//test sandbox for QuadTree
let qtree;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  let boundary = new Rectangle(window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
  qtree = new QuadTree(boundary, 4);
  console.log(qtree);
//  for (let i = 0; i < 500; i++) {
//    let p = new Point(random(width), random(height));
//    qt.insert(p);
//  }

}

function draw() {
  if(mouseIsPressed) {
    for (let i = 0; i < 5; i++) {
      let m = new Point(mouseX + random(-25, 25), mouseY + random(-25, 25))
      //let m = new Point(random(0, window.innerWidth), random(0, window.innerHeight));
      qtree.insert(m);
    }

  }

  background(0);
  qtree.show();
}
