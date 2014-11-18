exports.init = function(server) {
  console.log('Loading routes');

  require('./polling-stations')(server);
  require('./questions')(server);
  require('./feedback')(server);
  require('./reports')(server);
};