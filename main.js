const launchesContainer = document.getElementById("launches");
const searchInput = document.getElementById("search");
const countdown = document.getElementById("countdown");

let launches = [];

// API 1: SpaceX Launches
async function loadLaunches() {
  const response = await fetch("https://api.spacexdata.com/v5/launches/upcoming");
  launches = await response.json();
  displayLaunches(launches);

  if (launches.length > 0) {
    startCountdown(launches[0].date_utc);
  }
}

function displayLaunches(data) {
  launchesContainer.innerHTML = "";

  data.slice(0, 10).forEach((launch) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${launch.name}</h3>
      <p>Date: ${new Date(launch.date_utc).toLocaleString()}</p>
      <button onclick="saveFavorite('${launch.name}')">
        Save Favorite
      </button>
    `;

    launchesContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const filtered = launches.filter((launch) =>
    launch.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  displayLaunches(filtered);
});

// Local Storage
function saveFavorite(name) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.push(name);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  alert("Saved to favorites!");
}

// Countdown Timer
function startCountdown(date) {
  setInterval(() => {
    const difference = new Date(date) - new Date();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    countdown.textContent =
      "Next Launch Countdown: " + days + " days";
  }, 1000);
}

// API 2: NASA APOD
async function loadNASA() {
  const response = await fetch(
    "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
  );

  const data = await response.json();

  document.getElementById("nasa").innerHTML = `
    <div class="card">
      <h2>${data.title}</h2>
      <img src="${data.url}" width="100%">
      <p>${data.explanation.substring(0, 200)}...</p>
    </div>
  `;
}

loadLaunches();
loadNASA();
