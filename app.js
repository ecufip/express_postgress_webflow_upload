var express = require('express');
var bodyParser = require('body-parser')

// define new app
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require routes for the application.
require('./routes/index')(app);

app.listen(3000);
console.log('Server listening on port 3000!');
