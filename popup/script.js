function getRoot() {
    const element = document.getElementById('entries');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    return element;
}

function enableBack() {
    const element = document.querySelector('.back-btn');
    element.classList.remove('hide');
}

function disableBack() {
    const element = document.querySelector('.back-btn');
    element.classList.add('hide');
}

async function getHistory(frame) {
    return await browser.history.search({ text: frame.url });
}

async function getFrames() {
    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true
    });
    return await browser.webNavigation.getAllFrames({ tabId: tab.id });
}

async function displayFrames() {
    disableBack();
    const element = getRoot();
    const frames = await getFrames();
    const entries = frames.map(createFrameEntry);
    for (const entry of entries) {
        element.appendChild(entry);
    }
}

async function displayHistory(frame) {
    enableBack();
    const element = getRoot();
    const history = await getHistory(frame);
    const entries = history.map(createHistoryEntry);
    for (const entry of entries) {
        element.appendChild(entry);
    }
}

function createFrameEntry(frame) {
    // Create container
    const element = document.createElement('li');
    element.classList.add('frame');
    // Create link
    const link = document.createElement('a');
    link.onclick = () => displayHistory(frame);
    // Create title
    const title = document.createElement('h2');
    const titleText = document.createTextNode(frame.frameId === 0 ? 'Root' : `Child ${frame.frameId}`);
    title.appendChild(titleText);
    link.appendChild(title);
    // Create url
    const url = document.createElement('span');
    const urlText = document.createTextNode(frame.url);
    url.appendChild(urlText);
    link.appendChild(url);
    // Append link
    element.appendChild(link);
    return element;
}

function createHistoryEntry(history) {
    // Create container
    const element = document.createElement('li');
    element.classList.add('history');
    // Create link
    const link = document.createElement('a');
    link.href = history.url;
    link.target = '_blank';
    // Create title
    const title = document.createElement('h2');
    const titleText = document.createTextNode(history.title);
    title.appendChild(titleText);
    link.appendChild(title);
    // Create url
    const url = document.createElement('span');
    const urlText = document.createTextNode(history.url);
    url.appendChild(urlText);
    link.appendChild(url);
    // Append link
    element.appendChild(link);
    return element;
}

displayFrames();

document.querySelector('.back-btn').onclick = () => displayFrames();
