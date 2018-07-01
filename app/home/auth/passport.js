const User        = require('../model/instagram-user');
const passport    = require('passport');
const passportJWT = require("passport-jwt");

//jwt authentication
const ExtractJWT    = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

let cookieExtractor = (req, res) => {
  var token = null;
  if (req && req.cookies) token = req.cookies['instagram-user-cookies'];
  return token;
};

//passport jwt
const opts = {};

opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey    =  process.env.jwt_secret;

passport.use('instagram-user-jwt', new JWTStrategy(opts, (jwt_payload, callback) => {
    let query = User.findOne({id: jwt_payload.user.id});

    query.exec((err, user) => {
        if (err) {
            return callback(err, false);
        }
        if (user) {
            return callback(null, user);
        } else {
            return callback(null, false);
            // or you could create a new account
        }
    });
}));