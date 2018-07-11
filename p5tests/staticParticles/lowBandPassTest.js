var fft, noise, filter;

function preload() {
 sound = loadSound('DEMO_1.mp3');
}

function setup() {
  createCanvas(window.innerWidth, window.innerheight);
  filter = new p5.LowPass();
  noise = new p5.Noise();
  // disconnect unfiltered noise,
  // and connect to filter
  sound.disconnect();
  sound.connect(filter);
  sound.play();

  fft = new p5.FFT();
}

let x = 0;
function draw() {
  background(0);

  // set the BandPass frequency based on mouseX
  var freq = 200;//map(mouseX, 0, width, 20, 10000);
  filter.freq(freq);
  // give the filter a narrow band (lower res = wider bandpass)
  //filter.res(50);

  // draw filtered spectrum
  var spectrum = fft.analyze();

  let sum = 0;
  let count = 0;
  for (var i = 0; i < spectrum.length; i++) {
    sum += spectrum[i];
    count ++;
    // var x = map(i, 0, spectrum.length, 0, width);
    // var h = -height + map(spectrum[i], 0, 255, height, 0);
    // rect(x, height, width/spectrum.length, h);
  }
  let avg = sum/count;
  console.log(avg);
  x++;
  let y = map(avg, 0, 10, 0, height);
  fill(0, 255, 0);
  rect(x, height, width / spectrum.length, y);
}
