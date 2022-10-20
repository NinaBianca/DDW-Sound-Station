let data;
let windowW = window.innerWidth;
let windowH = window.innerHeight;

let col1;
let col2;
let col3;
let col4;

let particles = [];
let maxDistance = 100;
let crack;
let mask = [];
let loopCount = 0;
let nFrames = 12000;

function preload(){
    document.body.style.overflow = 'hidden';
    crack = loadImage('assets/crack.png');
    for(i = 0; i < 251; i++) {
        mask[i] = loadImage('assets/Mask_002_00' + i + '.png');
    }
}

function setup(){
    data = new Data();
   
    rectMode(CENTER);
    imageMode(CORNER); 
    createCanvas(windowW - 1, windowH - 1);

    // Wait for an interaction with the page before requesting the Audio Context to avoid errors
    getAudioContext().suspend();
}

function draw(){
    data.update();
    
    background(244, 227, 226, 10);
    let timing = (frameCount) / nFrames;
    
    let vol = data.output.sounds.volume;
    let freq = data.output.sounds.frequency;

    // Map volume for particle size
    let volume = map(vol, 0, 1, 1, 20);

    // Map frequency for particle acceleration
    let frequency = map(freq, 100, 2000, 1, 20);

    if(vol >= .25){
        // Red colors for loud volume
        col1 = color(255, 0, 0);
        col2 = color(227, 11, 92);
        col3 = color(225, 49, 49);
        col4 = color(233, 30, 70);
    }
    else {
        // HyperCulture style colors for normal volume
        col1 = color(0, 128, 201);
        col2 = color(194, 237, 46);
        col3 = color(69, 69, 158);
        col4 = color(138, 135, 235);
    }

    // Screen crack overlay for extreme volume - NOT CURRENTLY IN USE
    // if (vol > .15) {
    //     particles = [];
    //     clear();
    //     background(0);
    //     image(mask[loopCount], 0, 0, windowW, windowH);
    //     push();
    //     tint(255, 100);
    //     image(crack, 0, 0, windowW, windowH);
    //     pop();
    //     return;
    // }

    push();
    // Rotate screen center
    translate(windowW / 2, windowH / 2);
    var x = 0 + 10 * cos(360 * timing);
    var y = 0 + 175 * sin(360 * timing);
    translate(x, y);

    // Spawn new particles when noise is detected
    if(vol > .09){
        for(var i = 0; i < 3; i++){
            if(particles.length < 100){
                var p = new Particle(volume);
                particles.push(p);
            }   
        }
    }

    // Display and move all existing particles
    for(var i = particles.length - 1; i >= 0; i--) {
        if(!particles[i].edges()) {
            particles[i].update(frequency);
            particles[i].show(volume);
        } else {
            particles.splice(i, 1);
        }
    }  

    // Randomly spawn a particle every 30 seconds if no noise is detected
    if(particles.length == 0 && second() % 30 == 0){
        var p = new Particle(8);
        particles.push(p);
    }
    pop();

    // Refresh background - NOT CURRENTLY IN USE
    // if(particles.length == 0){
    //     clear();
    //     background(0);
    // }

    // Loop through mask images
    image(mask[loopCount], 0, 0, windowW, windowH);
    if(loopCount < mask.length - 1){
        loopCount++;
    }
    else {
        loopCount = 0;
    }
}

// This part makes sure there's been an interaction with the page before audio elements
// are activated. This prevents errors.
let overlayEl = document.querySelector('.overlay');
overlayEl.addEventListener('mouseup', (e) => {
    overlayEl.classList.add('overlay--hidden');
    data.startInput();
});