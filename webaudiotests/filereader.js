let context = new (window.AudioContext || window.webkitAudioContext)();
let play = document.getElementById('play');
let stop = document.getElementById('stop');
let src;

function getFile() {
        src = context.createBufferSource()
        // Load a file from the file input
        let selectedFile = document.getElementById('fileIn').files[0];
        let reader = new FileReader();
        // Create an HTTP request to get the file
        let request = new XMLHttpRequest();
        // Error - File not found!
        if(!selectedFile) {
            alert("Select a file!")
        }
        else {
            reader.onload = function() {
                let data = reader.result;
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
            reader.readAsArrayBuffer(selectedFile);
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