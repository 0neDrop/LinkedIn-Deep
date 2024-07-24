// ==UserScript==
// @name         LinkedIn-Deep
// @namespace    http://tampermonkey.net/
// @version      2024-07-23
// @description  Attempts to find out more info about LinkedIn user. Will display info behind user's profile picture banner.
// @author       GV3Dev
// @match        https://www.linkedin.com/*
// @match        https://www.searchpeoplefree.com/terms
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// ==/UserScript==


(() => {
    const initCheckInterval = setInterval(() => {
        const profileButton = document.querySelector('button[aria-label="open profile picture"]');
        if (profileButton && profileButton.childElementCount > 0) {
            clearInterval(initCheckInterval);
            processProfile(profileButton);
        }
    }, 100);

    const processProfile = (profileButton) => {
        const userName = profileButton.children[0].title.split(", #")[0];
        if (userName) {
            const formattedUserName = userName.toLowerCase().split(" ").join("-");
            const searchUrl = `https://www.searchpeoplefree.com/find/${formattedUserName}`;
            GM_setValue("info_returned", null);
            initiateDataRetrieval(searchUrl);
            GM_addValueChangeListener("info_returned", (name, old_value, new_value, remote) => {
                const returnedInfo = JSON.parse(new_value);
                if (returnedInfo.length === 0) {
                    alert("No deep results could be returned for this user!");
                } else {
                    displayResults(returnedInfo);
                }
            });
        }
    };

    const initiateDataRetrieval = (url) => {
        GM_setValue("requested_user", url);
        const hiddenIframe = document.createElement("iframe");
        hiddenIframe.style.visibility = "hidden";
        hiddenIframe.src = "https://www.linkedin.com/psettings/guest-controls/recent-history";
        document.body.appendChild(hiddenIframe);
    };

    const displayResults = (data) => {
        const backgroundSection = document.querySelector(".profile-background-image").parentElement;
        const infoContainer = document.createElement("div");
        infoContainer.innerHTML = data.join("<br/><br/><br/>");
        infoContainer.style = "width:100%; display:flex; justify-content:center; align-items:center; flex-direction:column;";
        backgroundSection.appendChild(infoContainer);
        backgroundSection.style.overflowY = "scroll";
    };

    if (location.href.includes("https://www.linkedin.com/psettings/guest-controls/")) {
        const deepSearchIframe = document.createElement("iframe");
        deepSearchIframe.src = "https://www.searchpeoplefree.com/terms";
        document.body.appendChild(deepSearchIframe);
    }

    if (location.href.includes("https://www.searchpeoplefree.com/terms")) {
        (async () => {
            const requestedUrl = await GM_getValue("requested_user");
            try {
                const response = await fetch(requestedUrl);
                if (!response.ok) {
                    throw new Error(response.status === 404 ? '404 Not Found' : 'Network response was not ok');
                }
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, "text/html");
                const infoElements = doc.querySelectorAll("article");
                const infoArray = Array.from(infoElements, article => article.innerHTML);
                GM_setValue("info_returned", JSON.stringify(infoArray));
            } catch (error) {
                console.error('Error fetching the HTML:', error);
                GM_setValue("info_returned", JSON.stringify([]));
            }
        })();
    }
})();

