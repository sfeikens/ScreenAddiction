import { GameSize, ScreenSize } from "./Constants.js";

export class World{
    
    constructor(){
        this.WorldGrid = [];
        this.backgrImg = new Image();

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
    
    GenerateWorld() {

        this.backgrImg.onload = () => {
            this.backgroundCtx.drawImage(this.backgrImg, 0, 0, SCRDIMENSIONS._SCRWIDTH, SCRDIMENSIONS._SCRHEIGHT);
        };
        this.backgrImg.src = "./assets/Image.png";
        if (this.backgrImg.complete) {
            this.backgroundCtx.drawImage(this.backgrImg, 0, 0, SCRDIMENSIONS._SCRWIDTH, SCRDIMENSIONS._SCRHEIGHT);
        }

    }

    // Call each frame before entities are drawn
    ClearEntityLayer() {
        this.entityCtx.clearRect(0, 0, SCRDIMENSIONS._SCRWIDTH, SCRDIMENSIONS._SCRHEIGHT);
    }
}