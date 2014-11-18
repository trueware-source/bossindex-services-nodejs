var Mongoose   = require('mongoose');
var Schema     = Mongoose.Schema;

var pollingStationReportSchema = new Schema({
  happinessIndex : { type: Number, required: true },
  happin
  question : { type : Mongoose.Schema.ObjectId, ref : 'questions', required: true },
  questionsShown : [{ type : Mongoose.Schema.ObjectId, ref : 'questions'}],
  pollingStation : {type : Mongoose.Schema.ObjectId, ref : 'pollingStation' },
  createDate : { type: Date, default: new Date().getTime() }
});

var feedback = Mongoose.model('feedback', feedbackSchema, 'feedback');

module.exports = {
  Feedback: feedback
};

