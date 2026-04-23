import { ScreenSize, GameSize } from "./Constants.js";
import { Entity } from "./Entity.js";
import { World } from "./World.js";

const TileTypeMap = {
    0: null,
    1: "rgb(0, 0, 0)",
    2: "rgb(182, 0, 0)"
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
        if (tileType === null) return;
        ctx.fillStyle = tileType;
        ctx.fillRect(this.entityPositionX, this.entityPositionY, GameSize.blockSize, GameSize.blockSize);
    }
}