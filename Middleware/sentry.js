const Sentry = require("@sentry/node");

module.exports = (app) => {
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        // Capture all 404 and 500 errors
        return error.status === 404 || error.status === 500;
      },
    })
  );
};
