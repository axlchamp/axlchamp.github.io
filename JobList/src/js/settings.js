let data = {
    config: {
        // API ENDPOINT
        api_url: 'https://hbapi.hirebridge.com/v2/CareerCenter/GetJobs?cid=7648',
        company_id: "7648",
        // DESIGN AND LAYOUT
        filters_layout: "Side", // Top || Side
        layout: "grid_layout", // grid_layout or list_layout ( for desktop only )
        desktop_page_size: "6",
        mobile_page_size: "3",
        theme: "#88cc22",
        font: "Calibri",
        pagination_position: "center",

        // Elements CSS
        design_list: {
            search: {
                size: "16px",
                color: "#333333",
                font_family: "Calibri",
                font_weight: "400",
                background_color: "#ffffff"
            },
            dropdown_filters: {
                size: "16px",
                color: "#88cc22",
                font_family: "Calibri",
                font_weight: "400",
                background_color: "#ffffff"
            },
            job_title: {
                size: "18px",
                color: "#333333",
                font_family: "Calibri",
                font_weight: "bold",
                background_color: "#ffffff"
            },
            company_name: {
                size: "16px",
                color: "#88cc22",
                font_family: "Calibri",
                font_weight: "400",
                background_color: "#ffffff"
            },
            location: {
                size: "14px",
                color: "#aaaaaa",
                font_family: "Calibri",
                font_weight: "400",
                background_color: "#ffffff"
            },
            description: {
                size: "14px",
                color: "#333333",
                font_family: "Calibri",
                font_weight: "400",
                background_color: "#ffffff"
            },
            job_details: {
                size: "14px",
                color: "#333333",
                font_family: "Calibri",
                font_weight: "400",
                background_color: "#ffffff"
            },
            label: {
                size: "16px",
                color: "#88cc22",
                font_family: "Calibri",
                font_weight: "bold",
                background_color: "#ffffff"
            },
            button_1: {
                size: "16px",
                color: "#ffffff",
                font_family: "Calibri",
                font_weight: "bold",
                background_color: "#88cc22",
                border: "1px solid #88cc22"
            },
            button_2: {
                size: "16px",
                color: "#88cc22",
                font_family: "Calibri",
                font_weight: "bold",
                background_color: "#ffffff",
                border: "1px solid #88cc22"
            },
            modal_button_1: {
                size: "16px",
                color: "#ffffff",
                font_family: "Calibri",
                font_weight: "bold",
                background_color: "#88cc22",
                border: "1px solid #88cc22"
            },
            modal_button_2: {
                size: "16px",
                color: "#88cc22",
                font_family: "Calibri",
                font_weight: "bold",
                background_color: "#ffffff",
                border: "1px solid #88cc22"
            },
            modal_button_3: {
                size: "16px",
                color: "#88cc22",
                font_family: "Calibri",
                font_weight: "bold",
                background_color: "#ffffff",
                border: "1px solid #88cc22"
            }
        },
        // Add or remove dropdown filters
        filter_list: [{
            field: 'jobcatname',
            name: 'Job Category'
        }, {
            field: 'joblocname',
            name: 'Locations'
        }, {
            field: 'jobtypename',
            name: 'Employment Type'
        }, {
            field: 'jobfunctionname',
            name: 'Job Type'
        }],
        label_list: {
            sort_label: "Sort By",
            button_1: {
                show: true,
                text: "Apply"
            },
            button_2: {
                show: true,
                text: "Learn More"
            },
            modal_button_1: {
                show: true,
                text: "Apply"
            },
            modal_button_2: { // Description Modal
                show: true,
                text: "See Requirements"
            },
            modal_button_3: { // Requirements modal
                show: true,
                text: "See Description"
            }
        },
        // Toggle to show or hide elements ( true or false)
        toggles: {
            sorting: true,
            job_details: true,
            description: true,
            job_posted: true,
        },
        newTab: true
    }
};