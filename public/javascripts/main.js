Var Api={};
 window.onload=function initPage(){
                 Api.socket = io.connect('http://localhost');
                 console = document.getElementById("console");
                socket.on('login/LoginAccepted', function (data) {
                   
                    Log("loged as "+ data.UserName + "(in 2 secondes)");
                    setTimeout("window.location = 'index.html'",2000);
                });
                socket.on('socketOk', function (data) {
                   Log("Debug:Socket connected");
                  
                });
                socket.on('login/RegisterAccepted', function (data) {
                   Log("RegisterAccepted "+data.email+"/"+data.password);
  
                });
  
                socket.on('login/Error', function (data) {
                   Log("Error: "+ data.data);
  
                });
  
            }
            function Log(data)
            {
                console.innerHTML=console.innerHTML+data+"<br/>";
            }
Api.SubmitForm= function (form)
		{
			var content = {}
			var reg=new RegExp("(\[|\])", "g");
			var destination = form.form.attributes['action'].value;
			for(i=0; i<form.form.length; i++)
			{
				var elm=form.form[i];
				var names = elm.name.split(/(\]|\[)+/);
				if(content[names[0]]==undefined)
				{
					content[names[0]]={};
				}
				var val ="";
				switch(elm.type)
				{
					case 'checkbox':
						if(elm.checked)
						{
							content[names[0]][names[2]]=elm.value;
						}
						break;
					default:
						content[names[0]][names[2]]=elm.value;
				}
				
			}
			
			Api.socket.emit(destination, content);
			return false;
		}