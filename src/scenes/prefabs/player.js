class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Hero to existing scene
        scene.physics.add.existing(this)   // add physics body to scene

        //this.body.setCollideWorldBounds(true);//Player collides with boundaries

        //set player values
        this.directionx = 1;
        this.velocityS = 50;
        this.drag = 300;
        this.acceleration = 100;
        this.JUMP_VELOCITY = -500;
        this.jumping = false;

    }
}
class IdleState extends State {//Player idle state
    enter(scene, hero) {
        hero.setVelocityX(0);
        //hero.body.setDragX(hero.drag);
        //hero.setAccelerationX(0);
        //hero.anims.play(`walk`);
        hero.anims.stop();
    }

    execute(scene,hero){
        const { left, right, up, } = scene.keys;
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
        const { left, right, up,} = scene.keys;

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
        
        hero.body.setVelocityX(hero.acceleration * hero.directionx);
        hero.anims.play(`walk`, true);
        /*if(hero.body.velocity.x > hero.velocityS){
            hero.body.velocity.x = hero.velocityS;
        }
        else if(hero.body.velocity.x < -hero.velocityS){
            hero.body.velocity.x = -hero.velocityS;
        }*/
        hero.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })
    }
}

class JumpState extends State{
    enter(scene,player){
        const { up } = scene.keys;

        player.isGrounded = player.body.blocked.down;
        if(player.isGrounded == true && Phaser.Input.Keyboard.DownDuration(up, 150)) {
	        player.body.velocity.y = player.JUMP_VELOCITY;
	    }

        /*hero.once('animationcomplete', () => {
            this.stateMachine.transition('idle')
        })*/
        this.stateMachine.transition('idle');
    }
}