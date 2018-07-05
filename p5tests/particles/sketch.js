//test sandbox for QuadTree
let qtree;
var modifier = 2 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;
var particles = create2dArray(cols, rows); //array of arrays, each index of the outer is height, inner is width

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  let boundary = new Rectangle(window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
  qtree = new QuadTree(boundary, 4);
  console.log(qtree);
  //populate 2d array particles with particle objects
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      particles[i][j] = new Particle(random(width), random(height));
      qtree.insert(particles[i][j]);
    }
  }
  // for (let i = 0; i < 1250; i++) {
  //   let p = new Particle(random(width), random(height));
  //   qtree.insert(p);
  // }
}

function draw() {
  background(0);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < particles[i].length; j++) {
      particles[i][j].update();
      particles[i][j].show();
      if(particles[i][j].finished() <= 0)
        particles[i].splice(j, 1);
    }
  }
  // if(mouseIsPressed) {
  //   for (let i = 0; i < 5; i++) {
  //     let m = new Particle(mouseX + random(-25, 25), mouseY + random(-25, 25))
  //     //let m = new Point(random(0, window.innerWidth), random(0, window.innerHeight));
  //     qtree.insert(m);
  //   }
  // }

  background(0);
  qtree.show();
  stroke(0, 255, 0);
  rectMode(CENTER);
  let range = new Rectangle(mouseX, mouseY, 100, 100)
  rect(range.x, range.y, range.w * 2, range.h  * 2);
  let points = qtree.query(range);
  for (let p of points) {
    stroke(0, 0, 255);
     strokeWeight(3);
     point(p.x, p.y);
  }
}
