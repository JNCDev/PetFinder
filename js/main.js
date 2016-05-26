'use strict';

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

petApp.init = function () {
	// petApp.getLocationData();
	petApp.getUserLocation();
	// petApp.getData();

	// petApp.getLocationData(userLocation);
	// console.log(userLocation);
};
petApp.getUserLocation = function () {
	$('#userLocationInput').on('submit', function (e) {
		e.preventDefault();
		var userLocation = $('#userPostalCode').val();
		document.getElementById('userLocationInput').reset();
		console.log(userLocation);
		petApp.getLocationData(userLocation);
	});
};

petApp.getLocationData = function (postalCode) {
	$.ajax({
		url: 'http://api.petfinder.com/shelter.find',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			key: '7650ccca5ad807a0a39eaf4aed5ccb10',
			location: postalCode,
			format: 'json',
			count: 10 // This will help limit the number of shelters. The first object returned is closest location
		}
	}).then(function (results) {
		var shelterResults = results.petfinder.shelters.shelter
		var shelterIDs = shelterResults.map(function (a){
			return a.id["$t"]
		})
		console.log(shelterIDs);
		petApp.getData(shelterIDs);
	});
};

// var petFind = {};

petApp.getData = function (shelterIDs) {
	console.log(shelterIDs)

	var shelterCalls = shelterIDs.map(function(id) {
		return $.ajax({
			url: 'http://api.petfinder.com/shelter.getPets',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				key: '7650ccca5ad807a0a39eaf4aed5ccb10',
				id: id, 
				format: 'json'
			}
		});
	});

	$.when.apply(null, shelterCalls)
		.then(function() {
			var data = Array.prototype.slice.call(arguments);

			data = data.map(function(pets) {
				return pets[0].petfinder.pets.pet;
			});
			//Here is your pets
			//Flatten array of pets
			data = data.reduce(function(prev,next) {
				return prev.concat(next);
			},[]);

			console.log(data);
			petApp.pets = data;
			petApp.displayPets();
		});
};

petApp.displayPets = function() {

	$('input[name=animalSelect]').on('click',function (res){
		//Work with pet data
		var filteredPets = petApp.pets.filter(function(value){
			if (value != undefined) {
			// console.log(value)
	            return value.animal.$t === $('input[name=animalSelect]:checked').val();
	        }	
		});
	console.log(filteredPets);
     });
};

$(function () {
	petApp.init();
});