const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    // origin: (origin, callback) => {
    //     // if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
    //     if (allowedOrigins.indexOf(origin) !== -1) {     // use this line in production
    //             callback(null, true)
    //     } else {
    //         callback(new Error('Not allowed by CORS'));
    //     }
    // },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;