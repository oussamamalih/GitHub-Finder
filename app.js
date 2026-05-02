// ==================== TEST DATA ====================

const testUsers = [
  {
    login: "wilr",
    avatar_url: "https://avatars.githubusercontent.com/u/1024588?v=4",
    bio: "Linux creator",
    followers: 200000,
    following: 0,
    public_repos: 50,
  },
  {
    login: "natsho",
    avatar_url: "https://avatars.githubusercontent.com/u/6490553?v=4",
    bio: "Python creator",
    followers: 50000,
    following: 50,
    public_repos: 30,
  },
];

const testRepos = {
  wilr: [
    {
      name: "linux",
      description: "Linux kernel source tree",
      language: "C",
      stargazers_count: 175000,
      forks_count: 52000,
      html_url: "https://github.com/torvalds/linux",
    },
    {
      name: "subsurface-for-dirk",
      description: "Dive log program",
      language: "C++",
      stargazers_count: 800,
      forks_count: 200,
      html_url: "https://github.com/torvalds/subsurface-for-dirk",
    },
    {
      name: "test-tlb",
      description: "Test TLB performance",
      language: "C",
      stargazers_count: 400,
      forks_count: 50,
      html_url: "https://github.com/torvalds/test-tlb",
    },
  ],
  natsho: [
    {
      name: "cpython",
      description: "The Python programming language",
      language: "C",
      stargazers_count: 60000,
      forks_count: 29000,
      html_url: "https://github.com/python/cpython",
    },
    {
      name: "mypy",
      description: "Optional static typing for Python",
      language: "Python",
      stargazers_count: 17000,
      forks_count: 2700,
      html_url: "https://github.com/python/mypy",
    },
    {
      name: "peps",
      description: "Python Enhancement Proposals",
      language: "Python",
      stargazers_count: 3500,
      forks_count: 1500,
      html_url: "https://github.com/python/peps",
    },
  ],
};

// ==================== STATE ====================

const state = {
  currentUser: null,
  bookmarks: JSON.parse(localStorage.getItem("gf_bookmarks")) || [],
};

// ==================== DOM ELEMENTS ====================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsRow = document.getElementById("resultsRow");
const reposList = document.getElementById("reposList");
const welcomeState = document.getElementById("welcomeState");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const bookmarksList = document.getElementById("bookmarksList");
const bookmarkCount = document.getElementById("bookmarkCount");
const addBookmarkBtn = document.getElementById("addBookmarkBtn");
const viewBookmarksBtn = document.getElementById("viewBookmarksBtn");
const bookmarksContainer = document.getElementById("bookmarksContainer");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");

// ==================== THEME ====================

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
  localStorage.setItem("gf_theme", theme);
}

function initTheme() {
  const saved = localStorage.getItem("gf_theme") || "light";
  applyTheme(saved);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// ==================== DISPLAY FUNCTIONS ====================

function displayUserProfile(user) {
  document.getElementById("userAvatar").src = user.avatar_url;
  document.getElementById("userAvatar").alt = user.login;
  document.getElementById("userLogin").textContent = user.login;
  document.getElementById("followersCount").textContent = formatNumber(
    user.followers,
  );
  document.getElementById("followingCount").textContent = formatNumber(
    user.following,
  );
  document.getElementById("reposCount").textContent = user.public_repos;

  const bioEl = document.getElementById("userBio");
  bioEl.textContent = user.bio || "";
  bioEl.style.display = user.bio ? "block" : "none";

  hideAll();
  resultsRow.classList.remove("hidden");
}

function displayRepositories(repos) {
  reposList.innerHTML = "";

  if (!repos || repos.length === 0) {
    reposList.innerHTML = `<div class="item_ no-repo">No repositories found.</div>`;
    return;
  }

  repos.slice(0, 6).forEach((repo) => {
    const card = document.createElement("div");
    card.classList.add("item_");
    card.innerHTML = `
      <div class="repo_name">
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      </div>
      ${repo.description ? `<p class="repo_desc">${repo.description}</p>` : ""}
      <div class="repo_details_">
        ${repo.language ? `<div class="info_"><span class="lang-dot" style="background:${getLanguageColor(repo.language)}"></span>${repo.language}</div>` : ""}
        <div class="info_"><i class="fa fa-star-o"></i> ${formatNumber(repo.stargazers_count)}</div>
        <div class="info_"><i class="fa fa-code-fork"></i> ${formatNumber(repo.forks_count)}</div>
      </div>
    `;
    reposList.appendChild(card);
  });
}

// ==================== UI STATE HELPERS ====================

function hideAll() {
  welcomeState.classList.add("hidden");
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  resultsRow.classList.add("hidden");
  bookmarksList.classList.add("hidden");
}

function showLoading() {
  hideAll();
  loadingState.classList.remove("hidden");
}

function showError(message) {
  hideAll();
  document.getElementById("errorMessage").textContent = message;
  errorState.classList.remove("hidden");
}

function showWelcome() {
  hideAll();
  welcomeState.classList.remove("hidden");
}

// ==================== BOOKMARK FUNCTIONS ====================

function saveBookmarks() {
  localStorage.setItem("gf_bookmarks", JSON.stringify(state.bookmarks));
  bookmarkCount.textContent = state.bookmarks.length;
}

function addBookmark() {
  if (!state.currentUser) return;
  const exists = state.bookmarks.some(
    (b) => b.login === state.currentUser.login,
  );
  if (exists) {
    addBookmarkBtn.innerHTML = '<i class="fa fa-check"></i> Already saved!';
    setTimeout(() => {
      addBookmarkBtn.innerHTML = '<i class="fa fa-bookmark"></i> Save Profile';
    }, 1500);
    return;
  }
  state.bookmarks.push(state.currentUser);
  saveBookmarks();
  addBookmarkBtn.innerHTML = '<i class="fa fa-check"></i> Saved!';
  setTimeout(() => {
    addBookmarkBtn.innerHTML = '<i class="fa fa-bookmark"></i> Save Profile';
  }, 1500);
}

function removeBookmark(login) {
  state.bookmarks = state.bookmarks.filter((b) => b.login !== login);
  saveBookmarks();
  showBookmarks();
}

function showBookmarks() {
  if (state.bookmarks.length === 0) {
    showError("No bookmarks yet. Search a user and save their profile!");
    return;
  }
  hideAll();
  bookmarksList.classList.remove("hidden");
  bookmarksContainer.innerHTML = "";
  state.bookmarks.forEach((user) => {
    const item = document.createElement("div");
    item.classList.add("bookmark-item");
    item.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" />
      <div class="bookmark-info">
        <strong>${user.login}</strong>
        <span>${formatNumber(user.followers)} followers</span>
      </div>
      <button class="load-bookmark-btn" data-login="${user.login}">
        <i class="fa fa-arrow-right"></i>
      </button>
      <button class="remove-bookmark-btn" data-login="${user.login}">
        <i class="fa fa-trash"></i>
      </button>
    `;
    bookmarksContainer.appendChild(item);
  });
  document.querySelectorAll(".load-bookmark-btn").forEach((btn) => {
    btn.addEventListener("click", () => searchUser(btn.dataset.login));
  });
  document.querySelectorAll(".remove-bookmark-btn").forEach((btn) => {
    btn.addEventListener("click", () => removeBookmark(btn.dataset.login));
  });
}

// ==================== SEARCH ====================

function searchUser(username) {
  showLoading();
  setTimeout(() => {
    const localUser = testUsers.find(
      (u) => u.login.toLowerCase() === username.toLowerCase(),
    );
    if (localUser) {
      state.currentUser = localUser;
      displayUserProfile(localUser);
      displayRepositories(testRepos[localUser.login] || []);
    } else {
      fetchFromAPI(username);
    }
  }, 800);
}

function fetchFromAPI(username) {
  const headers = { Accept: "application/vnd.github+json" };
  fetch(`https://api.github.com/users/${username}`, { headers })
    .then((res) => res.json())
    .then((data) => {
      if (data.message && data.message.includes("rate limit")) {
        showError(
          "Rate limit reached. Please wait a few minutes and try again.",
        );
        return null;
      }
      if (data.message === "Not Found") {
        showError(`User "${username}" not found on GitHub.`);
        return null;
      }
      state.currentUser = data;
      displayUserProfile(data);
      return fetch(`https://api.github.com/users/${username}/repos`, {
        headers,
      });
    })
    .then((res) => res && res.json())
    .then((repos) => {
      if (repos) displayRepositories(repos);
    })
    .catch(() => showError("Network error. Please try again."));
}

// ==================== UTILS ====================

function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return String(num);
}

function getLanguageColor(lang) {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    C: "#555555",
    "C++": "#f34b7d",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
  };
  return colors[lang] || "#888";
}

// ==================== EVENT LISTENERS ====================

searchBtn.addEventListener("click", () => {
  const username = searchInput.value.trim();
  if (!username) {
    showError("Please enter a GitHub username.");
    return;
  }
  searchInput.value = "";
  searchUser(username);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

addBookmarkBtn.addEventListener("click", addBookmark);
viewBookmarksBtn.addEventListener("click", showBookmarks);

// ==================== INITIALIZE ====================

initTheme();
bookmarkCount.textContent = state.bookmarks.length;
showWelcome();
