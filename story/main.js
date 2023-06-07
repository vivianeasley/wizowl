// add sounds from Claw & Order

const bubbles = document.querySelectorAll(".bubbles");
const image = document.querySelector("#source");
const canvasNode = document.querySelector("#canvas");
const ctx = canvasNode.getContext("2d");

let storyIndex;
const introArr = [
  {
    text: "Good day students of the magical arts. For many of you this is your first class at Wizaduries Wizardy Wizard College of the Wizarding. Let’s dive right into the lessons shall we?",
    bubble: bubbles[2],
    speakArr: [2, 3, 6, 4, 5, 7, 9],
    endOn: 0,
    row: 0,
    sound: 'ZYXUTV'
  },
  {
    text: "But before any of you pick up your wands we need to go over something very important. Wand safety! Wands are incredibly dangerous tools of the arcane arts and not toys. Remember these very important rules whenever you use them:",
    bubble: bubbles[2],
    speakArr: [2, 3, 6, 4, 5, 7, 9],
    endOn: 0,
    row: 0,
    sound: 'acXUeTVbf'
  },

  {
    text: "Do not point the wand at its reflection in a mirror. The wand will explode.",
    bubble: bubbles[0],
    speakArr: [2, 3, 6, 4, 5, 7, 9],
    endOn: 0,
    row: 0,
    sound: 'ZYXUTV'
  },

  {
    text: "Do not grind the wand into a fine powder and then consume it to see through time and space. You will explode.",
    bubble: bubbles[1],
    speakArr: [2, 3, 6, 4, 5, 7, 9],
    endOn: 0,
    row: 0,
    sound: 'hgklrsm'
  },

  {
    text: "Do not use your wand to solve logical paradoxes. The wand will explode.",
    bubble: bubbles[0],
    speakArr: [2, 3, 6, 4, 5, 7, 9],
    endOn: 0,
    row: 0,
    sound: 'acXUeTVbf'
  },
  {
    text: "And definitely, under no circumstances, look down the tip of your wand to see what the color of magic is.",
    bubble: bubbles[1],
    speakArr: [2, 3, 6, 4, 5, 7, 9],
    endOn: 11,
    row: 0,
    sound: 'VVUXcZaXUTfYe'
  },
  {
    text: "",
    bubble: undefined,
    speakArr: undefined,
    endOn: 0,
    row: 1,
    sound: 'acXUeTVbf'
  },
  {
    text: "Oh dear. I've done it again. I've accidently turned myself into an owl.",
    bubble: bubbles[0],
    speakArr: [1, 1, 1, 1, 1, 1, 1],
    endOn: 1,
    row: 1,
    sound: 'hgklrsm'
  },
  {
    text: "Down here! On the floor.",
    bubble: bubbles[0],
    speakArr: [1, 1, 1, 1, 1, 1, 1],
    endOn: 1,
    row: 1,
    sound: 'acXUeTVbf'
  },
  {
    text: "Well, I'll need a little help to transform back into my human form.",
    bubble: bubbles[0],
    speakArr: [2, 2, 2, 2, 2, 2, 2],
    endOn: 2,
    row: 1,
    sound: 'VVUXcZaXUTfYe'
  },
  {
    text: "Please use circular motions to push me back and forth. I'll need you to do it at a specific speed to be successful. Watch my eyes to know if you are moving me at the correct speed. Please start now!",
    bubble: bubbles[2],
    speakArr: [3, 3, 3, 3, 3, 3, 3],
    endOn: 3,
    row: 1,
    sound: 'acXUeTVbf',
  },
  {
    onFinish: ()=>location.href = '/game/'
  }
]

const loseArr = [
  {
    text: "Well, that didn't work. Try watching my owl eyes and changing your speed if I look angry. Let's try again!",
    bubble: bubbles[1],
    speakArr: [3, 3, 3, 3, 3, 3, 3],
    endOn: 3,
    row: 1,
    sound: 'acXUeTVbf',
  },
  {
    onFinish: ()=>location.href = '/game/'
  }
];

const winArr = [
  {
    text: "Huzzah! You have succeeded! Now we can return to your wizarding studies!",
    bubble: bubbles[1],
    speakArr: [4, 5, 6, 7, 8, 9, 6],
    endOn: 4,
    row: 1,
    sound: 'VVUXcZaXUTfYe',
  },
  {
    onFinish: ()=>location.href = '/' // winning score open high score input
  }
];

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
let activeStoryArr;
if (type === 'lose') {
  activeStoryArr = loseArr;
} else if (type === 'win') {
  activeStoryArr = winArr;
} else {
  activeStoryArr = introArr;
}

function progressStory () {
  if (storyIndex === undefined) {
    storyIndex = 0;
  } else {
    storyIndex++;
  }
  const storyObj = activeStoryArr[storyIndex];
  if (storyObj.onFinish) {
    storyObj.onFinish();
    return;
  }

  bubbles[0].style.display = "none";
  bubbles[1].style.display = "none";
  bubbles[2].style.display = "none";
  
  if (storyObj.bubble) {
    storyObj.bubble.style.display = "block";
    storyObj.bubble.querySelector(".bubble-text").textContent = storyObj.text;
  }
  
  speak(storyObj.speakArr, storyObj.endOn, storyObj.sound, storyObj.row);
}

function speak (arr, endIndex, soundNotes, row) {
  if (!arr) {
    ctx.drawImage(image, endIndex * 140, 192*row, 140, 192, 0, 0, window.innerWidth, window.innerHeight);
    return;
  }
  let counter = 0;
  changeImage();
  sound(shuffleString(soundNotes), 0.3);

  function changeImage () {
    if (!arr[counter]) {
      ctx.drawImage(image, endIndex * 140, 192*row, 140, 192, 0, 0, window.innerWidth, window.innerHeight);
      return;
    }
    ctx.drawImage(image, arr[counter] * 140, 192*row, 140, 192, 0, 0, window.innerWidth, window.innerHeight);
    setTimeout(() => {
      counter++;
      changeImage()
    }, 200);
  }

}


function startup() {
  canvasNode.addEventListener("touchend", progressStory);
  canvasNode.addEventListener("rotate", handleResize);
  canvasNode.addEventListener("resize", handleResize);
  setTimeout(() => {
    handleResize();
    ctx.drawImage(image, 0, 0, 140, 192, 0, 0, window.innerWidth, window.innerHeight);
    progressStory();
  }, 1000);

}

document.addEventListener("DOMContentLoaded", startup);

function handleResize () {
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  canvasNode.style.width = window.innerWidth + "px";
  canvasNode.style.height = window.innerHeight + "px";
}

// Slightly augmented version of XEMs nifty little music player https://xem.github.io/alphabet-piano/
//type: sine triangle square or sawtooth -> "-" pause "a-zA-Z" sounds "1-5" previous note length
function sound (stringNotes, type, musicLength) { 
  // if(soundOn === false)return;
  let noteLength;
  let noteLengths = {
    '5': 0.4, // full
    '4': 0.3, // 3 quarters
    '3': 0.2,
    '2': 0.1,
    '1': 0.05,
  }
  let skipList = Object.keys(noteLengths);
  skipList.push('-')
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  let ctx = new AudioContext();
  let gainNode=ctx.createGain();
  for(let i=0;i<stringNotes.length;i++) {
    noteLength = !isNaN(stringNotes[i+1]) ? noteLengths[stringNotes[i+1]] : musicLength ? musicLength : 0.1;
    let oscNode = ctx.createOscillator();
    if(stringNotes[i=+i]&&!skipList.includes(stringNotes[i])) {
      oscNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscNode.start(i*noteLength+.3);
      oscNode.frequency.setValueAtTime(440*1.06**(-105+stringNotes.charCodeAt(i)),i*noteLength+.3);
      oscNode.type= type ? type : 'sine';           
      gainNode.gain.setValueAtTime(.5,i*noteLength+.3);
      gainNode.gain.setTargetAtTime(.001,i*noteLength+.3+.1,.05);
      oscNode.stop(i*noteLength+.3+noteLength-.01);
    }
  }
}

// Shuffle text string. Used for randomizing speech sounds
function shuffleString (str) {
  return str.split('').sort(function(){return 0.5-Math.random()}).join('');
}