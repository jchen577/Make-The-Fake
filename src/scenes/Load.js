class Load extends Phaser.Scene {
    constructor() {
        super({key: 'loadScene'})
    }

    preload() {
        this.load.spritesheet('klungoWalk','./assets/KlungoWalk.png',{frameWidth: 32, frameHeight: 32});
        this.load.image('baseTiles','assets/MTFtiles.png ');
        this.load.image('laser','assets/Laser.png');
        this.load.image('enemyR','assets/EnemyR.png');
        this.load.image('enemyG','assets/EnemyG.png');
        this.load.tilemapTiledJSON('tilemap','assets/TestMap.JSON');
        this.load.image('backgroundG','assets/Background.png');
        this.load.image('tempG','assets/Ground1.png');
        this.load.image('earth','assets/earth.png');
        this.load.image('emptyP','assets/emptyP.png');
        this.load.bitmapFont('gem_font', 'assets/gem.png', 'assets/gem.xml');
        this.load.audio('caveMusic', './assets/caveMusic.mp3');
        this.load.audio('gunShot', './assets/beamSound.mp3');
        this.load.audio('jumpS', './assets/jump.mp3');
        this.load.audio('click', './assets/click.mp3');
    }

    create(){
        this.anims.create({ 
            key: 'walk', 
            frames: this.anims.generateFrameNumbers('klungoWalk',{
                start: 0,
                end: 3,
            }), 
            frameRate: 4,
            repeat: -1 
        })
        this.scene.start('menuScene');
    }
}