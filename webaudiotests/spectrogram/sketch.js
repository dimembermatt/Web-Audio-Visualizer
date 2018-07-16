// Spectrograph setup
const spectrum = new Uint8Array(analyser.frequencyBinCount);
function setup() {
	createCanvas(spectrum.length, 480);
}

function draw() {
	background(0);
	if(loaded && spectrum) {
		analyser.getByteFrequencyData(spectrum);
		let i = 0;
		while(i < spectrum.length) {
			let freq = spectrum[i];
			let percent = freq/300;
			let width = windowWidth/spectrum.length;
			let height = windowHeight/4 * percent;
			let offset = windowHeight/2 - height - 1;
			let hue = (i+255)/spectrum.length * 500;
			if(i < spectrum.length/3)
				fill(hue, 0, 0);
			else if(i < spectrum.length * 2/3) 
				fill(0, hue, 0);
			else 
				fill(0, 0, hue);
			rect(i/2 * width, offset, width, height);
			i+=3;
		}
	}
}