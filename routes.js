var express = require('express');
var router = express.Router();
var User = require('./node-token-auth/reg/user');
var cons = require('tracer').console();

var isRightList = function(lists, list){
        return _.find(lists, function(obj) { return obj.lid == list })
}

module.exports = function(passport){
	router.get('/api/dog/', function(req, res) {
		res.jsonp('You are a dog, Uli')
	});	
	
	router.get('/api/users/:email', 
		passport.authenticate('bearer', { session: false }), 
		function(req, res) {
			console.log('in find user by email');
			var email = req.params.email.toLowerCase();
			console.log(email)
			User.findOne({email: email}, function(err, items) {
				cons.log(err)
				cons.log(items)
				if (items != null && items.email == email) {
					console.log(items)
					res.jsonp({message:'success', items:items});
				} else {
					res.jsonp({
						message: 'error'
					});
				}
			});		
		});
	router.delete('/api/users/:email',
		passport.authenticate('bearer', { session: false }),  
		function(req, res) {
			console.log('in delete user by email');
			console.log(req.params);
			var email = req.params.email;
			User.findOneAndRemove({email: email}, function(err, result) {
				console.log(result)
					if (err) {
						res.jsonp(err)
					} else {
						res.jsonp(result)
					};	
				});				
		});

	return router;
}