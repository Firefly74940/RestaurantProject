var pwdH;
var pwdD;
 window.onload=function()
			{
			pwdH = document.getElementById("pwdH");
			pwdD = document.getElementById("pwd");
			pwdD.innerHTML='';
			}
function tape(num)
{
	pwdH.value= pwdH.value+''+num;
	pwdD.innerHTML+='*';
}