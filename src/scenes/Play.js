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

        //Group creation
        this.laserGroup = this.add.group();
        this.enemyGroup = this.add.group();
        this.invGroup = this.add.group();

        //Enemy Spawn
        this.enemyS = map.findObject('spawns',obj => obj.name === 'enemySpawn1');
        this.inv1 = this.physics.add.sprite(384,map.heightInPixels-128,'tempG');
        this.inv1.body.setAllowGravity(false);
        this.inv1.setImmovable(true);
        this.invGroup.add(this.inv1);
        this.inv2 = this.physics.add.sprite(384+316,map.heightInPixels-128,'tempG');
        this.inv2.setImmovable(true);
        this.inv2.body.setAllowGravity(false);
        this.invGroup.add(this.inv2);
        /*let enemy = this.physics.add.sprite(this.enemyS.x,this.enemyS.y,'enemyR').setScale(1.5,1.5);
        enemy.body.immovable = true;
        this.enemyGroup.add(enemy);
        this.enemyC1+=1;*/

        //Create Klungo walking sprite
        const klungoSpawn = map.findObject('spawns',obj => obj.name === 'playerSpawn')
        this.player = new Player(this,klungoSpawn.x,klungoSpawn.y,'klungoWalk',0).setScale(2,2);
        this.player.setSize(20,32);
        this.player.body.setCollideWorldBounds(true);
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        this.cameras.main.startFollow(this.player,true,0.25,0.25);
        this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels);


        this.playerFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
        }, [this, this.player]);
        //this.player.anims.play('walk');

        //player shot
        this.cooldown = true;
        this.input.on('pointerdown', (pointer) => {
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
        });

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
        this.physics.add.collider(this.invGroup,this.enemyGroup,(sprite,enemyG)=>{
            if(enemyG.body.velocity.x < 0){
                enemyG.setVelocityX(100);
            } else{
                enemyG.setVelocityX(-100);
            }
        });
    }

    update(){
        this.cavern.setTilePosition(this.cameras.main.scrollX);
        if(!gameOver){
            this.playerFSM.step();
            if(this.enemyC1 != 1){
                let enemyN = this.physics.add.sprite(this.enemyS.x,this.enemyS.y,'enemyR').setScale(1.5,1.5);
                enemyN.body.immovable = true;
                this.enemyGroup.add(enemyN);
                enemyN.setVelocityX(-100);
                this.enemyC1 +=1;
            }
        }
    }

    onCooldown(){
        this.cooldown = true;
    }
}