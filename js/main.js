const dataJson = "json/games.json";

const itemsPerPage = 24;
let currentPage = 1;
let filterGenre = "";
let filterPlatform = "";

// get data
fetch(dataJson)
    .then (data => data.json())
    .then (data => {
        displayGenres(data);
        displayPlatforms(data);
        displayGames(data);
    })
    .catch(error => console.log(error));

function deleteExceptions(phrase) {
    return phrase.replace(/^\s+/g, '');
}

// show all genres
function displayGenres(data) {
    const genresTag = document.querySelector(".filters-genre ul");
    let genresArray = [];

    data.map(item => {
        if(!genresArray.includes(deleteExceptions(item.genre))) {
            genresArray.push(deleteExceptions(item.genre));
        }
    });

    genresArray.map(item => {
        genresTag.insertAdjacentHTML("beforeend", `
            <li>
                <input class="input-radio" name="filter" type="radio" id="${item}">
                <label class="label-radio" for="${item}">${item}</label>
            </li>
        `)}
    );
}

// show all platforms
function displayPlatforms(data) {
    const platformTag = document.querySelector(".filters-platform ul");
    let platformArray = [];

    data.map(item => {
        if(!platformArray.includes(deleteExceptions(item.platform))) {
            platformArray.push(deleteExceptions(item.platform));
        }
    });

    platformArray.map(item => {
        platformTag.insertAdjacentHTML("beforeend", `
            <li>
                <input class="input-radio" name="filter" type="radio" id="${item}">
                <label class="label-radio" for="${item}">${item}</label>
            </li>
        `)}
    );
}

// display all games
function displayGames(data) {

    const gamesContainer = document.querySelector(".results-container");

    data.map((item, index) => {
        gamesContainer.insertAdjacentHTML("beforeend", `
        <div class="result-container">
            <div class="result">
                <div>
                    
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

        filterSortingPagination();
    });
    // <img src="${item.thumbnail}" alt="${item.title}">
}

function filterSortingPagination() {

    const resultsArray = [...document.querySelectorAll(".result-container")];

    // reset hide all results
    resultsArray.map((item) => {
        item.style.display = "none";
    });

    // show active results
    resultsArray.map((item, index) => {
        if(index >= (currentPage * itemsPerPage - itemsPerPage) && index < (currentPage * itemsPerPage)) {
            item.style.display = "block";
        } else {
            displayItem = "none";
        }
    });

    showPagination(resultsArray);
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

    // add click events on arrows
    document.querySelector(".pagination-arrow-prev").addEventListener("click", function(item) {
        if(!item.currentTarget.classList.contains("pagination-arrows-disabled")) {
            currentPage--;
        }
        console.log(currentPage);
        filterSortingPagination()
    });
    document.querySelector(".pagination-arrow-next").addEventListener("click", function(item) {
        if(!item.currentTarget.classList.contains("pagination-arrows-disabled")) {
            currentPage++;
        }
        console.log(currentPage);
        filterSortingPagination()
    });

}