/*
Name: Jacky Chen
*/
const tileSize = 32;

let config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [ Menu, Play, GameOver, Load]
}

let game = new Phaser.Game(config);
let borderUISize = game.config.height/15;
let borderPadding = borderUISize/3;
let keyF,keyR,keyLEFT,keyRIGHT;
let gameOver = false;