//test sandbox for QuadTree
'use strict';
var modifier = 3 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;
var particles = [];
var boundary;
var qtree;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  boundary = new Rectangle(window.innerWidth/2, window.innerHeight/2,
    window.innerWidth/2, window.innerHeight/2);
  //setup a system of particles, displayed evenly determined by a modifier
  let widthSlice = window.innerWidth/cols;
  let heightSlice = window.innerHeight/rows;
  //populate 2d array particles with particle objects
  let ctr = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      particles[ctr] = new Particle(i * widthSlice + widthSlice * .5, j * heightSlice + heightSlice * .5,25, 5);
      ctr++;
    }
  }

  // for (let i = 0; i < cols * rows; i++) {
  //   particles[i] = new Particle(random(width), random(height), random(5, 12), 5);
  // }
}

function draw() {
  background(0);
  //update and display particles
  qtree = new QuadTree(boundary, 4, 0, 10);

  for (let particle of particles) {
    particle.update();
    particle.show();
    qtree.insert(particle);
  }
  //qtree.show();
  //for each particle, identify other nearby particles and display intersecting particles.
  for (let particle of particles) {
    let range = new Rectangle(particle.x, particle.y, particle.size, particle.size);
    let others = qtree.query(range);
    for (let i = 0; i < others.length; i++) {
      let particleB = others[i];
      if (particle !== particleB && particle.pIntersect(particleB)) {
        // stroke(0, 0, 255);
        // strokeWeight(6);
        // point(particle.x, particle.y);
        // point(particleB.x, particleB.y);

        //elastic collision if particles have not collided before
        if (particle.colliding == false && particleB.colliding == false) {
          particle.storeVelocities();
          particleB.storeVelocities();
          particle.elasticCollision(particleB);
          particleB.elasticCollision(particle);
          particle.colliding = true;
          particleB.colliding = true;
        }

        //draw bounding box
        stroke(255, 0, 0);
        strokeWeight(1);
        //rect(particle.x, particle.y, 30, 30);
      }
      else {//colliding state is now false when not in range of another particle
        particle.colliding = false;
        particleB.colliding = false;
      }
    }
  }
}

function mousePressed() {
  let x = mouseX;
  let y = mouseY
  let range = new Rectangle(x, y, 30, 30);
  let impulseArea = new Circle(x, y, 30);
  stroke(255, 0, 0);
  strokeWeight(1);
  rect(x-30, y-30, 60, 60);
  ellipse(x, y, 60, 60);
  let particles = qtree.query(range);
  for (let particle of particles) {
    let impulseVector = Math.sqrt(Math.pow(x - particle.x, 2), Math.pow(y - particle.y, 2));
    let sign = impulseArea.detPosition(particle);
    let signX = 1;
    let signY = 1;
    if (sign == 0 || sign == 2)
      signX = -1;
    if (sign == 2 || sign == 3)
      signY = -1;
    particle.vx = signX * impulseVector/particle.size/3;
    particle.vy = signY * impulseVector/particle.size/3;
  }
}
