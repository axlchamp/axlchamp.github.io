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