const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to database
mongoose.connect('<mongoDB URI>', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// routes
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const messagesRouter = require('./routes/messages');
app.use('/messages', messagesRouter);

// start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
