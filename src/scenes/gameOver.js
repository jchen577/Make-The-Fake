class GameOver extends Phaser.Scene{
    constructor(){
        super("gameOverScene");
    }

    preload(){
    }

    create(){
        this.keys = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.cavern = this.add.tileSprite(0,0,0,0,'backgroundG').setOrigin(0,0);
        this.titleText = this.add.bitmapText(centerX, centerY, 'gem_font', 'You saved the world!\nTime for Klungo to sleep\nPress R to return to menu', 40).setOrigin(0.5);
        

    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.start('menuScene');
        }
    }
}