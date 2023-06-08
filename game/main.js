import {Howl, Howler} from 'howler';

let isMusicPlaying = false;

const sound = new Howl({
  src: ['../lite-saturation-despair-metal-trailer.mp3'],
  html5: true,
  autoplay: true,
  loop: true,
  volume: 0.5,
  onplay: () =>isMusicPlaying = true
});

const ongoingTouches = [];
let interval;

const happinessNode = document.querySelector(".owl-head");
const canvasNode = document.querySelector("#canvas");
const gamePlayTextArea = document.querySelector(".gameplay-text-node");
const scoreNode = document.querySelector(".score-js");
const levelNode = document.querySelector(".level-js");
const image = document.getElementById("source");
const ctx = canvasNode.getContext("2d");

const positivePhrases = ['Perfect!', 'Like that!', 'keep going!', 'Hoot!'];
const negativePhrases = ['Screech!', 'No!', "That's wrong!", 'Should I try?'];

let level = 1;
let score = 0;

let screenText = [{opacity: 1, y: 300, x: 180, text: 'hello'}];
let screenTextInterval = 0;

let zones = [];
let zonesHeightMin = 0;
let zonesHeightMax = 0;

const spriteX = []; // sprite sheet coordinates
const spriteY = []; // sprite sheet coordinates

let xTouch = 0;
let yTouch = 0;

let lossThreshHold = 0;
let happiness = 0;

let userMessages = [];

let swipeSize = 0;
let speeds = [0];

let intervalCount = 0;
let currentZone = 3;
let lastZone = 3;
let force = 0;
let isTouching = false;
let lastDirection = 'left';
let currentDirection = 'right';
let speedCount = 0;
let directionCount = 0;
let lastIndex = 3;

// red #ff0000
// green #00ff19
// cyan #00fff5

let lastTargets = {  
  swipeSize: 'large',
  swipeSpeedTarget: 2,
  force: 1,
  isTouching: false,
};

const targets = {
  swipeSize: 'large',
  swipeSpeedTarget: 2,
  force: 1,
  isTouching: false,
}


function tickCheck () {
  if (speeds.length > 4) {
    speeds.shift();
    speeds.push(speedCount);
  } else {
    speeds.push(speedCount);
  }

  // Speed
  const swipeSpeed = speeds.reduce((a, b) => a + b) / speeds.length;

  if (targets.swipeSpeedTarget + 1 < swipeSpeed ||  targets.swipeSpeedTarget - 1 > swipeSpeed) {
    if (happiness < 4) happiness++;
  } else {
    if (happiness !== 0) happiness--;
  }

  // Size (swipSize)
  if (level > 1) {
    if (targets.swipeSize === 'large' && swipeSize < 4) {
      if (happiness < 4) happiness++;
    } else if (targets.swipeSize === 'large' && swipeSize >= 4) {
      if (happiness !== 0) happiness--;
    }
  
    if (targets.swipeSize === 'small' && swipeSize >= 4 ) {
      if (happiness < 4) happiness++;
    } else if (targets.swipeSize === 'small' && swipeSize < 4) {
      if (happiness !== 0) happiness--;
    }
  }

  // // // Force
  // console.log("force", force);
  // if (level > 2) {
  //   if (targets.force === 'heavy' && force < 0.5) {
  //     if (happiness !== 0) happiness--;
  //   } else if (targets.force === 'heavy' && force >= 0.5) {
  //     if (happiness < 4) happiness++;
  //   }
  //   if (targets.force === 'light' && force >= 0.5) {
  //     if (happiness !== 0) happiness--;
  //   } else if (targets.force === 'light' && force < 0.5) {
  //     if (happiness < 4) happiness++;
  //   }
  // } 

  
  // Stop and go (isTouched)
  if (level > 2) { 
    if (targets.isTouching === true && isTouching === false ||  targets.isTouching === false && isTouching === true) {
      if (happiness < 4) happiness++;
    } else if (targets.isTouching === false && isTouching === false || targets.isTouching === true && isTouching === true) {
      if (happiness !== 0) happiness--;
    }
  }

  happinessNode.setAttribute('class', `owl-head img${happiness < 1 ? 1 : happiness}`);

  if (intervalCount % 2 === 0) {
    if (happiness > 3) lossThreshHold++;
    if (happiness < 4) lossThreshHold = 0;
  }

  if (intervalCount % 6 === 0) {
    if (happiness <= 0) {
      score += 10;
      scoreNode.textContent = score;
      addText(randText(positivePhrases), "#00ff19");
    }
    if (happiness === 2) {
      score += 6;
      scoreNode.textContent = score;
    }
    if (happiness >= 4) {
      score -= 4;
      scoreNode.textContent = score;
      addText(randText(negativePhrases), "#ff0000");
    }
  }

  // if you are at 4 for 5 seconds you lose
  if (lossThreshHold > 8) {
    location.href = '../story/?type=lose';
    clearInterval(interval);
  }

  // If you don't lose for just under 2 min you win round
  if (intervalCount > 140) {
    level++;
    levelNode.textContent = level;
    if (level > 3) {
      location.href = '../story/?type=win';
      reset();
      clearInterval(interval);
    } else {
      addText(`Level ${level}!`, "#00fff5");
      // if (level === 2) addText("Pressure Added", "#00fff5");
      if (level === 2) addText("Circle Size Added", "#00fff5");
      if (level === 3) addText("Pauses Added", "#00fff5");
      intervalCount = 0;
    }
  }

  speedCount++;
  intervalCount++;
  if (intervalCount % 25 === 0) {
    const speeds = [0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3];
    lastTargets = {...targets};

    targets.swipeSize = Math.random() > 0.5 ? 'small' : 'large';
    targets.swipeSpeedTarget = speeds[Math.floor(Math.random()*speeds.length)];
    targets.force = Math.random() > 0.2 ? 'heavy' : 'light';
    targets.isTouching = Math.random() > 0.2 ? true : false;

    if (targets.swipeSpeedTarget !== lastTargets.swipeSpeedTarget) {
      if (targets.swipeSpeedTarget < lastTargets.swipeSpeedTarget) addText("Slower!");
      if (targets.swipeSpeedTarget > lastTargets.swipeSpeedTarget) addText("Faster!");
    }
    if (targets.swipeSize !== lastTargets.swipeSize && level > 1) {
      if (targets.swipeSize === 'small') addText("Smaller circles!");
      if (targets.swipeSize === 'large') addText("Larger circles!");
    }
    // if (targets.force !== lastTargets.force && level > 2) {
    //   if (targets.force === 'light') addText("Lighter touch!");
    //   if (targets.force === 'heavy') addText("Heavier touch!");
    // }
    if (targets.isTouching !== lastTargets.isTouching  && level > 2) {
      if (targets.isTouching === true) addText("Start!");
      if (targets.isTouching === false) addText("Stop!");
    }
  }
}

function startup() {
  canvasNode.addEventListener("touchstart", handleStart);
  canvasNode.addEventListener("touchend", handleEnd);
  canvasNode.addEventListener("touchmove", handleMove);
  canvasNode.addEventListener("rotate", handleResize);
  canvasNode.addEventListener("resize", handleResize);
  setTimeout(() => {
    handleResize();
    ctx.drawImage(image, 3*140, 0, 140, 192, 0, 110, window.innerWidth, window.innerHeight);
  }, 1000);
  interval = setInterval(tickCheck, 250); // starts games
  window.requestAnimationFrame(animateText); // starts text animations
}

document.addEventListener("DOMContentLoaded", startup);

function handleStart(evt) {
  evt.preventDefault();
  isTouching = true;
  if (isMusicPlaying === false) {
    sound.play();
    console.log("music start")
  }
  updateTouchValues(evt.changedTouches)
}

function handleMove(evt) {
  evt.preventDefault();
  updateTouchValues(evt.changedTouches)
}

function handleEnd(evt) {
  evt.preventDefault();
  isTouching = false;
  updateTouchValues(evt.changedTouches)
}

function updateTouchValues (touches) {
  if (isTouching === false) {
    return;
  }

  const key = Object.keys(touches)[0]
  if (!touches[key]) {
    return;
  }
  force = touches[key].force;
  xTouch = touches[key].pageX;
  yTouch = touches[key].pageX;

  // if no zone bail
  let index = 0;
  while (xTouch > zones[index]) {
    index++;
  }

  if (lastIndex !== index) {
    const direction = lastIndex - index < 0 ? 'left' : 'right';

    if (lastDirection !== direction) {
      lastDirection = currentDirection;
      swipeSize = directionCount !== 1 ? directionCount : swipeSize;
      directionCount = 0;
      speedCount = 0;
    }

    currentDirection = direction;
    directionCount++;
    lastIndex = index;
  }


  ctx.drawImage(image, index*140, 0, 140, 192, 0, 110, window.innerWidth, window.innerHeight);
}

function handleResize () {
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  canvasNode.style.width = window.innerWidth + "px";
  canvasNode.style.height = window.innerHeight + "px";
  setZones();
}

function setZones () {
  zones = [];
  const zoneWidth = window.innerWidth/7;
  for (let index = 0; index < 7; index++) {
    zones.push(index*zoneWidth);
  }
}

function addText (text, color) {
  const offset = (Math.random()*100 - 100);
  const xStart = window.innerWidth/2 + offset;
  const yStart = window.innerHeight/2 + offset;
  const textNode = document.createElement("div");
  textNode.classList.add("text");
  textNode.textContent = text;
  textNode.style.opacity = 1;
  if (color) {
    textNode.style.color = color;
  } else {
    textNode.style.color = "#f1f1f1";
  } 
  gamePlayTextArea.appendChild(textNode);
  textNode.style.transform = `translate(${xStart}px, ${yStart}px)`;
  textNode.dataset.y = yStart;
  textNode.dataset.x = xStart;
  const gamePlayTextNodes = gamePlayTextArea.querySelectorAll(".text");
  if (gamePlayTextNodes.length === 1) {
    window.requestAnimationFrame(animateText);
  }
}

function animateText () {
  const gamePlayTextNodes = gamePlayTextArea.querySelectorAll(".text");
  for (let textIndex = 0; textIndex < gamePlayTextNodes.length; textIndex++) {
    if (gamePlayTextNodes[textIndex].style.opacity <= 0) {
      gamePlayTextNodes[textIndex].remove();
    } else {
      const yStart = parseInt(gamePlayTextNodes[textIndex].dataset.y, 10);
      const xStart = parseInt(gamePlayTextNodes[textIndex].dataset.x, 10);
      const opacity = gamePlayTextNodes[textIndex].style.opacity;
      gamePlayTextNodes[textIndex].style.opacity = opacity - 0.004;
      gamePlayTextNodes[textIndex].style.transform = `translate(${xStart}px, ${yStart + (opacity*100)}px)`;
    }
  }

  if (gamePlayTextNodes.length > 0) {
    window.requestAnimationFrame(animateText);
  }




  // clearRect(0, 0, window.innerWidth, window.innerHeight);
  // if (screenText.length === 0) {
  //   window.requestAnimationFrame(animateText);
  //   return;
  // }

  // screenTextInterval++;

  // if (screenTextInterval % 200 === 0) {
  //   screenText.shift();
  // }

  // for (let textIndex = 0; textIndex < screenText.length; textIndex++) {
  //   screenText[textIndex].y = screenText[textIndex].y - 1;
  //   screenText[textIndex].opacity = screenText[textIndex].opacity - 0.1;
  //   txtCtx.fillStyle = "#f1f1f1";
  //   txtCtx.font = "48px serif";
  //   txtCtx.globalAlpha = screenText[textIndex].opacity;
  //   txtCtx.fillText(screenText[textIndex].text, screenText[textIndex].x , screenText[textIndex].y );    
  // }

  
}

function reset () {
  xTouch = 0;
  yTouch = 0;

  lossThreshHold = 0;
  happiness = 0;

  userMessages = [];

  swipeSize = 0;
  speeds = [0];

  intervalCount = 0;
  currentZone = 3;
  lastZone = 3;
  force = 0;
  isTouching = false;
  lastDirection = 'left';
  currentDirection = 'right';
  speedCount = 0;
  directionCount = 0;
  lastIndex = 3;
}

function randText (arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}