'use strict';
// Step 1: User enters their postal code
// Step 2: Based on user's postal code, API returns all the shelters in the user's vicinity (back end)
// Step 3: User chooses whether they want to see 'small and furry animals', 'birds', 'rabbits', 'scales, fins & other'
// Step 4: Display all animals available at the shelters in the user's vicinity that match their animal filter
// Step 5: User has the option to advance filter animals by breed
// Step 6: Display all animals (Image, Name, Breed, Gender, Age, Shelter, Location) that match their criteria
// Step 7: If user is interested in a specific animal, they can click on the animal and it will link to the shelter

var petApp = {};
var userLocation = {};

petApp.init = function () {
    petApp.getUserLocation();
    $('#postalSubmit').on('click', function() {
        $('.results').empty();
        $('input[name=animalSelect]').attr('checked', false);
    });
    $(".returnTop").on('click', function(e) {
        event.preventDefault(e);
        $('html, body').animate ({
            //Smooth Scroll from bottom of pet display section to top of pet selection section
            scrollTop: $("#two").offset().top
        }, 2000);
    })
};

petApp.getUserLocation = function() {
    $('#userLocationInput').on('submit', function(e) {
        e.preventDefault();
        var userLocation = $('#userPostalCode').val();
        document.getElementById('userLocationInput').reset();
        console.log(userLocation);
        petApp.getLocationData(userLocation);
        //Smooth Scroll from Postal Code input to top of pet selection section
        $('html, body').animate ({
            scrollTop: $("#two").offset().top
        }, 1000);
    });
};

petApp.getLocationData = function(data) {
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
    }). then(function(results) {
        if (results.petfinder.shelters != undefined) {
            var shelterResults = results.petfinder.shelters.shelter;
            var shelterIDs = shelterResults.map(function(a) {
                return a.id["$t"];
            });
        } else {
            alert('Sorry! There were no results found for ' + postalCode + '. Please try again.');
            //removing smooth scroll when user enters invalid/insufficient data postal code
            $('html, body').animate ({    
            scrollTop: $("#one")
            });
        };
        petApp.getData(shelterIDs);
    });
};

petApp.getData = function(shelterIDs) {
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
    //The Ajax call returns multiple arrays of data
    $.when.apply(null, shelterCalls).then(function () {
        var data = Array.prototype.slice.call(arguments);
        data = data.map(function (pets) {
            return pets[0].petfinder.pets.pet;
        });
        //Flatten the multiple arrays into one manageable array
        data = data.reduce(function(prev, next) {
            return prev.concat(next);
        }, []);
        petApp.pets = data;
        petApp.displayPets();
    });
};

petApp.displayPets = function() {
    $('input[name=animalSelect]').on('click', function(res) {
        //Smooth Scroll from pet selection section to top of pet display section
        $('html, body').animate ({
            scrollTop: $("#three").offset().top
        }, 1000);
        $('.results').empty();
        //Filter array of pet data by User's selection
        var filteredPets = petApp.pets.filter(function(value) {
            if (value != undefined) {
                var userInput = $('input[name=animalSelect]:checked').val();
                return value.animal.$t === userInput;
            }
        });
        var animalCategory = $('input[name=animalSelect]:checked').val();
        if (typeof filteredPets[0] === 'undefined') {
            alert('Sorry, it seems your selection of ' + animalCategory + ', hasn\'t returned any results in your area. Please make another selection.');
        }
        //Use Handlebar template to display pet data
        var petTemplate = $('#petTemplate').html();
        var template = Handlebars.compile(petTemplate);
        filteredPets.forEach(function(pet) {
            var petInfo = {
                name: pet.name.$t,
                age: pet.age.$t,
                sex: pet.sex.$t,
                breed: pet.breeds.breed.$t,
                description: pet.description.$t,
                photo: pet.media.photos.photo[2].$t,
                shelter: 'https://www.petfinder.com/petdetail/' + pet.id.$t,
                address: pet.contact.address1.$t,
                city: pet.contact.city.$t
            };
            //Push template to the page for each animal
            var fillTemplate = template(petInfo);
            $(".results").append(cleanup(fillTemplate));
        });
    });
	var cleanup=function(string) {
	    return string.replace(/ *\([^)]*\) */g, "");
	};
};

function adjustHeights(elem) {
	var fontstep = 2;
	if ($(elem).height()>$(elem).parent().height() || $(elem).width()>$(elem).parent().width()) {
	$(elem).css('font-size',(($(elem).css('font-size').substr(0,2)-fontstep)) + 'px').css('line-height',(($(elem).css('font-size').substr(0,2))) + 'px');
	adjustHeights(elem);
	}
}

$(function() {
    petApp.init();
    setTimeout(function() { 
        adjustHeights('.too_big'); 
    }, 100); 
});