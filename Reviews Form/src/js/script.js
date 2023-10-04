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
	dmAPI.loadScript("https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.31/sweetalert2.all.min.js", function () {

	});
});
$(element).find(".reviewsForm-Dropdown-Category").click(function () {
	$(this).next(".reviewsForm-Dropdown-Options").toggleClass("show-Options");
});

$(element).on("click", ".reviewsForm-Value-Item", function () {
	$(this).find("i").toggleClass("fa-solid fa-square-check fa-regular fa-square");
	$(this).toggleClass("reviewsForm-Value-Item-Active");

	let selected = new Get().categories().map(i => {
		return `<span>${i}</span>`
	});
	$(element).find(".reviewsForm-Dropdown-Text").html(selected)
})
$(element).find(".reviewsForm-Dropdown-Options").mouseleave(function () {
	global_data.categories = new Get().categories();
	$(this).removeClass("show-Options");
});

$(element).find(".reviewsForm-Panel-Button").click(function () {
	let author = $(element).find('.reviewsForm-Name-Input').val()
	let review = $(element).find('.reviewsForm-Panel-Review').val()
	let rating = $(element).find('.reviewsForm-Star-Rating input:checked').val();
	let reviews = {
		"records": [{
			"fields": {
				"Author": author,
				"Review": review,
				"Rating": parseInt(rating),
				"Categories": global_data.categories,
				"Timestamp": Date.now()
			}
		}]
	};

	new Run({
		action: "Create Record",
		review_obj: reviews
	}).ajax().then(function (response) {
		let resp = JSON.parse(response);
		if (resp.status) {
			const Toast = Swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
				timerProgressBar: true,
				customClass: {
					container: 'reviewsForm-Swal-Class' // Apply the custom CSS class to the dialog container
				},
				didOpen: (toast) => {
					toast.addEventListener('mouseenter', Swal.stopTimer)
					toast.addEventListener('mouseleave', Swal.resumeTimer)
				}
			})

			Toast.fire({
				icon: 'success',
				title: 'Review Posted!'
			})
		}
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

function Get() {
	let $this = this;
	this.categories = function () {
		let selected_categories = [];
		$(element).find(".reviewsForm-Value-Item").each(function () {
			if ($(this).hasClass("reviewsForm-Value-Item-Active")) {
				selected_categories.push($(this).find("span").text())
			}
		});
		return selected_categories;
	};
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
css_resource('https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.31/sweetalert2.min.css', 'swal2');

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