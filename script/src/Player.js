// Classes
import { Entity } from './Entity.js';

// Constants
import { GameSize, PlayerSize, ScreenSize } from './Constants.js';

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

        this.direction = 1; // 1 = right, -1 = left

        this.actionAllowed = true;
        this.actionDirection = null;

        this.devstuff = false;
    }
    // methods

    Update(delta, keysDown, matrix) {
        this.HandleInput(delta, keysDown);
        this.Move(delta);
        // Recalculate COM and hitbox AFTER moving so collision sees the new position
        this.COM = this.SetUpCOM(PlayerSize.width, PlayerSize.height);
    }

    HandleInput(delta, keysDown){
        this.actionAllowed = !this.animationLocked && !this.dashing && !this.dodging;
    }
}