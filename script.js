const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");

const recommendationContainer = document.getElementById(
    "recommendationContainer"
);


// Fetch travel data
async function getTravelData() {
    try {
        const response = await fetch("travel_recommendation_api.json");

        if (!response.ok) {
            throw new Error("Unable to fetch travel data");
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error(error);

        recommendationContainer.innerHTML =
            "<p>Unable to load travel recommendations.</p>";
    }
}


// Display recommendations
function displayRecommendations(recommendations) {

    recommendationContainer.innerHTML = "";

    recommendations.forEach((place) => {

        const card = document.createElement("div");

        card.className = "recommendation-card";

        card.innerHTML = `
            <img 
                src="${place.imageUrl}" 
                alt="${place.name}"
            >

            <div class="recommendation-content">

                <h3>${place.name}</h3>

                <p>${place.description}</p>

            </div>
        `;

        recommendationContainer.appendChild(card);
    });
}


// Search recommendations
async function searchRecommendations() {

    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
        return;
    }

    const data = await getTravelData();

    if (!data) {
        return;
    }

    let recommendations = [];


    // =========================
    // BEACH SEARCH
    // =========================

    if (
        keyword.includes("beach") ||
        keyword.includes("beaches")
    ) {

        recommendations = data.beaches;
    }


    // =========================
    // TEMPLE SEARCH
    // =========================

    else if (
        keyword.includes("temple") ||
        keyword.includes("temples")
    ) {

        recommendations = data.temples;
    }


    // =========================
    // COUNTRY SEARCH
    // =========================

    else if (
        keyword.includes("country") ||
        keyword.includes("countries")
    ) {

        // Countries contain cities,
        // so we get the cities from every country.

        data.countries.forEach((country) => {

            country.cities.forEach((city) => {

                recommendations.push(city);

            });

        });
    }


    // =========================
    // DISPLAY RESULTS
    // =========================

    if (recommendations.length > 0) {

        displayRecommendations(recommendations);

    } else {

        recommendationContainer.innerHTML = `
            <p>
                No recommendations found.
                Try beach, temple, or country.
            </p>
        `;
    }
}


// Clear recommendations
function clearRecommendations() {

    searchInput.value = "";

    recommendationContainer.innerHTML = "";
}


// Search button
searchBtn.addEventListener(
    "click",
    searchRecommendations
);


// Clear button
clearBtn.addEventListener(
    "click",
    clearRecommendations
);


// Press Enter to search
searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchRecommendations();

        }

    }
);
