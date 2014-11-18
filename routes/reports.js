var Boom = require('boom');
var Joi = require('joi');
var Feedback = require('../models/feedback.js').Feedback;
var calculator = require('../lib/index-calculator');
var moment = require('moment');
var _ = require('lodash');

// Exports = exports? Huh? Read: http://stackoverflow.com/a/7142924/5210
module.exports = exports = function (server) {
  console.log('Loading report routes');
  exports.index(server);
};

/**
* GET /reports
* Gets all the reports
*
* @param server - The Hapi Server
*/
exports.index = function (server) {
  // GET /reports
  server.route({
    method: 'GET',
    path: '/reports/{reportName}',
    handler: function (request, reply) {
      if(request.params.reportName == "pollingstation"){
        generatePollingStationReport(request.query.pollingstation,function(error, report){
          if(error){
            reply(Boom.badImplementation(error)); 
          }
          else{
           reply(report);
          }
        })
      }
      if(request.params.reportName == "company"){
        generateCompanyReport(function(error, report){
          if(error){
            reply(Boom.badImplementation(error));
          }
          else{
            reply(report);
          }
        });
      }
    },
    config: {
        validate: {
            params: {
                reportName: Joi.valid('pollingStation','company')
            }
        }
    }
  });
};

function generatePollingStationReport(pollingStationId, callback){
  var report = {};
  Feedback.find({'pollingStation': pollingStationId},function(error, feedback){
    if(error){
      return error;
    }

    //set the happinessIndex
    var indicators = [];
    feedback.forEach(function(f){
      indicators.push(f.indicator);
    });
    report.happinessIndex = calculator.calculateIndex(indicators);

    //set happinessIndex for today
    indicators = [];
    feedback.forEach(function(f){
      if(isFeedbackInRange(f, moment().startOf('day').toDate(), moment().endOf('day').toDate())){
        indicators.push(f.indicator);
      }
    });
    report.happinessIndexToday = calculator.calculateIndex(indicators);

    //feedback count
    report.feedbackCount = feedback.length;

    //pollingstation
    report.pollingStationId = pollingStationId

    //happy reasons
    report.happyReasons = getReasonsByIndicator(1, feedback);

    //unhappy reasons
    report.unHappyReasons = getReasonsByIndicator(-1, feedback); 

    //daily indexes
    report.dailyIndexes = getDailyIndexes(feedback);

    return callback(null, report);
  });
}

function isFeedbackInRange(feedback, startDate, endDate){
  if(feedback.createDate > startDate && feedback.createDate < endDate) {
    return feedback;
  } 
  else {
    return null;
  }
}

function getReasonsByIndicator(indicator, feedback){
  var responses = _.filter(feedback, function(response) { return response.indicator == indicator; });
  return responses;
}

function getDailyIndexes(feedback){
  var groupedResponses = _.groupBy(feedback,function(response){return moment(response.createDate).startOf('day').format()});
  var indexes = [];
  _.mapValues(groupedResponses , function(group) {
    var indicators = _.map(group, function(response){
      return response.indicator;
    });
    var index = calculator.calculateIndex(indicators);
    return indexes.push({reportDate:moment(group[0].createDate).startOf('day').format(), index:index, count: group.length})
  });
  return indexes;
}

function generateCompanyReport(callback){
  Feedback.find({},function(error, feedback){

    var report  =  {};

    //set the all-time happinessIndex
    var indicators = [];
    feedback.forEach(function(f){
      indicators.push(f.indicator);
    });
    report.happinessIndex = calculator.calculateIndex(indicators);

    //set happinessIndex for today
    indicators = [];
    feedback.forEach(function(f){
      if(isFeedbackInRange(f, moment().startOf('day').toDate(), moment().endOf('day').toDate())){
        indicators.push(f.indicator);
      }
    });
    report.happinessIndexToday = calculator.calculateIndex(indicators);

    report.feedbackCount = feedback.length;

    report.dailyIndexes = getDailyIndexes(feedback);

    report.unhappyReasons = getReasonsByIndicator(-1, feedback);

    report.happyReasons = getReasonsByIndicator(1, feedback);
    
    return callback (null, report);
  });
}

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