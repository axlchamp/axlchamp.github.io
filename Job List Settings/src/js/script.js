function Addscript() {
	this.runOnReady = (functionName, callback) => functionName ? callback() : console.error("Please Enter Function Name!");
	this.loadScript = (url, callback) => {
		const script = document.createElement("script");
		script.src = url;
		const firstScript = document.getElementsByTagName("script")[0];
		firstScript.parentNode.insertBefore(script, firstScript);
		script.onload = callback;
	};
}



// WIDGET VARIABLES
new Addscript().runOnReady('init', function () {
	new Addscript().loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js', function () {
		new Addscript().loadScript('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/3.4.0/js/bootstrap-colorpicker.min.js', function () {
			$('.font-selection li button').click(function () {
				let value = $(this).text();
				$(this).parents('.dropdown').next().val(value);
			});

			$('input[type=range]').mousemove(function () {
				let value = $(this).val();
				$(this).next().val(value);
			});

			$('input[type=checkbox]').change(function () {
				let is_checked = $(this).is(":checked");
				$(this).next().find('.checkbox-custom').toggleClass("fa-square fa-square-check");

				if (is_checked) {
					$(this).next().find("input").focus().removeAttr("readonly").addClass("selected_input");
					$(this).next().find("i.fa-pen-to-square").addClass('selected_icon');

				} else {
					$(this).next().find("input").attr("readonly", true).removeClass("selected_input");
					$(this).next().find("i.fa-pen-to-square").removeClass('selected_icon');
				}
			});

			// Filter layout and Job Items Layout
			$('.filter-selector-option li button,.jobitems-selector-option li button').click(function () {
				let value = $(this).attr("data-value");
				let text = $(this).text();
				$(this).parents('ul').prev().text(text).attr("data-value", value);
			});

			$('.color-container input').change(function () {
				let val = $(this).val().includes("#") ? $(this).val() : "#" + $(this).val();
				$(this).next().val(val);
			});

			$('.generate-button').click(function () {
				let company_id = $('#company_id').val();
				let filters_layout = $('#filter-layout-selector').attr("data-value");
				let pagination_position = $('#pagination-position').attr("data-value");
				let layout = $('#jobitems-layout-selector').attr("data-value");
				let desktop_page_size = $('#desktop-count').val();
				let mobile_page_size = $('#mobile-count').val();
				let theme = $('.theme-color-container input').val();
				let font = $('#theme-font-selected').val();

				let apply = $('#apply').val();
				let learnmore = $('#learnmore').val();
				let modal_apply = $('#modal-apply').val();
				let see_req = $('#see-req').val();
				let see_desc = $('#see-desc').val();

				let sort = getChecked($('#jobsort')).length > 0 ? true : false;
				let sort_label = $('#jobsort').next().find("input").val();

				let job_details = $('#job_details_fontweight').is(":checked");
				let description = $('#job_description_fontweight').is(":checked");
				let job_posted = $('#job_job_posted_fontweight').is(":checked");

				let newTab = getChecked($('#newtab')).length > 0 ? true : false;
				// labels
				let button_1 = {
					show: apply !== "",
					text: apply
				};
				let button_2 = {
					show: learnmore !== "",
					text: learnmore
				};
				let modal_button_1 = {
					show: modal_apply !== "",
					text: modal_apply
				};
				let modal_button_2 = {
					show: see_req !== "",
					text: see_req
				};
				let modal_button_3 = {
					show: see_desc !== "",
					text: see_desc
				};

				let checkbox_elements = $('.container[data-container=search_filters] .form-check:not(.newtab-form):not(.searchbar-container):not(.jobsort-container) input[type=checkbox]');
				let filters_check = getChecked(checkbox_elements);
				let filter_list = filters_check.map(i => {
					return {
						field: $('#' + i).val(),
						name: $('#' + i).next().find(".selected_input").val()
					};
				});

				let search_design = {
					size: $('#saf-fontsize').val() + "px",
					color: $('.saf-color-container input').val(),
					font_family: $('#saf-font-selected').val(),
					font_weight: $('#saf-weight').val(),
					background_color: $('.saf-background-color-container input').val()
				};
				let dropdown_filters_design = {
					size: $('#dropdown_filters-fontsize').val() + "px",
					color: $('.dropdown_filters-color-container input').val(),
					font_family: $('#dropdown_filters-font-selected').val(),
					font_weight: $('#dropdown_filters-weight').val(),
					background_color: $('.dropdown_filters-background-color-container input').val()
				};
				let job_title_design = {
					size: $('#job_title-fontsize').val() + "px",
					color: $('.job_title-color-container input').val(),
					font_family: $('#job_title-font-selected').val(),
					font_weight: $('#job_title-weight').val(),
					background_color: $('.job_title-background-color-container input').val()
				};
				let company_name_design = {
					size: $('#company_name-fontsize').val() + "px",
					color: $('.company_name-color-container input').val(),
					font_family: $('#company_name-font-selected').val(),
					font_weight: $('#company_name-weight').val(),
					background_color: $('.company_name-background-color-container input').val()
				};

				let location_design = {
					size: $('#location-fontsize').val() + "px",
					color: $('.location-color-container input').val(),
					font_family: $('#location-font-selected').val(),
					font_weight: $('#location-weight').val(),
					background_color: $('.location-background-color-container input').val()
				};
				let description_design = {
					size: $('#description-fontsize').val() + "px",
					color: $('.description-color-container input').val(),
					font_family: $('#description-font-selected').val(),
					font_weight: $('#description-weight').val(),
					background_color: $('.description-background-color-container input').val()
				};
				let job_details_design = {
					size: $('#job_details-fontsize').val() + "px",
					color: $('.job_details-color-container input').val(),
					font_family: $('#job_details-font-selected').val(),
					font_weight: $('#job_details-weight').val(),
					background_color: $('.job_details-background-color-container input').val()
				};
				let label_design = {
					size: $('#label-fontsize').val() + "px",
					color: $('.label-color-container input').val(),
					font_family: $('#label-font-selected').val(),
					font_weight: $('#label-weight').val(),
					background_color: $('.label-background-color-container input').val()
				};
				let button_1_design = {
					size: $('#button_1-fontsize').val() + "px",
					color: $('.button_1-color-container input').val(),
					font_family: $('#button_1-font-selected').val(),
					font_weight: $('#button_1-weight').val(),
					background_color: $('.button_1-background-color-container input').val()
				};
				let button_2_design = {
					size: $('#button_2-fontsize').val() + "px",
					color: $('.button_2-color-container input').val(),
					font_family: $('#button_2-font-selected').val(),
					font_weight: $('#button_2-weight').val(),
					background_color: $('.button_2-background-color-container input').val()
				};
				let modal_button_1_design = {
					size: $('#modal_button_1-fontsize').val() + "px",
					color: $('.modal_button_1-color-container input').val(),
					font_family: $('#modal_button_1-font-selected').val(),
					font_weight: $('#modal_button_1-weight').val(),
					background_color: $('.modal_button_1-background-color-container input').val()
				};
				let modal_button_2_design = {
					size: $('#modal_button_2-fontsize').val() + "px",
					color: $('.modal_button_2-color-container input').val(),
					font_family: $('#modal_button_2-font-selected').val(),
					font_weight: $('#modal_button_2-weight').val(),
					background_color: $('.modal_button_2-background-color-container input').val()
				};
				let modal_button_3_design = {
					size: $('#modal_button_3-fontsize').val() + "px",
					color: $('.modal_button_3-color-container input').val(),
					font_family: $('#modal_button_3-font-selected').val(),
					font_weight: $('#modal_button_3-weight').val(),
					background_color: $('.modal_button_3-background-color-container input').val()
				};


				let new_code = {
					// API ENDPOINT
					api_url: `https://hbapi.hirebridge.com/v2/CareerCenter/GetJobs?cid=${company_id}`,
					company_id: `${company_id}`,
					// DESIGN AND LAYOUT
					filters_layout, // Top || Side
					layout: layout, // grid_layout or list_layout ( for desktop only )
					desktop_page_size,
					mobile_page_size,
					theme,
					font,
					pagination_position,

					// Elements CSS
					design_list: {
						search: search_design,
						dropdown_filters: dropdown_filters_design,
						job_title: job_title_design,
						company_name: company_name_design,
						location: location_design,
						description: description_design,
						job_details: job_details_design,
						label: label_design,
						button_1: button_1_design,
						button_2: button_2_design,
						modal_button_1: modal_button_1_design,
						modal_button_2: modal_button_2_design,
						modal_button_3: modal_button_3_design,
					},
					// Add or remove dropdown filters
					filter_list,
					label_list: {
						sort_label,
						button_1,
						button_2,
						modal_button_1,
						modal_button_2,
						modal_button_3
					},
					// Toggle to show or hide elements ( true or false)
					toggles: {
						sorting: sort,
						job_details,
						description,
						job_posted,
					},
					newTab
				};

				$('.container[data-container=generated_codes] textarea').val(JSON.stringify({
					"config": new_code
				}));
			});
		});
	});
});

function getChecked(el) {
	let checkedPermission = [];
	el.filter(function () {
		if ($(this).is(":checked")) {
			checkedPermission.push($(this).val());
		}
	});
	return checkedPermission;
}

css_resource('https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css', 'bs5');
css_resource('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/3.4.0/css/bootstrap-colorpicker.css', 'bs5color');
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