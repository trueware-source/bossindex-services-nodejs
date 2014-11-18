var Boom = require('boom');                                  // HTTP Errors
var Joi = require('joi');                                   // Validation
var Feedback = require('../models/feedback.js').Feedback; // Mongoose ODM

// Exports = exports? Huh? Read: http://stackoverflow.com/a/7142924/5210
module.exports = exports = function (server) {

    console.log('Loading feedback routes');
    exports.index(server);
    exports.create(server);
    exports.show(server);
    exports.remove(server);
};

/**
 * GET /feedback
 * Gets all the feedback from MongoDb and returns them.
 *
 * @param server - The Hapi Server
 */
exports.index = function (server) {
    // GET /feedback
    server.route({
        method: 'GET',
        path: '/feedback',
        handler: function (request, reply) {
            Feedback.find(function (err, feedback) {
                if (!err) {
                    reply(feedback);
                } else {
                    reply(Boom.badImplementation(err)); // 500 error
                }
            });
        }
    });
};

/**
 * POST /new
 * Creates a new feedback in the datastore.
 *
 * @param server - The Hapi Serve
 */
exports.create = function (server) {
    // POST /feedback
    var feedback;

    server.route({
        method: 'POST',
        path: '/feedback',
        handler: function (request, reply) {

            feedback = new Feedback();
            feedback.indicator = request.payload.indicator;
            feedback.question = request.payload.question;
            feedback.questionsShown = request.payload.questionsShown;
            feedback.pollingStation = request.payload.pollingStation;
            feedback.save(function (err) {
                if (!err) {
                    reply(feedback).created('/feedback/' + feedback._id);    // HTTP 201
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};

/*/**
 * GET /feedback/{id}
 * Gets the feedback based upon the {id} parameter.
 *
 * @param server
 */
 exports.show = function (server) {

    server.route({
        method: 'GET',
        path: '/feedback/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Feedback.findById(request.params.id, function (err, feedback) {
                if (!err && feedback) {
                    reply(feedback);
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
 * DELETE /feedback/{id}
 * Deletes an feedback, based on the feedback id in the path.
 *
 * @param server - The Hapi Server
 */
exports.remove = function (server) {
    server.route({
        method: 'DELETE',
        path: '/feedback/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Feedback.findById(request.params.id, function(err, feedback) {
                if(!err && feedback) {
                    feedback.remove();
                    reply({ message: "Feedback deleted successfully"});
                } else if(!err) {
                    // Couldn't find the object.
                    reply(Boom.notFound());
                } else {
                    console.log(err);
                    reply(Boom.badRequest("Could not delete Feedback"));
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