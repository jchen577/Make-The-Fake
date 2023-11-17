class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Hero to existing scene
        scene.physics.add.existing(this)   // add physics body to scene

        //this.body.setCollideWorldBounds(true);//Player collides with boundaries

        //set player values
    }
}
class IdleState extends State {//Player idle state
    enter(scene, hero) {
        //hero.setVelocity(0);
        hero.body.setDragX(hero.drag);
        hero.setAccelerationX(0);
        hero.anims.play(`walk`);
        //hero.anims.stop();
    }

    execute(scene,hero){
        const { left, right, up } = scene.keys;
        //transition to new states
        if(Phaser.Input.Keyboard.JustDown(up)) {
            this.stateMachine.transition('jump');
            return;
        }

        if(left.isDown || right.isDown ) {
            this.stateMachine.transition('move');
            return;
        }
    }
}

class MoveState extends State {
    execute(scene,hero){
        const { left, right, up } = scene.keys;

        if(Phaser.Input.Keyboard.JustDown(up)) {
            this.stateMachine.transition('jump');
            return;
        }

        if(!(left.isDown || right.isDown )) {
            this.stateMachine.transition('idle');
            return;
        }

        if(left.isDown) {
            hero.setFlip(true, false);
            hero.directionx = -1;
        } else if(right.isDown) {
            hero.resetFlip();
            hero.directionx = 1;
        }
        
        hero.body.setAccelerationX(hero.acceleration * hero.directionx);
        hero.anims.play(`walk`, true);
        if(hero.body.velocity.x > hero.velocityS){
            hero.body.velocity.x = hero.velocityS;
        }
        else if(hero.body.velocity.x < -hero.velocityS){
            hero.body.velocity.x = -hero.velocityS;
        }
        hero.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
}

class JumpState extends State{
    enter(scene,player){
        const { up } = scene.keys;

        player.isGrounded = player.body.touching.down;
	    if(player.isGrounded) {
            //player.anims.play('walk', true);
	    	player.jumps = player.MAX_JUMPS;
	    	player.jumping = false;
	    }

        if(player.jumps >= 0 && Phaser.Input.Keyboard.DownDuration(up, 150)) {
	        player.body.velocity.y = player.JUMP_VELOCITY;
	        player.jumping = true;
	    }

        if(player.jumping) {
            scene.sound.play('jump');
	    	player.jumps--;
	    	player.jumping = false;
	    }

        /*hero.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })*/
        this.stateMachine.transition('idle');
    }
}