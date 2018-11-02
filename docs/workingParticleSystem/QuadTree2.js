//Quadtree V2 for Particle collission detection
var weight = .2;
//this class is for testing purposes. Replace with particle class in implementation.
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

//this class is the sections in which each Particle is sorted into.
//the smallest subdivision Rectangle decides which particles the Particle in
//question compares itself to for object collision.
class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  //check if coordinates of Particle are within the bounds of the Rectangle
  contains(x, y) {
    return (x >= this.x - this.w &&
      x <= this.x + this.w &&
      y >= this.y - this.h &&
      y <= this.y + this.h)
  }

  intersects(range) {
    return !(range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h);
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = this.r * this.r;
  }
}

//this class sorts objects
class QuadTree {
  constructor(boundary, n, currentLevel, maxLevels) {
    this.boundary = boundary;           //size and location of a QuadTree
    this.capacity = n;                  //how many particles it can hold before splitting
    this.particles = [];                //the particles within a QuadTree
    this.currentLevel = currentLevel;   //current level the QuadTree has split
    this.maxLevels = maxLevels;         //how many levels a QuadTree should split before saturation
    this.divided = false;               //determines whether it has been divided or not
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let nW = this.boundary.w/2;
    let nH = this.boundary.h/2;

    let neNode = new Rectangle(x + nW, y - nH, nW, nH);
    let nwNode = new Rectangle(x - nW, y - nH, nW, nH);
    let seNode = new Rectangle(x + nW, y + nH, nW, nH);
    let swNode = new Rectangle(x - nW, y + nH, nW, nH);

    let newLevel = this.currentLevel + 1;
    this.northeast = new QuadTree(neNode, this.capacity, newLevel, this.maxLevels);
    this.northwest = new QuadTree(nwNode, this.capacity, newLevel, this.maxLevels);
    this.southeast = new QuadTree(seNode, this.capacity, newLevel, this.maxLevels);
    this.southwest = new QuadTree(swNode, this.capacity, newLevel, this.maxLevels);
    //after one subdivision, all new QuadTrees are at level 1
    this.divided = true;
  }

  insert(particle) {
    //don't insert if not in bounds
    if (!this.boundary.contains(particle.x, particle.y)) {
      return false;
    }
    //if number of points in the tree are less than copacity or is on the bottom level, push
    if (this.particles.length < this.capacity || this.currentLevel == this.maxLevels) {
      this.particles.push(particle);
      return true;
    //else make a new level and insert theat point
    }else{
      //make a new QuadTree if
      if (!this.divided) {
        this.subdivide();
      }
      if (this.northeast.insert(particle)) {
        return true;
      }else if (this.northwest.insert(particle)) {
        return true;
      }else if (this.southeast.insert(particle)) {
        return true;
      }else if (this.southwest.insert(particle)) {
        return true;
      }
    }
  }

  //range is a boundary shape (i.e. rectangle) in which all points are found.
  query(range, found) {
    if (!found) {
      found = [];
    }
    if (!this.boundary.intersects(range)) {
      return found;
    } else {
      for (let p of this.particles) {
        if (range.contains(p.x, p.y)) {
          found.push(p);
        }
      }
      if (this.divided) {
        this.northeast.query(range, found);
        this.northwest.query(range, found);
        this.southeast.query(range, found);
        this.southwest.query(range, found);
      }
      return found;
    }
  }

  show() {
     stroke(255);
     strokeWeight(weight);
     noFill();
     rectMode(CENTER);
     rect(this.boundary.x, this.boundary.y, this.boundary.w*2, this.boundary.h*2);
     if (this.divided) {
       weight += .3;
       this.northeast.show();
       this.northwest.show();
       this.southeast.show();
       this.southwest.show();
     }
     for (let p of this.particles) {
       strokeWeight(2);
       point(p.x, p.y);
     }
     weight = .2;
  }
}
