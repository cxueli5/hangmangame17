// telebot codes
var url = new URL(location.href);
var playerID = url.searchParams.get("id");

// hangman game codes
var list1 = new Array(); // list of used letters (correct)
var list1_index = 0;

var list2 = new Array(); // list of used letters (all)
var list2_index = 0;

var running = 0;
var failnum = 0;
var advising = 0;

myStickman = document.getElementById("stickmanCanvas");
context = myStickman.getContext("2d");

function pick() {
  var choice = "";
  var blank = 0;

  for (i = 0; i < words[index].length; i++) {
    t = 0;
    if (list1_index >= 0)
      // first time click go dunnid check if have any matching letters.
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

  document.f.word.value = choice; // display this onto the top middle bar

  if (!blank) {
    // if all letters in list1 matches correct word, i.e. 'blank' remained = 0 for all i
    document.f.tried.value = "   === You Win! ===";
    scoreVal = document.getElementById("scoreDisplayVal").value;
    scoreVal++;
    // document.f.score.value++;
    running = 0;
  }
}

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

function seek(letter) {
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

      document.f.lives.value = failnum;
      if (failnum == 8) {
        document.f.tried.value = "the man has been hanged!!!";
        document.f.word.value = words[index]; // give user the correct word
        document.f.score.value--;
        running = 0;
      } else pick();
      animate();
    } else advise("Letter " + letter + " is already used!");
  }
}

function advise(msg) {
  if (!advising) {
    advising = -1;
    savetext = document.f.tried.value;
    document.f.tried.value = msg;
    window.setTimeout("document.f.tried.value=savetext; advising=0;", 500);
  }
}

var xmlhttp = new XMLHttpRequest();
var url =
  "https://hangmangame17.herokuapp.com/highscore/" +
  document.getElementById("scoreDisplayVal").value +
  "?id=" +
  playerid;
var sendingText = document.getElementById("sendingText");
sendingText.style.display = "block";

xmlhttp.onreadystatechange = function () {
  sendingText.style.display = "none";
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

// call to the functions in drawArray
var animate = function () {
  drawArray[failnum]();
};

// drawing functions
canvas = function () {
  context.beginPath(); // call to end previous path. IMPORTANT
  context.lineWidth = 2;
};

head = function () {
  context.beginPath();
  context.arc(60, 25, 10, 0, Math.PI * 2, true);
  context.stroke();
};

draw = function ($pathFromx, $pathFromy, $pathTox, $pathToy) {
  context.beginPath(); // impt ~
  context.moveTo($pathFromx, $pathFromy);
  context.lineTo($pathTox, $pathToy);
  context.stroke();
};

frame2 = function () {
  draw(10, 0, 10, 600);
};

frame3 = function () {
  draw(0, 5, 70, 5);
};

frame4 = function () {
  draw(60, 5, 60, 15);
};

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

nothing = function () {};

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

var words = new Array(
  "canidae",
  "felidae",
  "cat",
  "cattle",
  "dog",
  "donkey",
  "goat",
  "guineapig",
  "horse",
  "pig",
  "rabbit",
  "aardvark",
  "aardwolf",
  "africanbuffalo",
  "africanelephant",
  "africanleopard",
  "albatross",
  "alligator",
  "alpaca",
  "americanbuffalo",
  "americanrobin",
  "amphibian",
  "anaconda",
  "angelfish",
  "anglerfish",
  "ant",
  "anteater",
  "antelope",
  "antlion",
  "ape",
  "aphid",
  "arabianleopard",
  "arcticfox",
  "arcticwolf",
  "armadillo",
  "arrowcrab",
  "asp",
  "ass",
  "baboon",
  "badger",
  "baldeagle",
  "bandicoot",
  "barnacle",
  "barracuda",
  "basilisk",
  "bass",
  "bat",
  "beakedwhale",
  "bear",
  "beaver",
  "bedbug",
  "bee",
  "beetle",
  "bird",
  "bison",
  "blackbird",
  "blackpanther",
  "blackwidowspider",
  "bluebird",
  "bluejay",
  "bluewhale",
  "boa",
  "boar",
  "bobcat",
  "boxjellyfish",
  "bovid",
  "buffalo",
  "bug",
  "butterfly",
  "buzzard",
  "camel",
  "canid",
  "capebuffalo",
  "capybara",
  "cardinal",
  "caribou",
  "carp",
  "cat",
  "catshark",
  "caterpillar",
  "catfish",
  "cattle",
  "centipede",
  "cephalopod",
  "chameleon",
  "cheetah",
  "chickadee",
  "chicken",
  "chimpanzee",
  "chinchilla",
  "chipmunk",
  "clam",
  "clownfish",
  "cobra",
  "cockroach",
  "cod",
  "condor",
  "constrictor",
  "coral",
  "cougar",
  "cow",
  "coyote",
  "crab",
  "crane",
  "cranefly",
  "crawdad",
  "crayfish",
  "cricket",
  "crocodile",
  "crow",
  "cuckoo",
  "cicada",
  "damselfly",
  "deer",
  "dingo",
  "dinosaur",
  "dog",
  "dolphin",
  "donkey",
  "dormouse",
  "dove",
  "dragonfly",
  "dragon",
  "duck",
  "dungbeetle",
  "eagle",
  "earthworm",
  "earwig",
  "echidna",
  "eel",
  "egret",
  "elephant",
  "elephantseal",
  "elk",
  "emu",
  "englishpointer",
  "ermine",
  "falcon",
  "ferret",
  "finch",
  "firefly",
  "fish",
  "flamingo",
  "flea",
  "fly",
  "flyingfish",
  "fowl",
  "fox",
  "frog",
  "fruitbat",
  "gamefowl",
  "galliform",
  "gazelle",
  "gecko",
  "gerbil",
  "giantpanda",
  "giantsquid",
  "gibbon",
  "gilamonster",
  "giraffe",
  "goat",
  "goldfish",
  "goose",
  "gopher",
  "gorilla",
  "grasshopper",
  "greatblueheron",
  "greatwhiteshark",
  "grizzlybear",
  "groundshark",
  "groundsloth",
  "grouse",
  "guan",
  "guanaco",
  "guineafowl",
  "guineapig",
  "gull",
  "guppy",
  "haddock",
  "halibut",
  "hammerheadshark",
  "hamster",
  "hare",
  "harrier",
  "hawk",
  "hedgehog",
  "hermitcrab",
  "heron",
  "herring",
  "hippopotamus",
  "hookworm",
  "hornet",
  "horse",
  "hoverfly",
  "hummingbird",
  "humpbackwhale",
  "hyena",
  "iguana",
  "impala",
  "jackal",
  "jaguar",
  "jay",
  "jellyfish",
  "junglefowl",
  "kangaroo",
  "kangaroomouse",
  "kangaroorat",
  "kingfisher",
  "kite",
  "kiwi",
  "koala",
  "koi",
  "komododragon",
  "krill",
  "ladybug",
  "lamprey",
  "landfowl",
  "landsnail",
  "lark",
  "leech",
  "lemming",
  "lemur",
  "leopard",
  "leopon",
  "limpet",
  "lion",
  "lizard",
  "llama",
  "lobster",
  "locust",
  "loon",
  "louse",
  "lungfish",
  "lynx",
  "macaw",
  "mackerel",
  "magpie",
  "mammal",
  "manatee",
  "mandrill",
  "mantaray",
  "marlin",
  "marmoset",
  "marmot",
  "marsupial",
  "marten",
  "mastodon",
  "meadowlark",
  "meerkat",
  "mink",
  "minnow",
  "mite",
  "mockingbird",
  "mole",
  "mollusk",
  "mongoose",
  "monitorlizard",
  "monkey",
  "moose",
  "mosquito",
  "moth",
  "mountaingoat",
  "mouse",
  "mule",
  "muskox",
  "narwhal",
  "newt",
  "newworldquail",
  "nightingale",
  "ocelot",
  "octopus",
  "oldworldquail",
  "opossum",
  "orangutan",
  "orca",
  "ostrich",
  "otter",
  "owl",
  "ox",
  "panda",
  "panther",
  "pantherahybrid",
  "parakeet",
  "parrot",
  "parrotfish",
  "partridge",
  "peacock",
  "peafowl",
  "pelican",
  "penguin",
  "perch",
  "peregrinefalcon",
  "pheasant",
  "pig",
  "pigeon",
  "pike",
  "pilotwhale",
  "pinniped",
  "piranha",
  "planarian",
  "platypus",
  "polarbear",
  "pony",
  "porcupine",
  "porpoise",
  "portuguesemanowar",
  "possum",
  "prairiedog",
  "prawn",
  "prayingmantis",
  "primate",
  "ptarmigan",
  "puffin",
  "puma",
  "python",
  "quail",
  "quelea",
  "quokka",
  "rabbit",
  "raccoon",
  "rainbowtrout",
  "rat",
  "rattlesnake",
  "raven",
  "redpanda",
  "reindeer",
  "reptile",
  "rhinoceros",
  "rightwhale",
  "roadrunner",
  "rodent",
  "rook",
  "rooster",
  "roundworm",
  "sabertoothedcat",
  "sailfish",
  "salamander",
  "salmon",
  "sawfish",
  "scaleinsect",
  "scallop",
  "scorpion",
  "seahorse",
  "sealion",
  "seaslug",
  "seasnail",
  "shark",
  "sheep",
  "shrew",
  "shrimp",
  "silkworm",
  "silverfish",
  "skink",
  "skunk",
  "sloth",
  "slug",
  "smelt",
  "snail",
  "snake",
  "snipe",
  "snowleopard",
  "sockeyesalmon",
  "sole",
  "sparrow",
  "spermwhale",
  "spider",
  "spidermonkey",
  "spoonbill",
  "squid",
  "squirrel",
  "starfish",
  "starnosedmole",
  "steelheadtrout",
  "stingray",
  "stoat",
  "stork",
  "sturgeon",
  "sugarglider",
  "swallow",
  "swan",
  "swift",
  "swordfish",
  "swordtail",
  "tahr",
  "takin",
  "tapir",
  "tarantula",
  "tarsier",
  "tasmaniandevil",
  "termite",
  "tern",
  "thrush",
  "tick",
  "tiger",
  "tigershark",
  "tiglon",
  "toad",
  "tortoise",
  "toucan",
  "trapdoorspider",
  "treefrog",
  "trout",
  "tuna",
  "turkey",
  "turtle",
  "tyrannosaurus",
  "urial",
  "vampirebat",
  "vampiresquid",
  "vicuna",
  "viper",
  "vole",
  "vulture",
  "wallaby",
  "walrus",
  "wasp",
  "warbler",
  "waterboa",
  "waterbuffalo",
  "weasel",
  "whale",
  "whippet",
  "whitefish",
  "whoopingcrane",
  "wildcat",
  "wildebeest",
  "wildfowl",
  "wolf",
  "wolverine",
  "wombat",
  "woodpecker",
  "worm",
  "wren",
  "xerinae",
  "xrayfish",
  "yak",
  "yellowperch",
  "zebra",
  "zebrafinch"
);
