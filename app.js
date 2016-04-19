var express = require('express');
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
  res.render("dashboard");
});

app.get("*", function(req, res) {
    res.render("dashboard");
})

app.listen(3000, function () {
  console.log('Magic Mirror up and running');
});