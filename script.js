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
            <img src="${place.imageUrl}" alt="${place.name}">

            <div class="recommendation-content">

                <h3>${place.name}</h3>

                <p>${place.description}</p>

            </div>
        `;

        recommendationContainer.appendChild(card);
    });
}


// Search function
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

    // Beach search
    if (keyword.includes("beach")) {

        recommendations = data.beaches;

    }

    // Temple search
    else if (keyword.includes("temple")) {

        recommendations = data.temples;

    }

    // Country search
    else if (
        keyword.includes("country") ||
        keyword.includes("countries")
    ) {

        recommendations = data.countries;

    }

    if (recommendations.length > 0) {

        displayRecommendations(recommendations);

    } else {

        recommendationContainer.innerHTML =
            "<p>No recommendations found. Try beach, temple, or country.</p>";
    }
}


// Clear results
function clearRecommendations() {

    searchInput.value = "";

    recommendationContainer.innerHTML = "";
}


// Event listeners
searchBtn.addEventListener("click", searchRecommendations);

clearBtn.addEventListener("click", clearRecommendations);


// Allow Enter key for search
searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchRecommendations();
    }

});
