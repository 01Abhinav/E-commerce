const path = require("path");

module.exports = path.dirname(require.main.filename); //gives path of the dir in which file responsible for process"app.js" is.
