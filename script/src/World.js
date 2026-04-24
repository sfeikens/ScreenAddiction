import { GameSize, ScreenSize, COIN_SIZE } from "./Constants.js";
import { Tile } from "./Tile.js";
import { Wall, WALL_SIZE } from "./Wall.js";
import { Door, DOOR_WIDTH, DOOR_HEIGHT } from "./Door.js";
import { Coin } from "./Coin.js";

export class World{
    
    constructor(){
        this.WorldGrid = [];
        this.walls     = [];
        this.doors     = [];
        this.coins     = []; 
        this.backgrImg = new Image();
        this.trueX = ScreenSize.centerX-GameSize.centerX;
        this.trueY = ScreenSize.centerY-GameSize.centerY;

        this.backgroundCtx = null;
        this.worldCtx      = null;
        this.entityCtx     = null;
        this.hudCtx        = null;
    }

    LoadRoom(room) {
        this.walls = [];
        this.doors = [];
        this.coins = []; 

        this.worldCtx.clearRect(0, 0, ScreenSize.width, ScreenSize.height);

        this.matrix = this.GenerateMatrix();
        this.DrawTiles();
        this.DrawBorder(this.worldCtx);

        for (const wallDef of room.walls) {
            this.CreateWall(wallDef);
        }
        for (const doorDef of room.doors) {
            this.CreateDoor(doorDef);
        }

        this.SpawnCoins(10); 
    }

    SpawnCoins(count = 5) {
        let spawned = 0;
        let attempts = 0;
        const maxAttempts = 500; 

        while (spawned < count && attempts < maxAttempts) {
            attempts++;
            const randomX = this.trueX + Math.random() * (GameSize.width - COIN_SIZE);
            const randomY = this.trueY + Math.random() * (GameSize.height - COIN_SIZE);
            
            const tempCoin = new Coin({ x: randomX, y: randomY });
            const coinBox = tempCoin.SetUpHitBox();

            let insideWall = false;
            for (const wall of this.walls) {
                const wallBox = wall.SetUpHitBox(WALL_SIZE, WALL_SIZE);
                if (coinBox.maxX > wallBox.minX && coinBox.minX < wallBox.maxX &&
                    coinBox.maxY > wallBox.minY && coinBox.minY < wallBox.maxY) {
                    insideWall = true;
                    break;
                }
            }

            if (!insideWall) {
                this.coins.push(tempCoin);
                spawned++;
            }
        }
    }

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

    CreateWall({ x = 0, y = 0, orientationIndex = 0, length = 1, width = 1, colorIndex = 0 }) {
        for (let l = 0; l < length; l++) {
            for (let w = 0; w < width; w++) {
                let tileX, tileY;
                if (orientationIndex === 0) {
                    tileX = x + l;
                    tileY = y + w;
                } else {
                    tileX = x + w;
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
        document.body.appendChild(canvas);
        return canvas.getContext('2d');
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
            for (const tile of row) { tile.Draw(this.worldCtx); }
        }
    }

    GenerateWorld() {
        this.backgrImg.onload = () => {
            this.backgroundCtx.drawImage(this.backgrImg, 0, 0, ScreenSize.width, ScreenSize.height);
        };
        this.backgrImg.src = "./assets/image-asset.jpeg";
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

    // New method for the HUD score
    ClearHudLayer() {
        this.hudCtx.clearRect(0, 0, ScreenSize.width, ScreenSize.height);
    }
}