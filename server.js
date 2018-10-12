var express = require('express');
var app = express();
app.use(express.static('static'));
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

require('dotenv').config();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var dbURI = 'mongodb://localhost:27017/todo';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI + '/todo';
}
mongoose.connect(dbURI, { useMongoClient: true });

var ToDoSchema = new mongoose.Schema({
  title: String,
  content: String,
  adddate: String
}, {
    timestamps: true
  },
);
var ToDo = mongoose.model('ToDo', ToDoSchema);

app.get('/', function (req, res) {
  res.render('index');
});

var moment = require('moment-timezone');

app.put('/todo', function (req, res) {
  var n = new ToDo();
  n.title = req.body.title;
  n.content = req.body.content;

  // TODO: Refactor this!
  // original data is also converted & It does not work with window width..
  // if (n.title.length > 50) {
  //   n.title = n.title.substr(0, 50) + '…';
  // }
  // if (n.content.length > 80) {
  //   n.content = n.content.substr(0, 80) + '…';
  // }

  // mongo n._id to convert JST timestamp
  // TODO: Refactor this! simple honesty 
  timestamp = n._id.toString().substring(0, 8);
  date = new Date(parseInt(timestamp, 16) * 1000);
  date_jst = moment(date).tz("Asia/Tokyo").format();
  n.adddate = date_jst;

  n.save();
  n.save(function (err, todo) {
    console.log('Adds the todo ' + todo._id);
    res.status((!err) ? 200 : 500).json((typeof (todo) !== 'undefined') ? todo : { error: true });
  });
});

app.get('/todos', function (req, res) {
  ToDo.find({}, function (err, todos) {
    console.log('Returns ' + todos.length + ' todos');
    res.status((!err) ? 200 : 500).json((typeof (todos) !== 'undefined') ? todos : { error: true });
  });
});

app.get('/todo/:id', function (req, res) {
  ToDo.update({'_id': req.params.id, 'title': todo.title, upsert: true}, function (err, todo) {
    console.log('Edit the todo' + todo._id);
    res.status((!err) ? 200 : 500).json((typeof (todos) !== 'undefined') ? todo : { error: true });
  });
});

app.delete('/todo/:id', function (req, res) {
  ToDo.findOneAndRemove({ '_id': req.params.id }, function (err, todo) {
    res.status((!err) ? 200 : 500).json((typeof (todo) !== 'undefined') ? todo : { error: true });
  });
});


var port = process.env.PORT || 3000;
app.listen(port);
