export const GameSize = {
    width: 64*15,
    height: 64*10,
    blockSize: 64,
    get centerX() {const half = this.width/2; return half},
    get centerY() {const half = this.height/2; return half},
}

export const ScreenSize = {
    width: window.screen.availWidth,
    height: window.screen.availHeight,
    centerX: window.screen.availWidth/2,
    centerY: window.screen.availHeight/2,
}

export const PlayerConstants = {
    width: 28,
    height: 28,
    baseVelocity:0.6,
}

export const KEYS ={
    
    _LEFT: "A",
    _RIGHT: "D",
    _UP: "W",
    _DOWN: "S",

}

// Coin dimensions
export const COIN_SIZE = 20;