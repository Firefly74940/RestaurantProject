//When the "add contact" page is created...
$('#addContactPage').live('pagecreate',function()
{
	//For each button...
	$(this).find('button').each(function()
	{
		/*  
			==========================
			==  Write the code for  ==
			==   buttons behavior   ==
			==========================
		*/
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
	/*  
		==========================
		==    Update the list   ==
		==  #contacts_list here ==
		==========================
	*/
	
	/*
		TIPS: var contacts = getContacts();
		
		==> "contacts" will be a JSON containing all
		the stored contacts, in this format:
		
		{
			'John Doe': '+33234567890',
			'Foo Bar': '4156789012'
		}
	*/
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