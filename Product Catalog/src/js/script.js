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
		show_popup: false,
		list: [{
			name: "Stethoscopes",
			image: "https://cdn.britannica.com/29/123229-050-4EE13335/stethoscopes-rubber-tubing-sounds-patient-ears-physician.jpg",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			tags: "Tag 1, Tag 2",
			category: "",
			condition: "New",
			manufacturer: "Americomp",
		}, {
			name: "MRI Scanner",
			image: "https://media.istockphoto.com/id/882991370/photo/mri-scanner.jpg?s=612x612&w=0&k=20&c=W9yNP1GNbIAdTnhWxid7Hl6eJ9f5h3lMtH43_6gRkdI=",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			tags: "Tag 1, Tag 3",
			category: "",
			condition: "Used",
			manufacturer: "Barco",
		}, {
			name: "X-Ray",
			image: "https://www.wolverson.uk.com/wp-content/uploads/2018/11/Visaris-Vision-U-Dr-Imaging-Equipment-3-Wolverson-X-Ray-Limited.jpg",
			description: "Imaging Accessories",
			tags: "Tag 1, Tag 2",
			category: "",
			condition: "New",
			manufacturer: "Wolverson",
		}, {
			name: "OP 3D Pro",
			image: "https://www.wolverson.uk.com/wp-content/uploads/2019/06/OP-3D-Pro-Dental-Xray-Machine-Wolverson-Xray-Limited.jpg",
			description: "Imaging Accessories",
			tags: "Tag 1, Tag 2",
			category: "",
			condition: "New",
			manufacturer: "Wolverson",
		}, {
			name: "Dymedso Frequencer Secretolysis",
			image: "https://inspiration-medical.de/media/image/fe/47/78/Frequencer3bqJtNhD8PdwI.jpg",
			description: "Imaging Accessories",
			tags: "Tag 1, Tag 2",
			category: "",
			condition: "New",
			manufacturer: "Dymedso",
		}]
	}
};


// WIDGET VARIABLES
let list = data.config.list;
let show_popup = data.config.show_popup;
let headerHeight = $('.dmHeaderContainer').css("position") == "fixed" ? parseFloat($('.dmHeaderContainer').outerHeight()) : 0;
// let scrollTo = $(element).offset().top - header_height - 20;
let scrollTo = 0;
let search_query = {};

dmAPI.runOnReady('init', function () {
	dmAPI.loadScript('https://irt-cdn.multiscreensite.com/8914113fe39e47bcb3040f2b64f71b02/files/uploaded/paginates.min.js', function () {
		let resp = new Collection(list).data();

		// Category
		let category = new Create(resp).checkbox('category');
		$(element).find(".pc-Filters-Container[data-container=category] .pc-Container-Checkbox").html(`${category}`);
		// Condition
		let condition = new Create(resp).checkbox('condition');
		$(element).find(".pc-Filters-Container[data-container=condition] .pc-Container-Checkbox").html(`${condition}`);
		// Manufacturer
		let manufacturer = new Create(resp).checkbox('manufacturer');
		$(element).find(".pc-Filters-Container[data-container=manufacturer] .pc-Container-Checkbox").html(`${manufacturer}`);

		// Add Pagination
		pagination(resp);
		search_query.all = resp;

	});
});

function pagination(obj) {
	$(element).find('.pc-Panel-Items').pagination({
		dataSource: obj,
		pageSize: 9,
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
			return `<div class="pc-Container-Item" style="background-image:url(${i.image})">
			<div class="pc-Item-Image">
				<div class="pc-Image-Container">
					<img src="${i.image}" alt="${i.name}">
				</div>
			</div>
			<div class="pc-Item-Info">
				<div class="pc-Info-Text">
					<div class="pc-Info-Name">${i.name}</div>
					<div class="pc-Info-Description">${i.category}</div>
				</div>
				<div class="pc-Info-Icon" data-id="${i.id}">
					<i class="fa-solid fa-circle-info"></i>
				</div>
			</div>
		</div>`;
		}).join("");
	};

	this.checkbox = (key) => {
		let newObj = obj.map(i => {
			return i[key].split(",").map(j => {
				return j.trim();
			});
		}).flat();
		var uniqueItems = Array.from(new Set(newObj));
		return uniqueItems.sort((a, b) => {
			return a > b ? 1 : -1;
		}).map(i => {
			return `<div class="pc-Checkbox-Input">
				<input id="item-${i.replaceAll(" ","")}" type="checkbox" value="${i}">
				<label for="item-${i.replaceAll(" ","")}">${i}</label>
			</div>`;
		}).join('');
	};

	this.sort = (key) => {
		return obj.sort((a, b) => a[key].toLowerCase() < b[key].toLowerCase() ? -1 : 1);
	};


	this.search = () => {
		let category_filter = $(element).find('.pc-Filters-Container[data-container=category] input');
		let condition_filter = $(element).find('.pc-Filters-Container[data-container=condition] input');
		let manufacturer_filter = $(element).find('.pc-Filters-Container[data-container=manufacturer] input');

		let ctg_filtered = validate_check(category_filter);
		let cdn_filtered = validate_check(condition_filter);
		let mnf_filtered = validate_check(manufacturer_filter);

		// let item_category = getChecked(ctg_filtered, "category");
		// let item_condition = getChecked(cdn_filtered);
		// let item_manufacturer = getChecked(mnf_filtered);

		let category = ctg_filtered.length > 0 ? getChecked(obj, ctg_filtered, "category") : obj;
		let condition = cdn_filtered.length > 0 ? getChecked(category, cdn_filtered, "condition") : category;
		let manufacturer = mnf_filtered.length > 0 ? getChecked(condition, mnf_filtered, "manufacturer") : condition;

		return manufacturer;
	};

	return this;

	function validate_check(el) {
		let check_item = [];
		el.filter(function () {
			if ($(this).is(":checked")) {
				check_item.push($(this).val());
			}
		});
		return check_item;
	}

	function getChecked(items, filter, key) {
		return items.filter(i => {
			return filter.find(j => {
				return i[key].split(",").find(k => {
					return k.toLowerCase().includes(j.toLowerCase()) || j.toLowerCase().includes(k.toLowerCase());
				});
			});
		});
	}

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

	function shuffle(array) {
		var currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]
			];
		}

		return array;
	}
}

function Collection(collection) {
	this.data = () => {
		return collection.map((i, index) => {
			let item = {};
			Object.keys(i).filter(j => {
				item[removeSpecial(j).toLowerCase()] = typeof i[j] == "object" ? i[j].href : this.removeExtra(i[j]);
			});
			item.keyword = Object.keys(i).map(k => i[k]).join(',');
			item.id = index;
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


// ! USER EVENTS
// Dropdown Filter
$(element).find('.pc-Panel-Filters').on("change", ".pc-Checkbox-Input input", function () {
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
$(element).find('.pc-Filters-Clear').click(function () {
	$(element).find(".pc-Container-Checkbox input").prop("checked", false);
	pagination(search_query.all);
});

// Open Modal

$(element).on("click", ".pc-Info-Icon", function (e) {
	$(element).find(".pc-Main-Modal").fadeIn().css("display", "flex");
	let id = $(this).attr("data-id");
	let selected_modal = search_query.all[id];
	console.log(selected_modal)
	if (!show_popup) {
		window.open(selected_modal.page_item_url, "_self");
		return;
	}

	let name = selected_modal['name'];
	let category = selected_modal['category'];
	let condition = selected_modal['condition'];
	let manufacturer = selected_modal['manufacturer'];
	let description = selected_modal['description'];

	$(element).find(".pc-Details-Name").text(name);
	$(element).find(".pc-Category-Text").text(category);
	$(element).find(".pc-Condition-Text").text(condition);
	$(element).find(".pc-Manufacturer-Text").text(manufacturer);
	$(element).find(".pc-Modal-Description").text(description);
});

// Close Modal
$(element).on("click", ".pc-Modal-Close", function () {
	$(element).find(".pc-Main-Modal").hide();
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