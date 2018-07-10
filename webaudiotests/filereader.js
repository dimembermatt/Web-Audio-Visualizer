let context = new (window.AudioContext || window.webkitAudioContext)();
let play = document.getElementById('play');
let stop = document.getElementById('stop');
let src;

function getFile() {
        src = context.createBufferSource()
        // Load a file from the file input
        let selectedFile = document.getElementById('fileIn').files[0];
        // Create an HTTP request to get the file
        let request = new XMLHttpRequest();
        // Error - File not found!
        if(!selectedFile) {
            alert("Select a file!")
        }
        else {
            request.open('GET', selectedFile.name, true);
            request.responseType = 'arraybuffer';

            request.onload = function() {
                let data = request.response;
                context.decodeAudioData(data, function(buffer){
                    src.buffer = buffer;
                    src.loop = false;
                    src.connect(context.destination);
                    src.start(0);
                    src.onended = function() {
                        play.removeAttribute('disabled');
                    }
                }, (e) => console.log("Error with decoding audio data" + e));
            }
            request.send();
        }
        return !!selectedFile;
}

play.onclick = function() {
    let fileFound = getFile();
    
    // Only disable the play button if a file is found
    if (fileFound){
        play.setAttribute('disabled', 'disabled');
    }
}


stop.onclick = function() {
    src.stop(0);
    play.removeAttribute('disabled');
}