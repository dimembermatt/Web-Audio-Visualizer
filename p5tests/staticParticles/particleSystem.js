function create2dArray(rows, columns) {
  var arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(columns);
  }
  return arr;
}

//a Particle in a ParticleSystem only has a size.
class Particle {
  constructor(basePSize) {
    this.size = basePSize;
    this.color = [random(0, 255), random(0, 255), random(0, 255)];
    this.alpha = 255;
  }
}
/**
 * this class is a particle system, initialized at the begining of the main
 * with dimensions. In each box is a Particle, each of which has a Size.
 * When all particles in the System are equal (same size), a net zero force
 * is on any point of the system.
 * When an force is added to the system (from mousePressed or at start),
 * particles at the edge of a size-difference (size being synonymous with force)
 * experience a size-change proportional to the size-difference.
 * Like a wave, size changes should expand across the map and reflect the traveling
 * wave of the force.
 */

class ParticleSystem {
  constructor(rows, columns, basePSize, decayRate) {
    this.rows = rows;
    this.columns = columns
    this.decayRate = decayRate;
    this.basePSize = basePSize;
    this.pSystem = create2dArray(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        this.pSystem[i][j] = new Particle(basePSize);
      }
    }
  }

  display(sectionWidth, sectionHeight) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        noStroke();
        let particle = this.pSystem[i][j];
        fill(particle.color[0], particle.color[1], particle.color[2], particle.alpha);
        ellipse(j * sectionWidth, i * sectionHeight, particle.size);
      }
    }
  }

  update() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let sum = 0;
        let count = 3;
        
        //take the average of the surrounding 4 cells to calculate new size
        //check left and right cells first, if they exist
        if (i == 0) {//if leftmost column
          sum += this.pSystem[i + 1][j].size;
        } else if (i == this.rows-1) {//if rightmost column
          sum += this.pSystem[i - 1][j].size;
        } else {//if neither of the above
          sum += this.pSystem[i + 1][j].size;
          sum += this.pSystem[i - 1][j].size;
          count++;
        }

        //check up and down cells next, if they exist
        if (j == 0) { //if topmost row
          sum += this.pSystem[i][j + 1].size;
        } else if (j == this.columns-1) { //if bottom most row
          sum += this.pSystem[i][j - 1].size;
        } else {//if neither of the above
          sum += this.pSystem[i][j + 1].size;
          sum += this.pSystem[i][j - 1].size;
          count++;
        }

        sum += this.pSystem[i][j].size;
        let weightedAvg = sum/count;
        this.pSystem[i][j].size = this.pSystem[i][j].size <= this.basePSize ? this.basePSize : weightedAvg;
      }
    }
  }

  modifyParticleSize(i, j, newSize) {
    let particle = this.pSystem[i][j];
    particle.size = newSize;
  }
}
