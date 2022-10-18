class Data {
    constructor() {
        this.output = new Output();
        this.analysis = new Analysis();
        this.input = new Input();
    }
    startInput() {
        userStartAudio();
        this.input.mic = new p5.AudioIn();
        this.input.mic.start( () => {
            this.analysis.pitchDetector = ml5.pitchDetection('models/pitchmodel', getAudioContext(), this.input.mic.stream, () => { this.analysis.loaded = true; });
        });
    }
    update() {
        if(this.analysis.loaded){
            this.analysis.pitchDetector.getPitch((err, frequency) => {
               if(frequency){
                this.output.sounds.frequency += (frequency - this.output.sounds.frequency) * 0.05;
               } else {
                this.output.sounds.frequency += (0 - this.output.sounds.frequency) * 0.05;
               }
            });
            this.output.sounds.volume += (this.input.mic.getLevel() - this.output.sounds.volume) * 0.05;
        }
    }
}

class Analysis {
    constructor(){
        this.pitchDetector = null;
        this.loaded = false;
    }
    handleResults(error, result){
        if (error) {
            console.error(error);
        }

        return result[0].label;
    }
}

class Input {
    constructor(){
        this.mic = null;
    }
}

class Output {
    constructor(){
        this.sounds = {
            frequency: null,
            volume: null
        };
    }
}