var Mongoose   = require('mongoose');
var Schema     = Mongoose.Schema;

var feedbackSchema = new Schema({
  indicator : { type: Number, required: true },
  question : { type : Mongoose.Schema.ObjectId, ref : 'questions', required: true },
  questionsShown : [{ type : Mongoose.Schema.ObjectId, ref : 'questions'}],
  pollingStation : {type : Mongoose.Schema.ObjectId, ref : 'pollingStation', required: true },
  createDate : { type: Date, default: new Date().getTime() }
});

var feedback = Mongoose.model('feedback', feedbackSchema, 'feedback');

module.exports = {
  Feedback: feedback
};

