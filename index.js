// telegram bot script

// use to interact with telegram bot api
const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

// get unique TOKEN generated from telebot @BotFather
const TOKEN = "5312948605:AAErfcYzKZDrbYmxKaBuzbP3XVN6N-Dv3c8";

// initalise server for telegram bot
const server = express();
// create new telegram bot
const bot = new TelegramBot(TOKEN, { polling: true });
// server port number
const port = process.env.PORT || 5000;
// game name as set through BotFather on telebot (for /newgame)
const gameName = "hangman17";

const queries = {};

// contents of public directory available as static files
server.use(express.static(path.join(__dirname, 'public')));

// (/help) command to show information to users on how game is played
bot.onText(/help/, (msg) =>
  bot.sendMessage(
    msg.from.id,
    "This is a hangman game. Type any alphabets to guess the word, if the hangeman is fully drawn before the blanks are filled, YOU LOSE. Otherwise, YOU WIN! Click on /leggo if you want to play."
  )
);

// start game command (use /start or /leggo)
bot.onText(/start|leggo/, (msg) => bot.sendGame(msg.from.id, gameName));

// get game from heroku (game web app is deployed via heroku)
bot.on("callback_query", function (query) {
  if (query.game_short_name !== gameName) {
    bot.answerCallbackQuery(
      query.id,
      "Oh man, '" + query.game_short_name + "' is not available at the moment."
    );
  } else {
    queries[query.id] = query;
    let gameurl =
      "https://hangmangame17.herokuapp.com/index.html?id=" + query.id;
    bot.answerCallbackQuery({
      callback_query_id: query.id,
      url: gameurl,
    });
  }
});

// server listen to port 5000
server.listen(port);
