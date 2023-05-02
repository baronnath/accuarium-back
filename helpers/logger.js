// helper/logger.js

const env 		= process.env.NODE_ENV || 'development';
const config 	= require(__dirname + './../config/logger');
const winston 	= require('winston');
const morgan 	= require('morgan');

// Set loggers
winston.addColors(config.colors);
winstonLogger = winston.createLogger({
	levels: config.levels,
	transports: [
		new winston.transports.File({
			format: winston.format.combine(
				winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
				winston.format.printf(api => `${api.timestamp} ${api.level}: ${api.message}`)
			),
			filename: './logs/' + env + '/' + env + '.log',
			json: false,
			maxSize: config.maxSize,
    		maxFiles: config.maxFiles,
			level: 'api',
			colorize: true
		}),
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
			level: 'silly'
		}),
		new winston.transports.File({
			format: winston.format.combine(
				winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
				winston.format.printf(api => `${api.timestamp} ${api.level}: ${api.message}`)
			),
			filename: './logs/' + env + '/exceptions.log',
			json: false,
			maxSize: config.maxSize,
    		maxFiles: config.maxFiles,
			humanReadableUnhandledException: true,
		    // handleExceptions: true,
		})
	],
	exitOnError: false
});

exports.logger = winstonLogger;

morgan.token('reqBody', (req, res) => { return JSON.stringify(req.body) });
exports.httpLogger = morgan(
  	':method :url :status :response-time ms - :res[content-length] - :reqBody',
  	{ 
  		stream: {
			  write: message => winstonLogger.api(message.substring(0, message.lastIndexOf('\n')))
			}
		}
);
