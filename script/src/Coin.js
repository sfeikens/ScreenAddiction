import { Entity } from './Entity.js';
import { COIN_SIZE } from './Constants.js';

export class Coin extends Entity {
    constructor({ x, y }) {
        super({ x, y, health: 1 });
    }

    Draw(ctx) {
        ctx.save();
        ctx.fillStyle = "gold";
        ctx.beginPath();
        // Draw a circle for the coin
        ctx.arc(
            this.entityPositionX + COIN_SIZE / 2, 
            this.entityPositionY + COIN_SIZE / 2, 
            COIN_SIZE / 2, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    SetUpHitBox() {
        // Uses the standard hitbox logic from Entity
        return super.SetUpHitBox(COIN_SIZE, COIN_SIZE);
    }
}