import { ScreenSize, GameSize } from "./Constants.js";
import { Entity } from "./Entity.js";
import { World } from "./World.js";

const TileTypeMap = {
    0: null,
    1: "blue",
    2: "red"
};

export class Tile extends Entity {
    #tileINDX;
    constructor({ xas = 0, yas = 0, tileINDX = 0 }) {
        super({ x: xas, y: yas, health: null });
        this.#tileINDX = tileINDX;
        if (this.#tileINDX > 0){
            this.entityCenterOfMass = this.SetUpCOM(GameSize.blockSize, GameSize.blockSize)
        }
    }

    get tileINDX()        { return this.#tileINDX; }
    set tileINDX(val)     { this.#tileINDX = val; this.entityCenterOfMass = this.SetUpCOM(GameSize.blockSize, GameSize.blockSize) }

    Draw(ctx) {
        const tileType = TileTypeMap[this.#tileINDX];
        ctx.strokeStyle = this.tileINDX == 1 ? "rgb(255, 0, 0)":"rgb(0, 0, 255)";
        ctx.lineWidth = 10;
        ctx.strokeRect(this.entityPositionX, this.entityPositionY, GameSize.blockSize, GameSize.blockSize);
    }
}