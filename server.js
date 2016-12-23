var express = require('express');
var app = express();
var port =8888;
var mongoose = require('mongoose');//Load the mongoose library

var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

app.use(express.static('public'));//to access static css files

/*Body parser*/
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/js', express.static(__dirname + '/js'));

/*Initialize sessions*/
app.use(cookieParser());
app.use(bodyParser());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

/*Initialize Passport*/
app.use(passport.initialize());
app.use(passport.session());

/*Database connection - MongoDB*/

var username = 'admin';
var password = '123456';

var dbHost = 'localhost';
var dbPort = '27017';
var database = 'Task_userDB';

//connection string
var url = 'mongodb://' + username + ':' + password + '@' + dbHost + ':' + dbPort + '/' + database;
console.log('mongodb connection = ' + url);

//establish database connection
mongoose.connect(url, function(err) {
    if(err) {
        console.log('connection error: ', err);
    } else {
        console.log('connection successful');
    }
});


/***********
Declare all models here
***********/

//User model
var UserSchema = new mongoose.Schema({
	//https://github.com/Automattic/mongoose/issues/1285
     _id: { type: mongoose.Schema.ObjectId, auto: true },
     username: String,
     password: String
 });

var User = mongoose.model('user', UserSchema);


/***********
All routes go below
***********/

var bcrypt = require('bcrypt-nodejs'); 

app.get('/',function(req,res,next){
	res.sendFile(__dirname + '/index.html');
});

app.get('/register', function (req, res, next) {
    res.sendFile( __dirname + '/register.html');
});

app.get('/home', loggedIn, function (req, res, next) {
     res.sendFile( __dirname + '/home.html');
});

app.get('/user', loggedIn, function (req, res, next) {
    User.findById({ _id: req.user._id }, function(err, user) {
        return res.json(user);
    });
});

app.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

app.post('/login', passport.authenticate('local'),
    function(req, res) {
        res.redirect('/home');
});

/**********
The login logic where it passes here if it reaches passport.authenticate
**********/

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if(user !== null) {
                var isPasswordCorrect = bcrypt.compareSync(password, user.password);
                if(isPasswordCorrect) {
                    console.log("Username and password correct!");
                    return done(null, user);
                } else {
                    console.log("Password incorrect!");
                    return done(null, false);
                }
           } else {
               console.log("Username does not exist!");
               return done(null, false);
           }
       });
    }
));

/**********
Serialize and Deserialize here for passport.authenticate
**********/

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.post('/register', function (req, res, next) {

	var password = bcrypt.hashSync(req.body.password);
    req.body.password = password;

	User.create(req.body, function(err, saved) {
    if(err) {
        console.log(err);
        res.json({ message : err });
    } else {
        res.json({ message : 'User successfully registered!'});
    }
	});
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

app.listen(port,'0.0.0.0', function(){
	console.log('Server running at port ' + port);
});