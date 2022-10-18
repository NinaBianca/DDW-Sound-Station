let mask = [];
let loopCount = 0;

function preload(){
    for(i = 0; i < 201; i++) {
        mask[i] = (loadImage('assets/Mask_003_' + i + '.png'));
    }
}

function setup(){
    imageMode(CORNER);
}

function draw(){
    image(mask[loopCount], 0, 0, windowW, windowH);
    if(loopCount < mask.length - 1){
        loopCount++;
    }
    else {
        loopCount = 0;
    }
}