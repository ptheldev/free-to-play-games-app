const dataJson = "json/games.json";

const itemsPerPage = 24;
let currentPage = 1;
let filterGenre = "";
let filterPlatform = ""

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

function displayGames(data) {

    const gamesContainer = document.querySelector(".results-container");
    let displayItem;

    data.map((item, index) => {
        displayItem = "";
        if(index >= (currentPage * itemsPerPage - itemsPerPage) && index < (currentPage * itemsPerPage)) {
            displayItem = " display-item";
        } else {
            displayItem = "";
        }
        gamesContainer.insertAdjacentHTML("beforeend", `
        <div class="result-container${displayItem}">
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

        showPagination(data);
    });
    // <img src="${item.thumbnail}" alt="${item.title}">
}

function showPagination(data) {

    let maxPages = Math.floor(data.length / itemsPerPage) + 1;

    document.querySelector(".pagination-status").innerText = `${currentPage} / ${maxPages}`;

    if(currentPage == 1) {
        document.querySelector(".pagination-arrow-prev").classList.add("pagination-arrows-disabled");
    }
    if(currentPage >= maxPages) {
        document.querySelector(".pagination-arrow-next").classList.add("pagination-arrows-disabled");
    }
}

document.querySelector(".pagination-arrow-prev").addEventListener("click", function(item) {
    if(!item.currentTarget.classList.contains("pagination-arrows-disabled")) {
        currentPage--;
    }
    console.log(currentPage);
});
document.querySelector(".pagination-arrow-next").addEventListener("click", function(item) {
    if(!item.currentTarget.classList.contains("pagination-arrows-disabled")) {
        currentPage++;
    }
    console.log(currentPage);
});