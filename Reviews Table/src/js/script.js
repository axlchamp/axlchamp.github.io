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

let global_data = {};

let company_name = data.config.company_name;
dmAPI.runOnReady("Widget_Initialization", function () {
	new Run({
		action: "Get Record",
	}).ajax().then(function (response) {
		let resp = JSON.parse(response).response.records;
		let reviews = new Create(resp).review_structure();
		$(element).find(".reviewsTable-Section-Container").html(reviews)
	});
});

function Create(obj) {
	let $this = this;
	this.review_structure = function () {
		return obj.filter(i => i.fields['Status'] == "Accepted").map(i => {
			let raw_date = new Date(i.fields['Timestamp']);
			let date = `${raw_date.getMonth()+1}/${raw_date.getDate()}/${raw_date.getFullYear()}`

			return `<div class="reviewsTable-Panel-Container">
				<div class="reviewsTable-Panel-Name">
					<div class="reviewsTable-Name-Author">
						<div class="reviewsTable-Author-Initial">${i.fields['Author'].charAt(0).toUpperCase()}</div>
						<div class="reviewsTable-Author-Full"><span>${i.fields['Author']}</span><span class="reviewsTable-Full-Date">${date}</span></div>
					</div>
				</div>
				<div class="reviewsTable-Panel-Title">
					${i.fields['Categories']}
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