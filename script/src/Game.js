import { Parser } from './Parser.js';
import { World } from './World.js';
import { Entity } from './Entity.js';
import { Player } from './Player.js';
import { Room } from './Room.js';
import { GameSize, PlayerConstants, ScreenSize } from './Constants.js';
import { WALL_SIZE } from './Wall.js';

// ── Room definitions ──────────────────────────────────────────────────────────
// x/y coords are wall-grid units (1 unit = WALL_SIZE px = blockSize/4 px)
// The game world is blockSize*15 wide and blockSize*10 tall,
// so in wall-grid units that is 60 wide × 40 tall.

const ROOMS = {
    'room1': new Room({
        id: 'room1',
        walls: [
            { x: 5,  y: 10, orientationIndex: 0, length: 15, width: 1, colorIndex: 0 }, // horizontal wall
            { x: 20, y: 5,  orientationIndex: 1, length: 10, width: 1, colorIndex: 1 }, // vertical wall
        ],
        doors: [
            // Door on the right side, leads to room2; player spawns near left side of room2
            { x: 50, y: 18, targetRoomId: 'room2', spawnX: 4, spawnY: 18 },
        ],
    }),
    'room2': new Room({
        id: 'room2',
        walls: [
            { x: 10, y: 20, orientationIndex: 0, length: 20, width: 2, colorIndex: 3 }, // brown wall
            { x: 30, y: 8,  orientationIndex: 1, length: 12, width: 1, colorIndex: 2 }, // red wall
        ],
        doors: [
            // Door leads back to room1; player spawns near the room1 door
            { x: 2,  y: 18, targetRoomId: 'room1', spawnX: 46, spawnY: 18 },
            {x:57,y:36,targetRoomId: 'room3', spawnX:2, spawnY:2}
        ],
    }),
    'room3': new Room({
        id: 'room3',
        walls: [
            { x: 15, y:10, orientationIndex:1 , length:20, width:2, colorIndex:1},
        ],
        doors: [
            {x:1,y:1,targetRoomId: 'room2', spawnX:57, spawnY:37}, 
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
        this.onDoor      = false; // true while player is standing on a door
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

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.doorCooldown > 0) this.doorCooldown -= delta;

        this.world.ClearEntityLayer();
        const entityCtx = this.world.entityCtx;
        entityCtx.save();
        this.player.Update(delta, this.parser.getKeysArray(), this.world.walls);
        entityCtx.restore();

        // ── Door transition ───────────────────────────────────────────────────
        const door = this.player.CheckDoors(this.world.doors);
        if (door) {
            // Only trigger on the frame the player first steps onto the door
            if (!this.onDoor) {
                this.onDoor = true;
                const targetRoom = ROOMS[door.targetRoomId];
                if (targetRoom) {
                    this.currentRoom = targetRoom;
                    this.world.LoadRoom(targetRoom);
                    this.player.entityPositionX = this.world.trueX + door.spawnX * WALL_SIZE;
                    this.player.entityPositionY = this.world.trueY + door.spawnY * WALL_SIZE;
                }
            }
        } else {
            this.onDoor = false; // player has stepped off, next door can fire
        }

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