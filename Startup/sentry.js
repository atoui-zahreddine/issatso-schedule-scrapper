module.exports = function (app) {
  if (process.env.NODE_ENV === "production") {
    const Sentry = require("@sentry/node");
    const Tracing = require("@sentry/tracing");

    Sentry.init({
      dsn:
        "https://9ac49aaadade4070860824fe7afff118@o1077885.ingest.sentry.io/6081160",
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });

    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
  }
};
