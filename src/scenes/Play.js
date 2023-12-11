//Tilemap stuff credits: https://blog.ourcade.co/posts/2020/phaser-3-noob-guide-loading-tiled-tilemaps/
//https://pixabay.com/music/search/cave%20music/ cave of light
//https://pixabay.com/sound-effects/search/laser/ beam 8
class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload(){
    }

    create(){
        //Set world stuff
        this.tweening = false;
        this.enemyC1 = 0;
        this.enemyC2 = 0;
        this.enemyC3 = 0;
        this.physics.world.gravity.y = 1000;
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D',});


        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
        this.projEnemyGroup = this.add.group();

        //Enemy Spawn
        this.enemyS = map.findObject('spawns',obj => obj.name === 'enemySpawn1');
        this.enemyS2 = map.findObject('spawns',obj => obj.name === 'enemySpawn2');
        this.enemyS3 = map.findObject('spawns',obj => obj.name === 'enemySpawn3');
       
        this.end = map.findObject('spawns',obj=>obj.name === 'endPoint');
        this.endP = this.physics.add.sprite(this.end.x,this.end.y,'emptyP').setScale(1.5,1.5);
        this.endP.body.allowGravity = false;

        //Create Klungo walking sprite
        this.klungoSpawn = map.findObject('spawns',obj => obj.name === 'playerSpawn');
        this.player = new Player(this,this.klungoSpawn.x,this.klungoSpawn.y,'klungoWalk',0).setScale(2,2);
        this.player.setSize(20,28);
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

        //player shot
        this.cooldown = true;
        this.input.on('pointerdown', (pointer) => {
            if(!this.tweening){
                if(!gameOver){
                    if(this.cooldown == true){
                        let xlength = 10;
                        if(this.player.directionx == -1){
                            xlength = -32-10;
                        }
                        this.cooldown = false;
                        let tLaser = this.physics.add.sprite(this.player.x+xlength,this.player.y-12,'laser').setOrigin(0,0);
                        tLaser.setSize(28,16);
                        tLaser.body.velocity.x = 500*this.player.directionx;
                        tLaser.body.allowGravity = false;
                        this.laserGroup.add(tLaser);
                        this.sound.play('gunShot',{volume: 0.1});
                        this.timedEvent = this.time.delayedCall(1000, this.onCooldown, [], this);
                    }
                }
            }
        })
        //Background music
        this.bgm = this.sound.add('caveMusic', { 
            mute: false,
            volume: 0.1,
            rate: 1,
            loop: true 
        });
        this.bgm.play();

        //Laser Collision
        this.physics.add.collider(this.enemyGroup,this.laserGroup,(enemyN,laser)=>{
            enemyN.destroy();
            laser.destroy();
            if(enemyN.x < 670){
                this.enemyC1 -= 1;
            }
            else if(enemyN.x > 1615){
                this.enemyC2 -= 1;
            }
            else if(enemyN.x < 1615){
                this.enemyC3 -= 1;
            }
        });

        this.physics.add.collider(this.projEnemyGroup,this.laserGroup,(enemyN,laser)=>{
            enemyN.destroy();
            laser.destroy();
        });

        this.physics.add.collider(this.projEnemyGroup,this.player,(enemyN,player)=>{
            gameOver = true;
            this.player.setPosition(this.player.x,map.widthInPixels+50);
            this.planet1.setPosition(-200,0);
            //this.planet1.destroy();
        });

        this.physics.add.collider(this.enemyGroup,this.player,(enemyN,player)=>{
            gameOver = true;
            this.player.setPosition(this.player.x,map.widthInPixels+50);
            this.planet1.setPosition(-200,0);
            //this.planet1.destroy();
        });

        this.physics.add.collider(this.endP,this.player,()=>{
            this.scene.start('gameOverScene');
        });

        this.endWall = this.add.rectangle(-30,0,10, 480, 0x000000).setOrigin(0,0).setAlpha(0);
        this.physics.add.existing(this.endWall);
        this.endWall.body.allowGravity = false;
        this.endWall.body.immovable = true;
        this.physics.add.collider(this.projEnemyGroup,this.endWall,(ene,endW)=>{
            ene.destroy();
        });

        //Tweening
        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;
        const w = this.cameras.main.width
        const h = this.cameras.main.height

        //Add rectangles to create a textbox look
        this.greenB = this.add.rectangle(-640,240,640,480,0x355E3B);
        this.talkB = this.add.rectangle(this.centerX-200,this.centerY+125,390, 100, 0x000000).setOrigin(0,0).setAlpha(0);
        this.talkW1 = this.add.rectangle(this.centerX-195,this.centerY+130,380, 5, 0xFFFFFF).setOrigin(0,0).setAlpha(0);
        this.talkW2 = this.add.rectangle(this.centerX-195,this.centerY+215,380, 5, 0xFFFFFF).setOrigin(0,0).setAlpha(0);
        this.talkW3 = this.add.rectangle(this.centerX-195,this.centerY+130,5, 85, 0xFFFFFF).setOrigin(0,0).setAlpha(0);
        this.talkW4 = this.add.rectangle(this.centerX+180,this.centerY+130,5, 85, 0xFFFFFF).setOrigin(0,0).setAlpha(0);
        this.instructionText = this.add.bitmapText(this.centerX, this.centerY+175, 'gem_font', '', 24).setOrigin(0.5);

        let textTween = this.tweens.chain({//Set Tween to tween text box
            targets: [this.instructionText,this.talkB,this.talkW1,this.talkW2,this.talkW3,this.talkW4],
            ease: 'Sine.easeOut',
            loop: 0,
            paused: true,
            tweens: [
            {
                x:-600,
                duration:1000,
            }
        ]});

        let backgroundTween = this.tweens.chain({//Set Tween to move background only
            targets: this.greenB,
            ease: 'Bounce.easeOut',
            loop: 0,
            paused: true,
            tweens: [
            {
                x:320,
                duration:1000,
                hold: 5500,
                
            },
            {
                x: -640,
                duration: 1000,
                ease: 'Sine.easeOut',
            }
            
        ]});

        this.testP = this.add.sprite(-200,200,'klungoWalk').setScale(10,10);//Make larger klungo to use for tweening
        let startTween = this.tweens.chain({//Set tween to move klungo only
            targets: this.testP,
            ease: 'Bounce.easeOut',
            loop: 0,
            paused: true,
            tweens: [
                {
                    x: 200,
                    duration: 1000,
                    onStart: () => {
                        this.tweening = true;
                        backgroundTween.restart();
                        this.input.keyboard.enabled = false;
                    },
                },
                {
                    x: 200,
                    hold: 2500,
                    onStart: ()=> {
                        //Set text to be visible
                        this.talkB.setAlpha(1);
                        this.talkW1.setAlpha(1);
                        this.talkW2.setAlpha(1);
                        this.talkW3.setAlpha(1);
                        this.talkW4.setAlpha(1);
                        this.instructionText.text = 'Hello! I am Klungo!\nMove me with W, A, D\nShoot with left click';
                    }
                },
                {
                    x: 200,
                    hold: 2000,
                    onStart: ()=> {
                        this.instructionText.text = 'Now take me to the end!\nThe Planet depends on us!';
                    }
                },
                {
                    x: -200,
                    duration: 1000,
                    ease: 'Sine.easeOut',
                    onComplete: ()=>{
                        this.input.keyboard.enabled = true;
                        this.tweening = false;
                        textTween.restart();
                    }
                },
            ]
        })
        startTween.restart();//Start Tween when game begins

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
        this.physics.add.collider(Layer2,this.enemyGroup);
        //Mob spawn timers
        this.nextSpawn = this.time.now + 1000;
        this.nextSpawn1 = this.time.now + 1000;
        this.nextSpawn2 = this.time.now + 1000;
        this.nextProjSpawn = this.time.now+1000;
        //Spawn mobs at the beginning
        this.mobSpawn(this.enemyS.x,this.enemyS.y,this.enemyC1,this.nextSpawn);
        this.mobSpawn(this.enemyS2.x,this.enemyS2.y,this.enemyC2,this.nextSpawn1);
        this.mobSpawn(this.enemyS3.x,this.enemyS3.y,this.enemyC3,this.nextSpawn2);


        this.deadText = this.add.bitmapText(this.centerX, this.centerY, 'gem_font', 'Press R to respawn', 40).setOrigin(0.5).setAlpha(0);
    }

    update(){
        if(!gameOver){//While player not dead
            this.cavern.setTilePosition(this.centerX+320,this.centerY-240);
            this.playerFSM.step();
            this.planet1.y = this.player.y-54;
            if(this.player.directionx == -1){
                this.planet1.x = this.player.x+10;
            }
            else{
                this.planet1.x = this.player.x-13;
            }
            if(this.player.y> 480){
                gameOver = true;
            }
            //Spawn mobs in max has not been reached
            if(this.enemyC1 <= 1){
                this.mobSpawn(this.enemyS.x,this.enemyS.y,this.enemyC1,this.nextSpawn);
            }
            if(this.enemyC2 <= 1){
                this.mobSpawn(this.enemyS2.x,this.enemyS2.y,this.enemyC2,this.nextSpawn1);
            }
            if(this.enemyC3 <= 1){
                this.mobSpawn(this.enemyS3.x,this.enemyS3.y,this.enemyC3,this.nextSpawn2);
            }
            this.projectileMobSpawn();
        }
        else if(gameOver){
            //Reset everything once player dies
            this.enemyGroup.clear(true);
            this.projEnemyGroup.clear(true);
            this.player.setVelocityX(0);
            this.planet1.setPosition(-200,0);
            this.deadText.setAlpha(1);
            this.enemyC1 = 0;
            this.enemyC2 = 0;
            this.enemyC3 = 0;
            if(this.player.x > 320){
                this.deadText.setPosition(this.player.x,this.centerY);
            }
            else{
                this.deadText.setPosition(this.centerX,this.centerY);
            }
            if(Phaser.Input.Keyboard.JustDown(keyR)){
                gameOver = false;
                this.player.setPosition(this.klungoSpawn.x,this.klungoSpawn.y);
                this.deadText.setAlpha(0);
            }
        }
    }

    projectileMobSpawn(){//Spawn projectile mobs
        if(this.nextProjSpawn <= this.time.now && !this.tweening){
            let enemyP = this.physics.add.sprite(this.player.x+640,this.player.y,'enemyG');
            enemyP.body.immovable = true;
            enemyP.body.allowGravity = false;
            enemyP.setVelocityX(-200);
            this.projEnemyGroup.add(enemyP);
            this.nextProjSpawn = this.time.now + 2000;
        }
    }

    mobSpawn(enemyx,enemyy,counter,spawner){//Spawn area specific mobs
        if(spawner <= this.time.now && !this.tweening){
            let dir = Math.round(Math.random()*2);
            let vel = 0;
            if(dir == 1){
                vel = -1;
            }
            else{
                vel = 1;
            }
            vel = vel*Math.round(Math.random()*50+100)
            if(enemyx < 670 && this.enemyC1 <= 1){
                let enemyN = this.physics.add.sprite(enemyx,enemyy,'enemyR').setScale(1.5,1.5);
                enemyN.body.immovable = true;
                this.enemyGroup.add(enemyN);
                enemyN.setVelocityX(vel);
                enemyN.setBounce(1);
                this.enemyC1 +=1;
                this.nextSpawn = this.time.now + 5000;
            }
            else if(enemyx > 1615 && this.enemyC2 <= 1){
                let enemyN = this.physics.add.sprite(enemyx,enemyy,'enemyR').setScale(1.5,1.5);
                enemyN.body.immovable = true;
                this.enemyGroup.add(enemyN);
                enemyN.setVelocityX(vel);
                enemyN.setBounce(1);
                this.enemyC2 +=1;
                this.nextSpawn1 = this.time.now + 5000;
            }
            else if(enemyx < 1615 && this.enemyC3 <= 1){
                let enemyN = this.physics.add.sprite(enemyx,enemyy,'enemyR').setScale(1.5,1.5);
                enemyN.body.immovable = true;
                this.enemyGroup.add(enemyN);
                enemyN.setVelocityX(vel);
                enemyN.setBounce(1);
                this.enemyC3 +=1;
                this.nextSpawn2 = this.time.now + 5000;
            }
        }
    }

    onCooldown(){
        this.cooldown = true;
    }
}