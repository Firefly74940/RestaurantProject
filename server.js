var Modules=new Array();
var parseCookie , Session;
Modules.push({
    name :"login",
    md:''
});
Modules.push({
    name :"cook",
    md:''
});
function Init(Params) {
    Params.Modules=Modules;
    parseCookie = Params.parseCookie;
    Session= Params.Session;
    var app=Params.app,
    io= Params.io;
    
    SessionManagerInit(Params);
    app.listen(8080);
    
    //modules requier
    
    for (var i = 0; i < Modules.length; i++)
    {
        var module = require("./Modules/"+Modules[i].name);
        module.init(Params);
        Modules[i].md= module;
    }

    app.get('/', function (req, res) {
       
		res.render('index', {
    title: 'Home',
	page: 'Home'
  });
    });
   
    
    SocketInit(io);
    
    console.log("Server has started.");
 
}
function MongoInit()
{}
function SessionManagerInit(Params)
{
    var app = Params.app,
    io= Params.io,
    express= Params.express,
    sessionStore= Params.sessionStore;
    
    app.configure(function () {
        app.use(express.cookieParser());
        app.use(express.session({
            store: sessionStore
            , 
            secret: 'sadkenew'
            , 
            key: 'express.sid'
        }));
		
		
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(Params.stylus.middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
		
		
		
    });

    io.set('authorization', function (data, accept) {
        if (data.headers.cookie) {
            data.cookie = parseCookie(data.headers.cookie);
            data.sessionID = data.cookie['express.sid'];
            // save the session store to the data object 
            // (as required by the Session constructor)
            data.sessionStore = sessionStore;
            sessionStore.get(data.sessionID, function (err, session) {
                if (err || !session) {
                    accept('Error', false);
                } else {
                    // create a session object, passing data as request and our
                    // just acquired session data
                    data.session = new Session(data, session);
                    accept(null, true);
                }
            });
        } else {
            return accept('No cookie transmitted.', false);
        }
    });
    
    
}

function SocketInit(io)
{
    io.sockets.on('connection', function (socket) {
        var hs = socket.handshake;
        console.log('A socket with sessionID ' + hs.sessionID 
            + ' connected!');
        // setup an inteval that will keep our session fresh
        var intervalID = setInterval(function () {
            // reload the session (just in case something changed,
            // we don't want to override anything, but the age)
            // reloading will also ensure we keep an up2date copy
            // of the session with our connection.
            hs.session.reload( function () { 
                // "touch" it (resetting maxAge and lastAccess)
                // and save it back again.
                hs.session.touch().save();
            });
        }, 60 * 1000);
        socket.on('disconnect', function () {
            console.log('A socket with sessionID ' + hs.sessionID 
                + ' disconnected!');
            // clear the socket interval to stop refreshing the session
            clearInterval(intervalID);
        });
    
        socket.emit('socketOk', {
            msg: 'Welcome'
        });
  
        for (var i = 0; i < Modules.length; i++)
        {
           
            Modules[i].md.SocketInit(socket);
        }
        
    });
}
exports.init = Init;
exports.modules=Modules