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
		api_url: "/JobList/src/js/sample.json",
		jobLayout: "gridLayout", // gridLayout || listLayout
		pageSze: "9",
		theme: "red"
	}
};

let headerHeight = $('.dmHeaderContainer').css("position") == "fixed" ? parseFloat($('.dmHeaderContainer').outerHeight()) : 0;
let scrollTo = $(element).offset().top - headerHeight - 20;

let jobs = data.config.api_url;
let layoutType = data.config.jobLayout;
let newTab = data.config.linkNewTab;
let pageSze = parseInt(data.config.pageSze);
let getJobs = new Collection(jobs).ajax();
let jobList;

let jobfunctionname_init = getParameterByName('jobfunctionname') ? decodeURIComponent(getParameterByName('jobfunctionname')) : "";
let jobcatname_init = getParameterByName('jobcatname') ? decodeURIComponent(getParameterByName('jobcatname')) : "";
let joblocname_init = getParameterByName('joblocname') ? decodeURIComponent(getParameterByName('joblocname')) : "";
let jobtypename_init = getParameterByName('jobtypename') ? decodeURIComponent(getParameterByName('jobtypename')) : "";
let keyword_init = getParameterByName('keyword') ? decodeURIComponent(getParameterByName('keyword')) : "";

let theme = data.config.theme;
//DISPLAY FEATURED JOBS ON LOAD
dmAPI.loadScript('https://irp-cdn.multiscreensite.com/e70fa563a8d442bc81646ad9d635638a/files/uploaded/fuse.js', function () {
	dmAPI.loadScript('https://irt-cdn.multiscreensite.com/8914113fe39e47bcb3040f2b64f71b02/files/uploaded/paginates.min.js', function () {
		let filters = {
			jobfunctionname: jobfunctionname_init,
			jobcatname: jobcatname_init,
			joblocname: joblocname_init,
			jobtypename: jobtypename_init,
		};
		let param = multiFilter(jobList, filters).filter(i => {
			return i.keyword.toLowerCase().includes(keyword_init.toLowerCase());
		});
		if (keyword_init) {
			$(element).find("#searchKeyword").val(keyword_init);
		}
		//CREATING DYNAMIC FILTER DROPDOWN
		let jobfunctionname = removeDuplicate(jobList.map(a => a.jobfunctionname));
		let jobcatname = removeDuplicate(jobList.map(a => a.jobcatname));
		let jobtypename = removeDuplicate(jobList.map(a => a.jobtypename));
		let joblocname = removeDuplicate(jobList.map(a => a.joblocname));

		createFilterDropdown(jobfunctionname, 'jobfunctionname');
		createFilterDropdown(jobcatname, 'jobCategory');
		createFilterDropdown(joblocname, 'joblocname');
		createFilterDropdown(jobtypename, 'jobtypename');
		if (data.device != "mobile") {
			multiSelectWithoutCtrl('#jobCategory');
		}

		displayFeatJobs(param);
	});
});

function change_theme(theme) {
	$(element).find(".searchIconWrapper i,.joblocname,.jobInfoLabel,.jobFilterWrap>div").css("color", theme);
	$(element).find(".featuredJob .innerJobWrap2,.featJob").css("border-color", theme);
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

$(element).find(".searchIconWrapper").on('click touchstart', function () {
	search_bar($(this).next().find('.searchField'));
});

$(element).find(".jobCategory").on('click touchstart', function () {
	$(element).find("#jobCategory").toggleClass("jobCategory-Active");
});

$(element).find("#jobCategory").on('click touch', 'option', function () {
	$(element).find('.jobFilWrap select').trigger("change");
});

$(element).find("#jobCategory").mouseleave(function () {
	$(element).find("#jobCategory").removeClass("jobCategory-Active");
});

//ONCHANGE SEARCH
$(element).find('.searchField').keyup(function (event) {
	if (event.keyCode == '13') {
		search_bar($(this));
	}
});

function search_bar(el) {
	let keyword = el.val();
	if (keyword) {
		let result = searchByJobCompKey(jobList, keyword);
		$(element).find('.jobListWrap').empty();

		PaginationFunction(result);
		let jobCount = result.length;
		$(element).find('.jobCount').text(jobCount);
		$(element).find('.jobKey').text(keyword);
		$(element).find('.jobFeatTitle').hide();
		$(element).find('.resultSummary').fadeIn();
	}
}

//ONCLICK RESET
$(element).find('.resetIconWrapper').click(function () {
	$(element).find('.searchInputField input').val("");
	$(element).find('.resultSummary').hide();
	$(element).find('.jobFeatTitle').fadeIn();
	displayFeatJobs(jobList);
});

//FILTER ONCHANGE
$('.jobFilWrap select').change(function () {
	let keyword = $(element).find('.searchInputField input').val();
	let selectedCateg = $(element).find('#jobCategory').val();
	let selectedLevel = $(element).find('#jobfunctionname').val();
	let selectedLocation = $(element).find('#joblocname').val();
	let selectedJType = $(element).find('#jobtypename').val();
	let filters = {};

	if (selectedCateg !== null) {
		let is_any = selectedCateg.includes("select_all") ? "" : selectedCateg;
		filters.jobcatname = is_any;
	}
	if (selectedLevel !== null) {
		filters.jobfunctionname = selectedLevel;
	}
	if (selectedLocation !== null) {
		filters.joblocname = selectedLocation;
	}
	if (selectedJType !== null) {
		filters.jobtypename = selectedJType;
	}

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
$(element).find('.clearFilter').click(function () {
	$(element).find('.jobFilWrap select').prop('selectedIndex', 0);
	$(element).find('.resultSummary').hide();
	$(element).find('.jobFeatTitle').fadeIn();
	$(element).find('.searchInputField input').val("");

	displayFeatJobs(jobList);
});


//SORT JOB VIA TITLE IN ASCENDING ORDER
function sortAsc(arr) {
	return arr.sort((a, b) => a.jobtitle.localeCompare(b.jobtitle))
}

//SORT JOB VIA TITLE IN DESCENDING ORDER
function sortDesc(arr) {
	return arr.sort((a, b) => b.jobtitle.localeCompare(a.jobtitle))
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
	$(element).find('.jobListWrap').empty();
	let str = arr.filter(i => i);
	PaginationFunction(str);
	let jobCount = arr.length;
	$(element).find('.jobCount').text(jobCount);
	$(element).find('.jobKey').text(keyword);
	$(element).find('.jobFeatTitle').hide();
	$(element).find('.resultSummary').fadeIn();
}

//CREATE DROPDOWN
function createFilterDropdown(arr, filter) {
	arr.map(function (i) {
		if (getParameterByName(filter)) {
			$(element).find('#' + filter).append(`<option value="${i}" ${i.toLowerCase().includes(getParameterByName(filter).toLowerCase()) ? "selected":""}>${i}</option>`);
		} else {
			$(element).find('#' + filter).append(`<option value="${i}" ${i.includes(getParameterByName(filter)) ? "selected":""}>${i}</option>`);
		}
	});
}


//REMOVE DUPLICATE IN ARRAY
function removeDuplicate(arr) {
	return uniqueItems = Array.from(new Set(arr))
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
	$(element).find('.jobListWrap').empty();
	let str = arr.filter(function (i) {
		return i;
	});
	PaginationFunction(str);
}

//PAGINATION 
function PaginationFunction(jobs) {
	$(element).find('.jobListWrapPage').pagination({
		dataSource: jobs,
		pageSize: pageSze,
		callback: function (result, pagination) {
			let structure = '';
			if (layoutType == 'listLayout') {
				structure = result.map(i => {
					return createJob2(i);
				}).join("")
			} else {
				structure = result.map(i => {
					return createJob(i);
				}).join("")
			}
			$(element).find(".jobListWrap").html(structure);
			change_theme(theme);
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
function createJob(jobItem) {
	let tags = "";
	// let jobT = 
	// jobT.map(function (i) {
	// 	tags += `<div class="jobTag">${i}</div>`;
	// });
	let itemLink = jobItem.url;

	let j = `<div class="jobWrap">
                <a href="${itemLink}" class="innerJobWrap featJob" data-jobid="${jobItem.joblistid}" ${newTab == true ? 'target="_blank"' : ''}>
                    <div class="jobHeadInfo">
                        <div class="jobMainInfo">
                            <div class="jobTitle">${jobItem.jobtitle}</div>
                            <div class="joblocname">${jobItem.joblocname}</div>
                        </div>
                    </div>
                    <div class="jobLocWrap">
                        ${jobItem.joblocname}, ${jobItem.jobloc}
                    </div>
                    <div class="jobDetailsWrap">
                        <div class="jobCategory">${jobItem.jobtypename}</div>
                        <div class="jobfunctionname">${jobItem.jobfunctionname}</div>
                        <div class="jobSalary">${jobItem.jobdeptname}</div>
                    </div>
                    <div class="jobDescWrap">
                        ${jobItem.description.replaceAll(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, " ")} 
                    </div>
                    <div class="jobTagsWrap">
                      
                    </div>
                </a>
            </div>`;
	return j;
}

//CREATE JOB LIST LAYOUT
function createJob2(jobItem) {
	let tags = "";
	// jobT.map(function (i) {
	// 	tags += `<div class="jobTag">${i}</div>`
	// });
	let itemLink = jobItem.url;

	let j = `<a href="${itemLink}" class="jobWrap2 featuredJob" data-jobid="${jobItem.joblistid}" ${newTab == true ? 'target="_blank"' : ''}>
                <div class="innerJobWrap2">
                    ${jobItem.jobFeatured == "true" ? '<div class="featWrapper">FEATURED</div>' : ''}
                    <div class="jobWrap2Col1">
                        <div class="jobTitle">${jobItem.jobtitle}</div>
                        <div class="joblocname">${jobItem.joblocname}</div>
                        <div class="jobDescription">${jobItem.description.replaceAll(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, " ")}</div>
                        <div class="jobTagsWrap">${tags}</div>
                    </div>
                    <div class="jobWrap2Col2">
                        <div class="jobInfo">
                            <div class="jobInfoLabel">Location:</div>
                            <div class="jobInfoVal"> ${jobItem.joblocname}, ${jobItem.jobloc}</div>
                        </div>
                        <div class="jobInfo">
                            <div class="jobInfoLabel">Employment Type:</div>
                            <div class="jobInfoVal">${jobItem.jobtypename}</div>
                        </div>
                        <div class="jobInfo">
                            <div class="jobInfoLabel">Sub Type:</div>
                            <div class="jobInfoVal">${jobItem.jobfunctionname}</div>
                        </div>
                        <div class="jobInfo">
                            <div class="jobInfoLabel">Category:</div>
                            <div class="jobInfoVal">${jobItem.jobcatname}</div>
                        </div>
                    </div>
                </div>
            </a>`;
	return j;
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
$(element).find('.searchInputField input').focus(function () {
	$(element).find('.resetIconWrapper').fadeIn();
});
$(element).find('.searchInputField input').blur(function () {
	$(element).find('.resetIconWrapper').fadeOut();
});

//HIDE AND SHOW FILTER CLICK
let filterVisible = false;
$(element).find('.showFilter').click(function () {
	if (filterVisible) {
		$(element).find('.showFilter').text('Show Filter');
		$(element).find('.clearFilter').fadeOut();
		filterVisible = false;
	} else {
		$(element).find('.showFilter').text('Hide Filter');
		$(element).find('.clearFilter').fadeIn();
		filterVisible = true;
	}
});

// COLLECTION FOR WIDGET LIST
function Collection(collection) {
	let $this = this;
	this.ajax = () => {
		return $.ajax({
			url: collection,
		}).then(response => {
			jobList = $this.data(response);
		});
	};
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