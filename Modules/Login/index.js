
var mongoose
, Schema,User ;

var crypto = require('crypto');
function Init(Params)
{
    mongoose=Params.mongoose;
    mongoose.connect('mongodb://localhost/my_database');
    Schema = mongoose.Schema;
   var app = Params.app;

    User = new Schema({
        name    : {
            type: String, 
            required: true
        }
        , 
        email     : {
            type: String, 
            required: true, 
            index: {
                unique: true, 
                sparse: true
            }
        }
        , 
        password : {
            type: String, 
            required: true
        }
    });
    
    User.pre('save', function(next, done){
        hashPwd(this);
        next();
    });
    User = mongoose.model('User', User);
	
	
	
	app.get('/Password/:type', renderPassword);
	
	
	
	
	
    console.log("Login Module loaded");
}
function renderPassword (req, res) {
       
		res.render('Password', {
    title: 'Login', 
	page: 'Password',
	type : req.params.type
  });

}

function SocketInit(socket)
{
    socket.on('login/connect', function (data) {
        var hs = socket.handshake;
        if(!data.hasOwnProperty("email")|| !data.hasOwnProperty("password"))
        {
            Error(socket,{
                text: "Login failed"
            });
        }
        hashPwd(data);
        
        User.findOne({
            email: data.email,
            password:data.password
        }, function (err, user){
            if(err)
            {
                Error(socket,{
                    text: "Login failed"
                });
                return;
            }
            
            if(user)
            {
                hs.session.UserName= user.name;
				hs.session.Socket=socket;
                hs.session.save();
                socket.emit('login/LoginAccepted', {
                    UserName: hs.session.UserName
                });
            }
            else
            {
                Error(socket,{
                    text: "Login failed"
                });
            }
                
        });
       

        
    });
    
    socket.on('login/Register', function (data) {
        console.log("Request on: login/Register");
       
        var user = new User({
            name: 'Firefly',
            email: data.email, 
            password : data.password
        }); 
        user.save(function (err) {
            if (err)
            {
                Error(socket,{
                    text: "register failed"
                });
                return;
            }
            socket.emit('login/RegisterAccepted', {
                email: user.email, 
                password:user.password
            });

        });
        
    });
    
    console.log("Login socket Module initialized");
}

function CheckDependencies(Params)
{
   
}

function hashPwd(user)
{
    var shasum = crypto.createHash('sha1');
    shasum.update(user.password);
    shasum.update("SadKenew");
    user.password= shasum.digest('hex');
}

function Error(socket,msg)
{
    socket.emit('login/Error', {
        data: msg.text
    });
}

exports.init = Init;
exports.SocketInit=SocketInit;


function findByLoginMdp(User, callback) {
    
    getCollection(function(error, Users_collection) {
        if( error ) callback(error)
        else {
            Users_collection.findOne({
                email: User.email, 
                password: User.password
            }, function(error, result) {
                if( error ) callback(error)
                else callback(null, result)
            });
        }
    });
}


