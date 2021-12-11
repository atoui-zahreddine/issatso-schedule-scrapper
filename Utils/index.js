module.exports.sleep = function (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

module.exports.sentryLog = function (e, severity) {
  const Sentry = require('@sentry/node');
  Sentry.captureMessage(e, {
    level: severity
  });
  console.log(e.message || e);
};

module.exports.SeverityTypes = {
  /** JSDoc */
  Fatal: 'fatal',
  /** JSDoc */
  Error: 'error',
  /** JSDoc */
  Warning: 'warning',
  /** JSDoc */
  Log: 'log',
  /** JSDoc */
  Info: 'info',
  /** JSDoc */
  Debug: 'debug',
  /** JSDoc */
  Critical: 'critical'
};
