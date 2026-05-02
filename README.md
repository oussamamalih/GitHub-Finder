# 🐙 GitHub Finder

A clean, responsive web app to search GitHub user profiles and repositories — with bookmarks and dark mode support.

---

## ✨ Features

- 🔍 **User Search** — Search any GitHub username and view their profile instantly
- 📦 **Repositories** — Displays up to 6 public repos with language, stars, and forks
- 🔖 **Bookmarks** — Save and revisit profiles (persisted via `localStorage`)
- 🌙 **Dark / Light Mode** — Toggle with animated pill switch (persisted via `localStorage`)
- ⚡ **Test Data** — Works offline with built-in demo users (`wilr`, `natsho`)
- 📱 **Responsive** — Fully adapted for mobile and tablet screens

---

## 📁 Project Structure

```
github-finder/
├── index.html        # Main HTML structure
├── styles.css        # CSS variables, layout, components, responsive
├── app.js            # Logic: search, bookmarks, theme, API
└── github_logo.png   # Favicon
```

---

## 🚀 Getting Started

No build tools required. Just open the file in your browser:

```bash
# Clone or download the project
open index.html
```

Or serve it locally:

```bash
npx serve .
# Then visit http://localhost:3000
```

---

## 🔌 GitHub API

The app uses the public **GitHub REST API v3**:

- `GET https://api.github.com/users/{username}` — Fetch user profile
- `GET https://api.github.com/users/{username}/repos` — Fetch repositories

> ⚠️ The unauthenticated GitHub API allows **60 requests/hour** per IP. If you hit the rate limit, the app will display a friendly error message.

---

## 🧪 Demo Users (Offline Mode)

If you search for these usernames, the app returns local mock data (no API call needed):

| Username | Description       |
|----------|-------------------|
| `wilr`   | Linux creator     |
| `natsho` | Python creator    |

---

## 🎨 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Markup     | HTML5                               |
| Styling    | CSS3 (custom properties, flexbox)   |
| Logic      | Vanilla JavaScript (ES6+)           |
| Icons      | Font Awesome 6                      |
| Fonts      | Google Fonts — Space Mono & Syne    |

---

## 📦 Language Colors

The app automatically colors language badges based on the programming language (JavaScript, Python, C, Rust, Go, etc.).

---

## 📱 Responsive Breakpoints

| Breakpoint  | Layout                              |
|-------------|-------------------------------------|
| > 900px     | Side-by-side (profile + repos)      |
| ≤ 900px     | Stacked vertically                  |
| ≤ 560px     | Compact navbar, full-width search   |

---

## 📄 License

MIT — free to use, modify, and distribute.
