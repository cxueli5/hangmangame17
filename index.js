const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "5312948605:AAErfcYzKZDrbYmxKaBuzbP3XVN6N-Dv3c8";
const server = express();
const bot = new TelegramBot(TOKEN, { polling: true });

const port = process.env.PORT || 5000;
const gameName = "hangmantt";

const queries = {};

bot.onText(/help/, (msg) =>
  bot.sendMessage(
    msg.from.id,
    "This is a hangman game. Type any alphabets to guess the word, if the hangeman is fully drawn before the blanks are filled, YOU LOSE. Otherwise, YOU WIN! Click on /game if you want to play."
  )
);

bot.onText(/test/, (msg) =>
  bot.sendMessage(
    msg.from.id,
    "test"
  )
);
// bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));
bot.onText(/game/, (msg) => bot.sendGame(msg.from.id, gameName));
bot.on("callback_query", function (query) {
    if (query.game_short_name !== gameName) {
        bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
        queries[query.id] = query;
        let gameurl = "https://hangmangame17.herokuapp.com/index.html?id="+query.id;
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: gameurl
        });
    }
});
// bot.gameQuery((ctx) => {
//   let queryId = ctx.callbackQuery.id;
//   let gameurl = "https://hangmangame17.herokuapp.com/index.html?id=" + queryId;
//   ctx.answerGameQuery(gameurl);
// });
bot.on("inline_query", function (iq) {
  bot.answerInlineQuery(iq.id, [
    { type: "game", id: "0", game_short_name: gameName },
  ]);
});

server.use(express.static(path.join(__dirname, "public")));

server.get("/highscore/:score", function (req, res, next) {
  if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
  let query = queries[req.query.id];
  let options;
  if (query.message) {
    options = {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
    };
  } else {
    options = {
      inline_message_id: query.inline_message_id,
    };
  }
  bot.setGameScore(
    query.from.id,
    parseInt(req.params.score),
    options,
    function (err, result) {}
  );
});
server.listen(port);
