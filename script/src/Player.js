// Classes
import { Entity } from './Entity.js';

// Constants
import { GameSize, PlayerConstants, ScreenSize, KEYS } from './Constants.js';

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

    Update(delta, keysDown) {
        this.HandleInput(delta, keysDown);
        this.Move(delta);
        this.ClampToBorder();
        // Recalculate COM and hitbox AFTER moving so collision sees the new position
        this.DrawPlayer(this.ctx);
        this.COM = this.SetUpCOM(PlayerConstants.width, PlayerConstants.height);
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
        const minX = ScreenSize.centerX - GameSize.centerX;
        const minY = ScreenSize.centerY - GameSize.centerY;
        const maxX = minX + GameSize.width  - PlayerConstants.width;
        const maxY = minY + GameSize.heigth - PlayerConstants.height;

        this.entityPositionX = Math.max(minX, Math.min(this.entityPositionX, maxX));
        this.entityPositionY = Math.max(minY, Math.min(this.entityPositionY, maxY));
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