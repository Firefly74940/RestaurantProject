
var mongoose
, Schema,Employee ;

function Init(Params)
{
    mongoose=Params.mongoose;
    mongoose.connect('mongodb://localhost/my_database');
    Schema = mongoose.Schema;
   var app = Params.app;

    Employee = new Schema({
        name    : {
            type: String, 
            required: true
        }
    });
	
	}
	
	function Error(socket,msg)
{
    socket.emit('Employee/Error', {
        data: msg.text
    });
}


function SocketInit(socket)
{
	socket.on('Employee/Add', function (data) {
        console.log("Request on: Employee/Add");
       
        var employee = new Employee({
            name: data.name,
        });
		 var hs = socket.handshake;
		if(!hs.session.Admin)return;
        employee.save(function (err) {
            if (err)
            {
                Error(socket,{
                    text: "add failed"
                });
                return;
            }

        });
        
    });
    
    console.log("Employee socket Module initialized");

}

exports.init = Init;
exports.SocketInit=SocketInit;
