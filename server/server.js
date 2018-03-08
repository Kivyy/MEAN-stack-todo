require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT;

let {mongoose} = require('./db/mongoose');
let userRoutes = require('./routes/userRoutes');
let todoRoutes = require('./routes/todoRoutes');

app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

app.listen(port, () => {
  console.log('Listening to port:3000');
})
