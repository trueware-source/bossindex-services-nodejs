var Boom    = require('boom');                                  // HTTP Errors
var Joi     = require('joi');                                   // Validation
var PollingStation   = require('../models/polling-station.js').PollingStation; // Mongoose ODM

// Exports = exports? Huh? Read: http://stackoverflow.com/a/7142924/5210
module.exports = exports = function (server) {

    console.log('Loading polling station routes');
    exports.index(server);
    exports.create(server);
    exports.show(server);
    exports.remove(server);
};

/**
 * GET /pollingstations
 * Gets all the pollingstations from MongoDb and returns them.
 *
 * @param server - The Hapi Server
 */
exports.index = function (server) {
    // GET /pollingstations
    server.route({
        method: 'GET',
        path: '/polling-stations',
        handler: function (request, reply) {
            PollingStation.find(function (err, pollingStations) {
                if (!err) {
                    reply(pollingStations);
                } else {
                    reply(Boom.badImplementation(err)); // 500 error
                }
            });
        }
    });
};

/**
 * POST /new
 * Creates a new pollingStation in the datastore.
 *
 * @param server - The Hapi Serve
 */
exports.create = function (server) {
    // POST /pollingstations
    var pollingStation;

    server.route({
        method: 'POST',
        path: '/polling-stations',
        handler: function (request, reply) {

            pollingStation = new PollingStation();
            pollingStation.name = request.payload.name;
            pollingStation.save(function (err) {
                if (!err) {
                    reply(pollingStation).created('/pollingstations/' + pollingStation._id);    // HTTP 201
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};

/*/**
 * GET /pollingstations/{id}
 * Gets the pollingstation based upon the {id} parameter.
 *
 * @param server
 */
 exports.show = function (server) {

    server.route({
        method: 'GET',
        path: '/polling-stations/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            PollingStation.findById(request.params.id, function (err, pollingstation) {
                if (!err && pollingstation) {
                    reply(pollingstation);
                } else if (err) {
                    // Log it, but don't show the user, don't want to expose ourselves (think security)
                    console.log(err);
                    reply(Boom.notFound());
                } else {

                    reply(Boom.notFound());
                }
            });
        }
    })
};

/**
 * DELETE /pollingstations/{id}
 * Deletes an pollingstations, based on the pollingstations id in the path.
 *
 * @param server - The Hapi Server
 */
exports.remove = function (server) {
    server.route({
        method: 'DELETE',
        path: '/polling-stations/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            PollingStation.findById(request.params.id, function(err, pollingstation) {
                if(!err && pollingstation) {
                    pollingstation.remove();
                    reply({ message: "Pollingstation deleted successfully"});
                } else if(!err) {
                    // Couldn't find the object.
                    reply(Boom.notFound());
                } else {
                    console.log(err);
                    reply(Boom.badRequest("Could not delete Pollingstation"));
                }
            });
        }
    })
};

/**
 * Formats an error message that is returned from Mongoose.
 *
 * @param err The error object
 * @returns {string} The error message string.
 */
function getErrorMessageFrom(err) {
    var errorMessage = '';

    if (err.errors) {
        for (var prop in err.errors) {
            if(err.errors.hasOwnProperty(prop)) {
                errorMessage += err.errors[prop].message + ' '
            }
        }

    } else {
        errorMessage = err.message;
    }

    return errorMessage;
}