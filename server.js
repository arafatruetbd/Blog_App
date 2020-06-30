require('dotenv').config({ path: 'env' });
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const setMiddleware = require('./middleware/middlewares');
const setRoute = require('./routes/routes');

const app = express();

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//using middleware form middleware directory
setMiddleware(app);
//using routes form route directory
setRoute(app);

//error handle
app.use((req, res, next) => {
  let error = new Error('404 Page Not Found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  if (error.status == 404) {
    return res.render('pages/error/404', { flashMessage: {} });
  }
  console.log(error);
  return res.render('pages/error/500', { flashMessage: {} });
});

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.ATLAS_URI || 'mongodb://localhost/Blog_App', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB Connection Establish Successfully');
});

app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT}`);
});
