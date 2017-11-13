(function () {
    "use strict";

	require("dotenv").config({
		"silent": true
	});
	process.isLocal = process.argv.some((args) => {
		return args === "--local" || "--l"
	});

    const express = require("express");
    const app = express();
	const appPort = process.env.APP_PORT || process.env.PORT || 6050;
	const server = require("http").createServer(app);
	// const io = require("socket.io")(server);
	const request = require("request");
	const cookieSession = require("cookie-session");
	const cookieParser = require("cookie-parser");
	const compress = require("compression");
	const engines = require("consolidate");
	const morgan = require("morgan");
	const bodyParser = require("body-parser");

	app.disable("x-powered-by");
	app.use(compress());
	app.use(cookieParser());
	app.use(cookieSession({
		"secret": process.env.APP_SECRET,
		"maxAge": 86400000,
		"saveUninitialized": false,
		"resave": false,
		"cookie": {
			"secure": true,
			"httpOnly": true
		}
	}));

	app.engine("html", engines.ejs);
	app.set("view engine", "ejs");
	app.set("views", __dirname + "/client");
	app.use(express.static(__dirname + "/client"));
	app.use(bodyParser.json({
		"limit": "50mb"
	}));
	app.use(bodyParser.urlencoded({
		"extended": true,
		"limit": "10mb"
	}));

	if (process.isLocal) {
		app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
	}

	require("./server/routes/index")(app, request);

    server.listen(appPort, () => {
		process.stdout.write(["\nServer running on port:", appPort, "\n"].join(" "));
	});

}());