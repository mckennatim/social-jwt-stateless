var env = require('../../env.json')
var cfg= env[process.env.NODE_ENV||'development']
var db = cfg.db;
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var usersSchema = new Schema({
	name: {type:String},
	email: {type:String, index:{unique: true}},
	apikey: String,
	apps: Array,
	timestamp: String,
	verified: Boolean,
	role: String
}, { strict: false });
mongoose.connect(db.url);


module.exports = mongoose.model('User', usersSchema);
