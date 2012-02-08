
var Dependences=[ "DB" ];
var DB;

var crypto = require('crypto');
function Init(Params)
{
   var mongoose=Params.mongoose;
   var Schema = mongoose.Schema;
   var app = Params.app;
	DB=Params.Modules.DB;
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
    },{strict : true});
    
    User.pre('save', function(next, done){
        hashPwd(this);
        next();
    });
	DB.Schemas.User=User;
    User = mongoose.model('User', User);
//	var  schem = User.model.schema;
	
	Params.Modules.DB.Add('User',{name: 'Firefly',email:'mail', password : 'pwd'},function (err) {
            if (err)
            {
               
                return;
            }
           

        });
	app.get('/Password/:type', renderPassword);
	
	
	
    console.log("Login Module loaded");
	return true;
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
exports.Dependences=Dependences;


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


