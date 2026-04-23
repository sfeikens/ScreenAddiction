import { GameSize, ScreenSize } from "./Constants.js";
import { Tile } from "./Tile.js";

export class World{
    
    constructor(){
        this.WorldGrid = [];
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
            for (let y = 0; y*GameSize.blockSize < GameSize.heigth; y++) {
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

    // Needs fix
    ClearEntityLayer() {
        this.entityCtx.clearRect(0, 0, ScreenSize.width, ScreenSize.height);
    }
}