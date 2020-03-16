"use strict";

for (const button of document.getElementById('sidebar-menu').children) {
    button.addEventListener('click', onAppLaunch);
}
document.getElementById('sidebar-close-button').addEventListener('click', closeSidebar);

/**
 * Closes the sidebar.
 */
function closeSidebar() {
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('sidebar-menu').style.display = 'unset';
}

/**
 * Opens the sidebar to the specified app.
 */
function openSidebar(appName, appId) {
    document.getElementById('sidebar').style.display = 'unset';
    document.getElementById('sidebar-menu').style.display = 'none';

    document.getElementById('sidebar-title').innerHTML = appName;

    loadAppPage(appId);
}


/**
 * Called when an app is launched from the sidebar menu.
 */
function onAppLaunch(event) {
    const appName = event.target.innerHTML;
    const appId = event.target.getAttribute('name');
    openSidebar(appName, appId);
}

/**
 * Loads an app into the sidebar.
 */
function loadAppPage(appId) {
    let request = new XMLHttpRequest();
    request.addEventListener('load', onAppLoad)
    request.addEventListener('error', onAppLoadError)
    request.open('GET', `apps/${appId}.html`);
    request.send();
}

/**
 * Called when an app finishes loading, to display it in the sidebar.
 */
function onAppLoad(event) {
    document.getElementById('sidebar-content').innerHTML = event.target.responseText;
}

/**
 * Called when an app fails to load.
 */
function onAppLoadError(event) {
    document.getElementById('sidebar-content').innerHTML = `<p>Error loading app.</p>`
}