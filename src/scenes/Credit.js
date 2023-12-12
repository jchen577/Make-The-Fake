class Credit extends Phaser.Scene{
    constructor(){
        super("creditScene");
    }
    
    preload(){
    }
    
    create(){
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.titleText = this.add.bitmapText(centerX, 40, 'gem_font', 'Credits', 40).setOrigin(0.5);
        this.artCred = this.add.bitmapText(centerX, 100, 'gem_font', 'Art: Amy Tan, Jacky Chen ', 30).setOrigin(0.5);
        this.codeCred = this.add.bitmapText(centerX, 160, 'gem_font', 'Code: Jacky Chen', 30).setOrigin(0.5);
        this.playCred = this.add.bitmapText(centerX, 220, 'gem_font', 'Playtesters: Luke W, Dirk H, Nathan L', 30).setOrigin(0.5);
        this.soundCred = this.add.bitmapText(centerX, 280, 'gem_font', 'Sounds from: Pixalbay.com', 30).setOrigin(0.5);
        this.ret = this.add.bitmapText(centerX, 340, 'gem_font', 'Press R ro return to main menu', 40).setOrigin(0.5);


        this.keys = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.start('menuScene');
        }
    }

}