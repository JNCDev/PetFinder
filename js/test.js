// User enters postal code
// Based on their postal code, API returns the closest 5 shelters in the user's area
// Then based on those 5 shelters, user sees all the specified types 
// of animals available for adoption at those shelters 
// User will also be given refine options to refine by animal type & ...


var app = {};

var location = {};

petApp.init = function() {
	petApp.getLocationData();

	var location = $('select').val();
	movieDB.getDataByGenre(genreID);
	// console.log(genreID);
}

petApp.getLocationData = function() {
	$.ajax({
		url: 'http://api.petfinder.com/shelter.find',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			key: '7650ccca5ad807a0a39eaf4aed5ccb10',
			location:'l1a4c5',
			format:'json',
			// count:5 // This will help limit the number of shelters. The first object returned is closest location
			}
	}).then(function(results){
			console.log(results.petfinder.shelters.shelter);
		});
	};

petApp.

$(function(){
	petApp.init();
});


