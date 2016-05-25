// Step 1: User enters their postal code
// Step 2: Based on user's postal code, API returns all the shelters in the user's vicinity (back end)
// Step 3: User chooses whether they want to see 'small and furry animals', 'birds', 'rabbits', 'scales, fins & other'
// Step 4: Display all animals available at the shelters in the user's vicinity that match their animal filter
// Step 5: User has the option to advance filter animals by breed
// Step 6: Display all animals (Image, Name, Breed, Gender, Age, Shelter, Location) that match their criteria
// Step 7: If user is interested in a specific animal, they can click on the animal
// and it will link to the shelter 

var petApp = {};

var userLocation = {};

petApp.init = function() {
	// petApp.getLocationData();

	userLocation = $('#userPostalCode').val();
	petApp.getLocationData(userLocation);
	// console.log(userLocation);
}

petApp.getLocationData = function(postalCode) {
	$.ajax({
		url: 'http://api.petfinder.com/shelter.find',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			key: '7650ccca5ad807a0a39eaf4aed5ccb10',
			location: postalCode,
			format:'json',
			// count:5 // This will help limit the number of shelters. The first object returned is closest location
			}
	}).then(function(results){
			console.log(results);
		});
	};


var petFind = {};

petFind.getData = function() {
	$.ajax({
		url: 'http://api.petfinder.com/shelter.getPets',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			key: '7650ccca5ad807a0a39eaf4aed5ccb10',
			id: 'ON57',
			format:'json',
			}
	}).then(function(petResults){
			console.log(petResults.petfinder.pets);
		});
	};

$(function(){
	app.getData();
	petFind.getData();

});


