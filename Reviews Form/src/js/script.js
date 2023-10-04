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

let company_name = data.config.company_name;
dmAPI.runOnReady("Widget_Initialization", function () {
	new Run({
		action: "Get Record",
	}).ajax().then(function (response) {
		let resp = JSON.parse(response).response.records;
		console.log(resp)
		let reviews = new Create(resp).review_structure();
		$(element).find(".reviewsTable-Section-Container").html(reviews)
	});
});

$(element).find('.reviewsForm-Panel-Button').click(function () {
	let author = $(element).find('.reviewsForm-Name-Input').val()
	let review = $(element).find('.reviewsForm-Panel-Review').val()
	let rating = $(element).find('.reviewsForm-Name-Rating input:checked').val();

	let reviews = {
		"records": [{
			"fields": {
				"Author": author,
				"Review": review,
				"Rating": parseInt(rating)
			}
		}]
	};

	new Run({
		action: "Create Record",
		review_obj: reviews
	}).ajax().then(function (response) {
		alert("Posted!")
		console.log(response);
	});
});


function Create(obj) {
	let $this = this;
	this.review_structure = function () {
		return obj.filter(i => i.fields['Status'] == "Accepted").map(i => {
			return `<div class="reviewsTable-Panel-Container">
				<div class="reviewsTable-Panel-Name">
					<div class="reviewsTable-Name-Author">${i.fields['Author']}</div>
					<div class="reviewsTable-Name-Rating">
						${$this.star_rating(i.fields['Rating'])}
					</div>
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
}

function Run(obj) {
	let $this = this;
	this.ajax = function () {
		let ajax_settings = {
			url: "src/php/actions.php",
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