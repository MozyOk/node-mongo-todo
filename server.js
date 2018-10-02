var express = require('express');
var app = express();
app.use(express.static('static'));
var bodyParser = require('body-parser')
app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({
  extended: true
})); 
app.use(bodyParser.json());

require('dotenv').config();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var dbURI = "mongodb://localhost:27017/todo'";
// if (process.env.NODE_ENV === 'production') {
//     dbURI = process.env.MONGOLAB_URI;
// }
mongoose.connect(dbURI, { useNewUrlParser: true });
console.log(process.env.MONGOLAB_URI)

var ToDoSchema = new mongoose.Schema({
  _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
  title: String,
  content: String,
});
var ToDo = mongoose.model('ToDo', ToDoSchema);

app.get('/',function (req, res) {
  res.render('index');
});

app.put('/todo', function (req, res) {
  var n = new ToDo();
  n.title = req.body.title;
  n.content = req.body.content;
  n.save();
  n.save(function(err,todo) {
    console.log('Adds the todo '+todo._id);
    res.status((!err) ? 200 : 500).json((typeof(todo) !== 'undefined') ? todo : {error: true});
  });
});

app.get('/todos', function (req, res) {
  ToDo.find({}, function(err, todos) {
    console.log('Returns '+todos.length+' todos');
    res.status((!err) ? 200 : 500).json((typeof(todos) !== 'undefined') ? todos : {error: true});
  });
});

app.delete('/todo/:id', function (req, res) {
  ToDo.findOneAndRemove({'_id':req.params.id}, function(err, todo){
    console.log('Removes the todo '+todo._id);
    res.status((!err) ? 200 : 500).json((typeof(todo) !== 'undefined') ? todo : {error: true});
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
