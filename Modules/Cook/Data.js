function Init(mongoose)
{
	Schema = mongoose.Schema;
	
	var Product = new Schema({
        name    : {
            type: String, 
            required: true
        }
		,
		type    : {
            type: String, 
            required: true,
			 enum: ['Drink', 'Food']
        }

        , 
        price     : {
            type: Number, 
            required: true, 
			min:0
            }
        
        , 
        description : {
            type: String, 
            required: false
        }
    });
    
    
    Product = mongoose.model('Product', Product);
	
	}


exports.Init = Init;