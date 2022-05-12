const express = require("express");
const path = require("path");
// telegram bot
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "5377529482:AAFBN_LkvKfbnFs1h8XH6mofmJXnfsoMQoM";
// server
const server = express();
const bot = new TelegramBot(TOKEN, { polling: true });
const port = process.env.PORT || 5000;
const gameName = "hangmangame17";
const queries = {};

// help command on telebot to help users play game
bot.onText(/help/, (msg) =>
  bot.sendMessage(
    msg.from.id,
    "This is a hangman game. Type any alphabets to guess the word, if the hangeman is fully drawn before the blanks are filled, YOU LOSE. Otherwise, YOU WIN! Click on /game if you want to play."
  )
);
// start game command on telebot
bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));
// play button logic
bot.on("callback_query", function (query) {
  if (query.game_short_name !== gameName) {
    bot.answerCallbackQuery(
      query.id,
      "Oh man, '" + query.game_short_name + "' is not available at the moment."
    );
  } else {
    queries[query.id] = query;
    let gameURL = "https://hangmangame17.herokuapp.com/index.html?id=" + query.id;
    bot.answerCallbackQuery({
      callback_query_id: query.id,
      url: gameURL,
    });
  }
});

// scores
bot.on("inline_query", function (iq) {
  bot.answerInlineQuery(id.id, [
    { type: "game", id: "0", game_short_name: gameName },
  ]);
});

// public directory content static files
server.use(express.static(path.join(__dirname, 'public')));

// // high score logic
// server.get("/highscore/:score", function(req, res, next) {
//     // check if userid exists
//     if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
//     let query = queries[req.query.id];
//     let options;
//     if (query.message) {
//         options = {
//             chat_id: query.message.chat.id,
//             message_id: query.message.message_id
//         };
//     } else {
//         options = {
//             inline_message_id: query.inline_message_id
//         };
//     }
//     // send high score to telegram
//     bot.setGameScore(query.from.id, parseInt(req.params.score), options, 
//         function (err, result) {});
// });

// listen to server port
server.listen(port);
