let mongoose = require('mongoose');

let Todo = mongoose.model('Todo',{
  text: {
    type: String,
    require: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null,
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  }
});

module.exports = {
  Todo
};
