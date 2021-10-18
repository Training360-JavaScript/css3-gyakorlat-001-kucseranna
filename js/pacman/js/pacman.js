var gameParent = gameParent || '';

var baseGame = new Phaser.Game(448, 496, Phaser.AUTO, gameParent);

var PacmanGame = function (game) {

    this.map = null;
    this.layer = null;
    this.pacman = null;

    this.safetile = 14;
    this.gridsize = 16;

    this.speed = 100;
    this.threshold = 3;

    this.marker = new Phaser.Point();
    this.turnPoint = new Phaser.Point();

    this.directions = [null, null, null, null, null];
    this.opposites = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];

    this.current = Phaser.NONE;
    this.turning = Phaser.NONE;

    this.eated = 0;
    this.autoRefill = false;

    window.PacmanInstance = this;

};

PacmanGame.prototype = {

    // Getter for game properies.
    get: function (name) {
        if (!this[name]) {
            return null;
        }
        return this[name];
    },

    // Setter for game properies.
    set: function (name, value) {
        this[name] = value;
        return this;
    },

    // Initialize game.
    init: function () {

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        this.physics.startSystem(Phaser.Physics.ARCADE);

    },

    // Load external resources.
    preload: function () {

        //  We need this because the assets are on Amazon S3
        //  Remove the next 2 lines if running locally
        // this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue005/';
        // this.load.crossOrigin = 'anonymous';

        this.load.image('dot', '/pacman/assets/dot.png');
        this.load.image('tiles', '/pacman/assets/pacman-tiles.png');
        this.load.spritesheet('pacman', '/pacman/assets/pacman.png', 32, 32);
        this.load.tilemap('map', '/pacman/assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);

        //  Needless to say, graphics (C)opyright Namco

    },

    // Create game instance.
    create: function () {

        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('pacman-tiles', 'tiles');

        this.layer = this.map.createLayer('Pacman');

        this.dots = this.add.physicsGroup();

        this.map.createFromTiles(7, this.safetile, 'dot', this.layer, this.dots);

        //  The dots will need to be offset by 6px to put them back in the middle of the grid
        this.dots.setAll('x', 6, false, false, 1);
        this.dots.setAll('y', 6, false, false, 1);

        //  Pacman should collide with everything except the safe tile
        this.map.setCollisionByExclusion([this.safetile], true, this.layer);

        //  Position Pacman at grid location 14x17 (the +8 accounts for his anchor)
        this.pacman = this.add.sprite((14 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
        this.pacman.anchor.set(0.5);
        this.pacman.animations.add('munch', [0, 1, 2, 1], 20, true);

        this.physics.arcade.enable(this.pacman);
        this.pacman.body.setSize(16, 16, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.pacman.play('munch');
        this.move(Phaser.LEFT);

    },

    // Check cursor keys.
    checkKeys: function () {

        if (this.cursors.left.isDown && this.current !== Phaser.LEFT) {
            this.checkDirection(Phaser.LEFT);
        }
        else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT) {
            this.checkDirection(Phaser.RIGHT);
        }
        else if (this.cursors.up.isDown && this.current !== Phaser.UP) {
            this.checkDirection(Phaser.UP);
        }
        else if (this.cursors.down.isDown && this.current !== Phaser.DOWN) {
            this.checkDirection(Phaser.DOWN);
        }
        else {
            //  This forces them to hold the key down to turn the corner
            this.turning = Phaser.NONE;
        }

    },

    // Check enabled directions.
    checkDirection: function (turnTo) {

        if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile) {
            //  Invalid direction if they're already set to turn that way
            //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
            return;
        }

        //  Check if they want to turn around and can
        if (this.current === this.opposites[turnTo]) {
            this.move(turnTo);
        }
        else {
            this.turning = turnTo;

            this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
            this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
        }

    },

    // Turn it.
    turn: function () {

        var cx = Math.floor(this.pacman.x);
        var cy = Math.floor(this.pacman.y);

        //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
        if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold)) {
            return false;
        }

        //  Grid align before turning
        this.pacman.x = this.turnPoint.x;
        this.pacman.y = this.turnPoint.y;

        this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);

        this.move(this.turning);

        this.turning = Phaser.NONE;

        return true;

    },

    // Move to any directions.
    move: function (direction) {

        var speed = this.speed;

        if (direction === Phaser.LEFT || direction === Phaser.UP) {
            speed = -speed;
        }

        if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
            this.pacman.body.velocity.x = speed;
        }
        else {
            this.pacman.body.velocity.y = speed;
        }

        //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
        this.pacman.scale.x = 1;
        this.pacman.angle = 0;

        if (direction === Phaser.LEFT) {
            this.pacman.scale.x = -1;
        }
        else if (direction === Phaser.UP) {
            this.pacman.angle = 270;
        }
        else if (direction === Phaser.DOWN) {
            this.pacman.angle = 90;
        }

        this.current = direction;

    },

    // Eat overlapped dots.
    eatDot: function (pacman, dot) {

        dot.kill();

        this.eated++;

        if (this.autoRefill && this.dots.total === 0) {
            this.dots.callAll('revive');
            this.eated = 0;
        }

        if (this.eatWatcher) {
            this.eatWatcher(this.eated, this.dots.total);
        }

    },

    // Game engine.
    update: function () {

        this.physics.arcade.collide(this.pacman, this.layer);
        this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);

        this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
        this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;

        //  Update our grid sensors
        this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
        this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
        this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
        this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);

        this.checkKeys();

        if (this.turning !== Phaser.NONE) {
            this.turn();
        }

    }

};

// Add PacmanGame to the game state.
baseGame.state.add('Game', PacmanGame, true);
