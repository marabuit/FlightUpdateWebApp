const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = require('./config');

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var cors = require('cors');

const FlightUpdateSubscriberDao = require('./models/flightUpdateDao');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cosmosClient = new CosmosClient(config.cosmosDBConnectionString);

const flightUpdateSubscriberDao = new FlightUpdateSubscriberDao(cosmosClient, config.databaseId, config.containerId, config.partitionKey)

flightUpdateSubscriberDao
  .init(err => {
    console.error(err);
  })
  .catch(err => {
    console.error(err);
    console.error('Shutting down because there was an error settinig up the database.');
    process.exit(1);
  });

app.post('/subscribe', (req, res, next) => flightUpdateSubscriberDao.subscribe(req.body).then(x => res.sendStatus(204)).catch(next));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
