import { GameSize, ScreenSize } from "./Constants.js";
import { Tile } from "./Tile.js";
import { Wall, WALL_SIZE } from "./Wall.js";
import { Door, DOOR_WIDTH, DOOR_HEIGHT } from "./Door.js";

export class World{
    
    constructor(){
        this.WorldGrid = [];
        this.walls     = [];
        this.doors     = [];
        this.backgrImg = new Image();
        this.trueX = ScreenSize.centerX-GameSize.centerX;
        this.trueY = ScreenSize.centerY-GameSize.centerY;

        // Layer contexts, wordt gebruikt in CreateLayers()
        this.backgroundCtx = null;
        this.worldCtx      = null;
        this.entityCtx     = null;
        this.hudCtx        = null;
    }

    // methods

    /*
     * CreateDoor — places a hand-drawn door on the world layer.
     *
     * @param {number} x            Wall-grid column (same coords as CreateWall)
     * @param {number} y            Wall-grid row
     * @param {string} targetRoomId Room id this door leads to
     * @param {number} spawnX       Wall-grid x player spawns at in target room
     * @param {number} spawnY       Wall-grid y player spawns at in target room
     */
    CreateDoor({ x = 0, y = 0, targetRoomId, spawnX = x, spawnY = y }) {
        const door = new Door({
            xas: this.trueX + x * WALL_SIZE,
            yas: this.trueY + y * WALL_SIZE,
            targetRoomId,
            spawnX,
            spawnY,
        });
        this.doors.push(door);
        door.Draw(this.worldCtx);
    }

    /*
     * LoadRoom — clears the world layer and rebuilds it from a Room definition.
     * Call this whenever the player moves to a new room.
     *
     * @param {Room} room  A Room instance with walls[] and doors[] arrays
     */
    LoadRoom(room) {
        // Reset state
        this.walls = [];
        this.doors = [];

        // Clear the world canvas
        this.worldCtx.clearRect(0, 0, ScreenSize.width, ScreenSize.height);

        // Redraw static world elements
        this.matrix = this.GenerateMatrix();
        this.DrawTiles();
        this.DrawBorder(this.worldCtx);

        // Build walls and doors from room definition
        for (const wallDef of room.walls) {
            this.CreateWall(wallDef);
        }
        for (const doorDef of room.doors) {
            this.CreateDoor(doorDef);
        }
    }

    /*
     * CreateWall — builds a wall out of Wall tiles and draws it on the world layer.
     *
     * @param {number} x                Tile-grid column  (0 = left edge of game world)
     * @param {number} y                Tile-grid row     (0 = top  edge of game world)
     * @param {number} orientationIndex 0 = horizontal | 1 = vertical | 2 = diagonal (↘)
     * @param {number} length           Tiles along the primary axis
     * @param {number} width            Tiles along the secondary axis
     * @param {number} colorIndex       0 = grey | 1 = dark grey | 2 = bright red | 3 = brown
     */
    CreateWall({ x = 0, y = 0, orientationIndex = 0, length = 1, width = 1, colorIndex = 0 }) {
        for (let l = 0; l < length; l++) {
            for (let w = 0; w < width; w++) {
                let tileX, tileY;
                if (orientationIndex === 0) {        // horizontal — length → right, width → down
                    tileX = x + l;
                    tileY = y + w;
                } else if (orientationIndex === 1) { // vertical   — length → down,  width → right
                    tileX = x + w;
                    tileY = y + l;
                } else {                             // diagonal   — length → ↘,     width → right
                    tileX = x + l + w;
                    tileY = y + l;
                }

                const wall = new Wall({
                    xas: this.trueX + tileX * WALL_SIZE,
                    yas: this.trueY + tileY * WALL_SIZE,
                    colorIndex,
                });
                this.walls.push(wall);
                wall.Draw(this.worldCtx);
                
            }
        }
    }

    /*
     * De creation van de layers zier er een beetje zo uit:
     *   0 - background  (sky, far bg)      draw once
     *   1 - world       (tiles/map)        redraw every frame (camera scroll)
     *   2 - entities    (player/enemies)   clear & redraw every frame
     *   3 - hud         (UI/inventory)     redraw on state change
     */
    CreateLayers() {
        this.backgroundCtx = this.CreateLayer('background', 0);
        this.worldCtx      = this.CreateLayer('world',      1);
        this.entityCtx     = this.CreateLayer('entities',   2);
        this.hudCtx        = this.CreateLayer('hud',        3);
    }

    CreateLayer(id, zIndex) {
        const canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.width  = ScreenSize.width;
        canvas.height = ScreenSize.height;
        canvas.style.position = 'absolute';
        canvas.style.left     = '0';
        canvas.style.top      = '0';
        canvas.style.zIndex   = zIndex;
        canvas.style.imageRendering = 'pixelated';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; 
        return ctx;
    }
    GenerateMatrix(){
        const matrix=[];
        for (let x = 0; x*GameSize.blockSize < GameSize.width; x++) {
            const row = [];
            for (let y = 0; y*GameSize.blockSize < GameSize.height; y++) {
                const color = (x + y) % 2 === 0 ? 1 : 2;
                row.push(new Tile({xas: this.trueX + GameSize.blockSize * x, yas: this.trueY + GameSize.blockSize * y, tileINDX: color}));
            }
            matrix.push(row);
        }
        return matrix;
    }
    DrawTiles() {
        for (const row of this.matrix) {
            for (const tile of row) {
                tile.Draw(this.worldCtx);
            }
        }
    }
    GenerateWorld() {

        this.backgrImg.onload = () => {
            this.backgroundCtx.drawImage(this.backgrImg, 0, 0, ScreenSize.width, ScreenSize.height);
        };
        this.backgrImg.src = "./assets/image-asset.jpeg";
        if (this.backgrImg.complete) {
            this.backgroundCtx.drawImage(this.backgrImg, 0, 0, ScreenSize.width, ScreenSize.height);
        }

    }
    DrawBorder(ctx){
        ctx.save();
        ctx.strokeStyle = "rgba(20, 20, 20)";
        ctx.lineWidth = 20;
        ctx.strokeRect(this.trueX, this.trueY, GameSize.width, GameSize.height);
        ctx.restore();
    }
    ClearEntityLayer() {
        this.entityCtx.clearRect(0, 0, ScreenSize.width, ScreenSize.height);
    }
}