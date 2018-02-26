const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc) => {
    res.send(doc);
  })
  .catch((err) => {
    res.status(400).send(err)
  })
})

app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  })
  .catch((err) => {
    res.send(err)
  })
})

app.listen(3000, () => {
  console.log('Listening to port:3000');
})
