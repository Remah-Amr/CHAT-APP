const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const { ensureAuthenticated, ensureGuest } = require('./helper/auth');
const Handlebars = require('handlebars')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const flash = require('connect-flash')


Handlebars.registerHelper('eachProperty', function (context, options) {
  var ret = "";
  for (var prop in context) {
    ret = ret + options.fn({ property: prop, value: context[prop] });
  }
  return ret;
});

// load user model
const message = require('./models/message');
const User = require('./models/user');


// load passport
require('./config/passport')(passport);

// Middleware express-session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// passport middleware must be after express-session
app.use(passport.initialize());
app.use(passport.session());


// flash middleware
app.use(flash())

// template engines // extname special to mainlayout only and hbs first "extension name" for all layouts but not main
app.engine('hbs', expressHbs({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs' })); // since hbs not built in express we have to register hbs engine to express TO USING IT
app.set('view engine', 'hbs'); // we say to node use pug to dynamic templating , "consider the default templating engine"
app.set('views', 'views'); // and their templatings will be at views folder 'default ' thats second paramater , i can change name ,else i don't need it because its the default


// middleware bodyParser
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.use(express.static('public'));

// global variables
app.use(function (req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; // This will make a user variable available in all templates, provided that req.user is populated.
  next();
})

// get login
app.get('/login', ensureGuest, (req, res, next) => {
  res.render('login');
});

// get register
app.get('/signup', ensureGuest, (req, res, next) => {
  res.render('signup');
});


// post register
app.post('/signup', (req, res, next) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      req.flash('error', 'Email already in use!');
      res.redirect('/signup');
    }
    else {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }
      console.log('newUser');
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          if (err) throw err;
          newUser.password = hash;
          new User(newUser).save().then(result => {
            res.redirect('/login');
          }).catch(err => {
            console.log(err);
          })
        });

      })
    }
  });
});

// post login
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});


// logout
app.get('/logout', (req, res) => {
  req.logout();// Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).
  res.redirect('/login');
  // req.flash('success_msg','You logged out successfully');
})


const rooms = {}

app.get('/', ensureAuthenticated, (req, res) => {
  // in index file put 4 years static without passing
  res.render('index')
})


app.get('/:room', ensureAuthenticated, async (req, res) => { // we want it
  rooms[req.params.room] = { users: {} }
  const msgs = await message.find({ roomName: req.params.room }) // want
  const user = await User.findById(req.user._id); // want to handle sender name
  res.render('chat', {
    roomName: req.params.room,
    msgs: msgs,
    sender: user.name
  })
})




// connect db
mongoose.connect('mongodb+srv://remah:remah654312@cluster0-ytypa.mongodb.net/Chat?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(result => {
    console.log('connected!');
  });



const port = process.env.PORT || 9999;
server.listen(port, () => {
  console.log('server started successfully!')
})



io.on('connection', socket => { // fire when we make connection to browser , each client has own socket

  socket.on('new-user', (room, name) => {
    rooms[room].users[socket.id] = name // equal to users.(socket.id)
    socket.join(room) // room here is name not object like 'first' , which I make package called first then put in this all socket.ids belong to this name 'first'
    socket.to(room).broadcast.emit('user-connected', name) // here i send only  to socket.ids which include in  my socket name 'first'
    // Rooms are left automatically upon disconnection.
  })


  socket.on('disconnect', () => {
    // disconnect user 'i think built in like connection 'true'
    // when user leave the socket , which mean when i enter to page like chat use socket.io will initilze socket.id
    // then if i leave the page or reload it that time  socket.id change which mean logout from prev id 
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('logout', rooms[room].users[socket.id])
    })
  })


  // listen for message or event sent from client
  socket.on('chat', data => {
    const msg = new message(data);
    msg.save();
    socket.to(data.roomName).broadcast.emit('chat', data)
    // io.sockets.emit('chat',data); // all client connected to server at chat event
  });


  // listen for typing message
  socket.on('typing', (room, userName) => {
    socket.to(room).broadcast.emit('typing', userName);
  })
})



// second paramater in reduce is the current value ,since rooms become array of arrays each value has 2 fields like this
// [ [ 'first', { users: [Object] } ],[ 'second', { users: [Object] } ] ] 
function getUserRooms(socket) { // that's return all rooms our user is part of this 'in our case only one room'
  return Object.entries(rooms).reduce((names, [name, room]) => { // name is the key 'roomName' like 'first' , room which the value of the first which as object'{ users: { fI0Fxyiwcx8AoF3xAAAC: 'lolo ' } }'
    if (room.users[socket.id] != null) names.push(name) // see if our user in this room or not then push roomName
    return names
  }, []) // names which i collect in , so initial value is an empty array 
} 
