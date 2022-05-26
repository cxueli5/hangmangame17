// main app script

// dark mode toggle
function darkMode() {
  var element = document.getElementById("displayText");
  element.classList.toggle("darkModeText");
  var element2 = document.getElementById("displayText2");
  element2.classList.toggle("darkModeText");
}
// list of correct used letters
var list1 = new Array();
var list1_index = 0;

// list of all used letters
var list2 = new Array();
var list2_index = 0;

// intialised variables
var running = 0;
var failnum = 0;
var advising = 0;

// stickman initalised variables
myStickman = document.getElementById("stickman");
context = myStickman.getContext("2d");

// play frog sound effect audio
function playSound(url) {
  new Audio(url).play();
}

// function to match user choice of letter and word generated
function pick() {
  var choice = "";
  var blank = 0;

  for (i = 0; i < words[index].length; i++) {
    t = 0;
    if (list1_index >= 0)
      // first time click 'Go' button, don't need to check if have matching letters
      for (j = 0; j <= list1_index; j++)
        if (
          words[index].charAt(i) == list1[j] ||
          words[index].charAt(i) == list1[j].toLowerCase()
        )
          t = 1;

    if (t) choice += words[index].charAt(i) + " ";
    // add the ordered set of correct used letters into 'choice'
    else {
      choice += "_ ";
      blank = 1;
    }
  }

  // display word in blanks
  document.f.word.value = choice;

  if (!blank) {
    // if all letters in list1 (correct used letter list) matches word, 'blank' remains 0 for all i
    document.f.tried.value = "        === You Win! ===";
    document.f.score.value++;
    running = 0;
  }
}

// function to generate new word from array
function new_word(form) {
  if (!running) {
    running = 1;
    failnum = 0;
    form.lives.value = failnum; // display this in mistake box
    form.tried.value = "";
    form.word.value = "";
    index = Math.floor(Math.random() * words.length); // pick a random word
    list1_index = -1;
    list2_index = -1;
    pick();
    context.clearRect(0, 0, 400, 400);
  } else advise("A word is already in play!");
}

// function to check user choice of letter on keyboard
function seek(letter) {
  stopRunning = true;
  if (!running) advise(".....Click GO to start !");
  else {
    t = 0;
    for (i = 0; i <= list2_index; i++) {
      if (list2[i] == letter || list2[i] == letter.toLowerCase()) t = 1;
    }

    if (!t) {
      // if letter selected is not previously chosen, add it to 'tried' (the bottom middle textbox)
      document.f.tried.value += letter + " ";
      list2_index++;
      list2[list2_index] = letter; // also add it to list of used letters (all)

      for (i = 0; i < words[index].length; i++)
        if (
          words[index].charAt(i) == letter ||
          words[index].charAt(i) == letter.toLowerCase()
        )
          t = 1;

      if (t) {
        // if letter is in word
        list1_index++;
        list1[list1_index] = letter; // add it to list of used letters (correct)
      } else failnum++;

      // check number of fails
      document.f.lives.value = failnum;
      // number of fails reached limit
      if (failnum == 8) {
        document.f.tried.value = "the man has been hanged!!!";
        document.f.word.value = words[index]; // give user the correct word
        document.f.score.value--;
        running = 0;
      } else pick();
      animate();
    } else advise("Letter " + letter + " is already used!"); // if letter has been clicked by user on keyboard before
  }
}

// display message
function advise(msg) {
  if (!advising) {
    advising = -1;
    savetext = document.f.tried.value;
    document.f.tried.value = msg;
    window.setTimeout("document.f.tried.value=savetext; advising=0;", 500);
  }
}

// stickman codes

// call to the functions in drawArray
var animate = function () {
  drawArray[failnum]();
};

// web animation
// bouncing hangman canvas (cause the canvas to oscillate only when the hangman appears)
hangmanBounce = function () {
  const AMPLITUDE = 3;

  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  function render(frame) {
    const rad = degToRad(frame * 10);
    const cosY = Math.cos(rad) * AMPLITUDE;

    document.getElementById(
      "stickman"
    ).style.transform = `translate(${cosY}px)`;
  }

  function frameLoop() {
    const FPS = 20;
    let prevTick = 0,
      firstTick;

    window.requestAnimationFrame(function loop() {
      window.requestAnimationFrame(loop);
      let nowTick = Math.round((FPS * performance.now()) / 1000);

      // get first tick
      if (!firstTick) {
        firstTick = nowTick;
      }

      // if tick has not changed, ignore
      if (nowTick === prevTick) {
        return;
      }

      prevTick = nowTick;
      const frame = nowTick - firstTick;

      render(frame);
    });
  }
  frameLoop();
};
hangmanBounce();
// drawing functions
canvas = function () {
  context.beginPath(); // call to end previous path. IMPORTANT
  context.lineWidth = 2;
};

// draw stickman head
head = function () {
  context.beginPath();
  context.arc(60, 25, 10, 0, Math.PI * 2, true);
  context.stroke();
};

// draw body, limbs, stand to hang the stickman
draw = function ($pathFromx, $pathFromy, $pathTox, $pathToy) {
  context.beginPath(); // impt ~
  context.moveTo($pathFromx, $pathFromy);
  context.lineTo($pathTox, $pathToy);
  context.stroke();
};

// stand to hang the stickman
frame2 = function () {
  draw(10, 0, 10, 600);
};

frame3 = function () {
  draw(0, 5, 70, 5);
};

frame4 = function () {
  draw(60, 5, 60, 15);
};

// stickman lower body parts
torso = function () {
  draw(60, 36, 60, 70);
};

arms = function () {
  draw(100, 50, 20, 50);
};

rightLeg = function () {
  draw(60, 70, 100, 100);
};

leftLeg = function () {
  draw(60, 70, 20, 100);
};

// no stickman drawn

nothing = function () {};

// array of elements to draw hangman
drawArray = [
  nothing,
  rightLeg,
  leftLeg,
  arms,
  torso,
  head,
  frame4,
  frame3,
  frame2,
];

// array of words that are used to guess
var words = new Array(
  "meerkat",
  "cow",
  "lizard",
  "tiger",
  "toad",
  "frog",
  "alpaca",
  "gazelle",
  "silverfox",
  "oryx",
  "pony",
  "bear",
  "ape",
  "coati",
  "platypus",
  "llama",
  "polarbear",
  "doe",
  "hyena",
  "eagle",
  "pig",
  "panda",
  "snake",
  "rhinoceros",
  "fawn",
  "elk",
  "deer",
  "ferret",
  "badger",
  "dingo",
  "guanaco",
  "rooster",
  "squirrel",
  "starfish",
  "leopard",
  "iguana",
  "thornydevil",
  "zebra",
  "guineapig",
  "lynx",
  "puma",
  "wildcat",
  "kangaroo",
  "orangutan",
  "sloth",
  "marmoset",
  "horse",
  "otter",
  "goat",
  "chipmunk",
  "possum",
  "alligator",
  "ram",
  "fox",
  "skunk",
  "chameleon",
  "weasel",
  "grizzlybear",
  "sheep",
  "gemsbok",
  "dormouse",
  "mandrill",
  "lion",
  "hamster",
  "beetle",
  "wildboar",
  "parrot",
  "parakeet",
  "tapir",
  "woodchuck",
  "mouse",
  "reindeer",
  "joey",
  "monkey",
  "ermine",
  "peacock",
  "impala",
  "giraffe",
  "moose",
  "hedgehog",
  "fish",
  "gorilla",
  "elephant",
  "shrew",
  "lemur",
  "bunny",
  "porcupine",
  "walrus",
  "rabbit",
  "canary",
  "jaguar",
  "groundhog",
  "armadillo",
  "buffalo",
  "wolverine",
  "chinchilla",
  "crocodile",
  "marten",
  "owl",
  "burro",
  "quagga",
  "beaver",
  "hippopotamus",
  "manatee",
  "whale",
  "antelope",
  "bison",
  "vicuna",
  "muskdeer",
  "bighorn",
  "wombat",
  "cat",
  "ibex",
  "lamb",
  "hare",
  "snowyow",
  "wolf",
  "hog",
  "monitorlizard",
  "puppy",
  "emu",
  "octopus",
  "mountainsheep",
  "addax",
  "cow",
  "anteater",
  "bat",
  "mare",
  "ostrich",
  "yak",
  "camel",
  "raccoon",
  "turtle",
  "seal",
  "mole",
  "springbok",
  "muskrat",
  "bull",
  "dolphin",
  "waterbuck",
  "warthog",
  "dog",
  "coyote",
  "ox",
  "panther",
  "capybara",
  "salamander",
  "finch",
  "kitten",
  "crow"
);
