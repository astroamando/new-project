const launchesContainer = document.getElementById("launches");
const searchInput = document.getElementById("search");
const countdown = document.getElementById("countdown");

let launches = [];

async function loadLaunches() {
  const response = await fetch("https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10");
  const data = await response.json();

  launches = data.results;
  displayLaunches(launches);

  if (launches.length > 0) {
    startCountdown(launches[0].window_start);
  }
}

function displayLaunches(data) {
  launchesContainer.innerHTML = "";

  data.forEach((launch) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${launch.name}</h3>
      <p><strong>Provider:</strong> ${launch.launch_service_provider.name}</p>
      <p><strong>Date:</strong> ${new Date(launch.window_start).toLocaleString()}</p>
      <button onclick="saveFavorite('${launch.name}')">Save Favorite</button>
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

function saveFavorite(name) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(name);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Saved to favorites!");
}

function startCountdown(date) {
  setInterval(() => {
    const difference = new Date(date) - new Date();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    countdown.textContent = "Next Launch Countdown: " + days + " days";
  }, 1000);
}

async function loadNASAImage() {
  const response = await fetch("https://images-api.nasa.gov/search?q=space&media_type=image");
  const data = await response.json();

  const item = data.collection.items[0];
  const imageUrl = item.links[0].href;
  const title = item.data[0].title;

  document.getElementById("nasa").innerHTML = `
    <div class="card">
      <h3>${title}</h3>
      <img src="${imageUrl}" alt="${title}" width="100%">
    </div>
  `;
}

loadLaunches();
loadNASAImage();
