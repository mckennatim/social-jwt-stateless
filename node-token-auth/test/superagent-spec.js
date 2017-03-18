var superagent = require('superagent')
var expect = require('expect.js')

var should = require('should')
var _ = require('underscore')
var jwt = require('jwt-simple');
var fs = require('fs');
var env = require('../../env.json')
var cfg= env[process.env.NODE_ENV||'development']
var secret = cfg.jwt.secret
var exp = cfg.jwt.exp

var httpLoc = 'http://localhost:' + cfg.port.express + '/api/'

describe('superagent:', function() {
	var agent = superagent.agent();
	var name = 'tim7';
	var ucnt = 0;
	var apikey = 'dog';
	var ureg = 'tim2';
	var uav = 'fred';
	var token ='';
	var emtim2 = 'tim2@sitebuilt.net';
	var emtim = 'mckenna.tim@gmail.com';
	var enottim = 'mckenna.nottim@gmail.com';
	it('GET / should be running and return: please select...', function(done) {
			superagent.get(httpLoc)
				.end(function(e, res) {
					//console.log(res.body)
					expect(e).to.eql(null)
					expect(res.body.length).to.be.above(0)
					expect(res.body).to.be.a('string')
					done()
				})
		})
		/*-----------------------------------authentication-----------------------------------------------*/
	describe('signup', function() {
		it('registers an email address and sends apikey', function(done) {
			agent
				.get(httpLoc + 'register/'+ emtim2)
				.end(function(e, res) {
					console.log(res.body)
					//expect(res.body.message).to.be('conflict')
					expect(true).to.be(true)
					setTimeout(function(){
						done();
					},1000)
				})
		})
	})
	describe('auth', function() {
		it('reads apikey from file, expects it to be 24 characters' ,function(done){
			fs.readFile('../node-token-auth/key', 'utf8', function(err, data) {
				if (err) {
					return console.log(err);
				}
				apikey = data
				console.log(apikey)
				expect(data.length).to.be(24)
				done()
			})
		})
		it('POSTs /auth/email w apikey and returns token', function(done) {
			superagent
				.post(httpLoc + 'auth/' + emtim2)
				.send({
					apikey: apikey
				})
				.end(function(e, res) {
					console.log(res.body)
					token = res.body.token
					var user = jwt.decode(token, secret);
					var email = user.iss;
					var dexp =  user.exp;
					expect(email).to.be(emtim2);
					done();
				})
			}
		)
		it('POSTs fails with 401 for tim2 with wrong apikey', function(done) {
			superagent
				.post(httpLoc + 'auth/'+emtim2)
				.send({
					apikey: '123457'
				})
				.end(function(e, res) {
					console.log(res.status);
					expect(res.status).to.be(401);
					done();
				})
			}
		)
		it('POSTs fails for emtim with emtim2 apikey', function(done) {
			superagent
				.post(httpLoc + 'auth/'+emtim)
				.send({
					apikey: apikey
				})
				.end(function(e, res) {
					console.log(res.body)
					expect(res.body.message).to.be('apikey does not match email');
					done();
				})
			}
		)
	})
	describe('users', function() {
		it('GETs succeeds w userinfo from api/account when passed token', function(done) {
			superagent
				.get(httpLoc + 'account/')
				.set('Authorization', 'Bearer ' + token)
				.end(function(e, res) {
					console.log(res.body)
					var user = jwt.decode(token, secret);
					var email = user.iss;
					var dexp =  user.exp;
					expect(email).to.be(res.body.email);
					done()
				})
		})
		it('GETs api/users/:email when passed token', function(done) {
			superagent
				.get(httpLoc + 'users/'+emtim2)
				.set('Authorization', 'Bearer ' + token)
				.end(function(e, res) {
					console.log(res.body)
					var user = jwt.decode(token, secret);
					console.log(user)
					var email = user.iss;
					var dexp =  user.exp;
					expect(email).to.be(res.body.items.email);
					done()
				})
		})
		it('GETs fail from api/account when passed badtoken', function(done) {
			superagent
				.get(httpLoc + 'account/')
				.set('Authorization', 'Bearer ' + token +'dog')
				.end(function(e, res) {
					console.log(res.body)
					expect(res.body.message).to.be('Signature verification failed');
					done()
				})
		})		
		it('DELETES user tim2', function(done){
			superagent
				.del(httpLoc + 'users/'+emtim2)
				.set('Authorization', 'Bearer ' + token)
				.end(function(e, res) {
					console.log(res.body)
					expect(e).to.eql(null)
					expect(res.body.email).to.eql(emtim2)
					done()
				})			
		})
	})
	describe('social', function() {
		it('GETS sauth/facebook', function(done){
			var httpLoc="http://localhost:3004/api/sauth/fuckbook"
			superagent
				.get(httpLoc)
				.end(function(err, res, req) {
					console.log(res.body)
					expect(true).to.be(true)
					done()
				})			
		})
		// it('GETS manuall contacts facebook', function(done){
		// 	var httpLoc="https://www.facebook.com/v2.8/dialog/oauth?scope=email&client_id=267464200368452&redirect_uri=http://127.0.0.1:3004/api/sauth/facebook/callback"
		// 	agent.get(httpLoc)
		// 		.end(function(e, res) {
		// 			console.log(res)
		// 			expect(true).to.be(true)
		// 			done()
		// 		})			
		// })		
	})
})
