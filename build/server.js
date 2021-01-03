"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var logging_1 = __importDefault(require("./config/logging"));
var config_1 = __importDefault(require("./config/config"));
var sample_1 = __importDefault(require("./routes/sample"));
var NAMESPACE = 'Server';
var router = express_1.default();
/** Logging the request */
router.use(function (req, res, next) {
    logging_1.default.info(NAMESPACE, "METHOD - [" + req.method + "], URL - [" + req.url + "], IP - [" + req.socket.remoteAddress + "]");
    res.on('finish', function () {
        logging_1.default.info(NAMESPACE, "METHOD - [" + req.method + "], URL - [" + req.url + "], IP - [" + req.socket.remoteAddress + "], STATUS - [" + req.statusCode + "]");
    });
    next();
});
router.use(express_1.default.json());
/** Roules of API */
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }
    next();
});
/** Routes */
router.use('/sample', sample_1.default);
/** Error Handling */
router.use(function (req, res, next) {
    var error = new Error('Not Found');
    return res.status(404).json({
        message: error.message
    });
});
/** create the server */
router.listen(config_1.default.server.port, function () { return logging_1.default.info(NAMESPACE, "Server running on " + config_1.default.server.hostname + ":" + config_1.default.server.port); });
