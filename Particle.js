//Simple Particle Visualization
var cols = 100;
var rows = 50;

var particles = create2dArray(cols, rows); //array of arrays, each index of the outer is height, inner is width

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  //setup a system of particles, one for each 1% block of the window
  var widthSlice = window.innerWidth * .01 / 1;
  var heightSlice = window.innerHeight * .02 / 1;
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
    for (var j = 0; j < rows; j++) {
      particles[i][j].update();
      particles[i][j].show();
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
    //this.color = random(0, 255);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 1;
  }
  show() {
    noStroke();
    //stroke(255);
    fill(255, this.alpha);
    //fill(this.color);
    ellipse(this.x, this.y, 3);
  }
}

function create2dArray(columns, rows) {
  var arr = new Array(columns);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
