const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const app = express();

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

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

app.get('/todos/:id', (req,res) => {
   var id = req.params.id;
   if(!ObjectID.isValid(id)){
     return res.status(404).send();
   }

   Todo.findById(id).then((todo) => {
     if(!todo){
       return res.status(404).send();
     }
     res.send({todo})
   }).catch((e) => {
    res.status(404).send();
   })
})

app.delete('/todos/:id',(req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  Todo.findByIdAndRemove(id).then((result) => {
    res.send(result)
  })
  .catch((err) => {
    res.status(404).send();
  })
})

app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  if(_.isBoolean(body.completed) && body.completed ){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set: body},{new: true})
  .then((todo) => {
    if(!todo){
      return res.status(404).send()
    }
    res.send({todo});
  })
  .catch((err) => {
     res.status(400).send();
  })
})

app.post('/users', (req,res) => {
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth',token).send(user)
  }).catch((err) => {
    res.status(400).send(err);
  })
})


app.get('/users/me', authenticate, (req,res)=> {
  res.send(req.user);
})

app.post('/users/login',(req,res) => {
  var body = _.pick(req.body,['email','password'])
  User.findByCredentials(body.email, body.password)
  .then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  })
  .catch((err) => {
    res.status(400).send();
  })

})

app.listen(3000, () => {
  console.log('Listening to port:3000');
})
