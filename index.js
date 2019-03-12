'use strict';
const Hapi = require('hapi');
const { HOST, PORT } = require('./config');
const initAuthBasic = require('./plugins/auth/basic');
const initPreResponseHook = require('./plugins/response/preResponse');
const { initSocketsService } = require('./services/sockets');
const initCategoriesController = require('./controllers/categories');
const initUsersController = require('./controllers/users');
const initEventsController = require('./controllers/events');

const server = Hapi.server({
    host: HOST,
    port: PORT,
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['access-control-allow-headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type', 'event-changes-notification'],
            additionalExposedHeaders: ['access-control-allow-headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type', 'event-changes-notification'],          
            credentials: true
        }
    }
});

const start = async () => {
    initAuthBasic(server);
    initPreResponseHook(server);
    initCategoriesController(server);
    initUsersController(server);
    initEventsController(server);
    await server.start();
    initSocketsService(server);
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

start();

module.exports = { server };