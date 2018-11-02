class Particle {
  constructor(x, y, size, speedMod) {
    this.x = x;
    this.y = y;
    this.vx = random(-.1, .1) * speedMod;
    this.vy = random(-.1, .1) * speedMod;
    this.old_vx = 0;
    this.old_vy = 0;
    this.colliding = false;
    this.alpha = 255;
    this.color = [random(0, 255), random(0, 255), random(0, 255)];
    this.size = size;
    this.speedMod = speedMod;
  }

  pIntersect(particleB) {
    let distance = Math.sqrt(Math.pow(this.x - particleB.x, 2), Math.pow(this.y - particleB.y, 2));
    if (distance < (this.size/12 + particleB.size/12))
      return true;
    else
      return false;
  }
  storeVelocities() {
    this.old_vx = this.vx;
    this.old_vy = this.vy;
  }
  elasticCollision(particleB) {
    //this is particle A
    //save old vX vY
    let vX = this.old_vx;
    let uX = particleB.old_vx;
    let mA = this.size;
    let mB = particleB.size;
    //if minimum mass of other particle is 1, and the maximum initial speed of the two particles is .2, .4 is the limit - therefore *2.5)
    this.vx = (2 * mB * (uX - vX))/(mA + mB) *2.5;///this.speedMod;
    //this.vx = (2 * mA * uX + vX * (mB - mA))/(mA + mB);

    let vY = this.old_vy;
    let uY = particleB.old_vy;
    this.vx = (2 * mB * (uY - vY))/(mA + mB) *2.5;///this.speedMod;
    //this.vy = (2 * mA * uY + vY * (mB - mA))/(mA + mB);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    //wall collision
    if(this.x < 0 || this.x > window.innerWidth)
      this.vx = -this.vx;
    if(this.y < 0 || this.y > window.innerHeight)
      this.vy = -this.vy;

    //this.alpha += random(-3, 1);
  }

  show() {
    noStroke();
    //fill(255, this.alpha);
    fill(this.color[0], this.color[1], this.color[2], this.alpha);
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
