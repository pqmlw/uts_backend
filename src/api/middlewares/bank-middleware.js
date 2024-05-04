const passport = require('passport');
const passportJWT = require('passport-jwt');

const config = require('../../core/config');
const { Transfer } = require('../../models');

// Authenticate transfer based on the JWT token
passport.use(
  'transfer',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: config.secret.jwt,
    },
    async (payload, done) => {
      try {
        const transfer = await Transfer.findOne({ accountNumber: payload.accountNumber });
        return transfer ? done(null, transfer) : done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

module.exports = passport.authenticate('transfer', { session: false });
