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
	$('#postalSubmit').on('click', function () {
		$('.results').empty();
		$('input[name=animalSelect]').attr('checked', false);
	});
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

petApp.getLocationData = function (data) {
	var postalCode = data;
	$.ajax({
		url: 'http://api.petfinder.com/shelter.find',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			key: '7650ccca5ad807a0a39eaf4aed5ccb10',
			location: postalCode,
			format: 'json'
		}
	}). // count: 10 // This will help limit the number of shelters. The first object returned is closest location
	then(function (results) {
		console.log(results);
		if (results.petfinder.shelters != undefined) {
			var shelterResults = results.petfinder.shelters.shelter;
			var shelterIDs = shelterResults.map(function (a) {
				return a.id["$t"];
			});
		} else {
			alert('Sorry! There were no results found for ' + postalCode + '. Please try again');
		};
		console.log(shelterIDs);
		petApp.getData(shelterIDs);
	});
};

// var petFind = {};

petApp.getData = function (shelterIDs) {
	console.log(shelterIDs);

	var shelterCalls = shelterIDs.map(function (id) {
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

	$.when.apply(null, shelterCalls).then(function () {
		var data = Array.prototype.slice.call(arguments);

		data = data.map(function (pets) {
			return pets[0].petfinder.pets.pet;
		});
		//Here is your pets
		//Flatten array of pets
		data = data.reduce(function (prev, next) {
			return prev.concat(next);
		}, []);

		console.log(data);
		petApp.pets = data;
		petApp.displayPets();
	});
};

petApp.displayPets = function () {
	// $('#userPostalCode')
	$('input[name=animalSelect]').on('click', function (res) {
		$('.results').empty();
		//Work with pet data
		var filteredPets = petApp.pets.filter(function (value) {
			if (value != undefined) {
			// console.log(value)
			var userInput = $('input[name=animalSelect]:checked').val();
	            return value.animal.$t === userInput;
	        }
		});
		console.log(filteredPets);
		var animalCategory = $('input[name=animalSelect]:checked').val();

		if (typeof filteredPets[0] === 'undefined') {
			alert('Sorry, there doesn\'t appear to be any ' + animalCategory + ' in your area.');
		}

		const petTemplate = $('#petTemplate').html();
		const template = Handlebars.compile(petTemplate);
		filteredPets.forEach(function(pet){

		const petInfo = {
			name: pet.name.$t,
			age: pet.age.$t,
			sex: pet.sex.$t,
			breed: pet.breeds.breed.$t,
			description: pet.description.$t,
			photo: pet.media.photos.photo[2].$t,
			shelter: 'https://www.petfinder.com/petdetail/' + pet.id.$t,
			address: pet.contact.address1.$t,
			city: pet.contact.city.$t
		}
		const fillTemplate = template(petInfo);

		$(".results").append(fillTemplate);

		});
	});
};

$(function () {
	petApp.init();
});