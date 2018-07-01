function setupWebAudio(){
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyserNode = audioCtx.createAnalyser();
  var source = audioCtx.createMediaElementSource(thisSong);
  source.connect(analyserNode);
  source.connect(audioCtx.destination);
  audio.play();
}

function analyseAudio(){
  analyserNode.fftSize = 2048;
  var bufferLength = analyserNode.frequencyBinCount;
  var frequency = new Uint8Array(bufferLength);
  var waveform = new Float32Array(bufferLength);
  analyserNode.getByteFrequencyData(frequency);
  analyserNode.getFloatTimeDomainData(waveform);
}

function draw(mode){ //adjust draw based on mode

}
