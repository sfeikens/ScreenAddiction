import { Parser } from './Parser.js';
import { World } from './World.js';
import { Entity } from './Entity.js';
import { Player } from './Player.js';
import { GameSize, ScreenSize } from './Constants.js';

export class Game{

    constructor(){
        this.parser     = new Parser();
        this.world      = new World();
        this.player     = null;
        this.loopId     = null;
        this.lastTime   = 0;
    }

    Play() {
        this.world.CreateLayers();

        this.player = new Player({
            xas: ScreenSize.width/2,
            yas: ScreenSize.height/2,
            ctx: this.world.entityCtx
        });

        this.world.GenerateWorld();


        this.loopId = requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // ── Entity layer ─────────────────────────────────────────────────────
        // Clear first (no transform), then apply camera before drawing
        this.world.ClearEntityLayer();
        const entityCtx = this.world.entityCtx;
        entityCtx.save();
        this.player.Update(delta, this.parser.getKeysArray(), this.world.matrix);
        entityCtx.restore();

        this.loopId = requestAnimationFrame(this.loop.bind(this));
    }

    Pause(){
        cancelAnimationFrame(this.loopId);
    }

    Resume(){
        this.lastTime = 0;
        this.loopId = requestAnimationFrame(this.loop.bind(this));
    }

    Debug(){
        window.player       = this.player;
        window.world        = this.world;
        window.game         = this;
    }
}