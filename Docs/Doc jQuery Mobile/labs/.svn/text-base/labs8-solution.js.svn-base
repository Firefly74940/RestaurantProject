//To change configuration, we listen for "mobileinit" event
$(document).bind('mobileinit',function()
{
	$.mobile.listview.prototype.options.filterPlaceholder='Filter contacts...';
});

//When the "add contact" page is created...
$('#addContactPage').live('pagecreate',function()
{
	//For each button...
	$(this).find('button').each(function()
	{
		//We listen its click event
		$(this).click(function()
		{
			var val=$('#newContactPhone').val();
			
			//If it's the "back" button
			if($(this).attr('data-icon'))
			{
				//We delete the last character of the phone number
				$('#newContactPhone').val(val.substr(0,val.length-1));
			}
			//If it's a "normal" button
			else
			{
				//We add its contents to the phone number
				$('#newContactPhone').val(val+$(this).text());
			}
			
			//And we prevent the submission!
			return false;
		});
	}).end().find('form').submit(function()
	{
		var name = $('#newContactName').val(),
		tel = $('#newContactPhone').val();
		
		if(name && tel)
		{
			$('#newContactName').val('');
			$('#newContactPhone').val('');
			storeContact(name,tel);
		}
	});
});

//When the main page is created.
$('#mainPage').live('pagecreate',function()
{
	//Just after the page is shown
	$(this).bind('pageshow',function()
	{
		var contacts=getContacts(),
		list='';
		for(var name in contacts)
		{
			list+='<li><a href="tel:'+contacts[name]+'"><b>'+name+'</b><br />'+
			'<em>'+contacts[name]+'</em></a><a href="'+name+'" data-icon="delete" data-iconpos="notext">Delete</a></li>';
		}
		// Don't forget to call listview() !
		$(this).find('#contacts_list').listview().html(list).listview('refresh');
	});
	
	//We get all the delete links: "delegate()" permits us to attach an event on them
	$(this).find('#contacts_list').delegate('a[data-icon="delete"]','click',function()
	{
		//We get the corresponding contact name
		var name=$(this).attr('href');
		
		//Asking for confirmation
		if(confirm('Do you really want to delete '+name+' from your contacts?'))
		{
			//Delete !
			deleteContact(name);
			$('#contacts_list').find('a[href="'+name+'"]').parent().remove();
			$('#contacts_list').listview('refresh');
		}
		return false;
	});
});

/*	
	===============================================
	==       These below functions are here      ==
	== to store the contacts. Don't modify them! ==
	===============================================
*/
function getContacts()
{
	var contacts=window.localStorage.getItem('contacts');
	
	if(!contacts)
	{
		return {};
	}
	return JSON.parse(contacts);
}

function storeContact(name,phone)
{
	var contacts=getContacts();
	contacts[name]=phone;
	window.localStorage.setItem('contacts',JSON.stringify(contacts));
}

function deleteContact(name)
{
	var contacts=getContacts();
	delete contacts[name];
	window.localStorage.setItem('contacts',JSON.stringify(contacts));
}