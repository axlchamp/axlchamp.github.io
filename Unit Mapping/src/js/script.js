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
			unit: "PH-A",
			floor: "5",
			bed: "4",
			bath: "3 ½",
			area: "5,000",
			floorplan: "#"
		}, {
			unit: "5A",
			floor: "5",
			bed: "4",
			bath: "3 ½",
			area: "5,000",
			floorplan: "#"
		}, {
			unit: "TH-B",
			floor: "5",
			bed: "4",
			bath: "3 ½",
			area: "5,000",
			floorplan: "#"
		}]

	}
};

let list = data.config.list;

// WIDGET VARIABLES
dmAPI.runOnReady('init', function () {
	dmAPI.loadScript("https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/js/bootstrap.bundle.min.js", function () {
		let responseData = new Collection(list).data();
		let cell_structure = new Create(responseData).cell_structure();
		$(element).find(".propMap-Row-Cell").html(cell_structure);
	});
});

$(element).find(".propMap-Svg-Class").mouseenter(function () {
	$(this).addClass("propMap-Active");
	$(this).next(".propMap-Svg-PE").addClass('propMap-Active');
	let value = $(this).attr("data-unit");
	$(element).find(`.propMap-Cell-Item[data-unit="${value}"]`).addClass("propMap-Unit-Active");
}).mouseleave(function () {
	$(element).find(".propMap-Svg-Class").removeClass("propMap-Active");
	$(element).find(".propMap-Svg-PE").removeClass("propMap-Active");
	$(element).find(`.propMap-Cell-Item`).removeClass("propMap-Unit-Active");
});

$(element).on("mouseenter", ".propMap-Cell-Item", function () {
	$(this).addClass("propMap-Unit-Active");
	let value = $(this).attr("data-unit");
	$(element).find(`.propMap-Svg-Class[data-unit="${value}"],.propMap-Svg-PE[data-unit="${value}"]`).addClass("propMap-Active");
}).on("mouseleave", ".propMap-Cell-Item", function () {
	$(element).find(".propMap-Cell-Item").removeClass("propMap-Unit-Active");
	$(element).find(".propMap-Svg-Class").removeClass("propMap-Active");
	$(element).find(".propMap-Svg-PE").removeClass("propMap-Active");
});

function Create(obj) {
	let $this = this;
	this.cell_structure = function () {
		return obj.map(i => {
			return `<div class="propMap-Cell-Item" data-unit="${i.unit}">
				<div class="propMap-Item-Value" data-header="unit">${i.unit}</div>
				<div class="propMap-Item-Value" data-header="floor">${i.floor}</div>
				<div class="propMap-Item-Value" data-header="bed">${i.bed}</div>
				<div class="propMap-Item-Value" data-header="bath">${i.bath}</div>
				<div class="propMap-Item-Value" data-header="area">${i.area}</div>
				<div class="propMap-Item-Value" data-header="floorplan">${i.floorplan}</div>
			</div>`;
		});
	};
}


// COLLECTION FOR WIDGET LIST
function Collection(collection) {
	this.data = () => {
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