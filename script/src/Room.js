/**
 * Room — pure data, describes the layout of one room.
 *
 * walls: array of CreateWall param objects
 *   { x, y, orientationIndex, length, width, colorIndex }
 *
 * doors: array of CreateDoor param objects
 *   { x, y, targetRoomId, spawnX, spawnY }
 *   x/y are wall-grid coords (same system as CreateWall)
 *   spawnX/spawnY are the wall-grid coords the player appears at in the target room
 */
export class Room {
    constructor({ id, walls = [], doors = [] }) {
        this.id    = id;
        this.walls = walls;
        this.doors = doors;
    }
}
