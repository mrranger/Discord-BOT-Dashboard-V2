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

const port = config.port;

app.use(express.static('./public'));
app.use(express.static('./themes'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(fileUpload());

require('./auth/passport')(passport);

// Express session
app.use(
  session({
    secret: '4135231b7f33c66406cdb2a78420fa76',
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
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

// Starting the server
http.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Connect to Discord
discord.client.on('ready', () => {
  console.log(`Logged in as ${discord.client.user.tag}!`);

  // Connecting sockets
  io.on('connection', (sockets) => {
    setInterval(() => {
      if (discord.client.uptime) {
        // Uptime Count
        let days = Math.floor(discord.client.uptime / 86400000);
        let hours = Math.floor(discord.client.uptime / 3600000) % 24;
        let minutes = Math.floor(discord.client.uptime / 60000) % 60;
        let seconds = Math.floor(discord.client.uptime / 1000) % 60;

        const BOTuptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // Emit count to browser
        sockets.emit('uptime', { uptime: BOTuptime });
      } else {
        console.error('Client uptime is undefined');
      }
    }, 1000);
  });
});

// Error Pages
app.use((req, res) => {
  res.status(404).render('error_pages/404');
});
