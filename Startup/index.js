module.exports = (app) => {
  require("./config")();
  require("./db")();
  require("./seed")();
  require("./events")();
  require("./sentry")(app);
};
