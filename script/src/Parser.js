import { KEYS } from './Constants.js';

export class Parser{
    keysDown = {};

    

    constructor(){

        window.addEventListener("keydown", (e) => this.addToKeysDown(e));
        window.addEventListener("keyup", (e) => this.removeFromKeysDown(e));
        window.addEventListener("mousedown", (e) => this.addToKeysDown(e));
        window.addEventListener("mouseup", (e) => this.removeFromKeysDown(e));
    }
    // methods

    addToKeysDown(e) {
        const key = this.parseKey(e);
        if (key !== null) {
            e.preventDefault();
            this.keysDown[key] = true;
        }
        // console.log(this.keysDown);
    }

    removeFromKeysDown(e) {
        const key = this.parseKey(e);
        if (key !== null) delete this.keysDown[key];
        // console.log(this.keysDown);
    }

    parseKey(e) {
        const key = e.button !== undefined ? `Mouse${e.button}` : e.code;

        switch(key) {
            case 'KeyA':
                return KEYS._LEFT;
            case 'KeyD':
                return KEYS._RIGHT;
            case 'KeyW':
                return KEYS._UP;
            case 'keyS':
                return KEYS._DOWN;
        }
    }

    getKeysArray(){
        return this.keysDown;
    }
}
