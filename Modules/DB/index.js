var mongoose;
var Schemas={};
function Init(Params)
{
    mongoose=Params.mongoose;
    mongoose.connect('mongodb://localhost/my_database');
	
	
	var app = Params.app;
	app.get('/GenerateForm/:Model/:pwd', GenerateForm);
	
	console.log("DB Module loaded");
	return true;
}

function Add(type,doc,callback)
{
	var Object = mongoose.model(type);
	var Obj = new Object(doc, true);
	Obj.save(callback);
}
function Update(type,condition,doc,callback)
{
	var options = { multi: false };
	var Object = mongoose.model(type);
	Object.update(condition,doc , options, callback)
}
function Remove(type,condition,callback)
{

	var Object = mongoose.model(type);
	Object.remove(condition, callback);
}

function GenerateForm(req, res)
{
	
		
	if(req.params.pwd!="azerty")
		 throw new NotFound;
	 var fs = require('fs');
	//Schema = mongoose.Schema;
	//console.log(Schema.Schema);
	//console.log(req.params.Model);
	//console.log(req.params.pwd);
	var Object = Schemas[req.params.Model];
	//console.log(Object.model);
	
	
	
	var content= "************************";
	content+= '  '+req.params.Model+'-Create-Template  ';
	content+= "************************\n\n";
	content +="form(method='post',action='/"+req.params.Model+"/Create', onSubmit='return Api.SubmitForm(this);') \n";
	content+="\tinput(type='hidden', name='_method', value='put') \n";
	for(var index in Object.paths) {
		if(index=="_id")
			continue;
		content+="\t";
		//content+= index + " : " + Object.paths[index] + "\n";
		content += "input(type='text', name='"+req.params.Model+"["+index+"]')\n";
		}
		content+="\tinput(type='submit', value='Submit')";
		
		
	content+= "\n\n\n\n************************";
	content+= '  '+req.params.Model+'-Update-Template  ';
	content+= "************************\n\n";
	content+="form(method='post',action='/"+req.params.Model+"/Update', onSubmit='return Api.SubmitForm(this);') \n";
	content+="\tinput(type='hidden', name='_method', value='put') \n";
	content+="\tinput(type='hidden', name='"+req.params.Model+"[_id]', value='#{"+req.params.Model+"._id}') \n";
	for(var index in Object.paths) {
		if(index=="_id")
			continue;
		content+="\t";
		//content+= index + " : " + Object.paths[index] + "\n";
		content += "input(type='text', name='"+req.params.Model+"["+index+"]', value='#{"+req.params.Model+"."+index+"}')\n";
		}
		content+="\tinput(type='submit', value='Submit')";
		
		
		
	fs.writeFile(__dirname+'/'+req.params.Model+'-Template.jade', content, function (err) {
	if (err) throw err;
	console.log('It\'s saved!');
	});
	//  throw new NotFound;
	res.end('done \n');
}









function SocketInit(socket)
{return;}
exports.SocketInit=SocketInit;
exports.init = Init;
exports.Schemas = Schemas;
exports.Add = Add;
exports.Update = Update;
exports.Remove = Remove;