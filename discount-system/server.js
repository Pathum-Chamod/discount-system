const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/discount-system', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
