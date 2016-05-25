var app = {};

app.getData = function() {
	$.ajax({
		url: 'http://api.petfinder.com/shelter.find',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			key: '7650ccca5ad807a0a39eaf4aed5ccb10',
			location:'l1a4c5',
			format:'json',
			count:5 // This will help limit the number of shelters. The first object returned is closest location
			}
	}).then(function(results){
			console.log(results.petfinder.shelters.shelter);
		});
	};


$(function(){
	app.getData();
});


