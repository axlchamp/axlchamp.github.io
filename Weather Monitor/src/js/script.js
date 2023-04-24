const dmAPI = {
	runOnReady: (functionName, callback) => functionName ? callback() : console.error("Please Enter Function Name!"),
	loadScript: (url, callback) => {
		const script = document.createElement("script");
		script.src = url;
		const firstScript = document.getElementsByTagName("script")[0];
		firstScript.parentNode.insertBefore(script, firstScript);
		script.onload = callback;
	}
};

let element = $('.widget-abc123');
let data = {
	config: {
		list: [{
				title: "HOME",
				alias: "home",
				path: "/",
				inNavigation: false,
				subNav: []
			},
			{
				title: "SERVICES",
				alias: "services",
				path: "/services",
				inNavigation: true,
				subNav: ['Inner Page 1', 'Inner Page 2', 'Inner Page 3']
			},
			{
				title: "TEAM",
				alias: "team",
				path: "/team",
				inNavigation: true,
				subNav: []
			},
			{
				title: "PRODUCTS",
				alias: "products",
				path: "/products",
				inNavigation: true,
				subNav: []
			},
			{
				title: "GALLERY",
				alias: "gallery",
				path: "/gallery",
				inNavigation: true,
				subNav: []
			},
			{
				title: "CONTACT",
				alias: "contact",
				path: "/contact",
				inNavigation: true,
				subNav: []
			}
		],
		api_key: "602e2c4489f8e7ced7202c1be4bce66d",
		address:"Lipa City, Batangas",
		lat: "13.9413873",
		long: "121.1450386",
		tempUnit: "metric",
		temperatureLayout: "full",
		tempContent: true,
		weatherContent:true, 
		windSpeed:true, 
		pressure:true, 
		fogvisibility:true, 
		humidity:true, 
		sunContent:true, 
		
	}
};

let list = data.config.list;
let collect = new Collection();

let address = data.config.address;
let lat = data.config.lat;
let long = data.config.long;
let api_key = data.config.api_key;
let tempUnit = data.config.tempUnit;
let temperatureLayout = data.config.temperatureLayout;
let dt = Math.floor(new Date().getTime()/1000.0);

let tempContent = data.config.tempContent;
let astroCredit = data.config.astroCredit;
let astroContent = data.config.astroContent;
let sunContent = data.config.sunContent;
let moonContent = data.config.moonContent;
let weatherContent = data.config.weatherContent;
let windSpeed = data.config.windSpeed;
let pressure = data.config.pressure;
let fogvisibility = data.config.fogvisibility;
let humidity = data.config.humidity;

// WIDGET VARIABLES
dmAPI.runOnReady('init', function () {
	dmAPI.loadScript('https://irt-cdn.multiscreensite.com/5775367238d847b8b62d126ce25c20de/files/uploaded/moment.js', function () {
		$.ajax({
			url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&dt=${dt}&appid=${api_key}&units=${tempUnit}`
		}).then(weatherData => {
			let month = moment.unix(weatherData.current.dt).format('MMMM');
			let year = moment.unix(weatherData.current.dt).format('YYYY');
			let day = moment.unix(weatherData.current.dt).format('dddd');
			let date = moment.unix(weatherData.current.dt).format('Do');
			$(element).find('.wWContainer').fadeIn();
			$(element).find('.wWCurrentTemp p').fadeIn().text(convertTempF(weatherData.current.temp));
			$(element).find('.wWLocation p').fadeIn().text(address);
			$(element).find('.wWCondition p').fadeIn().text(weatherData.current.weather[0].description);
			$(element).find('.day').fadeIn().text(day);
			$(element).find('.month').fadeIn().text(month + ' ' + date + ', ' + year);
			$(element).find('.wWIcon').fadeIn().append(weatherIcon(weatherData.current.weather[0].icon));
			$(element).find('.astroContainer').fadeIn();
			$(element).find('.sunIcon').fadeIn();
			$(element).find('.sunRiseLabel, .sunSetLabel').fadeIn();
			$(element).find('.astroSun .astroDate p').fadeIn().text(day + ' - Sun in ' + address);
			$(element).find('.astroMoon .astroDate p').fadeIn().text(day + ' - Moon in ' + address);
			$(element).find('.sunrise').fadeIn().text(moment.unix(weatherData.daily[0].sunrise).format('h:mm A'));
			$(element).find('.sunset').fadeIn().text(moment.unix(weatherData.daily[0].sunset).format('h:mm A'));
			$(element).find('.windSpeedContent').fadeIn().text(weatherData.current.wind_speed + ' m/s');
			$(element).find('.precipContent').fadeIn().text(Math.round(weatherData.current.pressure) + ' hPa');
			$(element).find('.visibilityContent').fadeIn().text(Math.round(weatherData.current.visibility) / 1000 + ' km');
			$(element).find('.humidityContent').fadeIn().text(weatherData.current.humidity + "%");
			if (temperatureLayout == "full") {
				let full_structure = appendNextWeather(weatherData.daily);
				$(element).find('.wWcolR').html(full_structure).fadeIn();
			}
			/* Medium Layout */
			$(element).find('.medWeatherCity p').text(address);
			$(element).find('.medDate p').text(month + ' ' + date + ', ' + year);
			$(element).find('.medTemp p').text(convertTempF(weatherData.current.temp));
			$(element).find('.medCondition').append(weatherIcon(weatherData.current.weather[0].icon));
			$(element).find('.medWindSpeed').fadeIn().text(weatherData.current.wind_speed + ' m/s');
			$(element).find('.medPrecip').fadeIn().text(Math.round(weatherData.current.pressure) + ' hPa');
			$(element).find('.medFogVis').fadeIn().text(Math.round(weatherData.current.visibility) / 1000 + ' m');
			$(element).find('.medHumid').fadeIn().text(weatherData.current.humidity + "%");
			$(element).find('.medAstroSunrise').fadeIn().text(moment.unix(weatherData.daily[0].sunrise).format('h:mm A'));
			$(element).find('.medAstroSunset').fadeIn().text(moment.unix(weatherData.daily[0].sunset).format('h:mm A'));
			if (temperatureLayout == "medium") {
				let med_structure = appendMedNextWeather(weatherData.daily);
				$(element).find('.medNextWeather').html(med_structure).fadeIn();
			}
			/*END*/
			/*Minimal Layout */
			$(element).find('.minWeatherImg').append(weatherIcon(weatherData.current.weather[0].icon));
			$(element).find('.minWeatherConditionText').fadeIn().text(weatherData.current.weather[0].description);
			$(element).find('.minWeatherTemp').fadeIn().text(convertTempF(weatherData.current.temp));
			$(element).find('.minDateTime').text(month + ' ' + date + ', ' + year);
			$(element).find('.minLocation').text(address);
			/*END*/

			tempContent ? $(element).find('.wWContainer, .medWeatherContainer, .minWeatherContainer').show() : $(element).find('.wWContainer, .medWeatherContainer, .minWeatherContainer').hide();
			sunContent ? $(element).find('.astroSun').show() : $(element).find('.astroSun').hide();
			weatherContent ? $(element).find('.conditionBg').show() : $(element).find('.conditionBg').hide();
			windSpeed ? $(element).find('.windSpeed').show() : $(element).find('.windSpeed').hide();
			pressure ? $(element).find('.precip').show() : $(element).find('.precip').hide();
			fogvisibility ? $(element).find('.visibility').show() : $(element).find('.visibility').hide();
			humidity ? $(element).find('.humidity').show() : $(element).find('.humidity').hide();
			if (!weatherContent && !sunContent) {
				$(element).find('.conditionDetails').hide();
			} else {
				$(element).find('.conditionDetails').show();
			}
		});
	});
});


function appendNextWeather(obj) {
	return obj.map((i, index) => {
		return index < 5 ? `
        <div class="wWTempDateContainer">
            <div class="wWNextCondition">
                <p>${i.weather[0].description}</p>
                <div class="wWNextConditionIcon">${weatherIcon(i.weather[0].icon)}</div>
                <div class="wWNextTempDateContain">
                    <div class="wWrapNextTemp"><p>${convertTempF(Math.round((i.temp.min + i.temp.max) / 2))}</p></div>
                    <div class="wWrapNextDate"><p>${moment.unix(i.dt).format("YYYY-MM-DD")}</p></div>
                    <hr>
                </div>
            </div>
        </div>` : "";
	}).join("");
};

function appendMedNextWeather(obj) {
	return obj.map((i, index) => {
		return index < 5 ? `<div class="dailyContainer">
            <p class="nextDate">${moment.unix(i.dt).format("MMM Do")}</p>
            <div class="nextCondition">${weatherIcon(i.weather[0].icon)}</div>
            <p class="nextTemp">${convertTempF(Math.round((i.temp.min + i.temp.max) / 2))}°</p>
        </div>` : "";
	}).join("");
};

function convertTempF(f) {
	let unit = tempUnit == "metric" ? "C" : tempUnit == "imperial" ? "F" : "K";
	return `${Math.round(f)}°${unit}`;
}

function weatherIcon(obj) {
	const icon = `https://openweathermap.org/img/wn/${obj}@2x.png`;
	return `<img src=${icon} alt="Clear Sky">`;
}


cssLibrary('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', 'fontAwesomeSource');

function cssLibrary(href, id) {
	if (!document.getElementById(id)) {
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.id = id;
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = href;
		link.crossOrigin = 'anonymous';
		head.appendChild(link);
	}
}


// COLLECTION FOR WIDGET LIST
function Collection() {
	this.data = (collection) => {
		return collection.map(i => {
			let item = {};
			Object.keys(i).filter(j => {
				if (i.inNavigation) return j;
				item[removeSpecial(j).toLowerCase()] = typeof i[j] == "object" ? i[j].href : this.removeExtra(i[j]);
			});
			item.keyword = Object.keys(i).map(k => i[k]).join(',');
			return item;
		});
	};
	this.removeExtra = (str) => {
		if (str) {
			return str.includes("</p>") ? str.substring(str.indexOf(">") + 1).replace("</p>", '') : str;
		}
		return str;
	};

	function removeSpecial(str) {
		let pattern = str.replace(/[^A-Z0-9]/ig, ``);
		return pattern;
	}
}

css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css', 'slickSliderCSs');
css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css', 'slickSliderCSsThemes');
css_resource('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', 'fasrc');

function css_resource(href, id) {
	if (!document.getElementById(id)) {
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.id = id;
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = href;
		link.crossOrigin = 'anonymous';
		head.appendChild(link);
	}
}