// Type: determine the type of a variable (extended to differentiate arrays and array-likes from objects)
function type(o){
	var t=typeof o;
	if (o&&t==='object'){
		if (o instanceof Array) return 'enumerable'; else if (!isNaN(o.length)&&o.length>=0) return 'enumerable'; else return 'object';
	}else return t;
}

// Include: a helper to create arrays in case two values are different when they're supposed to be the same.
// For instance:
// var postcode1='AB24 1GA',postcode2='AB24 1EA',postcode3='AB24 1EA';
// var postcode;
// postcode=include(postcode,postcode1);
//  postcode == 'AB24 1GA'
// postcode=include(postcode,postcode2);
//  postcode == ['AB24 1GA','AB24 1EA']
// postcode=include(postcode,postcode3);
//  postcode == ['AB24 1GA','AB24 1EA','AB24 1EA']
function include(oldval,newval){
	// Include 'includes' newval in oldval.
	// If newval is null, return oldval (we don't care for nulls.)
	// If oldval is null, oldval=newval.
	// If it's not null, but not the same, preserve oldval and newval in an array.
	// If it's not null but the same, newval is already 'included', return oldval.
	if (newval==null) return oldval;
	if (oldval!=null){
		// Oldval is not null, check for mismatch / error in oldval
		if (oldval!=newval){
			// Mismatch! Add value to set (create one if there isn't already one.)
			if (type(oldval)!=='enumerable') oldval=[oldval];
			oldval.push(newval);
		}else{
			// They're the same, return oldval
			return oldval;
		}
	}else{
		// Oldval is null, return newval
		return newval;
	}
}

module.exports={
	type:type,
	include:include
};
