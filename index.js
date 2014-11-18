var Hapi = require('hapi');
var Good = require('good');
var Mongoose  = require('mongoose');
var server = new Hapi.Server(3000);
var routes = require('./routes');

Mongoose.connect('mongodb://localhost/happyindex');

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

routes.init(server);

server.pack.register(Good, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
