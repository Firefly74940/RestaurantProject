
var mongoose
, Schema,ObjectName ;

function Init(Params)
{
    mongoose=Params.mongoose;
    mongoose.connect('mongodb://localhost/my_database');
    Schema = mongoose.Schema;
   var app = Params.app;

    ObjectName = new Schema({
        name    : {
            type: String, 
            required: true
        }
    });
	
	}
	
	function Error(socket,msg)
{
    socket.emit('ObjectName/Error', {
        data: msg.text
    });
}


function SocketInit(socket)
{
	socket.on('ObjectName/Add', function (data) {
        console.log("Request on: ObjectName/Add");
       
        var objectName = new ObjectName({
            name: data.name,
        }); 
        objectName.save(function (err) {
            if (err)
            {
                Error(socket,{
                    text: "add failed"
                });
                return;
            }

        });
        
    });
    
	 socket.on('ObjectName/Update', function (data) {
        var hs = socket.handshake;
       if(!hs.session.Admin)return;

			var query = { _id: data.id };
			Product.update(query, { name: data.name}, options, callback);
			
			
					socket.emit('ObjectName/Message', {
                msg: "Product Updated"
            });
          

    });

	 socket.on('ObjectName/Remove', function (data) {
        var hs = socket.handshake;
       if(!hs.session.Admin)return;

			var query = { _id: data.id };
			
			query.remove(function(error) {
				 if (error) {
				 Error(socket,{msg : "Can't remove"})
				 }
				 else
				 {
					socket.emit('ObjectName/Message', {
                msg: "Product Removed"
            });
				 }
			
			});
			
					
          

    });
	
	
    console.log("ObjectName socket Module initialized");

}

exports.init = Init;
exports.SocketInit=SocketInit;
