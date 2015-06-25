// Name: Felix Petersma
// Studentnumber: 10367217
// Project: EvolutionOfCoffee

'use strict';

window.onload = function() {
	// >>-------------------------------- initialise most of the variables --------------------------------<<

	// constants
	var HEIGHT = {smallMap: 120, largeMap: 600},
		WIDTH = {smallMap: 200, largeMap: 1000};

	// create svg for first wave
	var firstWave = d3.select('#first-wave').select('svg')
		.attr('width', WIDTH.smallMap)
		.attr('height', HEIGHT.smallMap)
		.attr('class', 'wave first-wave');

	// create svg for second wave
	var secondWave = d3.select('#second-wave').select('svg')
		.attr('width', WIDTH.smallMap)
		.attr('height', HEIGHT.smallMap)
		.attr('class', 'wave second-wave');

	// create svg for third wave
	var thirdWave = d3.select('#third-wave').select('svg')
		.attr('width', WIDTH.smallMap)
		.attr('height', HEIGHT.smallMap)
		.attr('class', 'wave third-wave');

	// create svg for fourth wave
	var fourthWave = d3.select('#fourth-wave').select('svg')
		.attr('width', WIDTH.smallMap)
		.attr('height', HEIGHT.smallMap)
		.attr('class', 'wave fourth-wave');

	// create svg for the main map
	var mainMap = d3.select('#map').select('svg')
		.attr('width', WIDTH.largeMap)
		.attr('height', HEIGHT.largeMap)
		.attr('class', 'wave map')

	// create svg element to put general info
	var generalInfo = d3.select('#information').append('svg')
		.attr('width', WIDTH.largeMap)
		.attr('height', HEIGHT.largeMap / 2)
		.append('p')
			.attr('class', 'main-text')

	var projectionLarge = d3.geo.robinson()
	    .scale((WIDTH.largeMap + 1) / 2 / Math.PI)
	    .translate([WIDTH.largeMap / 2, HEIGHT.largeMap / 2])
	    .precision(.1),

		projectionSmall = d3.geo.robinson()
	    .scale((WIDTH.smallMap + 1) / 2 / Math.PI)
	    .translate([WIDTH.smallMap / 2, HEIGHT.smallMap / 2])
	    .precision(.1);

	var pathLarge = d3.geo.path()
	    .projection(projectionLarge),

	    pathSmall = d3.geo.path()
	    .projection(projectionSmall);

	var graticule = d3.geo.graticule();

	// >>--------------------------------- first import: map data, and create the maps ------------------------------<<

	// load the json data of the world map
	d3.json('data_files/world-50m.json', function(error, world) {
		var countries = topojson.feature(world, world.objects.countries).features;

  		// function to draw a map 
    	function createMap(map, path, tag) {
    		map.append('path')
    			.datum(graticule)
			    .attr('class', 'graticule')
			    .attr('d', path);

			map.selectAll('.subunit')
    			.data(countries)
  				.enter().append('path')
    				.attr('class', function(d) { return 'subunit code' + d.id; })
    				.attr('d', path);

    		map.insert('path')
				.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
				.attr('class', 'boundary')
				.attr('d', path);

			map.append("defs").append("path")
			    .datum({type: "Sphere"})
			    .attr("id", "sphere" + tag)
			    .attr("d", path);

			map.append("use")
			    .attr("class", "stroke")
			    .attr("xlink:href", "#sphere" + tag);
    	}

    	// create the maps
    	createMap(firstWave, pathSmall, 'first');
    	createMap(secondWave, pathSmall, 'second');
    	createMap(thirdWave, pathSmall, 'third');
    	createMap(fourthWave, pathSmall, 'fourth');
    	createMap(mainMap, pathLarge, 'main');

		// >>------------------------------ start the interactivity --------------------------------------------<<

		// create function for when a wave is selected
		function showForWave(wave, text) {
			mainMap.attr('class', 'wave ' + wave);
			d3.select(text).style('display', 'block');
			d3.select('#info-btn').attr('class', 'btn-lg');
			d3.select('#waves').selectAll('a').style('background-color', null);
			d3.select('#' + wave).select('a').style('background-color', '#eeeeee');
			// hide main texttip if needed
			if (mainTextTip.style('display') == 'block') {
				mainTextTip.style('display', 'none');
			}
			// clear main texttip
			$('.maintexttip').empty();
			d3.select('#info-btn').text('Tell me more about the wave');
		}

		// when a wave is actually clicked
		firstWave.on('click', function() {
			d3.select('.dropdown').select('button').classed('disabled', true);
			showForWave('first-wave', '.text-1');
		});
		secondWave.on('click', function() {
			d3.select('.dropdown').select('button').classed('disabled', true);
			showForWave('second-wave', '.text-2');
		});
		thirdWave.on('click', function() {
			d3.select('.dropdown').select('button').classed('disabled', true);
			showForWave('third-wave', '.text-3');
		});
		fourthWave.on('click', function() {
			d3.select('.dropdown').select('button').classed('disabled', false);
			showForWave('fourth-wave', '.text-4');
		});

		// create the div for the tooltip
		var toolTip = d3.select('.container-map').append('div')
			.attr('class', 'tooltip')
			.style('display', 'none')
			.style('max-width', WIDTH.largeMap * 3 / 5 + 'px');

		// create div for main text tip
		var mainTextTip = d3.select('.maintexttip-row')
			.attr('class', 'maintexttip')
			.attr('id', 'maintexttip')
			.style('display', 'none')
			.style('width', '100%')
			.style('max-width', '1000px')
			.style('margin-left', 'auto')
			.style('margin-right', 'auto')
			.style('right', 0)
			.style('left', 0)
			
		function fillMainTextTip(text) {
			mainTextTip.append('p')
    			.text(text);
    		mainTextTip
    			.style('display', 'block');
    		d3.select('#info-btn').text('Hide information');
		}

		// show main-info text as sort-of pop up if button is clicked
    	d3.select('#info-btn').on('click', function() {
    		if (mainTextTip.style('display') == 'block') {
    			$('.maintexttip').empty();
    			mainTextTip.style('display', 'none');
    			d3.select('#info-btn').text('Tell me more about the wave');
    		}
    		else if (mainMap.attr('class') == 'wave first-wave') {fillMainTextTip(mainTexts.first)}
    		else if (mainMap.attr('class') == 'wave second-wave') {fillMainTextTip(mainTexts.second)}
    		else if (mainMap.attr('class') == 'wave third-wave') {fillMainTextTip(mainTexts.third)}
    		else if (mainMap.attr('class') == 'wave fourth-wave') {fillMainTextTip(mainTexts.fourth)}
    	});

    	// >>------------- create the paths to, and the functions for the interactivity with the countries -------------<<

		// selection paths to all the countries
		var france = mainMap.select('.code250'),
			netherlands = mainMap.select('.code528'),
			dutchColonies = mainMap.select('.code360'),
			ethiopia = mainMap.select('.code231'),
			saoudiArabia = mainMap.select('.code682'),
			unitedArabEmirates = mainMap.select('.code784'),
			oman = mainMap.select('.code512'),
			yemen = mainMap.select('.code887'),
			unitedStates = mainMap.select('.code840'),
			italy = mainMap.select('.code380'),
			japan = mainMap.select('.code392'),
			norway = mainMap.select('.code578'),
			finland = mainMap.select('.code246'),
			sweden = mainMap.select('.code752'),
			denmark = mainMap.select('.code208'),
			greatBritain = mainMap.select('.code826'),
			belgium = mainMap.select('.code56'),
			germany = mainMap.select('.code276'),
			australia = mainMap.selectAll('.code36'),
			arabPeninsulaAndEthiopia = [ethiopia, saoudiArabia, unitedArabEmirates, oman, yemen],
			scandinavia = [sweden, norway, denmark, finland],
			westernEurope = [netherlands, greatBritain, belgium, germany];

		function highlightArea(area, wave) {
			mainMap
				.attr('class', 'wave ' + wave + ' blanco')
			area
				.style('fill', '#8c3500');	
		}

		// change coordinates of tooltip, visible or not, according to mouse coordinates
		mainMap.on('mousemove', function() {
			// location of tooltip, flip if on right side
			if (d3.event.pageX >= window.innerWidth / 2) {
				toolTip
					.style('left', (d3.event.pageX) - WIDTH.largeMap * 3 / 5 + 'px');
			}
			else {
				toolTip
					.style('left', (d3.event.pageX) + 'px');
			}
			toolTip.style('top', (d3.event.pageY) - 150 + 'px');
		});

		function showToolTip(header, text) {
			// add header and text to tooltip
			toolTip.append('h4')
				.text(header);
		    toolTip.append('p')
		    	.text(text);
		    toolTip
				.style('display', 'block');
		}

		// function that colours the country and shows the tooltip
		function showInformation(wave, path, title, textPart) {
			if (mainMap.attr('class') == 'wave ' + wave) {
				highlightArea(path, wave);
				showToolTip(title, textPart);
			}
		}

		// function that clears the map on mouseout
		function clearInformation() { {
				d3.selectAll('.subunit').style('fill', null)
				mainMap.classed('blanco', false)
				// remove all elements inside the tooltip
				$('.tooltip').empty();
				toolTip.style('display', 'none');
			}
		}

		// function that colours the country and shows the tooltip for western europe
		function showInformationWesternEurope() {
			if (mainMap.attr('class') == 'wave third-wave') {
				westernEurope.forEach(function(area) {
					highlightArea(area, 'third-wave')
				});
				showToolTip('Western Europe', popUpTexts.westernEurope);
			}
		}

		// function that colours the country and shows the tooltip for scandinavia
		function showInformationScandinavia() {
			if (mainMap.attr('class') == 'wave third-wave') {
				scandinavia.forEach(function(area) {
					highlightArea(area, 'third-wave')
				})
				showToolTip('Scandinavia', popUpTexts.scandinavia);
			}
		}

		// function that colours the country and shows the tooltip for the arabian peninsula
		function showInformationArabPeninsula() {
			if (mainMap.attr('class') == 'wave first-wave') {
				arabPeninsulaAndEthiopia.forEach(function(area) {
					highlightArea(area, 'first-wave')
				});
				showToolTip('Ethiopia and the Arabian Peninsula', popUpTexts.arabPeninsula);
			}
		}

		// function to create the tooltip for the fourth wave
		function showToolTip2(path, country, introduction, tasteProfile, varieties, production) {
			highlightArea(path, 'fourth-wave');
			// add headers and text elements from json to tooltip
			toolTip
				.style('display', 'block');
			toolTip.append('h4')
				.text(country);
			toolTip.append('h5')
				.text('Introduction');
			toolTip.append('p')
				.text(introduction);
			toolTip.append('h5')
				.text('Taste profile');
			toolTip.append('p')
				.text(tasteProfile);
			toolTip.append('h5')
				.text('Varieties');
			toolTip.append('p')
				.text(varieties);
			toolTip.append('h5')
				.text('Production of 60kg bags (2013)');
			toolTip.append('p')
				.text(production);
			// location of tooltip, flip if on right side
			if (d3.event.pageX < window.innerWidth / 2) {
				toolTip
					.style('left', (d3.event.pageX) + 'px')
			}
			if (d3.event.pageX >= window.innerWidth / 2) {
				toolTip
					.style('left', (d3.event.pageX) - WIDTH.largeMap * 3 / 5 + 'px')
			}
			toolTip
				.style('top', (d3.event.pageY) - 200 + 'px')
				.style('display', 'block');
		}

		// function that links information to the specific country
		function linkInfoCountry(countries, country, path) {
			// information to be shown in the tooltip
			var introduction = countries[country]['Introduction'];
			var tasteProfile = countries[country]['Taste profile'];
			var varieties = countries[country]['Varieties'];
			var production = countries[country]['Number of 60kg bags (2013)'];

			// link information to tooltip
			d3.select('.dropdown-menu').append('li')
				.attr('class', 'dropdown-menu-input')
				.text(country)
				.on('mouseover', function() {
					// showToolTip2(path, country, introduction, tasteProfile, varieties, production)
					d3.select(this).classed('mouse-over-button', true);
				})
				.on('mouseout', function() {
					// clearInformation('fourth-wave', path);
					d3.select(this).classed('mouse-over-button', false);
				})
				.on('click', function() {
					if (toolTip.style('display') == 'block') {clearInformation('fourth-wave', path)}
					else {showToolTip2(path, country, introduction, tasteProfile, varieties, production)}
				});
				// stop collapsing of dropdown menu if a country is clicked, only collapse if menu header is clicked
				$('.dropdown-menu-input').click(function(e) {
            		e.stopPropagation()});

			// show tooltip on mouseover country
			path.on('mouseover', function() {
				if (mainMap.attr('class') == 'wave fourth-wave') {
					showToolTip2(path, country, introduction, tasteProfile, varieties, production);
				}
			});
		}
		// werkt nog niet , ene landje blijft nog hangen.
		d3.select('body').on('click', function() {
			if (d3.select('#dropdownMenu1').attr('aria-expanded') == 'true' && mainMap.attr('class') == 'wave fourth-wave blanco') {
				$('.tooltip').empty();
				toolTip.style('display', 'none');
				mainMap.classed('blanco', false);
				d3.selectAll('.subunit').style('fill', null)
			}
		})

		// >>--------------- import second data set and add the event listeners to the countries ----------------<<

		// import the data for coffee producing countries to add to the fourth wave map
		d3.json('data_files/coffee_countries.json', function(error, data) {
			var countries = data['Coffee Producing Countries'];
			coffeeCountries.forEach(function(country) {
				// skip yemen and ethiopia because they will get the .on(mousover) later in the code, skip hawaii due to irrelevance
				if (country != 'Yemen' && country != 'Ethiopia' && country != 'Hawaii') {
					var path = mainMap.select('.code' + countries[country]['Country code']);
					linkInfoCountry(countries, country, path);
					path.on('mouseout', function() {
						clearInformation('fourth-wave', path);
					});
				}
			});

			// on mouseover france
			france.on('mouseover', function() {
				showInformation('first-wave', france, 'France', popUpTexts.france);
			});
			france.on('mouseout', clearInformation);

			// on mouseover united states
			unitedStates.on('mouseover', function() {
				showInformation('second-wave', unitedStates, 'United States', popUpTexts.unitedStatesSecond);
				showInformation('third-wave', unitedStates, 'United States', popUpTexts.unitedStatesThird);
			});
			unitedStates.on('mouseout', clearInformation);

			// on mouseover italy
			italy.on('mouseover', function() {
				showInformation('second-wave', italy, 'Italy', popUpTexts.italy);
			});
			italy.on('mouseout', clearInformation);

			// on mouseover japan
			japan.on('mouseover', function() {
				showInformation('third-wave', japan, 'Japan', popUpTexts.japan);
			});
			japan.on('mouseout', clearInformation);

			// on mouseover australia
			australia.on('mouseover', function() {
				showInformation('third-wave', australia, 'Australia', popUpTexts.australia);
			});
			australia.on('mouseout', clearInformation);

			// on mouseover netherlands
			netherlands.on('mouseover', function(westernEurope) {
				showInformationWesternEurope(westernEurope);
				showInformation('first-wave', netherlands, 'The Netherlands', popUpTexts.netherlands);
			});
			netherlands.on('mouseout', clearInformation);

			// on mouseover arabian peninsula and ethiopia
			ethiopia.on('mouseover', function() {
				if (mainMap.attr('class') == 'wave fourth-wave') {
					var country = 'Ethiopia';
					var path = mainMap.select('.code' + countries[country]['Country code']);
					linkInfoCountry(countries, country, path);
				}
				showInformationArabPeninsula();
			});
			
			ethiopia.on('mouseout', clearInformation);

			yemen.on('mouseover', function() {
				if (mainMap.attr('class') == 'wave fourth-wave') {
					var country = 'Yemen';
					var path = mainMap.select('.code' + countries[country]['Country code']);
					linkInfoCountry(countries, country, path);
				}
				showInformationArabPeninsula();
			});
			yemen.on('mouseout', clearInformation);

			saoudiArabia.on('mouseover', showInformationArabPeninsula);
			saoudiArabia.on('mouseout', clearInformation);

			oman.on('mouseover', showInformationArabPeninsula);
			oman.on('mouseout', clearInformation);

			unitedArabEmirates.on('mouseover', showInformationArabPeninsula);
			unitedArabEmirates.on('mouseout', clearInformation);

			scandinavia.forEach(function(area) {
				area.on('mouseover', showInformationScandinavia);
				area.on('mouseout', clearInformation);
			});

			// on mouseover western europe
			greatBritain.on('mouseover', function() {
				showInformationWesternEurope();
			});
			greatBritain.on('mouseout', clearInformation);

			germany.on('mouseover', function() {
				showInformationWesternEurope()
			});
			germany.on('mouseout', clearInformation);

			belgium.on('mouseover', function() {
				showInformationWesternEurope();
			});
			belgium.on('mouseout', clearInformation);
		});
	});
}