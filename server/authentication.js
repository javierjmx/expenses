const bcrypt = require('co-bcrypt');
const bluebird = require('bluebird');
const isemail = require('isemail').validate;
const jwt = require('jsonwebtoken');
const jsonBody = require('koa-json-body');
const router = require('koa-router')();

const jwtVerify = bluebird.promisify(jwt.verify);
const ONE_DAY = '24h';

const getAuthorizationHeader = ctx => {
  if (!ctx.header || !ctx.header.authorization) {
    return;
  }

  const parts = ctx.header.authorization.split(' ');

  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
};

module.exports = secret => {
  const middleware = {
    * register (next) {
      const email = this.request.body.email;
      const password = this.request.body.password;
      const confirmation = this.request.body.confirmation;

      if (!isemail(email)) {
        this.throw(400, 'Invalid email address.');
      }

      if (password !== confirmation) {
        this.throw(400, 'Passwords do not match.');
      }

      if (yield this.database.getUserByEmail(email)) {
        this.throw(400, 'That email address is already taken.');
      }

      const salt = yield bcrypt.genSalt(10);
      const hash = yield bcrypt.hash(password, salt);
      const user = yield this.database.createUser(email, hash);
      const token = jwt.sign(user, secret, { expiresIn: ONE_DAY });

      this.body = { user, token };
    },

    * authenticate (next) {
      const email = this.request.body.email;
      const password = this.request.body.password;
      const user = yield this.database.getUserByEmail(email);

      if (!user) {
        this.throw(404, 'User not found.');
      }

      if (!(yield bcrypt.compare(password, user.passhash))) {
        this.throw(401, 'Authentication failed.');
      }

      const token = jwt.sign(user, secret, { expiresIn: ONE_DAY });

      this.body = {
        message: 'Authentication successful.',
        token,
      };
    },

    * authorize (next) {
      const token = getAuthorizationHeader(this);

      if (!token) {
        this.throw(401, 'No token provided.');
      }

      try {
        this.state.user = yield jwtVerify(token, secret);
      } catch (error) {
        this.throw(401, 'Failed to authenticate.');
      }

      yield next;
    },
  };

  router.use(jsonBody());
  router.post('/authenticate', middleware.authenticate);
  router.post('/register', middleware.register);

  return { router, middleware: middleware.authorize };
};
