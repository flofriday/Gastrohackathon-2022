function replacePrices() {
    const regex = "(€|EUR)?\ ?[0-9]{1,3}([\,\.]?[0-9]{3}?)*([\,\.][0-9]{2})?\ ?(€|EUR)";
    const correct_url_regex = new RegExp("https://jobs.ams.at");
    const boxes = document.querySelectorAll('#ams-search-result-list > sn-list-item-container');
    let counter = 0;
    for (let single_box of boxes) {
        let link = (single_box.getElementsByTagName('a')[0]).href;
        if (correct_url_regex.test(link)) {
            let req = new XMLHttpRequest();
            link = link.replace('/jobs/', '/api/joboffer/');
            req.open('GET', link, false);
            req.send(null);
            if (req.status == 200) {
                let loadedText = req.responseText;
                loadedText = loadedText.match(regex)[0];
                let priceDiv = document.createElement("div");
                priceDiv.innerHTML = String.raw`<div class="c-ams-icon-value" role="presentation"><div class="c-ams-icon-value-header with-label" id="58b2fd0c-0959-4385-94e5-063f5cec03fb" aria-hidden="true"><span class="d-inline-block me-1 text-center c-ams-icon-value-icon"><fa-icon class="ng-fa-icon"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="home" class="svg-inline--fa fa-home fa-w-18 fa-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg></fa-icon></span>Einkommen:<!----></div><div class="c-ams-icon-value-content clearfix" role="presentation"><span role="cell" class="fw-bold u-text-break" id="ams-search-joboffer-company">` + loadedText + `</span></div></div>`;
                let elements = document.querySelectorAll('[label="Unternehmen:"]');
                elements[counter].prepend(priceDiv);
                counter++;
            }
        } else {
            let priceDiv = document.createElement("div");
            priceDiv.innerHTML = String.raw`<div class="c-ams-icon-value" role="presentation"><div class="c-ams-icon-value-header with-label" id="58b2fd0c-0959-4385-94e5-063f5cec03fb" aria-hidden="true"><span class="d-inline-block me-1 text-center c-ams-icon-value-icon"><fa-icon class="ng-fa-icon"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="home" class="svg-inline--fa fa-home fa-w-18 fa-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg></fa-icon></span>Einkommen:<!----></div><div class="c-ams-icon-value-content clearfix" role="presentation"><span role="cell" class="fw-bold u-text-break" id="ams-search-joboffer-company">?????</span></div></div>`;
            const elements = document.querySelectorAll('[label="Unternehmen:"]');
            elements[counter].prepend(priceDiv);
            counter++;
        }
    }
    let page_links = document.getElementsByClassName("page-link");
    for (let page_link of page_links) {
        page_link.onclick = delayedFunction;
    }
}
function delayedFunction() {
    setTimeout(function () { replacePrices(); }, 250)
}
document.addEventListener("load", delayedFunction());


