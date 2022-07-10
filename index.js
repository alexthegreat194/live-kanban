const express = require('express');
const { engine } = require('express-handlebars');
const { createServer } = require("http");
const { Server } = require("socket.io");

require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.get('/', (req, res) => {
    return res.render('home');
});

const port = process.env.port;
app.listen(port, () => {
    console.log(`express app listening on port ${port}...`);
})