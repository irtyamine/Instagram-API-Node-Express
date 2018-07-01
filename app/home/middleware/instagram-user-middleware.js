const passport = require('passport');

module.exports.authorizeAccess = (req, res, next) => {
  passport.authenticate('instagram-user-jwt', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'You are not authorized to access this route.'
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }

            next();
        });
    })
    (req, res);
}