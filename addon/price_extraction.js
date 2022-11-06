function textToGermanNumber(text){
    return parseFloat(text.replace(/\./g, '').replace(',', '.'));
}

function replacePrices() {
    const average_wage = 2104;
    let monthly_wage = null;

    const regex = /(€|EUR)?\ ?[0-9]{1,4}([\,\.]?[0-9]{3}?)*([\,\.][0-9]{2})?\ ?(€|EUR)/g;
    const regex2 = /([0-9]+\.)*[0-9]+(\,[0-9]{1,2})?/g;
    const correct_url_regex = new RegExp("https://jobs.ams.at");
    const boxes = document.querySelectorAll('#ams-search-result-list > sn-list-item-container');
    let counter = 0;

    for (let single_box of boxes) {
        if (single_box.getElementsByClassName("prevent-double").length != 0){
            continue;
        }

        let link = (single_box.getElementsByTagName('a')[0]).href;
        if (correct_url_regex.test(link)) {
            let req = new XMLHttpRequest();
            link = link.replace('/jobs/', '/api/joboffer/');
            req.open('GET', link, false);
            req.send(null);
            if (req.status == 200) {
                let loadedText = req.responseText;

                if ((new RegExp(regex)).test(loadedText)) {
                    let matches = loadedText.match(regex);
                    matches = matches.map(x => x.match(regex2))
                    if (matches.length > 1) {
                        loadedText = matches.reduce(
                            function (a, b) {
                                return a.length > b.length ? a : b;
                            }
                        );
                    }
                    else {
                        loadedText = matches[0]
                    }
                    loadedText = loadedText[0];
                    
                    if (loadedText.length < 6) {
                        monthly_wage = textToGermanNumber(loadedText) * 40 * 4;
                        loadedText += " €/h";
                    } else if(loadedText.length > 8){
                        loadedText = loadedText.slice(0, - 3);
                        loadedText += " € p. a.";
                        monthly_wage = textToGermanNumber(loadedText) / 14;
                    } else {
                        loadedText = loadedText.slice(0, - 3);
                        loadedText += " € p. m.";
                        monthly_wage = textToGermanNumber(loadedText);
                    }
                } else {
                    loadedText = "?";
                }

                if (monthly_wage != null) {
                    if (monthly_wage < average_wage){ 
                        loadedText += " ❌"
                    }
                    else{
                        loadedText += " ✅"
                    }
                }
                
                let priceDiv = document.createElement("div");
                priceDiv.innerHTML = String.raw`<div class="c-ams-icon-value prevent-double" role="presentation"><div class="c-ams-icon-value-header with-label" id="58b2fd0c-0959-4385-94e5-063f5cec03fb" aria-hidden="true"><span class="d-inline-block me-1 text-center c-ams-icon-value-icon"><fa-icon class="ng-fa-icon"><svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke-width="0.5" stroke="#767676" style="fill: #767676" d="M0.568359 5.95898H1.34766C1.74609 7.85742 3.11719 9.01172 5.00977 9.01172C6.41602 9.01172 7.70508 8.4375 8.22656 7.13086C8.28516 6.99023 8.30273 6.84375 8.30273 6.72656C8.30273 6.43945 8.12109 6.25781 7.83984 6.25781C7.58789 6.25781 7.42383 6.39844 7.30664 6.69141C6.91406 7.66406 6.03516 8.0332 5.01562 8.0332C3.76172 8.0332 2.80664 7.25391 2.45508 5.95898H5.60156C5.80078 5.95898 5.94727 5.80078 5.94727 5.60742C5.94727 5.40234 5.80078 5.25586 5.60156 5.25586H2.32617C2.30859 5.09766 2.30273 4.93945 2.30273 4.76953C2.30273 4.59375 2.31445 4.42383 2.32617 4.25977H5.60156C5.80078 4.25977 5.94727 4.10156 5.94727 3.9082C5.94727 3.70312 5.80078 3.55664 5.60156 3.55664H2.46094C2.83008 2.28516 3.7793 1.51172 5.00977 1.51172C6.0293 1.51172 6.89648 2.01562 7.28906 2.98828C7.40625 3.28125 7.58203 3.42188 7.83398 3.42188C8.11523 3.42188 8.30859 3.22852 8.30859 2.94141C8.30859 2.82422 8.28516 2.67773 8.22656 2.53711C7.73438 1.30078 6.58008 0.533203 5.00977 0.533203C3.14062 0.533203 1.76367 1.6875 1.35352 3.55664H0.568359C0.375 3.55664 0.228516 3.70312 0.228516 3.9082C0.228516 4.10156 0.375 4.25977 0.568359 4.25977H1.25391C1.23633 4.42383 1.23047 4.59375 1.23047 4.76953C1.23047 4.93359 1.23633 5.09766 1.24805 5.25586H0.568359C0.375 5.25586 0.228516 5.40234 0.228516 5.60742C0.228516 5.80078 0.375 5.95898 0.568359 5.95898Z" fill="#BBBBBB"/></svg></fa-icon></span>Gehalt:<!----></div><div class="c-ams-icon-value-content clearfix" role="presentation"><span role="cell" class="fw-bold u-text-break" id="ams-search-joboffer-company">` + loadedText + `</span></div></div>`;
                let elements = document.querySelectorAll('[label="Unternehmen:"]');
                elements[counter].prepend(priceDiv);
                counter++;
            } else {
                alert(req.status);
            }
        } else {
            let priceDiv = document.createElement("div");
            priceDiv.innerHTML = String.raw`<div class="c-ams-icon-value" role="presentation"><div class="c-ams-icon-value-header with-label" id="58b2fd0c-0959-4385-94e5-063f5cec03fb" aria-hidden="true"><span class="d-inline-block me-1 text-center c-ams-icon-value-icon"><fa-icon class="ng-fa-icon"><svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.568359 5.95898H1.34766C1.74609 7.85742 3.11719 9.01172 5.00977 9.01172C6.41602 9.01172 7.70508 8.4375 8.22656 7.13086C8.28516 6.99023 8.30273 6.84375 8.30273 6.72656C8.30273 6.43945 8.12109 6.25781 7.83984 6.25781C7.58789 6.25781 7.42383 6.39844 7.30664 6.69141C6.91406 7.66406 6.03516 8.0332 5.01562 8.0332C3.76172 8.0332 2.80664 7.25391 2.45508 5.95898H5.60156C5.80078 5.95898 5.94727 5.80078 5.94727 5.60742C5.94727 5.40234 5.80078 5.25586 5.60156 5.25586H2.32617C2.30859 5.09766 2.30273 4.93945 2.30273 4.76953C2.30273 4.59375 2.31445 4.42383 2.32617 4.25977H5.60156C5.80078 4.25977 5.94727 4.10156 5.94727 3.9082C5.94727 3.70312 5.80078 3.55664 5.60156 3.55664H2.46094C2.83008 2.28516 3.7793 1.51172 5.00977 1.51172C6.0293 1.51172 6.89648 2.01562 7.28906 2.98828C7.40625 3.28125 7.58203 3.42188 7.83398 3.42188C8.11523 3.42188 8.30859 3.22852 8.30859 2.94141C8.30859 2.82422 8.28516 2.67773 8.22656 2.53711C7.73438 1.30078 6.58008 0.533203 5.00977 0.533203C3.14062 0.533203 1.76367 1.6875 1.35352 3.55664H0.568359C0.375 3.55664 0.228516 3.70312 0.228516 3.9082C0.228516 4.10156 0.375 4.25977 0.568359 4.25977H1.25391C1.23633 4.42383 1.23047 4.59375 1.23047 4.76953C1.23047 4.93359 1.23633 5.09766 1.24805 5.25586H0.568359C0.375 5.25586 0.228516 5.40234 0.228516 5.60742C0.228516 5.80078 0.375 5.95898 0.568359 5.95898Z" fill="#BBBBBB"/></svg></fa-icon></span>Gehalt:<!----></div><div class="c-ams-icon-value-content clearfix" role="presentation"><span role="cell" class="fw-bold u-text-break" id="ams-search-joboffer-company">` + "? €" + `</span></div></div>`;
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
    //if ((document.documentElement.textContent || document.documentElement.innerText).indexOf('Gehalt') == -1) {
    setTimeout(replacePrices, 1000);
}

function delayedFunctionSearch() {
    setTimeout(delayedFunction, 500);
}

//console.log(document.getElementsByTagName("form")[0])
setTimeout(function() {
    let form = document.getElementsByTagName("form")[0];
    form.addEventListener("submit", delayedFunctionSearch);
},
500
);

delayedFunction();