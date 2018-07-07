class Particle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.vx = random(-.1, .1)*8;
    this.vy = random(-.1, .1)*8;
    //this.rangeOfInfluence = 5;
    this.alpha = 255;
    this.vAlpha = random(-1.3, 1);
    this.color = [random(0, 255), random(0, 255), random(0, 255)];
    this.size = size;
  }

  transferMomentum(vx, vy, size) {
    let xMoment = vx * size;
    let yMoment = vy * size;
    this.vx = xMoment / this.size;
    this.vy = yMoment / this.size;
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
    //fill(255, this.alpha);
    fill(this.color[0], this.color[1], this.color[2]);
    //fill(this.alpha, this.x, this.y);
    ellipse(this.x, this.y, this.size);
  }

  finished() {
    return this.alpha;
  }
}

function create2dArray(columns, rows) {
  var arr = new Array(columns);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
