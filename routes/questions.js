var Boom = require('boom');                                  // HTTP Errors
var Joi = require('joi');                                   // Validation
var Question = require('../models/question.js').Question; // Mongoose ODM

// Exports = exports? Huh? Read: http://stackoverflow.com/a/7142924/5210
module.exports = exports = function (server) {

    console.log('Loading question routes');
    exports.index(server);
    exports.create(server);
    exports.show(server);
    exports.remove(server);
    exports.update(server);
};

/**
 * GET /questions
 * Gets all the questions from MongoDb and returns them.
 *
 * @param server - The Hapi Server
 */
exports.index = function (server) {
    // GET /questions
    server.route({
        method: 'GET',
        path: '/questions',
        handler: function (request, reply) {
            Question.find(function (err, questions) {
                if (!err) {
                    reply(questions);
                } else {
                    reply(Boom.badImplementation(err)); // 500 error
                }
            });
        }
    });
};

/**
 * POST /new
 * Creates a new question in the datastore.
 *
 * @param server - The Hapi Serve
 */
exports.create = function (server) {
    // POST /questions
    var question;

    server.route({
        method: 'POST',
        path: '/questions',
        handler: function (request, reply) {

            question = new Question();
            question.text = request.payload.text;
            console.log(question.text);
            question.category = request.payload.category;
            question.save(function (err) {
                if (!err) {
                    reply(question).created('/questions/' + question._id);    // HTTP 201
                } else {
                    reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                }
            });
        }
    });
};

/**
 * PUT /updates
 * Updates a question in the datastore.
 *
 * @param server - The Hapi Server
 */
exports.update = function (server) {
    // PUT /questions
    var question;

    server.route({
        method: 'PUT',
        path: '/questions/{id}',
        handler: function (request, reply) {

            Question.findById(request.params.id, function(err, question){
              if (err){
                reply(err);
                return;
              }

              question.text = request.payload.text;
              question.category = request.payload.category;
              question.save(function (err) {
                  if (!err) {
                      reply(question).created('/questions/' + question._id);    // HTTP 201
                  } else {
                      reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                  }
              });
            });
        }
    });
};


/*/**
 * GET /questions/{id}
 * Gets the question based upon the {id} parameter.
 *
 * @param server
 */
 exports.show = function (server) {

    server.route({
        method: 'GET',
        path: '/questions/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Question.findById(request.params.id, function (err, question) {
                if (!err && question) {
                    reply(question);
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
 * DELETE /questions/{id}
 * Deletes an questions, based on the questions id in the path.
 *
 * @param server - The Hapi Server
 */
exports.remove = function (server) {
    server.route({
        method: 'DELETE',
        path: '/questions/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().alphanum().min(5).required()
                }
            }
        },
        handler: function (request, reply) {
            Question.findById(request.params.id, function(err, question) {
                if(!err && question) {
                    question.remove();
                    reply({ message: "Question deleted successfully"});
                } else if(!err) {
                    // Couldn't find the object.
                    reply(Boom.notFound());
                } else {
                    console.log(err);
                    reply(Boom.badRequest("Could not delete Question"));
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