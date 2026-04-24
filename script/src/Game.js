import { Parser } from './Parser.js';
import { World } from './World.js';
import { Player } from './Player.js';
import { GameSize, PlayerConstants, ScreenSize } from './Constants.js';
import { WALL_SIZE } from './Wall.js';
import { Room } from './Room.js';

const ROOMS = {
    'room1': new Room({
        id: 'room1',
        walls: [
            { x: 0,  y: 0, orientationIndex: 0, length: 60, width: 10, colorIndex: 4 },
            { x: 0,  y: 30, orientationIndex: 0, length: 60, width: 10, colorIndex: 4 }
        ],
        doors: [
            { x: 57, y: 18, targetRoomId: 'room2', spawnX: 4, spawnY: 18 },
        ],
    }),
    'room2': new Room({
        id: 'room2',
        walls: [
            { x: 0,  y: 0, orientationIndex: 0, length: 60, width: 10, colorIndex: 4 },
            { x: 0,  y: 30, orientationIndex: 0, length: 50, width: 10, colorIndex: 4 }
        ],
        doors: [
            { x: 2,  y: 18, targetRoomId: 'room1', spawnX: 55, spawnY: 18 },
            { x: 57, y: 36, targetRoomId: 'room3', spawnX: 2, spawnY: 2 }
        ],
    }),
    'room3': new Room({
        id: 'room3',
        walls: [
            { x: 50, y: 0, orientationIndex: 1, length: 40, width: 10, colorIndex: 4 },
            { x: 20, y: 10, orientationIndex: 1, length: 20, width: 10, colorIndex: 4 },
            { x: 10, y: 30, orientationIndex: 0, length: 30, width: 10, colorIndex: 4 },
        ],
        doors: [
            { x: 1, y: 1, targetRoomId: 'room2', spawnX: 57, spawnY: 37 }, 
        ]
    })
};

export class Game{
    constructor(){
        this.parser      = new Parser();
        this.world       = new World();
        this.player      = null;
        this.loopId      = null;
        this.lastTime    = 0;
        this.currentRoom = ROOMS['room1'];
        this.onDoor      = false; // This tracks if the player is currently standing on a door
    }

    Play() {
        this.world.CreateLayers();
        this.player = new Player({
            xas: ScreenSize.centerX - PlayerConstants.width  / 2,
            yas: ScreenSize.centerY - PlayerConstants.height / 2,
            ctx: this.world.entityCtx
        });
        this.world.GenerateWorld();
        this.world.LoadRoom(this.currentRoom);
        this.loopId = requestAnimationFrame(this.loop.bind(this));
    }

    DrawHUD() {
        const ctx = this.world.hudCtx;
        const text = `Score: ${this.player.coinCount}`;
        
        const x = ScreenSize.centerX;
        const y = this.world.trueY - 45; 
        
        ctx.font = "bold 26px 'Courier New', Courier, monospace";
        const metrics = ctx.measureText(text);
        const padding = 20;
        const bgWidth = metrics.width + padding * 2;
        const bgHeight = 45;

        ctx.save();
        ctx.translate(x - bgWidth / 2, y - bgHeight / 2);

        // Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.fillRoundedRect(ctx, 4, 4, bgWidth, bgHeight, 10);

        // Golden Background
        const grad = ctx.createLinearGradient(0, 0, 0, bgHeight);
        grad.addColorStop(0, "#ffd700"); 
        grad.addColorStop(0.5, "#e6ac00"); 
        grad.addColorStop(1, "#ffd700");

        ctx.fillStyle = grad;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        this.fillRoundedRect(ctx, 0, 0, bgWidth, bgHeight, 10);
        this.strokeRoundedRect(ctx, 0, 0, bgWidth, bgHeight, 10);

        // Text
        ctx.fillStyle = "#222";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, bgWidth / 2, bgHeight / 2);

        ctx.restore();
    }

    fillRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.fill();
    }

    strokeRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.stroke();
    }

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.world.ClearEntityLayer();
        this.world.ClearHudLayer(); 

        const entityCtx = this.world.entityCtx;
        
        // Update Player and Coins
        this.player.Update(delta, this.parser.getKeysArray(), this.world.walls);
        this.player.CheckCoinCollisions(this.world.coins);
        this.world.coins.forEach(coin => coin.Draw(entityCtx));

        // Draw Score HUD
        this.DrawHUD();

        // ── Door transition ───────────────────────────────────────────────────
        const door = this.player.CheckDoors(this.world.doors);
        if (door) {
            // Trigger transition only if we aren't already marked as being "on a door"
            if (!this.onDoor) {
                this.onDoor = true;
                const targetRoom = ROOMS[door.targetRoomId];
                if (targetRoom) {
                    this.currentRoom = targetRoom;
                    this.world.LoadRoom(targetRoom);
                    // Move player to the spawn point in the new room
                    this.player.entityPositionX = this.world.trueX + door.spawnX * WALL_SIZE;
                    this.player.entityPositionY = this.world.trueY + door.spawnY * WALL_SIZE;
                }
            }
        } else {
            // Reset the flag once the player has stepped off all doors
            this.onDoor = false; 
        }

        this.loopId = requestAnimationFrame(this.loop.bind(this));
    }

    Pause(){ cancelAnimationFrame(this.loopId); }
    Resume(){ this.lastTime = 0; this.loopId = requestAnimationFrame(this.loop.bind(this)); }
    Debug(){ window.player = this.player; window.world = this.world; window.game = this; }
}