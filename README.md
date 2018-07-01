# Instagram-API-NODE-Express
Simple Oauth to Instagram using instagram API, requests and express

## How to use
After cloning do NPM install. <br>
Then in order to use mongo database set up your credentials to a separate .env file along with the server.js file

## How to enable/disable CORS and CSURF protection if you want to use cookies
On server.js uncomment or comment the the code where CORS and CSURF was initialize

## How to change ports
You can change the port in mongo-db-context.js

## Routes
/api - to see if home page works <br>
/api/login - initiate request to instagram to authorize access <br>
/api/auth/instagram - callback redirect after instagram authorize access <br>
