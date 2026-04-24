// Classes
import { Entity } from './Entity.js';

// Constants
import { GameSize, PlayerConstants, ScreenSize, KEYS } from './Constants.js';
import { WALL_SIZE } from './Wall.js';

export class Player extends Entity{
    //fields

    constructor({ xas, yas, ctx }) {
        super({x:xas,y:yas,health:100});

        this.ctx = ctx;

        this.animationLocked = false;
        this.gameFrame = 0;
        this.animationTimer = 0;
        this.animationInterval = 50; // ms per frame
        this.COM = this.SetUpCOM(14, 14)

        this.direction = "right";

        this.actionAllowed = true;
        this.actionDirection = null;

        this.devstuff = false;
    }
    // methods

    Update(delta, keysDown, walls = []) {
        this.HandleInput(delta, keysDown);
 
        // Resolve each axis independently so corners never block perpendicular sliding
        this.entityPositionX += this.entityVelocityX * delta;
        this.ResolveWallCollisionsX(walls);
 
        this.entityPositionY += this.entityVelocityY * delta;
        this.ResolveWallCollisionsY(walls);
 
        this.ClampToBorder();
        // Recalculate COM after all movement/collision is resolved
        this.DrawPlayer(this.ctx);
        this.COM = this.SetUpCOM(PlayerConstants.width, PlayerConstants.height);
    }
 
    // Push the player out of wall overlap on the X axis only.
    ResolveWallCollisionsX(walls) {
        for (const wall of walls) {
            const p = this.SetUpHitBox(PlayerConstants.width, PlayerConstants.height);
            const w = wall.SetUpHitBox(WALL_SIZE, WALL_SIZE);
 
            if (p.maxX <= w.minX || p.minX >= w.maxX ||
                p.maxY <= w.minY || p.minY >= w.maxY) continue;
 
            const overlapX = Math.min(p.maxX, w.maxX) - Math.max(p.minX, w.minX);
            this.entityPositionX += p.minX < w.minX ? -overlapX : overlapX;
        }
    }
 
    // Push the player out of wall overlap on the Y axis only.
    ResolveWallCollisionsY(walls) {
        for (const wall of walls) {
            const p = this.SetUpHitBox(PlayerConstants.width, PlayerConstants.height);
            const w = wall.SetUpHitBox(WALL_SIZE, WALL_SIZE);
 
            if (p.maxX <= w.minX || p.minX >= w.maxX ||
                p.maxY <= w.minY || p.minY >= w.maxY) continue;
 
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
        // Normalise diagonal so speed stays at baseVelocity in all directions
        const speed = movingX && movingY
            ? PlayerConstants.baseVelocity / Math.sqrt(2)
            : PlayerConstants.baseVelocity;

        if (!movingX) {
            this.SetVelocity({x: 0});
        } else if (pressedLeft) {
            this.SetVelocity({x: -speed});
        } else {
            this.SetVelocity({x: speed});
        }

        if (!movingY) {
            this.SetVelocity({y: 0});
        } else if (pressedUp) {
            this.SetVelocity({y: -speed});
        } else {
            this.SetVelocity({y: speed});
        }
    }

    ClampToBorder(){
        // World border — same formula World uses for trueX / trueY
        const minX = ScreenSize.centerX - GameSize.centerX;
        const minY = ScreenSize.centerY - GameSize.centerY;
        const maxX = minX + GameSize.width  - PlayerConstants.width;
        const maxY = minY + GameSize.height - PlayerConstants.height;

        this.entityPositionX = Math.max(minX, Math.min(this.entityPositionX, maxX));
        this.entityPositionY = Math.max(minY, Math.min(this.entityPositionY, maxY));
    }
    
    PlayPlayerAnimation(state, delta, direction, actionDirection) {
        this.animationTimer += delta;
        if (this.animationTimer >= this.animationInterval) {
            this.gameFrame++;
            this.animationTimer = 0;
        }

        if (actionDirection !== null){ direction = actionDirection}

        const animation = PlayerAnimations[state];

        if (this.animationLocked && this.gameFrame >= animation.loc.length) {
            this.animationLocked = false;
            this.SetState(PlayerStates._IDLE);
            return;
        }

        const position = this.animationLocked
            ? Math.min(this.gameFrame, animation.loc.length - 1)
            : this.gameFrame % animation.loc.length;

        const frameX = animation.loc[position].x;
        const frameY = animation.loc[position].y;
        
        this.ctx.save();

        if (direction === -1) {
            this.ctx.translate(this.entityPositionX + PlayerSize._WIDTH, this.entityPositionY);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                animation.image,
                frameX, frameY,
                PlayerSize._WIDTH, PlayerSize._HEIGHT,
                0, 0,
                PlayerSize._WIDTH, PlayerSize._HEIGHT
            );
        } else {
            this.ctx.drawImage(
                animation.image,
                frameX, frameY,
                PlayerSize._WIDTH, PlayerSize._HEIGHT,
                this.entityPositionX, this.entityPositionY,
                PlayerSize._WIDTH, PlayerSize._HEIGHT
            );
        }

        this.ctx.restore();
    }

    DrawPlayer(ctx){
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.fillRect(this.entityPositionX, this.entityPositionY, PlayerConstants.width, PlayerConstants.height)
        ctx.fillStyle = "rgb(156, 156, 156)"
        ctx.fillRect(this.entityPositionX+PlayerConstants.width/4, this.entityPositionY+PlayerConstants.height/4, PlayerConstants.width/2, PlayerConstants.height/2)
        ctx.strokeStyle = "rgba(255, 255, 255)";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.entityPositionX, this.entityPositionY, PlayerConstants.width, PlayerConstants.height);
    }
}