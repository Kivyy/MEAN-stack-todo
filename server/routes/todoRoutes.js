const router = require('express').Router();
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const {Todo} = require('../models/todo');
const {authenticate} = require('../middleware/authenticate');

router.post('/', authenticate, (req,res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  })
  .catch((err) => {
    res.status(400).send(err)
  })
})

router.get('/', authenticate, (req,res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos})
  })
  .catch((err) => {
    res.send(err)
  })
})

router.get('/:id', authenticate, (req,res) => {
   var id = req.params.id;
   if(!ObjectID.isValid(id)){
     return res.status(404).send();
   }

   Todo.findOne({
     _id: id,
     _creator: req.user._id
   }).then((todo) => {
     if(!todo){
       return res.status(404).send();
     }
     res.send({todo})
   }).catch((e) => {
    res.status(404).send();
   })
})

router.delete('/:id',authenticate,(req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((result) => {
    res.send(result)
  })
  .catch((err) => {
    res.status(404).send();
  })
})

router.patch('/:id',authenticate, (req,res) => {
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  },{$set: body},{new: true})
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

module.exports = router;
