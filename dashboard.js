/*
Iris Dashboard
Mostly by Hydrogen#0002
Xilog couldn't figure out express :(
*/

// import modules
const express = require('express');
const passport = require('passport');
const Strategy = require('passport-discord').Strategy;
const ejs = require('ejs');
const session = require('express-session');
var bodyParser = require('body-parser')

const config = require('./config.js');

const app = express();

app.use(bodyParser.json()); // idk
app.use(bodyParser.urlencoded({extended: false}))

module.exports = () => {
	app.set('view engine', 'ejs'); // Sets the view engine to ejs
	app.engine('ejs', ejs.renderFile); // i don't know
	app.set('views', `${__dirname}/Dashboard/pages`); // Sets the directory of your pages
	app.use(express.static(`${__dirname}/Dashboard/static`)); // Sets the directory of your static files / CSS
	app.use(express.urlencoded({ extended: true })); // Used for form data parsing
	app.use(express.json()); // Used for form data parsing

	passport.serializeUser((user, done) => { // Serializes the user object
		done(null, user);
	});
	passport.deserializeUser((obj, done) => { // Deserializes the user object
		done(null, obj);
	});

	let scopes = ['identify', 'guilds']; // Sets the OAuth2 scopes for Discord authentication.

	passport.use(new Strategy({
		clientID: config.dashboard.clientID, // Sets the Client ID for Discord authentication.
		clientSecret: config.dashboard.oauthSecret, // Sets the Client Secret for Discord authentication.
		callbackURL: config.dashboard.callbackURL, // Sets the Callback URL for Discord authentication. (The link discord redirects to after finishing authentication)
		scope: scopes // Sets the scopes for Discord Authentication
	}, (accessToken, refreshToken, profile, done) => {
		process.nextTick(() => {
			return done(null, profile);
		});
	}));

	app.use(session({ // Configures the session
		secret: 'ken hates my guts but for some reason is still helping to develop this. this needs to be long so lmao roflcopter add $ymb0l$ #ere haha help me',
		resave: false,
		saveUninitialized: false
	}));

	const checkAuth = (req, res, next) => {
		if (req.isAuthenticated()) return next();
		res.redirect('/login');
	};

	app.use(passport.initialize());
	app.use(passport.session());

	app.listen(config.dashboard.port, config.dashboard.ip, () => {
		console.log('>>> Dashboard launched!')
	})

	app.get('/', (req, res) => {
		res.render(`index.ejs`)
	})

	app.get('/login', passport.authenticate('discord', { scopes }));

	app.get('/login/callback', passport.authenticate('discord', { failureRedirect: '/error' }), (req, res) => {
		res.redirect('/dashboard');
	});

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	})

	// when user requests /dashboard show them the guild selector panel
	app.get('/dashboard', checkAuth, (req, res) => {
		res.render(`guildselect.ejs`, { user: req.user })
		// client is used by express, naming client as bot will fix many issues
	})

	// when user requests /dashboard/<guildID> show them the dashboard for that guild
	app.get('/dashboard/:id', checkAuth, (req, res) => {
		const guildId = req.params.id;
		res.render(`dashboard.ejs`, {
			guild: client.guilds.get(guildId),
			conf: guilds.get(guildId),
			user: client.users.get(req.user.id)
		})
	})

	// when user requests /dashboard/<guildID>/<page> show the page for that category, eg /strikes gives strikes.ejs
	app.get('/dashboard/:id/:page', checkAuth, (req, res) => {
		const guildId = req.params.id;
		res.render(`${req.params.page}.ejs`, {
			guild: client.guilds.get(guildId),
			conf: guilds.get(guildId),
			user: client.users.get(req.user.id)
		})
	})

	app.post('/api/set', (req, res) => {
		conf = guilds.get(req.body.id)
		if (conf && conf[req.body.setting])
		conf[req.body.setting] = req.body.value
		guilds.set(req.body.id, conf)
	})
	app.post('/api/rmstrike', (req, res) => {
		conf = guilds.get(req.body.id)
		body = req.body;
		if (conf && conf.strikes[body.user][body.strike])
			delete conf.strikes[body.user][body.strike];
		guilds.set(body.id, conf)
	})
	app.post('/api/:action', async (req, res) => {
		body = req.body;
		admin = client.users.get(req.user.id);
		guild = client.guilds.get(body.id);
		member = guild.members.get(body.user);

		switch (req.params.action) {
			case "ban":
				if (!member || !member.bannable || member.id == client.id) return;
				if (!body.reason) body.reason = "~REASON NOT PROVIDED~"
				await member.ban(body.reason).catch(err => console.log(err));
			break;
			case "kick":
				if (!member || !member.bannable || member.id == client.id) return;
				if (!body.reason) body.reason = "~REASON NOT PROVIDED~"
				await member.kick(body.reason).catch(err => console.log(err));
			break;
			case "strike":
				conf = guilds.get(body.id)
				if (!conf) return;
				strikes = conf.strikes;
				if (!strikes) conf.strikes = {}
				if (!strikes[body.user]) strikes[body.user] = {};

				sid = (+new Date).toString(36).slice(-5); // generate strike id
				// if that id already taken generate new
				while (strikes[body.user][sid]) { sid = (+new Date).toString(36).slice(-3) }
				strikes[body.user][sid] = { reason: body.reason, user: admin.tag }
				conf.strikes = strikes;
				guilds.set(body.id, conf)
			break;
		}
	})
} 