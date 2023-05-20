let data = JSON.parse(atob(getParameterByName("config")));

let element = $('.container-xxl[data-container=main]');
let headerHeight = $('header.header').css("position") == "fixed" ? parseFloat($('header.header').outerHeight()) : 0;
let scrollTo = $(element).offset().top - headerHeight - 20;
let isMobile = mobileCheck();
let api_url = data.config.api_url;
let proxy_url = api_url.includes("sample.json") ? '' : 'https://api.allorigins.win/raw?url='; // Proxy server URL
let layoutType = isMobile ? "grid_layout" : data.config.layout;
let filters_layout = data.config.filters_layout;
let newTab = data.config.newTab;
let hideCount = data.config.hideCount;
let page_size = isMobile ? parseInt(data.config.mobile_page_size) : parseInt(data.config.desktop_page_size);
let getJobs = new Ajax_request(api_url).ajax();
let jobList;

let keyword_init = getParameterByName('keyword') ? decodeURIComponent(getParameterByName('keyword')) : "";
let company_id = data.config.company_id;
// Configuration
let theme = data.config.theme;
let font = data.config.font;

let pagination_position = data.config.pagination_position;
let filter_list = data.config.filter_list;
let design_list = data.config.design_list;

let label_list = data.config.label_list;
let toggles = data.config.toggles;

// Display Jobs Onload
getJobs.then(function (response) {
	new Addscript().loadScript('https://irp-cdn.multiscreensite.com/e70fa563a8d442bc81646ad9d635638a/files/uploaded/fuse.js', function () {
		new Addscript().loadScript('https://irt-cdn.multiscreensite.com/8914113fe39e47bcb3040f2b64f71b02/files/uploaded/paginates.min.js', function () {
			new Addscript().loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js', function () {
				jobList = new Collection().data(response);
				if (!data.config.toggles.search) {
					$('.job-search-active').hide();
				}

				if (hideCount) {
					$(element).find(".job-count-container").addClass('job-count-hidden');
				}
				let filter_param = filter_list.map(i => {
					return `\"${i.field}\":${getParameterByName(i.field) ? `"${decodeURIComponent(getParameterByName(i.field))}"` : '\""'}`;
				}).join(",");
				let filters = JSON.parse(`{${filter_param}}`);

				let param = multiFilter(jobList, filters).filter(i => {
					return i.keyword.toLowerCase().includes(keyword_init.toLowerCase());
				});

				if (keyword_init) {
					$(element).find("#searchKeyword").val(keyword_init);
				}
				//CREATING DYNAMIC FILTER DROPDOWN
				let sorted = filter_list.sort((a, b) => {
					return a.field == "jobcatname" ? -1 : 1;
				}).sort((a, b) => {
					return a.field == "busunitname" ? -1 : 1;
				});
				let filter_dropdown = sorted.map(i => {
					let unique_list = removeDuplicate(jobList.map(a => a[i.field]));
					let dropdown_options = createFilterDropdown(unique_list, i.field);
					// return `<div class="job-fil-wrap" data-filter="${i.field}">
					// 	${i.field=="jobcatname" ? `<div class="job-category"><span>${i.name}</span> <i class="fa-solid fa-angle-down"></i>
					// 	</div>`:""}
					// 	<select class="form-select" name="${i.field}" id="${i.field}" ${i.field=="jobcatname" ? "multiple":""}>
					// 		<option value="" selected disabled hidden>${i.name}</option>
					// 		<option value="select_all">Any</option>
					// 		${dropdown_options}
					// 	</select>
					// </div>`;
					return `<div class="job-fil-wrap" data-filter="${i.field}">
					<select class="form-select" name="${i.field}" id="${i.field}">
						<option value="" selected disabled hidden>${i.name}</option>
						<option value="select_all">Any</option>
						${dropdown_options}
					</select>
				</div>`;
				}).join("");
				let sort_filter = toggles.sorting ? `<div class="job-fil-wrap" data-filter="sort">
					<select class="form-select" name="jobSortType" id="jobSortType">
						<option value="" selected disabled hidden>${label_list.sort_label}</option>
						<option value="atoz">A - Z</option>
						<option value="ztoa">Z - A</option>
						<option value="newest">Newest</option>
						<option value="oldest">Oldest</option>
					</select>
				</div>` : "";
				let dropdowns = `${filter_dropdown}${sort_filter}`;

				$(element).find(".inner-job-fil").html(dropdowns);

				// if (data.device != "mobile") {
				// 	multiSelectWithoutCtrl('#jobcatname');
				// }

				displayFeatJobs(param);

				// if (isMobile) {
				// 	$(element).find('#jobcatname').addClass('job-category-active');
				// }
				$(element).addClass('job-list-active');

				$(element).find(".job-list-wrap-page .paginationjs").css('justify-content', pagination_position);
				if (filters_layout.toLowerCase() == "side") {
					$(element).addClass("main-container-side");
				}
			});
		});
	});
});

$(element).find(".btn.job_search_button").on('click touchstart', function () {
	search_bar($(this).next().find('#searchKeyword'));
});

// $(element).on('click touchstart', '.job-category', function () {
// 	$(element).find("#jobcatname").toggleClass("job-category-active");
// });

// $(element).on('click touch', '#jobcatname option', function () {
// 	$(element).find('.job-fil-wrap select').trigger("change");
// });

// $(element).on("mouseleave", "#jobcatname", function () {
// 	$(element).find("#jobcatname").removeClass("job-category-active");
// });

//ONCHANGE SEARCH
$(element).find('#searchKeyword').keyup(function (event) {
	if (event.keyCode == '13') {
		search_bar($(this));
	}
});

function search_bar(el) {
	let keyword = el.val();

	let result = searchByJobCompKey(jobList, keyword);
	$(element).find('.job-list-wrap').empty();

	PaginationFunction(result);
	let jobCount = result.length;
	$(element).find('.job-count').text(`${jobCount} ${jobCount > 1 ? "Jobs found":"Job found"}.`);
	$(element).find('.jobKey').text(keyword);
	// $(element).find('.jobFeatTitle').hide();
	$(element).find('.form-label[data-label=result]').fadeIn();

}

//ONCLICK RESET
$(element).find('.container-xl[data-button=reset]').click(function () {
	$(element).find('input#searchKeyword').val("");
	displayFeatJobs(jobList);
});

//FILTER ONCHANGE
$(element).on("change", ".job-fil-wrap select", function () {
	let keyword = $(element).find('input#searchKeyword').val();
	let filters = {};

	filter_list.map(i => {
		let value_raw = $(element).find(`#${i.field}`).val();
		let value = "";
		if (value_raw) {
			value = value_raw.includes("select_all") ? "" : value_raw;
		}
		filters[i.field] = value;
	});
	if (keyword) {
		let sortValue = $(element).find('#jobSortType').val();
		let result = searchByJobCompKey(jobList, keyword);
		let filtered = multiFilter(result, filters);

		if (sortValue !== null) {
			let sortedArr;
			switch (sortValue) {
				case 'atoz':
					//Ascending Job Title
					updateJobList(sortAsc(filtered), keyword);
					break;
				case 'ztoa':
					//Descending Job Title
					updateJobList(sortDesc(filtered), keyword);
					break;
				case 'newest':
					//Newest to Oldest Jobs
					updateJobList(sortAscDate(filtered), keyword);
					break;
				default:
					//Oldest to Newest Jobs
					updateJobList(sortDescDate(filtered), keyword);
			}
		} else {
			updateJobList(filtered, keyword);
		}


	} else {
		let filtered = multiFilter(jobList, filters);
		let sortValue = $(element).find('#jobSortType').val();
		if (sortValue !== null) {
			let sortedArr;
			switch (sortValue) {
				case 'atoz':
					//Ascending Job Title
					updateJobList(sortAsc(filtered), keyword);
					break;
				case 'ztoa':
					//Descending Job Title
					updateJobList(sortDesc(filtered), keyword);
					break;
				case 'newest':
					//Newest to Oldest Jobs
					updateJobList(sortAscDate(filtered), keyword);
					break;
				default:
					//Oldest to Newest Jobs
					updateJobList(sortDescDate(filtered), keyword);
			}
		} else {
			updateJobList(filtered, keyword);
		}
	}

});


//FILTER CLEAR
$(element).find('.clear-filter').click(function () {
	$(element).find('.job-fil-wrap select').prop('selectedIndex', 0);
	$(element).find('input#searchKeyword').val("");
	displayFeatJobs(jobList);

});


//SORT JOB VIA TITLE IN ASCENDING ORDER
function sortAsc(arr) {
	return arr.sort((a, b) => a.jobtitle.localeCompare(b.jobtitle));
}

//SORT JOB VIA TITLE IN DESCENDING ORDER
function sortDesc(arr) {
	return arr.sort((a, b) => b.jobtitle.localeCompare(a.jobtitle));
}

//SORT JOB VIA DATE CREATED IN ASCENDING ORDER
function sortAscDate(arr) {
	return arr.sort(function (a, b) {
		return new Date(b.createdate) - new Date(a.createdate);
	});
}

//SORT JOB VIA DATE CREATED IN DESCENDING ORDER
function sortDescDate(arr) {
	return arr.sort(function (a, b) {
		return new Date(a.createdate) - new Date(b.createdate);
	});
}

//UPDATE JOB LIST BASED ON THE FILTERED/SORTED ARRAY
function updateJobList(arr, keyword) {
	$(element).find('.job-list-wrap').empty();
	let str = arr.filter(i => i);
	PaginationFunction(str);
	let jobCount = arr.length;
	$(element).find('.job-count').text(`${jobCount} ${jobCount > 1 ? "Jobs found":"Job found"}.`);
	$(element).find('.jobKey').text(keyword);
	// $(element).find('.jobFeatTitle').hide();
	$(element).find('.form-label[data-label=result]').fadeIn();
}

//CREATE DROPDOWN
function createFilterDropdown(arr, filter) {
	return arr.map(function (i) {
		if (getParameterByName(filter)) {
			return `<option value="${i}" ${i.toLowerCase().includes(getParameterByName(filter).toLowerCase()) ? "selected" : ""}>${i}</option>`;
		} else {
			if (!i) return "";
			return `<option value="${i}" ${i.includes(getParameterByName(filter)) ? "selected" : ""}>${i}</option>`;
		}
	}).join("");
}


//REMOVE DUPLICATE IN ARRAY
function removeDuplicate(arr) {
	return uniqueItems = Array.from(new Set(arr));
}

function removeDuplicates(array, key) {
	return array.reduce(function (arr, item) {
		const removed = arr.filter(function (i) {
			return i[key] !== item[key];
		});
		return [...removed, item];
	}, []);
}

//SEARCH BY JOB KEY
function searchByJobCompKey(arr, keyword) {
	return arr.filter(i => i.keyword.toLowerCase().includes(keyword.toLowerCase()))
}

//DISPLAY FEATURED JOBS
function displayFeatJobs(arr) {
	$(element).find('.job-list-wrap').empty();
	let str = arr.filter(function (i) {
		return i;
	});

	PaginationFunction(str);
	let jobCount = jobList.length;
	$(element).find('.job-count').text(`${jobCount} ${jobCount > 1 ? "Jobs found":"Job found"}.`);
}

//PAGINATION 
function PaginationFunction(jobs) {
	$(element).find('.job-list-wrap-page').pagination({
		dataSource: jobs,
		pageSize: page_size,
		callback: function (result, pagination) {
			let structure = new Layout(result)[layoutType]();
			$(element).find(".job-list-wrap").html(structure);
			new Config().theme(theme);
			new Config().font(font);

			let el_class = {
				search: '#searchKeyword',
				dropdown_filters: '.job-fil-wrap select,.job-category',
				label: '.job-info-label',
				job_title: '.job-title',
				company_name: '.job-company-name',
				location: '.job-loc-wrapper',
				description: '.job-description,.job-desc-wrapper',
				job_details: ".job-details-wrapper>div,.job-info-val",
				button_1: ".job-button-1 button",
				button_2: ".job-button-2 button",
				modal_button_1: ".modal-button-1",
				modal_button_2: ".modal-button-2",
				modal_button_3: ".modal-button-3",
			};

			Object.keys(el_class).map(i => {
				$(element).find(el_class[i]).css({
					"font-size": design_list[i].size,
					"color": design_list[i].color,
					"font-family": design_list[i].font_family,
					"font-weight": design_list[i].font_weight,
					"background-color": design_list[i].background_color,
					"border": design_list[i].border,
				});
			});

			if (result.length % 3 == 2) {
				$(element).find(".job-list-wrap").append(`<div class="job-wrap job-wrap-filler"></div>`);
			}
			$(element).find(".job-list-wrap-page .paginationjs").css('justify-content', pagination_position);
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

//CREATE JOB GRID LAYOUT
function Layout(obj) {
	let $this = this;
	this.grid_layout = () => {
		return obj.map(jobItem => {
			let itemLink1 = `https://recruit.hirebridge.com/v3/ApplicationV2/QuickApply.aspx?cid=${company_id}&jid=${jobItem.joblistid}&bid=1`;
			return `<div class="job-wrap" data-id="${jobItem.joblistid}">
                <div class="inner-job-wrap featJob" data-jobid="${jobItem.joblistid}">
                    <div class="job-head-info">
                        <div class="job-main-info">
                            <div class="job-title">${jobItem.jobtitle}</div>
                            <div class="job-company-name">${jobItem.companyname}</div>
                        </div>
                    </div>
                    <div class="job-loc-wrapper">
                        ${jobItem.joblocname}, ${jobItem.jobloc}
                    </div>
                    <div class="job-details-wrapper" style="display:${toggles.job_details ? "":"none"}">
                        <div class="job-type-name">${jobItem.jobtypename}</div>
                        <div class="job-function-name">${jobItem.jobfunctionname}</div>
                        <div class="job-cat-name">${jobItem.jobcatname}</div>
                    </div>
                    <div class="job-desc-wrapper" style="display:${toggles.description ? "":"none"}">
                        ${jobItem.description.replaceAll(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, " ")} 
                    </div>

					<div class="job-bottom-details">
						<div class="btn-toolbar job-list-buttons" role="toolbar" aria-label="Toolbar with button groups">
							<div class="btn-group me-2 job-button-1" role="group" aria-label="First group" style="display:${label_list.button_1.show ? "":"none"}">
								<a href="${itemLink1}" ${newTab == true ? 'target="_blank"' : '_self'}>
									<button type="button" class="btn btn-primary">${label_list.button_1.text}</button>
								</a>
							</div>
							<div class="btn-group job-button-2" role="group" aria-label="Second group" style="display:${label_list.button_2.show ? "" : "none"}">
								<button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#job-${jobItem.joblistid}">${label_list.button_2.text}</button>
							</div>
						</div>
						<div class="job-posted-date btn-group" role="group" aria-label="Third group"  style="display:${toggles.job_posted ? "":"none"}">
							<div class="job-date">
								<div class="job-info-label">Job Posted:</div>
								<div class="job-info-val">${jobItem.createdate}</div>
							</div>
						</div>
					</div>

					<!-- Modal -->
					<div class="modal fade" id="job-${jobItem.joblistid}" tabindex="-1" aria-labelledby="job-${jobItem.joblistid}-label" aria-hidden="true">
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header">
									<h1 class="modal-title fs-5" id="job-${jobItem.joblistid}-label">${jobItem.jobtitle}</h1>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body">
									<div class="modal-footer">
										<a href="${itemLink1}" ${newTab == true ? 'target="_blank"' : '_self'}>
											<button type="button" class="btn btn-secondary modal-button-1">${label_list.modal_button_1.text}</button>
										</a>
										<button type="button" class="btn btn-primary modal-button-2" data-bs-toggle="modal" data-bs-target="#job-${jobItem.joblistid}-req">${label_list.modal_button_2.text}</button>
									</div>
									<div class="job-modal-skills">${jobItem.description}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal fade" id="job-${jobItem.joblistid}-req" tabindex="-1" aria-labelledby="job-${jobItem.joblistid}-label-req" aria-hidden="true">
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header">
									<h1 class="modal-title fs-5" id="job-${jobItem.joblistid}-label-req">${jobItem.jobtitle}</h1>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body">


									<div class="modal-footer">
										<a href="${itemLink1}" ${newTab == true ? 'target="_blank"' : '_self'}>
											<button type="button" class="btn btn-secondary modal-button-1">${label_list.modal_button_1.text}</button>
										</a>
										<button type="button" class="btn btn-primary modal-button-3" data-bs-toggle="modal" data-bs-target="#job-${jobItem.joblistid}">${label_list.modal_button_3.text}</button>
									</div>
									<div class="job-modal-skills">${jobItem.skills}</div>
								</div>
							</div>
						</div>
					</div>
                </div>
            </div>`;
		}).join("");
	};
	this.list_layout = () => {
		return obj.map(jobItem => {
			let itemLink1 = `https://recruit.hirebridge.com/v3/ApplicationV2/QuickApply.aspx?cid=${company_id}&jid=${jobItem.joblistid}&bid=1`;
			return `<div class="job-wrap2 featuredJob" data-jobid="${jobItem.joblistid}">
                <div class="inner-job-wrap2">
                    ${jobItem.jobFeatured == "true" ? '<div class="featWrapper">FEATURED</div>' : ''}
                    <div class="job-wrap2-col1">
                        <div class="job-title">${jobItem.jobtitle}</div>
                        <div class="job-company-name">${jobItem.companyname}</div>
                        <div class="job-description" style="display:${toggles.description ? "":"none!important"}">${jobItem.description.replaceAll(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, " ")}</div>
						<div class="job-posted-date">
						<div class="job-bottom-details">
							<div class="btn-toolbar job-list-buttons" role="toolbar" aria-label="Toolbar with button groups">
								<div class="btn-group me-2 job-button-1" role="group" aria-label="First group" style="display:${label_list.button_1.show ? "":"none"}">
									<a href="${itemLink1}" ${newTab == true ? 'target="_blank"' : '_self'}>
										<button type="button" class="btn btn-primary">${label_list.button_1.text}</button>
									</a>
								</div>
								<div class="btn-group job-button-2" role="group" aria-label="Second group" style="display:${label_list.button_2.show ? "" : "none"}">
								<button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#job-${jobItem.joblistid}">${label_list.button_2.text}</button>
								</div>
							</div>
							<div class="job-posted-date btn-group" role="group" aria-label="Third group" style="display:${toggles.job_posted ? "" : "none"}">
								<div class="job-date">
									<div class="job-info-label">Job Posted:</div>
									<div class="job-info-val">${jobItem.createdate}</div>
								</div>
							</div>
						</div>
					</div>
                    </div>
                    <div class="job-wrap2-col2">
                        <div class="job-info">
                            <div class="job-info-label">Location:</div>
                            <div class="job-info-val"> ${jobItem.joblocname}, ${jobItem.jobloc}</div>
                        </div>
                        <div class="job-info" style="display:${toggles.job_details ? "":"none"}">
                            <div class="job-info-label">Employment Type:</div>
                            <div class="job-info-val">${jobItem.jobtypename}</div>
                        </div>
                        <div class="job-info" style="display:${toggles.job_details ? "":"none"}">
                            <div class="job-info-label">Sub Type:</div>
                            <div class="job-info-val">${jobItem.jobfunctionname}</div>
                        </div>
                        <div class="job-info" style="display:${toggles.job_details ? "":"none"}">
                            <div class="job-info-label">Category:</div>
                            <div class="job-info-val">${jobItem.jobcatname}</div>
                        </div>
                    </div>

					<!-- Modal -->
					<div class="modal fade" id="job-${jobItem.joblistid}" tabindex="-1" aria-labelledby="job-${jobItem.joblistid}-label" aria-hidden="true">
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header">
									<h1 class="modal-title fs-5" id="job-${jobItem.joblistid}-label">${jobItem.jobtitle}</h1>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body">
									<div class="modal-footer">
										<a href="${itemLink1}" ${newTab == true ? 'target="_blank"' : '_self'}>
											<button type="button" class="btn btn-secondary modal-button-1">${label_list.modal_button_1.text}</button>
										</a>
										<button type="button" class="btn btn-primary modal-button-2" data-bs-toggle="modal" data-bs-target="#job-${jobItem.joblistid}-req">${label_list.modal_button_2.text}</button>
									</div>
									<div class="job-modal-skills">${jobItem.description}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal fade" id="job-${jobItem.joblistid}-req" tabindex="-1" aria-labelledby="job-${jobItem.joblistid}-label-req" aria-hidden="true">
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header">
									<h1 class="modal-title fs-5" id="job-${jobItem.joblistid}-label-req">${jobItem.jobtitle}</h1>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body">


									<div class="modal-footer">
										<a href="${itemLink1}" ${newTab == true ? 'target="_blank"' : '_self'}>
											<button type="button" class="btn btn-secondary  modal-button-1">${label_list.modal_button_1.text}</button>
										</a>
										<button type="button" class="btn btn-primary modal-button-3" data-bs-toggle="modal" data-bs-target="#job-${jobItem.joblistid}">${label_list.modal_button_3.text}</button>
									</div>
									<div class="job-modal-skills">${jobItem.skills}</div>
								</div>
							</div>
						</div>
					</div>
                </div>
            </div>`;
		});
	};
}

function multiSelectWithoutCtrl(elemSelector) {
	let options = [].slice.call(document.querySelectorAll(`${elemSelector} option`));
	options.forEach(function (element) {
		element.addEventListener("mousedown",
			function (e) {
				e.preventDefault();
				element.parentElement.focus();
				this.selected = !this.selected;
				return false;
			}, false);
	});
}


//MULTIFILTER JS
function multiFilter(arr, filters) {
	const filterKeys = Object.keys(filters);
	return arr.filter(function (eachObj) {
		return filterKeys.every(function (eachKey) {
			if (!filters[eachKey].length) {
				return true; // passing an empty filter means that filter is ignored.
			}
			if (typeof filters[eachKey] == "object") {
				return filters[eachKey].includes(eachObj[eachKey]);
			} else {
				return filters[eachKey].toLowerCase().includes(eachObj[eachKey].toLowerCase()) || eachObj[eachKey].toLowerCase().includes(filters[eachKey].toLowerCase());
			}
		});
	});
}

//REMOVE EXTRA HTML P TAGS
function removeExtra(str) {
	let fullText = '';
	if (str && typeof str !== "undefined") {
		if (!str.includes("</p>")) {
			fullText = str;
		} else {
			fullText = str.substring(str.indexOf(">") + 1).replaceAll("</p>", ' ');
		}
	}
	return fullText;
}

//HIDE SHOW RESET ICON IN INPUT
$(element).find('input#searchKeyword').focus(function () {
	$(element).find('.container-xl[data-button=reset]').fadeIn();
});
$(element).find('input#searchKeyword').blur(function () {
	$(element).find('.container-xl[data-button=reset]').fadeOut();
});

//HIDE AND SHOW FILTER CLICK
let filterVisible = false;
$(element).find('.showFilter').click(function () {
	if (filterVisible) {
		$(element).find('.showFilter').text('Show Filter');
		$(element).find('.clear-filter').fadeOut();
		filterVisible = false;
	} else {
		$(element).find('.showFilter').text('Hide Filter');
		$(element).find('.clear-filter').fadeIn();
		filterVisible = true;
	}
});

function Config() {
	this.theme = function (theme) {
		$(element).find(".input-group.mb-3 i,.job-company-name,.jobInfoLabel,.job-filter-wrapper>div,.job-posted-date").css("color", theme);
		$(element).find(".featuredJob .inner-job-wrap2,.featJob,.job-date").css("border-color", theme);
		$(element).find(".paginationjs .paginationjs-pages li.active>a").css("background-color", theme);
		// $(element).find(".paginationjs .paginationjs-pages li").css("border-color", theme);
	};
	this.font = function (font) {
		$(element).find(".jobListingMainWrapper *:not(i)").css("font-family", font);
	};
}

function Addscript() {
	this.loadScript = (url, callback) => {
		const script = document.createElement("script");
		script.src = url;
		const firstScript = document.getElementsByTagName("script")[0];
		firstScript.parentNode.insertBefore(script, firstScript);
		script.onload = callback;
	};
}


function Ajax_request() {
	this.ajax = () => {
		const requestUrl = api_url; // Combined URL with proxy server
		return $.ajax({
			url: requestUrl,
			type: 'GET'
		});
	};
}

function Collection(collection) {
	let $this = this;
	this.data = (response) => {
		return response.map(i => {
			let item = {};
			Object.keys(i).filter(j => {
				if (j == "location") {
					item[removeSpecial(j)] = i[j];
				} else {
					item[removeSpecial(j)] = this.removeExtra(i[j]);
				}
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


//CREATE FONT AWESOME LINK SOURCE


css_resource('https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css', 'bootStrapCSS');
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

function getParameterByName(name, url) {

	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';

	if (results[2].includes("Research%20and%20Development")) {
		return decodeURIComponent("R&D/Quality Assurance/Food Safety".replace(/\+/g, ' '));
	}
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function mobileCheck() {
	let check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
}