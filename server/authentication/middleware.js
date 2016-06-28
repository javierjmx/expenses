const bluebird = require('bluebird');
const jwt = require('jsonwebtoken');
const jwtVerify = bluebird.promisify(jwt.verify);

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

module.exports = secret =>
  function * (next) {
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
  };
