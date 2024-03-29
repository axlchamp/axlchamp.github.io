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
	device: "desktop",
	config: {
		spreadsheet: "https://docs.google.com/spreadsheets/d/1dPbPN5bwv3paxYAkdqtbsJloPG_v7UcOVsZxy93nH9k/edit?usp=sharing"
	}
};

let city_list = {};
let spreadsheet = data.config.spreadsheet;
let sheet = spreadsheet.substring(spreadsheet.indexOf('d/') + 2).replace('/edit?usp=sharing', '');
let sheetDetails = {
	sheetid: sheet,
	sheetname: data.config.sheetname ? data.config.sheetname : "Sheet1",
	apikey: data.config.apikey ? data.config.apikey : "AIzaSyAO95R71N7Ha4Z8smai-y23QuKE2Rrq4U0"
};


// WIDGET VARIABLES

dmAPI.runOnReady('init', function () {
	dmAPI.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.js", function () {
		new Collection(sheetDetails).response().then(location_list => {
			city_list.list = location_list;
			location_list.map(i => {
				$(element).find(`g.svgAus-Pin-City[data-city="${i.city}"]`).addClass("svgAus-Pin-City-Active");
				$(element).find(`g.svgAus-Pin-City[data-city="${i.city}"]`).prev().addClass("svgAus-Pin-City-Active");
				$(element).find(`g.svgAus-Pin-City[data-city="${i.city}"]`).next().addClass("svgAus-Pin-City-Active");
			});
		});
	});
});

$(element).on("mouseenter touchstart", ".svgAus-Pin-City", function (event) {
	if (!$(this).attr("data-city")) return;
	let city = $(this).attr("data-city");
	let filters = {
		city
	};
	let filtered = multiFilter(city_list.list, filters);

	let content_window = new Create(filtered).infowindow();
	$(element).find('.svgAus-Tool-Container').html(content_window);
	let infowindow_height = $(element).find(".svgAus-Container-Infowindow").height() + 30;

	let left = $(this).offset().left - 105;
	let top = $(this).offset().top - infowindow_height;
	if (data.device == "desktop") {
		$(element).find('.svgAus-Tool-Container').css({
			top: top,
			left: left,
			opacity: 1,
			"pointer-events": "none"
		});
	} else {
		$(element).find('.svgAus-Tool-Container').css({
			opacity: 1,
			"pointer-events": "auto"
		});
	}
})
$(element).on("mouseleave touchend", function () {
	$(element).find('.svgAus-Tool-Container').css({
		opacity: 0
	});
});


function Create(obj) {
	let $this = this;
	this.infowindow = function () {
		return obj.map(i => {
			return `<div class="svgAus-Container-Infowindow">
				<div class="svgAus-Infowindow-Title">${i.city}</div>
				<div class="svgAus-Infowindow-street">${i.street}</div>
				<div class="svgAus-Infowindow-city">${i.city}</div>
				<div class="svgAus-Infowindow-stateZip">${i.state}, ${i.postal}</div>
			</div>`;
		}).join("");
	}

}

// COLLECTION FOR WIDGET LIST
function Collection(sheetDetails) {
	this.ajax = function () {
		return $.ajax({
			url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetDetails.sheetid}/values/${sheetDetails.sheetname}?key=${sheetDetails.apikey}`,
		});
	};
	this.response = function () {
		let sheet = this.ajax();
		return sheet.then(resp => {
			let header = resp.values[0];
			let values = resp.values.filter((i, index) => index !== 0);
			return values.map(i => {
				let items = {};
				header.map((k, index) => {
					items[removeSpecial(k.toLowerCase())] = i[index];
				});
				return items;
			});
		});

	};

	function removeSpecial(str) {
		let pattern = str.replace(/[^A-Z0-9]/ig, ``);
		return pattern;
	}
}

function multiFilter(obj, filters) {
	const filterKeys = Object.keys(filters);
	return obj.filter(function (eachObj) {
		return filterKeys.every(function (eachKey) {
			if (!filters[eachKey].length) {
				return true; // passing an empty filter means that filter is ignored.
			}
			return filters[eachKey] == eachObj[eachKey];
		});
	});
}
css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.css', 'slickSliderCSs');
css_resource('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.css', 'slickSliderCSsThemes');
css_resource('https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css', 'bs5CSS');
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