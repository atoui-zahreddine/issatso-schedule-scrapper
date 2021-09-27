module.exports = (app) => {
    require("./config")()
    require('./db')()
    require('./seed')()
    require('./events')()
}