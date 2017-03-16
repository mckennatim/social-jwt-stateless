#!/usr/bin/env node
var app = require('./node-token-auth/app');
var env = require('./env.json')
var cfg= env[process.env.NODE_ENV||'development']


app.set('port', process.env.PORT || cfg.port.express);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
