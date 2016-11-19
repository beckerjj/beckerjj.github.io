var bigMap,
	bigMapOptions = {
        zoom: 12,
		center: new google.maps.LatLng(44.293392, -90.698946),
		mapTypeId: google.maps.MapTypeId.HYBRID
    };

//Sort by name
Places.sort(function(a,b) {
	if (a.name < b.name)
		return -1;
	if (a.name > b.name)
		return 1;
	// a must be equal to b
	return 0;
});

//Construct map addresses
$.each(Places, function (index, place) {
	var temp = 'https://maps.google.com/?q={latitude},{longitude}&t=h&z={zoom}';
	
	if (place.latitudeMinutes) place.latitude = place.latitude + place.latitudeMinutes/60;
	if (place.longitudeMinutes) place.longitude = place.longitude + place.longitudeMinutes/60;
	
	temp = temp.replace('{latitude}', place.latitude || 0);
	temp = temp.replace('{longitude}', place.longitude || 0);
	temp = temp.replace('{zoom}', place.zoom || 18);
	
	place.src = temp;
});

$(document).ready(function() {
	$('#bigMapButton').click(function() {
		if($("#bigMap").is(':visible'))
			$("#bigMap").hide('slow');
		else {
			$("#bigMap").show({
				duration: 'slow',
				step: function() {
					window.scrollTo(0,document.body.scrollHeight);
					//$('body').animate({scrollTop: $('footer').offset().top}, 'slow');
				},
				complete: function() {
					if (!bigMap)
						buildBigMap();
					else {
						bigMap.setOptions(bigMapOptions);
					}
				}
			});
		}
	});
	
	buildRows();
	$('#bigMapButton').show();
});

function buildRows() {
	$.each(Places, function (index, place) {
		var $rowsDiv = $('.rows'),
			$rowDiv = $('<div/>').addClass('row').appendTo($rowsDiv),
			$infoDiv = $('<div/>').addClass('info').appendTo($rowDiv),
			$infoDiv2 = $('<div/>').addClass('info2').appendTo($infoDiv),
			$nameSpan = $('<span/>').text(place.name).appendTo($infoDiv2),
			//$address1Span = $('<span/>').text(place.address1).appendTo($infoDiv2),
			//$address2Span = $('<span/>').text(place.address2).appendTo($infoDiv2),
			$mapBtn = $('<button/>').addClass('map').text('Map').appendTo($infoDiv),
			$mapDiv = $('<div/>').addClass('map').css('display', 'none').appendTo($rowDiv),
			$mapIFrame = $('<iframe/>')
				//.attr('src', place.src)
				//.attr('frameborder', '0')
				.css('border', '1px solid black')
				.css('width', 600)
				.css('height', 450)
				.appendTo($mapDiv);
		
		$('<div/>').css('clear', 'both').appendTo($rowDiv);
		
		//$mapDiv.hide();
		
		$mapBtn.click(function() {
			if($mapDiv.is(':visible'))
				$mapDiv.hide('slow');
			else
				$mapDiv.show({
					duration: 'slow',
					step: function() {
						window.scrollTo(0, $rowDiv.offset().top);
					},
					complete: function() {
					//if(!$mapIFrame.attr('src'))
						$mapIFrame.attr('src', place.src + '&output=embed');
					}
				});
		});
	});
}

function buildBigMap() {
	bigMap = new google.maps.Map(document.getElementById('bigMap'), bigMapOptions);

	var infowindow = new google.maps.InfoWindow();

	$.each(Places, function(index, place) {
	
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(place.latitude, place.longitude),
			map: bigMap
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent('<div style="display: table;"><b>' + place.name + '</b>' /*+ '<br/><span>' + place.address1 + '</span><br/><span>' + place.address2 + '</span>'*/ + '</div>');
			infowindow.open(bigMap, marker);
		});
	});
}