const Hapi = require('hapi');
const Boom = require('boom');

const { User } = require('./../../models');
const { errorsHelper } = require('./../../helpers/formatting');

const initAuthBasic = server => {
    const scheme = function (server, options) {
        return {
            authenticate: async function (request, h) {
                let err, user;
                const authorization = request.headers.authorization;

                if (!authorization)
                    throw Boom.unauthorized(errorsHelper.unauthenticated());
    
                [err, user] = await User.findByToken(authorization);
                if (err)
                    throw Boom.unauthorized(err);
    
                return h.authenticated({ credentials: user });
            }
        };
    }

    server.auth.scheme('basic', scheme);
    server.auth.strategy('basic', 'basic');
}

module.exports = initAuthBasic;
