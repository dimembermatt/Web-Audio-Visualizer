// Spectrograph setup
const spectrum = new Uint8Array(analyser.frequencyBinCount);
// Point class
class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}
function setup() {
	createCanvas(spectrum.length, 480);
}

function draw() {
	background(0);
	if(loaded || spectrum) {
		analyser.getByteFrequencyData(spectrum);
		strokeWeight(4);
		stroke(255, 255, 255);
		let prevPoint;
		let i = 0;
		let xoff = 0;
		while(i < spectrum.length && xoff <= width) {
			let freq = spectrum[i];
			point(xoff, freq);
			if(prevPoint) {
				line(prevPoint.x, prevPoint.y, xoff, freq);
			}
			prevPoint = new Point(xoff, freq);
			xoff += 10;
			i++;
		}
		console.log(spectrum);
	}
}