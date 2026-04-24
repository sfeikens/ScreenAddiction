import { Entity } from "./Entity.js";
import { WALL_SIZE } from "./Wall.js";

// Door is 2 wall-segments wide, 3 tall — feels like an actual doorway
export const DOOR_WIDTH  = WALL_SIZE * 2;
export const DOOR_HEIGHT = WALL_SIZE * 3;

export class Door extends Entity {
    /**
     * @param {number} xas          Pixel x (top-left)
     * @param {number} yas          Pixel y (top-left)
     * @param {string} targetRoomId Id of the room this door leads to
     * @param {number} spawnX       Wall-grid x where the player spawns in the target room
     * @param {number} spawnY       Wall-grid y where the player spawns in the target room
     */
    constructor({ xas = 0, yas = 0, targetRoomId, spawnX = xas, spawnY = yas }) {
        super({ x: xas, y: yas });
        this.targetRoomId = targetRoomId;
        this.spawnX = spawnX;
        this.spawnY = spawnY;
    }

    // Hand-drawn door: slightly wobbly frame + arch + handle
    Draw(ctx) {
        const x = this.entityPositionX;
        const y = this.entityPositionY;
        const w = DOOR_WIDTH;
        const h = DOOR_HEIGHT;

        ctx.save();
        ctx.strokeStyle = "rgb(180, 120, 50)";
        ctx.fillStyle   = "rgba(210, 160, 80, 0.35)";
        ctx.lineWidth   = 3;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";

        // Outer frame — four slightly wobbly strokes
        ctx.beginPath();
        ctx.moveTo(x + 2,     y + h);
        ctx.lineTo(x + 1,     y + 4);         // left side
        ctx.bezierCurveTo(
            x + w * 0.1, y - 2,
            x + w * 0.9, y - 2,
            x + w - 1,   y + 4              // arch across the top
        );
        ctx.lineTo(x + w - 2, y + h);         // right side
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        // Centre panel lines (gives it a planks look)
        ctx.beginPath();
        ctx.moveTo(x + w * 0.5, y + h * 0.12);
        ctx.lineTo(x + w * 0.5, y + h * 0.88);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + w * 0.15, y + h * 0.45);
        ctx.lineTo(x + w * 0.85, y + h * 0.45);
        ctx.stroke();

        // Door handle — small circle
        ctx.beginPath();
        ctx.arc(x + w * 0.72, y + h * 0.58, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(220, 180, 60)";
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}
