//Simple Particle Visualization
var modifier = 4 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;


var particles = create2dArray(cols, rows); //array of arrays, each index of the outer is height, inner is width

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  //setup a system of particles, displayed evenly determined by a modifier
  let widthSlice = window.innerWidth * .01 * 1/modifier;
  let heightSlice = window.innerHeight * .02 * 1/modifier;
  //populate 2d array particles with particle objects
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      particles[i][j] = new Particle(i * widthSlice + widthSlice * .5, j * heightSlice + heightSlice * .5);
    }
  }
}

function draw(){
  background(0);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < particles[i].length; j++) {
      particles[i][j].update();
      particles[i][j].show();
      if(particles[i][j].finished() <= 0)
        particles[i].splice(j, 1);
    }
  }
}
