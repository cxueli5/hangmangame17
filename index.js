// use telegram bot api
const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

// get unique TOKEN generated from telebot botfather
const TOKEN = "5312948605:AAErfcYzKZDrbYmxKaBuzbP3XVN6N-Dv3c8";

// create new telegram bot
const server = express();
const bot = new TelegramBot(TOKEN, { polling: true });
// server port number
const port = process.env.PORT || 5000;
// game name as set through botfather on telebot (for /newgame)
const gameName = "hangman17";

const queries = {};

// help command to show information to users on how game is played
bot.onText(/help/, (msg) =>
  bot.sendMessage(
    msg.from.id,
    "This is a hangman game. Type any alphabets to guess the word, if the hangeman is fully drawn before the blanks are filled, YOU LOSE. Otherwise, YOU WIN! Click on /leggo if you want to play."
  )
);

// start game command
bot.onText(/start|leggo/, (msg) => bot.sendGame(msg.from.id, gameName));
bot.on("callback_query", function (query) {
    if (query.game_short_name !== gameName) {
        bot.answerCallbackQuery(query.id, "Oh man, '" + query.game_short_name + "' is not available at the moment.");
    } else {
        queries[query.id] = query;
        let gameurl = "https://hangmangame17.herokuapp.com/index.html?id="+query.id;
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: gameurl
        });
    }
});

bot.on("inline_query", function (iq) {
  bot.answerInlineQuery(iq.id, [
    { type: "game", id: "0", game_short_name: gameName },
  ]);
});

server.use(express.static(path.join(__dirname, "public")));

// listen to server port 5000
server.listen(port);
