//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Add the required modules
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const express        = require('express');
const app            = express();
const http           = require('http').Server(app);
const session        = require('express-session');
const validator      = require('express-validator');
const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const flash          = require('connect-flash');
const morgan         = require('morgan');
const methodOverride = require('method-override');
const helmet         = require('helmet');
const dotEnv         = require('dotenv').config();
const favicon        = require('serve-favicon');
const passport       = require('passport');

// Local modules for config
const localVariables = require('./config/initialize-local-variables');
const cors           = require('./config/initialize-cors');
const csurf          = require('./config/initialize-csurf');
const routes         = require('./config/routes-initialization');
const errorHandler   = require('./config/error-handler');
const databaseConfig = require('./config/mongo-db-context');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set database connection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const env = process.env.NODE_EN || 'local';
console.log(`NODE_ENV: ${env}`);
databaseConfig.pickEnv(env, app);
		
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set view engine and session
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Morgan is use for development to test what are the request and response that's being handle
app.use(morgan('dev')); 
// Set helmet
app.disable('x-powered-by');
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'The Force' }));
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());

app.use(cookieParser());
app.use(validator()); // Validator is a backend validator by express 
app.use(flash()); // Flash can be use to store messages or notification on session

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs'); ///Set the view engine to EJS
app.set('views', __dirname + '/views'); ///Set the views directory
app.use(express.static(__dirname));
//app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Get the bootstrap, jquery, and font-awesome inside the node_module 
app.use('/js'     , express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js'     , express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css'    , express.static(__dirname + '/node_modules/bootstrap/dist/css')); 
app.use('/css'    , express.static(__dirname + '/node_modules/selectize/dist/css'));
app.use('/fonts/' , express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));
app.use('/fonts/' , express.static(__dirname + '/node_modules/font-awesome/fonts'));
app.use('/css/'   , express.static(__dirname + '/node_modules/font-awesome/css'));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set locals variable
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use((req, res, next) => localVariables.initializeVariable(req, res, next));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set up CORS
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/* Allow CORS
*/
cors.initializeCORS(app);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Anti csurf attack protection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/* uncomment if you want to add csurf protection, 
   csurf will be stored in cookies and local variable 
 */
//csurf.initializeCSURF(app);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set and Initialize Routes
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
routes.initializeRoutes(app);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set Error Handler
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use((req, res, next) => errorHandler.getError(req, res, next));
app.use((err, req, res, next) => errorHandler.showError(err, req, res, next));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create Server
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
http.listen(app.get('port'), () => {
	console.log(`Server Listening to Port: ${app.get('port')}`);
});
