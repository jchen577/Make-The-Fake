//Tilemap stuff credits: https://blog.ourcade.co/posts/2020/phaser-3-noob-guide-loading-tiled-tilemaps/
class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload(){
        //this.load.spritesheet('klungoWalk','./assets/KlungoWalk.png',{frameWidth: 32, frameHeight: 32});
    }

    create(){
        //Set world stuff
        this.enemyC1 = 0;
        this.physics.world.gravity.y = 1000;
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D'});

        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        /*keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);*/

        //Add background that scrolls with the player
        this.cavern = this.add.tileSprite(0,0,0,0,'backgroundG').setOrigin(0,0).setScrollFactor(0, 1);

        //Creating map from tiled
        const map = this.make.tilemap({key:'tilemap'});
        const tileset = map.addTilesetImage('platforms','baseTiles');

        const Layer1 = map.createLayer('Tile Layer 1',tileset);
        const Layer2 = map.createLayer('Invis layer',tileset);

        //Group creation
        this.laserGroup = this.add.group();
        this.enemyGroup = this.add.group();
        //this.invGroup = this.add.group();

        //Enemy Spawn
        this.enemyS = map.findObject('spawns',obj => obj.name === 'enemySpawn1');
       
        this.end = map.findObject('spawns',obj=>obj.name === 'endPoint');
        this.endP = this.physics.add.sprite(this.end.x,this.end.y,'emptyP').setScale(1.5,1.5);
        this.endP.body.allowGravity = false;

        //Create Klungo walking sprite
        const klungoSpawn = map.findObject('spawns',obj => obj.name === 'playerSpawn');
        this.player = new Player(this,klungoSpawn.x,klungoSpawn.y,'klungoWalk',0).setScale(2,2);
        this.player.setSize(20,32);
        this.player.body.setCollideWorldBounds(true);
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        this.cameras.main.startFollow(this.player,true,0.25,0.25);
        this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels+100);
        this.planet1 = this.physics.add.sprite(0,0,'earth').setScale(1.5,1.5);
        this.planet1.body.allowGravity = false;

        this.playerFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
        }, [this, this.player]);
        //this.player.anims.play('walk');

        //player shot
        this.cooldown = true;
        this.input.on('pointerdown', (pointer) => {
            if(!gameOver){
                if(this.cooldown == true){
                    let xlength = 10;
                    if(this.player.directionx == -1){
                        xlength = -32-10;
                    }
                    this.cooldown = false;
                    let tLaser = this.physics.add.sprite(this.player.x+xlength,this.player.y-12,'laser').setOrigin(0,0);
                    //tLaser.body.setVelocityX = 1000;
                    tLaser.setSize(28,16);
                    tLaser.body.velocity.x = 500*this.player.directionx;
                    tLaser.body.allowGravity = false;
                    this.laserGroup.add(tLaser);
                    this.timedEvent = this.time.delayedCall(1000, this.onCooldown, [], this);
                }
            }

        })

        //Laser Collision
        this.physics.add.collider(this.enemyGroup,this.laserGroup,(enemyN,laser)=>{
            enemyN.destroy();
            laser.destroy();
            this.enemyC1 -= 1;
        });

        this.physics.add.collider(this.enemyGroup,this.player,(enemyN,player)=>{
            gameOver = true;
            this.player.destroy();
            this.planet1.destroy();
        });

        //Tweening
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const w = this.cameras.main.width
        const h = this.cameras.main.height
        this.instructionText = this.add.bitmapText(centerX, centerY+180, 'gem_font', '', 24).setOrigin(0.5);

        this.testP = this.add.sprite(-200,200,'klungoWalk').setScale(10,10);
        let startTween = this.tweens.chain({
            targets: this.testP,
            ease: 'Bounce.easeOut',
            loop: 0,
            paused: true,
            tweens: [
                {
                    x: 200,
                    duration: 1000,
                    onStart: () => {
                        this.input.keyboard.enabled = false;
                    },
                },
                {
                    x: 200,
                    hold: 5000,
                    onStart: ()=> {
                        this.instructionText.text = 'Hello! I am Klungo!\nMove me with W, A, D\nShoot with left click'
                    }
                },
                {
                    x: -200,
                    duration: 1000,
                    ease: 'Sine.easeOut',
                    onComplete: ()=>{
                        this.input.keyboard.enabled = true;
                        this.instructionText.destroy();
                    }
                },
            ]
        })
        startTween.restart();

        //Collision with the map
        Layer1.setCollisionByProperty({
            collisions: true,
        });
        this.physics.add.collider(this.player,Layer1);
        this.physics.add.collider(this.laserGroup,Layer1,(laser2,layer)=>{
            laser2.destroy();
        });
        this.physics.add.collider(this.enemyGroup,Layer1);

        //Enemy movement
        Layer2.setCollisionByProperty({
            collisions: true,
        });
        //this.physics.add.collider(Layer2,this.enemyGroup,(enemyG,layer)=>{
            this.physics.add.collider(Layer2,this.enemyGroup);
            //enemyG.setVelocityX(enemyG.body.velocity.x*-1);
        //});
        this.nextSpawn = this.time.now + 1000;
        //Spawn mobs at the beginning
        this.mobSpawn(this.enemyS.x,this.enemyS.y);

    }

    update(){
        this.cavern.setTilePosition(this.cameras.main.scrollX);
        if(!gameOver){
            this.playerFSM.step();
            if(this.player.directionx == -1){
                this.planet1.x = this.player.x+10;
            }
            else{
                this.planet1.x = this.player.x-13;
            }
            this.planet1.y = this.player.y-54;
            if(this.player.y> 480){
                gameOver = true;
                this.planet1.destroy();
            }
            if(this.enemyC1 <= 1){
                this.timedEvent2 = this.time.delayedCall(1000, this.mobSpawn, [this.enemyS.x,this.enemyS.y], this);
            }
        }
        else if(gameOver){
            if(Phaser.Input.Keyboard.JustDown(keyR)){
                gameOver = false;
                this.scene.start('playScene');
            }
        }
    }

    mobSpawn(enemyx,enemyy){
        if(this.nextSpawn <= this.time.now){
            let enemyN = this.physics.add.sprite(enemyx,enemyy,'enemyR').setScale(1.5,1.5);
            enemyN.body.immovable = true;
            this.enemyGroup.add(enemyN);
            enemyN.setVelocityX(-Math.round(Math.random()*50+100));
            enemyN.setBounce(1);
            this.enemyC1 +=1;
            this.nextSpawn = this.time.now + 5000;
        }
        //this.enemyC1 +=1;
    }

    onCooldown(){
        this.cooldown = true;
    }
}