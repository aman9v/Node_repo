const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // an object that stores the environment variables as key value pairs.
var app = express();

hbs.registerPartials(__dirname + '/views/partials')

app.set('view engine', 'hbs'); // using hbs as the default view engine. This will render .hbs on res.render call.
// takes as arguments the middleware function we want to use
app.use(express.static(__dirname + '/public'));

// register a middleware through app.use(middleware function)
// middlewares execute in the order they appear in a file.
// app.use((req, res, next) => {
//   res.render('maintenance');
// });

app.use((req, res, next) => { // req here and in the get callback below are exactly the same.
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) throw new Error('Unable to append to server.log');
    console.log('Logged to server.log');
  });
  next(); // if next() isn't called, the app is never going to proceed.
});



// takes the name of the helper function and the function itself. So that it can be referenced just by its name.
// if the thing inside {{ }} isn't a partial, then handlebars looks for a helper. If that is also not there,
// hbs looks for a piece of data with the name inside of {{}}
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  // res.send('<h1> Hello Express </h1>');
  res.render('home', {
    pageTitle: "Home",
    currentYear: new Date().getFullYear(),
    welcomeMessage: "Welcome to my Homepage",
  });
});
// express converts an object into JSON and sends it as response

app.get('/about', (req, res) => { // registers a URL
  res.render('about.hbs', { // injects data into the template
    pageTitle: 'About Title',
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorCode: 404,
    errorString: "Bad Request",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
