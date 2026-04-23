import { GameSize } from "./Constants.js";
import { Entity } from "./Entity.js";

export const WALL_SIZE = GameSize.blockSize / 4;

const WallColorMap = {
    0: "rgb(120, 120, 120)", // grey
    1: "rgb(80, 80, 80)",    // dark grey
    2: "rgb(200, 50, 50)",   // bright red
    3: "rgb(160, 100, 40)",  // brown
};

export class Wall extends Entity {
    #colorIndex;

    constructor({ xas = 0, yas = 0, colorIndex = 0 }) {
        super({ x: xas, y: yas, health: null });
        this.#colorIndex = colorIndex;
        this.entityCenterOfMass = this.SetUpCOM(WALL_SIZE, WALL_SIZE);
    }

    get colorIndex()    { return this.#colorIndex; }
    set colorIndex(val) { this.#colorIndex = val; this.entityCenterOfMass = this.SetUpCOM(WALL_SIZE, WALL_SIZE); }

    Draw(ctx) {
        const color = WallColorMap[this.#colorIndex];
        if (color === undefined) return;
        ctx.fillStyle = color;
        ctx.fillRect(this.entityPositionX, this.entityPositionY, WALL_SIZE, WALL_SIZE);
    }
}