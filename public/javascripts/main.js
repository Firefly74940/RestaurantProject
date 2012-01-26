
 window.onload=function initPage(){
                 socket = io.connect('http://localhost');
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