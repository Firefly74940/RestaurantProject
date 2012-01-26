var Libs={};
Libs.server = require("./server");
Libs.express = require('express')
Libs.app = Libs.express.createServer()
Libs.io = require('socket.io').listen(Libs.app)
Libs.connect = require('connect');
Libs.mongoose = require('mongoose');
Libs.parseCookie = require('connect').utils.parseCookie;
Libs.Session = require('connect').middleware.session.Session;
var MemoryStore = require('connect/lib/middleware/session/memory');
Libs.sessionStore = new MemoryStore();
Libs.stylus= require('stylus');
//Libs.Mongo={};
//Libs.Mongo.Db = require('mongodb').Db;
//Libs.Mongo.Connection = require('mongodb').Connection;
//Libs.Mongo.Server = require('mongodb').Server;
//Libs.Mongo.BSON = require('mongodb').BSON;
//Libs.Mongo.ObjectID = require('mongodb').ObjectID;

Libs.server.init(Libs);








