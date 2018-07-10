class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('SceneB');

		this.need_new_scene = false;
		this.tapTime = 0;
		this.player = null;
		this.stars = null;
		this.evilstars = null;
		this.platforms = null;
		this.cursors = null;
		this.score = 0;
		this.scoreText = null;
		this.rotate_right = true;
		this.fly = false;
		this.run = false;
    }

	preload ()
	{
        this.load.image('BSpace', './images/SceneB_Background.png');
		this.load.image('BPlatform', './images/platform.png');
		
		this.load.image('ground', './images/ground.png');

		this.load.image('star', './images/soul.png');
		this.load.spritesheet('wolf', 
			'./images/wolf.png',
			{ frameWidth: 52, frameHeight: 32 } );
		this.load.image('evilstar', './images/evilstar.png');
		this.load.spritesheet('enemy', 
			'./images/enemy.png',
			{ frameWidth: 52, frameHeight: 32 } );
		this.platforms = this.physics.add.staticGroup();
		this.cursors = this.input.keyboard.createCursorKeys();
	}
	
    create ()
    {
		this.cameras.main.setBounds(0, 0, 3200, 600);
		this.physics.world.setBounds(0, 0, 3200, 600);

		this.sceneText = this.add.text(300, 200, 'Scene B', { fontSize: '60px', fill: '#FFFFFF' });
		
		this.add.image(1600, 300, 'BSpace');
				
		sceneB_set_platforms(this.platforms);
		
		this.player = this.physics.add.sprite(100, 300, 'wolf');
		this.player.setBounce(0);
		this.player.setCollideWorldBounds(true);
		this.player.body.setGravityY(100)

		this.cameras.main.startFollow(this.player, false, 0.5, 0.5);
		this.cameras.main.followOffset.set(-50, 0);
		
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('wolf', { start: 0, end: 4 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('wolf', { start: 6, end: 10 }),
			frameRate: 10,
			repeat: -1
		});
		
		this.anims.create({
			key: 'turn_right',
			frames: [ { key: 'wolf', frame: 6 } ],
			frameRate: 20
		});
		
		this.anims.create({
			key: 'turn_left',
			frames: [ { key: 'wolf', frame: 4 } ],
			frameRate: 20
		});
		
		this.anims.create({
			key: 'fly_left',
			frames: [ { key: 'wolf', frame: 2 } ],
			frameRate: 20
		});
		
		this.anims.create({
			key: 'fly_right',
			frames: [ { key: 'wolf', frame: 8 } ],
			frameRate: 20
		});
		
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		});
		
		this.evilstars = this.physics.add.group();
		
		this.scoreText = this.add.text(16, 16, 'Scene B. Score: 0', { fontSize: '32px', fill: '#FFFFFF' });
		this.physics.add.collider(this.stars, this.platforms);
		this.physics.add.collider(this.evilstars, this.platforms);
		this.physics.add.collider(this.player, this.platforms);
		
		this.physics.add.overlap(this.player, this.stars, collectStar, null, this);
		this.physics.add.collider(this.player, this.evilstars, hitBomb, null, this);


		this.stars.children.iterate(function (child) {
			child.setBounce(1);
			child.setCollideWorldBounds(true);
			child.setVelocity(Phaser.Math.Between(-200, 200), 20);
			child.allowGravity = false;
		});
    }

	animate_player () {
		if(this.player.body != undefined) {
			if(!this.player.body.touching.down)
				this.fly = true;
			else 
				this.fly = false;
			
			if (this.rotate_right)
			{
				if(this.fly)
					this.player.anims.play('fly_right', true);
				else if (this.run)
					this.player.anims.play('right', true);
				else 
					this.player.anims.play('turn_right', true);
			}
			else
			{
				if(this.fly)
					this.player.anims.play('fly_left', true);
				else if (this.run)
					this.player.anims.play('left', true);
				else 
					this.player.anims.play('turn_left', true);
			}
		}
	}

    update (time, delta) {
		if(this.need_new_scene) {
			this.scene.start('SceneC');
			this.need_new_scene = false;
		}
		
		this.input.on('pointerdown', this.tapDown);
		this.input.on('pointerup', this.tapUp);
		this.animate_player();		
    }
	
	tapDown (pointer) {
		if(pointer.downTime - this.scene.tapTime < config.doubleTapDelay 
		&& this.scene.player.body.touching.down)
			this.scene.player.setVelocityY(-330);
		
		if(pointer.x > this.scene.player.body.x) {
			this.scene.rotate_right = true;
			this.scene.player.setVelocityX(160);
			this.scene.run = true;
		}
		else if (pointer.x < this.scene.player.body.x) {
			this.scene.rotate_right = false;
			this.scene.player.setVelocityX(-160);
			this.scene.run = true;
		}
		//console.log('playerX: ' + this.scene.player.body.x + ' PointerX: ' + pointer.x);
	}
	
	tapUp (pointer) {
			this.scene.tapTime = pointer.downTime;
			this.scene.player.setVelocityX(0);
			this.scene.run = false;
			//this.scene.animate_player();
	}
}