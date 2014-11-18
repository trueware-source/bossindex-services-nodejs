var Mongoose   = require('mongoose');
var Schema     = Mongoose.Schema;

var pollingStationScehma = new Schema({
  name : { type: String, required: true, trim: true },
  questions : [{ type : Mongoose.Schema.ObjectId, ref : 'questions' }]
});

var pollingStation = Mongoose.model('pollingStation', pollingStationScehma, 'pollingStation');

module.exports = {
  PollingStation: pollingStation
};