module.exports = (app) => {
    require("./config")()
    require('./db')()
    require('./events')()
}