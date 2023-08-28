const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');

function setUpHttpServer() {
    const app = express();
    app.use(cors());
    app.use(cookieParser());
    return app;
}

module.exports = setUpHttpServer;