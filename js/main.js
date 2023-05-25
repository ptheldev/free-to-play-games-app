// const dataJson = "json/games.json";
const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '498ce47e51msh0f012f4220396edp1ea81bjsne048bfe6e8ad',
		'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
	}
};

const genresTag = document.querySelector(".filters-genre ul");
const gamesContainer = document.querySelector(".results-container");
const platformTag = document.querySelector(".filters-platform ul");
const filterInput = document.querySelector(".input");
const itemsPerPage = 24;
let filterContainer = document.querySelector(".suggestions-list");
let originalData;
let currentPage = 1;
let dataMethods = {
    filterGenre : "",
    filterPlatform : "",
    filterPhrase : "",
    sortingMethod : ""
}

// get data
fetch(url, options)
    .then (data => data.json())
    .then (data => {
        originalData = JSON.parse(JSON.stringify(data));
        clearAllInputs();
        displayGenres(data);
        displayPlatforms(data);
        addInputListeners();
        displayGames(data);
    })
    .catch(error => console.log(error));

function deleteExceptions(phrase) {
    return phrase.replace(/^\s+/g, '');
}

// mobile filters toggle
document.querySelector(".filters-mobile-toggle").addEventListener("click", (event) => {
    document.querySelector(".filters-mobile-toggle").classList.toggle("filters-mobile-toggle-active");
    document.querySelector(".filters-mobile-content").classList.toggle("filters-mobile-content-active");
})

// clear all inputs onload 
function clearAllInputs() {
    filterInput.value = "";
    [...document.querySelectorAll('input[type="radio"]')].forEach(item => item.checked = false);
}

// show all genres
function displayGenres(data) {
    
    let genresArray = [];

    data.map(item => {
        if(!genresArray.includes(deleteExceptions(item.genre))) {
            genresArray.push(deleteExceptions(item.genre));
        }
    });

    genresArray.map(item => {
        genresTag.insertAdjacentHTML("beforeend", `
            <li>
                <input class="input-radio" name="filter" type="radio" id="${item}" sort-type="genre">
                <label class="label-radio" for="${item}" sort-type="genre">${item}</label>
            </li>
        `)}
    );
}

// show all platforms
function displayPlatforms(data) {
    
    let platformArray = [];

    data.map(item => {
        if(!platformArray.includes(deleteExceptions(item.platform))) {
            platformArray.push(deleteExceptions(item.platform));
        }
    });

    platformArray.map(item => {
        platformTag.insertAdjacentHTML("beforeend", `
            <li>
                <input class="input-radio" name="filter" type="radio" id="${item}" sort-type="platform">
                <label class="label-radio" for="${item}" sort-type="platform">${item}</label>
            </li>
        `)}
    );
}

// add click cisteners to filters and sorting
function addInputListeners() {
    const inputsArray = [...document.querySelectorAll(".label-radio")];
    inputsArray.forEach((item) => {
        item.addEventListener("click", (event) => {
            currentPage = 1;
            switch(event.target.getAttribute("sort-type")) {
                case "genre":
                    dataMethods.filterGenre = event.target.getAttribute("for");
                break;
                case "platform":
                    dataMethods.filterPlatform = event.target.getAttribute("for");
                break;
                case "sorting":
                    dataMethods.sortingMethod = event.target.getAttribute("sort-method");
                break;
            }
            displayGames(originalData);
            document.querySelector(`span.clear[clear-type="${event.target.getAttribute("sort-type")}"]`).style.display = "block";
            console.log(dataMethods);
        })
    })
}

// clear button effect
[...document.querySelectorAll("span.clear")].forEach(item => {
    item.addEventListener("click", (event) => {
        [...document.querySelectorAll(`input[sort-type="${event.target.getAttribute("clear-type")}"]`)].forEach((item) => item.checked = false);
        switch(event.target.getAttribute("clear-type")) {
            case "genre":
                dataMethods.filterGenre = "";
            break;
            case "platform":
                dataMethods.filterPlatform = "";
            break;
            case "sorting":
                dataMethods.sortingMethod = "";
            break;
        }
        displayGames(originalData);
        event.target.style.display = "none";
    })   
});

// display all games
function displayGames(data) {

    let temporaryData = data;

    // filter by phrase
    temporaryData = temporaryData.filter(item => item.title.toLowerCase().includes(dataMethods.filterPhrase.toLowerCase()));

    // filter by genre
    temporaryData = temporaryData.filter(item => item.genre.includes(dataMethods.filterGenre));

    // filter by platform
    temporaryData = temporaryData.filter(item => item.platform.includes(dataMethods.filterPlatform));

    // sorting
    switch(dataMethods.sortingMethod) {
        case "alphabetical-asc":
            temporaryData = temporaryData.sort(function(a, b) {
                if(a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
                if(a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
            });
        break;
        case "alphabetical-desc":
            temporaryData = temporaryData.sort(function(a, b) {
                if(a.title.toLowerCase() < b.title.toLowerCase()) { return 1; }
                if(a.title.toLowerCase() > b.title.toLowerCase()) { return -1; }
            });
        break;
        case "release-asc":
            temporaryData = temporaryData.sort(function(a, b) {
                if(a.release_date.toLowerCase() < b.release_date.toLowerCase()) { return -1; }
                if(a.release_date.toLowerCase() > b.release_date.toLowerCase()) { return 1; }
            });
        break;
        case "release-desc":
            temporaryData = temporaryData.sort(function(a, b) {
                if(a.release_date.toLowerCase() < b.release_date.toLowerCase()) { return 1; }
                if(a.release_date.toLowerCase() > b.release_date.toLowerCase()) { return -1; }
            });
        break;
    }

    // clear results field
    gamesContainer.innerText = "";

    temporaryData.map((item, index) => {
        if(index >= (currentPage * itemsPerPage - itemsPerPage) && index < (currentPage * itemsPerPage)) {
            gamesContainer.insertAdjacentHTML("beforeend", `
            <div class="result-container">
                <div class="result">
                    <div>
                        <img src="${item.thumbnail}" alt="${item.title}">
                        <div class="result-title">${item.title}</div>
                        <div class="result-desc">
                            <div>Genre: </div>
                            <div>${item.genre}</div>
                        </div>
                        <div class="result-desc">
                            <div>Platform: </div>
                            <div>${item.platform}</div>
                        </div>
                        <div class="result-desc">
                            <div>Producer: </div>
                            <div>${item.developer}</div>
                        </div>
                        <div class="result-desc">
                            <div>Release date: </div>
                            <div>${item.release_date}</div>
                        </div>
                    </div>
                    <div class="result-links">
                        <a href="${item.game_url}">Play this game</a>
                        <a href="${item.freetogame_profile_url}">Read more</a>
                    </div>
                </div>
            </div>
            `);
        }
    });
    showPagination(temporaryData);
}

function showPagination(data) {

    // refresh pagination items
    document.querySelector(".results-pagination").innerText = "";
    document.querySelector(".results-pagination").insertAdjacentHTML("afterbegin", `
        <div class="pagination-arrows pagination-arrow-prev"><?xml version="1.0" ?><svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M30.83 32.67l-9.17-9.17 9.17-9.17-2.83-2.83-12 12 12 12z"/><path d="M0-.5h48v48h-48z" fill="none"/></svg></div>
        <div class="pagination-status"></div>
        <div class="pagination-arrows pagination-arrow-next"><?xml version="1.0" ?><svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M17.17 32.92l9.17-9.17-9.17-9.17 2.83-2.83 12 12-12 12z"/><path d="M0-.25h48v48h-48z" fill="none"/></svg></div>
        `);

    let maxPages = Math.floor(data.length / itemsPerPage) + 1;

    document.querySelector(".pagination-status").innerText = `${currentPage} / ${maxPages}`;

    if(currentPage == 1) {
        document.querySelector(".pagination-arrow-prev").classList.add("pagination-arrows-disabled");
    }
    if(currentPage >= maxPages) {
        document.querySelector(".pagination-arrow-next").classList.add("pagination-arrows-disabled");
    }

    // add click events on arrows when arrow is active
    document.querySelector(".pagination-arrow-prev").addEventListener("click", function(item) {
        if(!item.currentTarget.classList.contains("pagination-arrows-disabled")) {
            currentPage--;
        }
        displayGames(data);
    });
    document.querySelector(".pagination-arrow-next").addEventListener("click", function(item) {
        if(!item.currentTarget.classList.contains("pagination-arrows-disabled")) {
            currentPage++;
        }
        displayGames(data);
    });

}


// Filter suggestions
function filteringResults(filterPhrase) {

    filterContainer.innerText = "";

    if(filterPhrase !== "") {

        // let filterResult = originalData.filter(item => item.title.toLowerCase().includes(filterPhrase.toLowerCase()));

        originalData.filter(item => item.title.toLowerCase().includes(filterPhrase.toLowerCase())).map((item) => {
            filterContainer.insertAdjacentHTML("beforeend", `
                <li class="suggestion">
                    <img class="suggestion-img" src="${item.thumbnail}" alt="${item.title}" width="32" height="32" />
                    <span>${item.title}</span>
                </li>
            `);
        });

    } else {

        // When input is focus and empty display first 5 suggestions from data
        originalData.map((item, index) => {
            if(index < 5) {
                filterContainer.insertAdjacentHTML("beforeend", `
                    <li class="suggestion">
                        <img class="suggestion-img" src="${item.thumbnail}" alt="${item.title}" width="32" height="32" />
                        <span>${item.title}</span>
                    </li>
                `);
            }
        });

    }

    // Add click listeners to suggestion items
    document.querySelectorAll(".suggestion").forEach(function(item) {
        item.addEventListener("click", function() {
            dataMethods.filterPhrase = item.children[1].innerText;
            filterInput.value = item.children[1].innerText;
            displayGames(originalData);
            filterContainer.innerText = "";
        })
    });

}

// Suggestions show/hide actions
filterInput.addEventListener("input", (event) => {
    filteringResults(event.target.value);
});

filterInput.addEventListener("focus", function(event) {
    filteringResults(event.target.value);
});

document.addEventListener("click", function (event) {
    if(event.target.className !== "input") {
        filterContainer.innerText = "";
    }
});