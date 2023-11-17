//Tilemap stuff credits: https://blog.ourcade.co/posts/2020/phaser-3-noob-guide-loading-tiled-tilemaps/
class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload(){
        this.load.spritesheet('klungoWalk','./assets/KlungoWalk.png',{frameWidth: 32, frameHeight: 32});
        this.load.image('baseTiles','assets/MTFtiles.png ');
        this.load.tilemapTiledJSON('tilemap','assets/TestMap.tmj');
        this.load.image('backgroundG','assets/Background.png');
    }

    create(){
        this.add.tileSprite(0,0,0,0,'backgroundG').setOrigin(0,0);
        //Create Klungo walking sprite
        /*this.anims.generateFrameNumbers('klungoWalk',{start:0 , end: 3});
        this.player = new Player(this,120,game.config.height/2-tileSize,'klungoWalk',0);
        this.anims.create({ 
            key: 'walk', 
            frames: this.anims.generateFrameNames('klungoWalk', {      
                prefix: '',
                start: 0,
                end: 3,
            }), 
            frameRate: 4,
            repeat: -1 
        })
        this.player.anims.play('walk');*/
        const map = this.make.tilemap({key:'tilemap'});
        const tileset = map.addTilesetImage('platforms','baseTiles');
        map.createLayer('Tile Layer 1',tileset);
    }

    update(){
    }
}