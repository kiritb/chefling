'use strict'
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const app = express();
const router = express.Router();

let userRoute = require('./api/controllers/users').router;

app.set('view engine', 'pug');

if (process.env.NODE_ENV === 'test') {
  
// and only applies compression to the /sam endpoint during testing.
 router.use('/sam', compression());
} else {
  router.use(compression());
}

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// NOTE: tests can't find the views directory without this
app.set('views', path.join(__dirname, 'views'));

router.get('/', (req, res) => {
  res.render('index', {
    apiUrl: req.apiGateway ? `https://${req.apiGateway.event.headers.Host}/${req.apiGateway.event.requestContext.stage}` : 'http://localhost:3000'
  });
})

router.get('/sam', (req, res) => {
  res.sendFile(`${__dirname}/sam-logo.png`);
})

router.use('/users', userRoute);

// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router);
//app.use(RequestRateLimitMiddleware);

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    data: err.message,
    error: true
  });
});

module.exports = app;
