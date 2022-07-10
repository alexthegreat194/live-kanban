const express = require('express');
const { engine } = require('express-handlebars');

require('dotenv').config();

const app = express();

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