let dmAPI = {
	runOnReady: (functionName, callback) => {
		if (functionName) {
			callback();
		} else {
			console.error("Please Enter Function Name!");
		}
	},
	loadScript: (url, callback) => {
		var fjs = document.getElementsByTagName("script")[0];
		script = document.createElement("script");
		script.src = url;
		fjs.parentNode.insertBefore(script, fjs);
		if (script.readyState) { //IE
			script.onreadystatechange = function () {
				if (script.readyState == "loaded" ||
					script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else { //Others
			script.onload = function () {
				callback();
			};
		}
		script.src = url;
		fjs.parentNode.insertBefore(script, fjs);
	}
};

let element = $('.widget-abc123');
let data = {
	config: {
		spreadsheet: "https://docs.google.com/spreadsheets/d/1HBK_2zLPspYDgOhhpa3M8CQbMtCAnnnKz8ETZthPWWg/edit?usp=sharing",
		button_text: "Read More"
	}
};

let spreadsheet = data.config.spreadsheet;
let sheet = spreadsheet.substring(spreadsheet.indexOf('d/') + 2).replace('/edit?usp=sharing', '');
let sheetDetails = {
	sheetid: sheet,
	sheetname: data.config.sheetname ? data.config.sheetname : "Sheet1",
	apikey: data.config.apikey ? data.config.apikey : "AIzaSyAO95R71N7Ha4Z8smai-y23QuKE2Rrq4U0"
};

// WIDGET VARIABLES
let button_text = data.config.button_text;
let headerHeight = $('.dmHeaderContainer').css("position") == "fixed" ? parseFloat($('.dmHeaderContainer').outerHeight()) : 0;
// let scrollTo = $(element).offset().top - header_height - 20;
let scrollTo = 0;
let search_query = {};

dmAPI.runOnReady('init', function () {
	dmAPI.loadScript('https://irt-cdn.multiscreensite.com/8914113fe39e47bcb3040f2b64f71b02/files/uploaded/paginates.min.js', function () {
		let responseData = new Collection(sheetDetails).response();
		responseData.then(function (resp) {
			// Add 1st Dropdown
			let level = new Create(resp).dropdown('category');
			$(element).find(".pc-Dropdown-Level").html(`<option disabled selected value="">Select Category</option>${level}`);
			// Add 2nd Dropdown
			let tags = new Create(resp).dropdown('tags');
			$(element).find(".pc-Dropdown-Tags").html(`<option disabled selected value="">Select Tags</option>${tags}`);

			// Add Pagination
			pagination(resp);
			search_query.all = resp;
		});
	});
});

function pagination(obj) {
	$(element).find('.pc-Panel-Items').pagination({
		dataSource: new Create(obj).shuffle(),
		pageSize: 6,
		callback: function (data, pagination) {
			let structured = data.length != 0 ? new Create().item_structure(data) : `
			<div class="pc-No-Result">
				<i class="fas fa-exclamation-circle pc-No-Result-Icon"></i>
				<div class="pc-No-Result-Text">No results found!</div>
			</div>`;
			$(element).find('.pc-Items-Container').html(structured);
			let is_even = data.length % 3 != 2 ? '' : '<div class="pc-Container-Item pc-Container-Item-Filler"></div>';
			$(element).find('.pc-Items-Container').append(is_even);
		},
		afterPageOnClick: function () {
			window.scrollTo({
				top: scrollTo,
				behavior: 'smooth'
			});
		},
		afterNextOnClick: function () {
			window.scrollTo({
				top: scrollTo,
				behavior: 'smooth'
			});
		},
		afterPreviousOnClick: function () {
			window.scrollTo({
				top: scrollTo,
				behavior: 'smooth'
			});
		}
	});
}

function Create(obj) {
	this.item_structure = (internal_obj) => {
		let obj_ = internal_obj ? internal_obj : obj;
		return obj_.map(i => {
			return `<div class="pc-Container-Item" data-level="${i.category}">
			<div class="pc-Item-Name">${i.name}</div>
			<div class="pc-Item-Image">
				<div class="pc-Image-Container">
					<img src="${i.image}" alt="${i.name}">
				</div>
			</div>
			<div class="pc-Item-Info">
				<div class="pc-Info-Description">${i.description}</div>
			</div>
			<div class="pc-Item-Footer">
				<div class="pc-Item-Preview">
					<a href="${i.link}">${button_text} <i class="fa-solid fa-caret-right"></i></a>
				</div>
			</div>
		</div>`;
		}).join("");
	};

	this.dropdown = (key) => {
		let newObj = obj.map(i => {
			return i[key].split(",").map(j => {
				return j.trim();
			});
		}).flat();
		var uniqueItems = Array.from(new Set(newObj));
		return `<option value="">All</option>` + uniqueItems.sort((a, b) => {
			return a > b ? 1 : -1;
		}).map(i => {
			return `<option value="${i}">${i}</option>`;
		}).join('');
	};

	this.sort = (key) => {
		return obj.sort((a, b) => a[key] < b[key] ? -1 : 1);
	};


	this.search = () => {
		let level_filter = $(element).find('.pc-Dropdown-Level').val();
		let tags_filter = $(element).find('.pc-Dropdown-Tags').val();
		let search_bar = $(element).find(".pc-Search-Input").val();

		let filters = {
			category: level_filter ? level_filter : "",
			tags: tags_filter ? tags_filter : "",
			name: search_bar ? search_bar : ""
		};
		return multiFilter(obj, filters);
	};
	this.shuffle = () => {
		var currentIndex = obj.length,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[obj[currentIndex], obj[randomIndex]] = [
				obj[randomIndex], obj[currentIndex]
			];
		}

		return obj;
	};
	return this;

	function multiFilter(obj, filters) {
		const filterKeys = Object.keys(filters);
		return obj.filter(function (eachObj) {
			return filterKeys.every(function (eachKey) {
				if (!filters[eachKey].length) {
					return true; // passing an empty filter means that filter is ignored.
				}
				return eachObj[eachKey].toLowerCase().includes(filters[eachKey].toLowerCase());
			});
		});
	}


}

const includedSearch = ['name'];

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
			let included = header.filter(a => includedSearch.includes(a.replace(/[^A-Za-z]+/g, "").toLowerCase()));

			return values.map(i => {
				let items = {};
				header.map((k, index) => {
					items[removeSpecial(k.toLowerCase())] = i[index];
				});
				items.keyword = included.map(b => items[b.replace(/[^A-Za-z]+/g, "").toLowerCase()].toLowerCase()).join(",");
				return items;
			});
		});
	};
	return this;

	function removeSpecial(str) {
		let pattern = str.replace(/[^A-Z0-9]/ig, ``);
		return pattern;
	}
}


// ! USER EVENTS
// Search Bar Input
$(element).find(".pc-Search-Input").keyup(function (e) {
	let value = $(this).val();
	$(element).find(".pc-Search-Icon").addClass("pc-Search-Icon-Active");
	if (value == "") {
		$(element).find(".pc-Search-Icon").removeClass("pc-Search-Icon-Active");
	}
	let searched = new Create(search_query.all).search();
	pagination(searched);
});

// More Filters
$(element).find(".pc-Filters-More").click(function () {
	$(element).find(".pc-Filters-Advance").toggleClass("pc-Filters-Advance-Active");
	let more_text = $(element).find(".pc-Filters-Advance").hasClass("pc-Filters-Advance-Active") ? "Hide Filters" : "More Filters";
	let icon = $(element).find(".pc-Filters-Advance").hasClass("pc-Filters-Advance-Active") ? "up" : "down";
	let this_text = `<span class="pc-More-Text">${more_text}</span>
	<i class="fa-solid fa-caret-${icon}"></i>`;
	$(this).html(this_text);
});

// Dropdown Filter
$(element).find(".pc-Dropdown-Select").change(function () {
	let searched = new Create(search_query.all).search();
	pagination(searched);
});

// Clear Search Bar
$(element).find(".pc-Search-Icon").click(function () {
	$(this).removeClass("pc-Search-Icon-Active");
	$(element).find(".pc-Search-Input").val("");
	pagination(search_query.all);
});

// Clear Filter Button
$(element).find('.pc-Advance-Clear').click(function () {
	$(element).find('.pc-Dropdown-Level').val("");
	$(element).find('.pc-Dropdown-Tags').val("");
	$(element).find(".pc-Search-Input").val("");
	$(element).find(".pc-Search-Icon").removeClass("pc-Search-Icon-Active");
	pagination(search_query.all);
});

css_resource('https://cdnjs.cloudflare.com/ajax/libs/paginationjs/2.1.4/pagination.css', 'paginationCss');
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