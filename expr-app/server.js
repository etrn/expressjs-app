var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken');
var config = require('./config'); 
var User   = require('./app/models/user');
    
var port = process.env.PORT || 4040;
mongoose.connect(config.database); 
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

//create user
app.get('/setup', function(req, res) {

  var cyril = new User({ 
    name: 'Cyril Figgis', 
    password: 'pShiGiYs',
    email: 'c.fig@name.com',
    avatar: 'https://goo.gl/NkYXRa'
  });

  cyril.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});


//API routes
var apiRoutes = express.Router();

apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440
        });

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});
// TODO: route middleware to verify a token
// route to show a message (GET http://localhost:4040/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'This is auth app)' });
});
//route to return users
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);