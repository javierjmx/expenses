const bcrypt = require('co-bcrypt');
const isemail = require('isemail').validate;
const jwt = require('jsonwebtoken');

const ONE_DAY = '24h';

module.exports = secret => ({
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

    if (yield this.database.users.one(email)) {
      this.throw(400, 'That email address is already taken.');
    }

    const salt = yield bcrypt.genSalt(10);
    const hash = yield bcrypt.hash(password, salt);
    const user = yield this.database.users.create(email, hash);
    const token = jwt.sign(user, secret, { expiresIn: ONE_DAY });

    this.body = { user, token };
  },

  * authenticate (next) {
    const email = this.request.body.email;
    const password = this.request.body.password;
    const user = yield this.database.users.one(email);

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
});
