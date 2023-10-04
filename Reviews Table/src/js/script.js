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
		company_name: "Lupsa LLC" // data connected
	}
};

let global_data = {
	rating_list: {},
	rating_average: {},
};

let company_name = data.config.company_name;
dmAPI.runOnReady("Widget_Initialization", function () {
	new Run({
		action: "Get Record",
	}).ajax().then(function (response) {
		let resp = JSON.parse(response).response.records.filter(i => i.fields['Status'] == "Accepted");
		global_data.all = resp;
		let reviews = new Create(resp).review_structure();
		$(element).find(".reviewsTable-Reviews-Result").html(reviews);

		let dropdown = new Create(resp).dropdown("Categories");
		$(element).find(".reviewsTable-Options-Value").html(dropdown);

		let reviews_count = resp.length;
		$(element).find(".reviewsTable-Count-Reviews").text(`${reviews_count} Reviews`)

		let reviews_average = (resp.map(i => i.fields["Rating"]).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / reviews_count).toFixed(1);
		$(element).find(".reviewsTable-Value-Text span").text(`${reviews_average}`);
		$(element).find(".reviewsTable-Count-Ratings").text(`${reviews_average} Ratings`);


		$(element).find(".reviewsTable-Base-Container").each(function (e) {
			let count = e + 1;
			global_data.rating_list["rate_" + count] = resp.filter(i => i.fields["Rating"] == count).length;
			global_data.rating_average["rate_" + count] = ((resp.filter(i => i.fields["Rating"] == count).length / resp.length) * 100).toFixed(0);
		});
		console.log(global_data)
		Object.keys(global_data.rating_list).map(i => {
			$(element).find(`.reviewsTable-Base-Container[data-rate="${i.replace("rate_","")}"] .reviewsTable-Container-Count`).text(global_data.rating_list[i])
			$(element).find(`.reviewsTable-Base-Container[data-rate="${i.replace("rate_","")}"] .reviewsTable-Container-Bar`).val(global_data.rating_average[i])
		})
	});
});

$(element).find(".reviewsTable-Container-Dropdown").click(function () {
	$(this).next().toggleClass("show-Options")
});

$(element).on("click", ".reviewsTable-Value-Item", function () {
	let value = $(this).text();
	$(element).find(".reviewsTable-Dropdown-Text").text(value);
	$(this).parents(".reviewsTable-Dropdown-Options").removeClass("show-Options");
	let searched = new Create(global_data.all).search(value);
	let filtered_structure = new Create(searched).review_structure();
	$(element).find(".reviewsTable-Reviews-Result").html(filtered_structure);

});

function Create(obj) {
	let $this = this;
	this.review_structure = function () {
		return obj.map(i => {
			let raw_date = new Date(i.fields['Timestamp']);
			let date = `${raw_date.getMonth()+1}/${raw_date.getDate()}/${raw_date.getFullYear()}`

			return `<div class="reviewsTable-Result-Item">
				<div class="reviewsTable-Panel-Name">
					<div class="reviewsTable-Name-Author">
						<div class="reviewsTable-Author-Initial">${i.fields['Author'].charAt(0).toUpperCase()}</div>
						<div class="reviewsTable-Author-Full"><span>${i.fields['Author']}</span><span class="reviewsTable-Full-Date">${date}</span></div>
					</div>
				</div>
				<div class="reviewsTable-Panel-Title">
					${i.fields['Categories'].join(", ")}
				</div>
				<div class="reviewsTable-Panel-Rating">
					${$this.star_rating(i.fields['Rating'])}
				</div>
				<div class="reviewsTable-Panel-Review">
					${i.fields['Review']}
				</div>
			</div>`;
		});
	};
	this.star_rating = function (rating) {
		let star = '';
		for (let i = 1; i <= 5; i++) {
			star += `<i class="fa-solid fa-star ${i<=rating ? "reviewsTable-Rating-Star-Active ":"" }"></i>`;
		}
		return star;
	}
	this.dropdown = function (key) {
		let newObj = obj.map(i => {
			return i.fields[key].map(j => {
				return j.trim();
			});
		}).flat();
		var uniqueItems = Array.from(new Set(newObj));
		return uniqueItems.sort((a, b) => {
			return a > b ? 1 : -1;
		}).map(i => {
			return `<div class="reviewsTable-Value-Item">${i}</div>`;
		}).join('');
	}
	this.search = function (value) {
		return obj.filter(i => i.fields['Categories'].join(",").toLowerCase().includes(value.toLowerCase()));
	}
}

function Run(obj) {
	let $this = this;
	this.ajax = function () {
		let ajax_settings = {
			url: "https://personalappaxl.000webhostapp.com/reviews/actions.php",
			method: "POST",
			data: JSON.stringify(obj)
		}
		return $.ajax(ajax_settings);
	};
}


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