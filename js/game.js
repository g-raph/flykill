// game start

$(document).ready(function(){

  var window_width = $(window).width();
  var window_height = $(window).height();
  // console.log(window_width+'x'+window_height);

  // welcome screen
  var load_last_time = localStorage.getItem('last_score');
  $('<div>Last score: '+load_last_time+'</div>').appendTo('#welcomescreen');
  $('#welcomescreen').click(function(){

    $(this).css('background','none');

    // THE GAME
    var game = new Phaser.Game(window_width, window_height, Phaser.CANVAS, 'flykill', { preload: preload, create: create, update: update });

    var fly;
    var fly_amount = 25;
    var fly_group;
    var floor;
    var position_x;
    var position_y;
    var gamesound;
    var wooshing;
    var counting = 0;
    var count_text;
    var gameovertext;
    var timer;
    var score;


    function preload() {

      game.load.atlasJSONHash('fly', 'images/fly.png', 'data/fly.json');
      game.load.image('flyisdead', 'images/flyisdead.png');
      game.load.image('floor', 'images/floor.png');
      game.load.audio('gamesound', 'sound/gamesound.mp3');
      game.load.audio('woosh', 'sound/woosh.mp3');

    }

    function create() {

      // BG
      floor = game.add.tileSprite(0, 0, window_width, window_height, 'floor');
      // sound
      gamesound = game.add.audio('gamesound');
      gamesound.play();

      // timer display
      timer = game.add.text(200, 5, '00:00:00', {
          font: "14px Arial",
          fill: "#fff",
          align: "center"
      });
      // counting text
      count_text = game.add.text(5, 5, "Flies killed: 0 / "+fly_amount+"!", {
          font: "14px Arial",
          fill: "#182d3b",
          align: "center"
      });
      // grouping flies
      fly_group = game.add.group();
      for (var i = 1; i <= fly_amount; i++) {
        fly_group.create(new aFly());
      }

      console.log(score);

    }

    function update() {

      // update counting text
      count_text.setText("Flies killed: "+counting+"!");
      // update timer
      if (counting < fly_amount) {
        updateTimer('start');
      }

    }

    function updateTimer(status) {

      if (status == 'start') {
        minutes = Math.floor(game.time.time / 60000) % 60;
        seconds = Math.floor(game.time.time / 1000) % 60;
        milliseconds = Math.floor(game.time.time) % 100;
        //If any of the digits becomes a single digit number, pad it with a zero
        if (milliseconds < 10)
            milliseconds = '0' + milliseconds;
        if (seconds < 10)
            seconds = '0' + seconds;
        if (minutes < 10)
            minutes = '0' + minutes;
        timer.setText(minutes + 'm '+ seconds + 's ' + milliseconds +'ms');
      }

    }

    function flyKilling() {

      if (counting < (fly_amount-1)) {
        counting++;
      } else {
        counting++;
        game_over();
      }
      // game.add.bitmapText(250, 250, counting, { font: '20px arial', align: 'left' });
      wooshing = game.add.audio('woosh');
      wooshing.play();
      position_x = this.flySprite.x;
      position_y = this.flySprite.y;
      // console.log(position_x+' x '+position_y);
      this.flySprite.kill();
      this.flySprite = game.add.sprite(position_x, position_y, 'flyisdead');


    }

    function game_over() {

      floor.kill();
      game.stage.backgroundColor = '#182d3b';
      gameovertext = game.add.text(game.world.centerX - 150, 100, "Flies killed: "+counting+" / "+fly_amount+"!", {font: "40px Arial",fill: "#fff",align: "center"});
      
      localStorage.setItem('last_score', 'data uit localstore');

    }

    // objects

    aFly = function(){

      // object randomness
      this.x = game.world.randomX;
      this.y = game.world.randomY;
      this.minSpeed = -75;
      this.maxSpeed = 75;
      this.vx = Math.random()*(this.maxSpeed - this.minSpeed+1)-this.minSpeed;
      this.vy = Math.random()*(this.maxSpeed - this.minSpeed+1)-this.minSpeed;

      // sprite randomness
      this.flySprite = game.add.sprite(this.x,this.y,'fly');
      this.flySprite.anchor.setTo(0.5, 0.5);
      this.flySprite.body.collideWorldBounds = true;
      this.flySprite.body.bounce.setTo(1, 1);
      this.flySprite.body.velocity.x = this.vx;
      this.flySprite.body.velocity.y = this.vy;
      this.flySprite.body.immovable = true;

      // custom functions
      this.flySprite.animations.add('flying');
      this.flySprite.animations.play('flying', 15, true);

      this.flySprite.inputEnabled=true;
      this.flySprite.events.onInputDown.add(flyKilling,this);

    }

  });

});
