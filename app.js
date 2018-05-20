import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './controllers';
import compress from 'compression';
import responseTime from 'response-time';
import expressValidator from 'express-validator';

/* init variable */
const app = express();
// app.set('env', 'production')
const errorFormatter = function(param, msg, value) {
  let namespace = param.split('.'),
    root    = namespace.shift(),
    formParam = root;

  while(namespace.length) {
    formParam += '[' + namespace.shift() + ']';
  }

  return {
    msg   : msg,
    type  : '',
    path  : formParam,
    value : (value==undefined || value==null)?'':value
  };
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(compress());
app.use(responseTime());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator({errorFormatter: errorFormatter}));
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));

// set routes
app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var data = {
      error: {
        name: '',
        message: err.message,
        details: []
      }
    };
    res.send(data);
  });
}

export default app;
