
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
    
    console.log("ObjectName socket Module initialized");

}

exports.init = Init;
exports.SocketInit=SocketInit;
