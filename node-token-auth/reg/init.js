var LocalStrategy = require('passport-localapikey').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

var jwt = require('jwt-simple');
var env = require('../../env.json')
var cfg= env[process.env.NODE_ENV||'development']
var secret = cfg.jwt.secret;
var exp =cfg.jwt.exp;
var configAuth = cfg.auth; // use this one for testing

var cons = require('tracer').console();

var User = require('./user');
// User.find().toArray(function(err, items) {
// 	console.log(err);
// 	console.log(items)
// }

module.exports = function(passport) {
	passport.use(new LocalStrategy(
		function(apikey, done) {
			// asynchronous verification, for effect...
			cons.log(apikey)
			process.nextTick(function() {
				User.findOne({apikey: apikey}, function(err, items) {
					if (items == null) {
						return done(null, null);
					} else if (items.apikey === apikey) {
						cons.log(items)
						User.update({email: items.email}, {verified: true}, {upsert: true}, function(err, result){
							cons.log(result)
							cons.log(err)
						})							
						return done(null, items);
					}else if(!items){
						return done(null, false, {
							message: 'Unknown api ' + apikey
						});	
					}					
					if (items.apikey != apikey) {
						return done(null, false, {
							message: 'wrong apikey'
						});
					}
					return done(null, null);
				});				
			});
		}
	));


	passport.use(new BearerStrategy({},
		function(token, done) {
			process.nextTick(function() {
				if (token) {
					try {
						cons.log(token)
						var user = jwt.decode(token, secret);
						var email = user.iss;
						var dexp =  user.exp;

						User.findOne({email: email, verified: true}, function(err, items) {
							if(!items){
								return done(null,false)							
							} else if (items.email === email) {
								return done(null, items);
							}
							return done(null, null);
						});
					} catch (err) {
						cons.log(err)
						return done(err, null);
					}
				}				
			});
		}
	));

  // https://developers.facebook.com/apps/267464200368452/fb-login/ ===========
  // FACEBOOK ================================================================
  // =========================================================================
  var fbAuthInfo = configAuth.facebookAuth;
  fbAuthInfo.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  passport.use(new FacebookStrategy(fbAuthInfo,
	  function(req, token, refreshToken, profile, done) {
			// asynchronous
			process.nextTick(function() {
			// check if the user is already logged in
				console.log('inside FacebookStrategy')
				cons.log(profile)
				var email=profile._json.email
				cons.log(token)
				cons.log(req.user)
				User.findOne({email: email, verified: true}, function(err, items) {
					console.log('in findone')
					console.log(err)
					console.log(items)
					return done(profile, items)
				})
			});
		}));				
			// if (!req.user) {

			//   User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
			// 		if (err)
			// 		  return done(err);
			// 		if (user) {
			// 			console.log(user)
			// 	    // if there is a user id already but no token (user was linked at one point and then removed)
			// 	    if (!user.facebook.token) {
			//         user.facebook.token = token;
			//         user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
			//         user.facebook.email = (profile.emails[0].value || '').toLowerCase();
			//         user.save(function(err) {
			//           if (err)
			//               return done(err);
			//           return done(null, user);
			//         });
			// 	    }
			// 	    return done(null, user); // user found, return that user
			// 		} else {
			// 	    // if there is no user, create them
			// 	    var newUser            = new User();
			// 	    newUser.facebook.id    = profile.id;
			// 	    newUser.facebook.token = token;
			// 	    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
			// 	    newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
			// 	    newUser.save(function(err) {
			//         if (err)
			//             return done(err);
			//         return done(null, newUser);
			// 	    });
			// 		}
			//   });
			// } else {
			//   // user already exists and is logged in, we have to link accounts
			//   var user            = req.user; // pull the user out of the session
			//   user.facebook.id    = profile.id;
			//   user.facebook.token = token;
			//   user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
			//   user.facebook.email = (profile.emails[0].value || '').toLowerCase();
			//   user.save(function(err) {
			//     if (err)
			//         return done(err);
			//     return done(null, user);
			//   });
			// }
	// 	});
	// }));

}
