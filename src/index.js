const express = require('express');
const discord = require('./bot');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const config = require('./config/config.json');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Extracting port from config
const { port } = config;

// Middleware configuration
app.use(express.static('./public'));
app.use(express.static('./themes'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(fileUpload());

// Passport configuration
require('./auth/passport')(passport);

// Express session middleware
app.use(session({
  secret: '4135231b7f33c66406cdb2a78420fa76',
  resave: true,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', require('./routes/home.js'));
app.use('/', require('./routes/settings.js'));
app.use('/', require('./routes/guilds.js'));
app.use('/', require('./routes/support.js'));
app.use('/', require('./routes/plugins.js'));

app.use('/login', require('./routes/login.js'));

// Start server
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Socket.io connection
io.on('connection', (sockets) => {
  setInterval(() => {
    const uptime = discord.client.uptime || 0; // Default to 0 if undefined
    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor(uptime / 3600000) % 24;
    const minutes = Math.floor(uptime / 60000) % 60;
    const seconds = Math.floor(uptime / 1000) % 60;

    const BOTuptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // Emit uptime to browser 
    sockets.emit('uptime', { uptime: BOTuptime });
  }, 1000);
});

// Error handling for 404
app.use((req, res) => {
  res.status(404).render('error_pages/404');
});
