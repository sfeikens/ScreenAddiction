import { Entity } from './Entity.js';
import { GameSize, PlayerConstants, ScreenSize, KEYS, COIN_SIZE } from './Constants.js';
import { WALL_SIZE } from './Wall.js';
import { DOOR_WIDTH, DOOR_HEIGHT } from './Door.js';

export class Player extends Entity{
    constructor({ xas, yas, ctx }) {
        super({x:xas,y:yas,health:100});

        this.ctx = ctx;

        this.animationLocked = false;
        this.gameFrame = 0;
        this.animationTimer = 0;
        this.animationInterval = 50; 
        this.COM = this.SetUpCOM(14, 14)

        this.direction = "right";
        this.coinCount = 0;

        this.actionAllowed = true;
        this.actionDirection = null;

        this.devstuff = false;
    }

    Update(delta, keysDown, walls = []) {
        this.HandleInput(delta, keysDown);
 
        this.entityPositionX += this.entityVelocityX * delta;
        this.ResolveWallCollisionsX(walls);
 
        this.entityPositionY += this.entityVelocityY * delta;
        this.ResolveWallCollisionsY(walls);
 
        this.ClampToBorder();
        
        // Render the player and update center of mass
        this.DrawPlayer(this.ctx);
        this.COM = this.SetUpCOM(PlayerConstants.width, PlayerConstants.height);
    }

    CheckCoinCollisions(coins) {
        const p = this.SetUpHitBox(PlayerConstants.width, PlayerConstants.height);
        
        // Loop backwards so splicing doesn't mess up the index
        for (let i = coins.length - 1; i >= 0; i--) {
            const c = coins[i].SetUpHitBox();

            if (p.maxX > c.minX && p.minX < c.maxX &&
                p.maxY > c.minY && p.minY < c.maxY) {
                
                this.coinCount++; 
                coins.splice(i, 1); // Remove from world
                console.log(`Coins collected: ${this.coinCount}`);
            }
        }
    }
 
    ResolveWallCollisionsX(walls) {
        for (const wall of walls) {
            const p = this.SetUpHitBox(PlayerConstants.width, PlayerConstants.height);
            const w = wall.SetUpHitBox(WALL_SIZE, WALL_SIZE);
            if (p.maxX <= w.minX || p.minX >= w.maxX || p.maxY <= w.minY || p.minY >= w.maxY) continue;
            const overlapX = Math.min(p.maxX, w.maxX) - Math.max(p.minX, w.minX);
            this.entityPositionX += p.minX < w.minX ? -overlapX : overlapX;
        }
    }
 
    ResolveWallCollisionsY(walls) {
        for (const wall of walls) {
            const p = this.SetUpHitBox(PlayerConstants.width, PlayerConstants.height);
            const w = wall.SetUpHitBox(WALL_SIZE, WALL_SIZE);
            if (p.maxX <= w.minX || p.minX >= w.maxX || p.maxY <= w.minY || p.minY >= w.maxY) continue;
            const overlapY = Math.min(p.maxY, w.maxY) - Math.max(p.minY, w.minY);
            this.entityPositionY += p.minY < w.minY ? -overlapY : overlapY;
        }
    }

    HandleInput(delta, keysDown){
        const pressedLeft  = !!keysDown[KEYS._LEFT];
        const pressedRight = !!keysDown[KEYS._RIGHT];
        const pressedUp    = !!keysDown[KEYS._UP];
        const pressedDown  = !!keysDown[KEYS._DOWN];
        const movingX = pressedLeft !== pressedRight;
        const movingY = pressedUp   !== pressedDown;
        const speed = movingX && movingY
            ? PlayerConstants.baseVelocity / Math.sqrt(2)
            : PlayerConstants.baseVelocity;

        if (!movingX) { this.SetVelocity({x: 0}); } 
        else if (pressedLeft) { this.SetVelocity({x: -speed}); } 
        else { this.SetVelocity({x: speed}); }

        if (!movingY) { this.SetVelocity({y: 0}); } 
        else if (pressedUp) { this.SetVelocity({y: -speed}); } 
        else { this.SetVelocity({y: speed}); }
    }

    CheckDoors(doors) {
        for (const door of doors) {
            const p = this.SetUpHitBox(PlayerConstants.width, PlayerConstants.height);
            const d = door.SetUpHitBox(DOOR_WIDTH, DOOR_HEIGHT);
            if (p.maxX > d.minX && p.minX < d.maxX && p.maxY > d.minY && p.minY < d.maxY) return door;
        }
        return null;
    }

    ClampToBorder(){
        const minX = ScreenSize.centerX - GameSize.centerX;
        const minY = ScreenSize.centerY - GameSize.centerY;
        const maxX = minX + GameSize.width  - PlayerConstants.width;
        const maxY = minY + GameSize.height - PlayerConstants.height;

        this.entityPositionX = Math.max(minX, Math.min(this.entityPositionX, maxX));
        this.entityPositionY = Math.max(minY, Math.min(this.entityPositionY, maxY));
    }

    DrawPlayer(ctx){
        // Restored your original multi-colored square design
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.fillRect(this.entityPositionX, this.entityPositionY, PlayerConstants.width, PlayerConstants.height)
        
        ctx.fillStyle = "rgb(156, 156, 156)"
        ctx.fillRect(
            this.entityPositionX + PlayerConstants.width / 4, 
            this.entityPositionY + PlayerConstants.height / 4, 
            PlayerConstants.width / 2, 
            PlayerConstants.height / 2
        )
        
        ctx.strokeStyle = "rgba(255, 255, 255)";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.entityPositionX, this.entityPositionY, PlayerConstants.width, PlayerConstants.height);
    }
}