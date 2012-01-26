
var mongoose
, Schema,Product ;


function Init(Params)
{
    mongoose=Params.mongoose;
    mongoose.connect('mongodb://localhost/my_database');
    Schema = mongoose.Schema;
	var Data = require("./Data");
	Data.Init(mongoose);
	var app = Params.app;

   Product= mongoose.model('Product');
	app.get('/Tables', renderTables);
    console.log("Product Module loaded");
}
	
	
	
	
	
function renderTables (req, res) {
       
		res.render('Tables', {
    title: 'Select a table', 
	page: 'Tables',
  });

}







function SocketInit(socket)
{
    socket.on('product/Update', function (data) {
        var hs = socket.handshake;
       if(!hs.session.Admin)return;

			var query = { _id: data.id };
			Product.update(query, { name: data.name,  type: data.type, price : data.price, description : data.description }, options, callback);
			
			
					socket.emit('product/message', {
                msg: "Product Updated"
            });
          

    });
    
    socket.on('product/Add', function (data) {
        console.log("Request on: login/Register");
		 var hs = socket.handshake;
       if(!hs.session.Admin)return;
        var product = new Product({
            name: data.name,
            type: data.type, 
            price : data.price,
			description : data.description
        }); 
        product.save(function (err) {
            if (err)
            {
                Error(socket,{
                    text: "register failed"
                });
                return;
            }
            socket.emit('product/message', {
                msg: "Product Added"
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


