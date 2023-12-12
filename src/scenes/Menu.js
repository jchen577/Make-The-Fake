class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }
    
    preload(){
    }
    
    create(){
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.cavern = this.add.tileSprite(0,0,0,0,'backgroundG').setOrigin(0,0);
        this.titleText = this.add.bitmapText(centerX, centerY-40, 'gem_font', 'Klungo Saves the World!', 40).setOrigin(0.5);
        this.playText = this.add.bitmapText(centerX, centerY+100, 'gem_font', 'Play', 24).setOrigin(0.5);
        this.credText = this.add.bitmapText(centerX, centerY+140, 'gem_font', 'Credits', 24).setOrigin(0.5);
    
        this.playText.setInteractive({
            useHandCursor: true,
        });

        this.credText.setInteractive({
            useHandCursor: true,
        });

        this.playText.on('pointerdown', ()=>{
            this.sound.play('click',{volume: 0.1});
            this.scene.start('playScene')
        });

        this.credText.on('pointerdown',()=>{
            this.sound.play('click',{volume: 0.1});
            this.scene.start('creditScene')
        })

    }

    update(){
        //this.scene.start('loadScene');
    }

}