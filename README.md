# social-token

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
