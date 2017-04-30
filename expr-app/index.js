require('dotenv').config();
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const parser = require('body-parser');
const requestMiddleware = require('./middleware').requestMiddleware;
const app = express();

const port = process.env.PORT || 4040;

app.engine('.hbs', exphbs({  
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', '.hbs'); 
app.set('views', path.join(__dirname, 'views'));

app.use(parser.json());
app.use(parser.urlencoded());
app.use(requestMiddleware);


app.get('/', (request, response) => {  
  response.render('home', {
    inserted: 'Inserted Text!'
  })
});

app.get('/about', (request, response) => {  
  response.render('about', {
    message: 'Inserted Text!'
  })
});

app.get('*', (request, response) => {  
  response.end('404!');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Errror', err);
    }
    console.log(`server is listening on port ${port}`);
});