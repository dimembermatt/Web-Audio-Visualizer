//Simple Particle Visualization
var modifier = 4 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;


var particles = create2dArray(cols, rows); //array of arrays, each index of the outer is height, inner is width

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  //setup a system of particles, displayed evenly determined by a modifier
  var widthSlice = window.innerWidth * .01 * 1/modifier;
  var heightSlice = window.innerHeight * .02 * 1/modifier;
  //populate 2d array particles with particle objects
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      particles[i][j] = new Particle(i * widthSlice + widthSlice * .5, j * heightSlice + heightSlice * .5);
    }
  }
}

function draw(){
  background(0);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < particles[i].length; j++) {
      particles[i][j].update();
      particles[i][j].show();
      if(particles[i][j].finished() <= 0)
        particles[i].splice(j, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.alpha = 255;
    this.vAlpha = random(-5, 2);
    //this.color = random(0, 255);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    //wall collision
    if(this.x < 0 || this.x > window.innerWidth)
      this.vx = -this.vx;
    if(this.y < 0 || this.y > window.innerHeight)
      this.vy = -this.vy;

    this.alpha += this.vAlpha;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, 3);
  }

  finished() {
    return this.alpha;
  }
}

function create2dArray(columns, rows) {
  var arr = new Array(columns);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
