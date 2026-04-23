const route = (event) => {
    event = event || window.event;
    event.preventDefault();

    // Use currentTarget (the element with onclick) so we don't accidentally
    // read href from a child element (e.g. an <span> inside the <a>).
    const anchor = event.currentTarget || event.target.closest?.("a");
    const href = anchor?.getAttribute?.("href") || "/";

    window.history.pushState({}, "", href);
    handleLocation();
}

const routes = {
    404: "/pages/404.html",
    "/": "/pages/home.html",
    "/about": "/pages/about.html",
    "/contact": "/pages/contact.html",
    "/events": "/pages/events.html",
    "/partners": "/pages/partners.html",
};


const handleLocation = async () => {
    // When initially loaded as /index.html, treat it as home.
    const path = window.location.pathname === "/index.html" ? "/" : window.location.pathname;
    const route = routes[path] || '<h1>Page Not Found</h1>';
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
}


window.onpopstate = handleLocation;
window.route = route;

handleLocation();