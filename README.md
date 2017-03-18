# social-jwt-stateless
http://localhost/services/social-jwt-stateless/tempclient/index3.html 
- the client logs in to facebook and gets an access_token.  
- access token is sent to server
- server calls graph.facebook.com/me with access key and gets the fields it want to save in user data, particularly the email address which it uses as an id.
- server saves the user data in the the emailid record and then sends a token back to the web client
- web client sends that token with each request for protected data


263878937398656
One important aspect to understand about access token is that they are portable. Once you have an access token you can use it to make calls from a mobile client, a web browser, or from your server to Facebook's servers. If a token is obtained on a client, you can ship that token down to your server and use it in server-to-server calls. If a token is obtained via a server call, you can also ship that token up to a client and then make the calls from the client.

https://digitalleaves.com/social-login-for-your-rest-api-using-oauth-2-i/

Starting from a working system that signs up/registers a user by having them 

- enter their email, 
- sends to that email an apikey 
- the user completes registration with by entering their apikey in the registration site. 
- Once the server gets the apikey it returns to the user a jwt token that encodes the users email and an expiration date.
- user email is the unique identifier for a user

the goal is to add social network as a way to verify a users identity. Once verified the social netwoork info will be added to the mongodb user record, for that email address. The app would then be sent the same token as local registration would have.

## deconstructing social login

Going from the session based tutorial on [social login by scotch.io](https://scotch.io/tutorials/easy-node-authentication-linking-all-accounts-together) which is pretty good but it ends up with a mess of a user database, I decided to try to better understand the process of social network login. Facebook has a tutorial on [manually building a login flow](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow) that starts with `Invoking the Login Dialog and Setting the Redirect URL`. Applying that to the scotch io stuff using

https://www.facebook.com/v2.8/dialog/oauth?client_id=413205512366551&redirect_uri=http://127.0.0.1:7080/auth/facebook/callback

brought up a facebook 

https://graph.facebook.com/v2.8/10212552501986668/?fields=id,name,email&access_token=EAADvZCxpTzYABADSzz11mNGMOVAZBHNaMIm0qmMih1EMkyn01J4oLQQ2hN5sU0gtjZBw62KPiXOUEtZB3tK4tegYZBq3ELKFeV21ugE6sZCAlSCWWPmTp6sOrUevXajWbK1uliwWTn8fFvDBGIZC6QrZAZCrEeZBFDZCUdXiAVfJOLJivJSI4RXO11oLxlzmzcvvLwZD
https://graph.facebook.com/v2.8/me?fields=id,name,email&access_token=EAADvZCxpTzYABADSzz11mNGMOVAZBHNaMIm0qmMih1EMkyn01J4oLQQ2hN5sU0gtjZBw62KPiXOUEtZB3tK4tegYZBq3ELKFeV21ugE6sZCAlSCWWPmTp6sOrUevXajWbK1uliwWTn8fFvDBGIZC6QrZAZCrEeZBFDZCUdXiAVfJOLJivJSI4RXO11oLxlzmzcvvLwZD

https://www.facebook.com/v2.8/dialog/oauth?scope=email&client_id=267464200368452&redirect_uri=http://127.0.0.1:3004/api/sauth/facebook/callback

### refs
- https://code.tutsplus.com/articles/social-authentication-for-nodejs-apps-with-passport--cms-21618
- https://scotch.io/tutorials/easy-node-authentication-linking-all-accounts-together
- https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow

## tags
### 01-email-as-userinfo-local
### initial commit
a copy of token-auth-server
### refactor
toward the cleaner looking code of node-authentication-guide https://scotch.io/tutorials/upgrading-our-easy-node-authentication-series-to-expressjs-4-0

Social Token authorization via local APIkey, twitter, facebook, google+ or github Email is the field that uniquely identifies a user. A user registering locally with an email address gets an apikey sent to their email address. Entering that apikey returns a token which would is stored stored in the browser's localStorage. Protected areas on the server require an token to be sent with each request.

Allows Cross-Origin-Resource-Sharing (CORS). MongoDb stores records for each user containing (at least) email and apikey.

Uses node, express, passport and mongoose.

##config

Rename cfg-blank.js to cfg.js and fill out database, port, jwt secret and smtp mailer credentials.
    
    cd node-token-auth
    mv cfg-blank.js cfg.js

from /node-token-auth  directory  run

    npm install 

start mongod if not running

       monngod

from /token-auth-server run
    
    node server

test - from new console:

      cd node-token-auth
      mocha
