# Letter-It 🎨

**Letter-It** is a lightweight, fast API for generating dynamic favicons on the fly. Built with **Cloudflare Pages Functions**.

[![GitHub stars](https://img.shields.io/github/stars/quasvx/Letter-It)](https://github.com/quasvx/Letter-It/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/quasvx/Letter-It)](https://github.com/quasvx/Letter-It/issues)
[![GitHub license](https://img.shields.io/github/license/quasvx/Letter-It)](https://github.com/quasvx/Letter-It/blob/main/LICENSE)

## 🚀 Features

- ⚡ **Blazing Fast** - Edge generation with Cloudflare Pages Functions
- 🎨 **Two Styles** - Rounded (faviconV1) and Square (faviconV2)
- 📦 **Lightweight** - Native SVG output, zero dependencies
- 🔒 **Secure** - Strict parameter validation
- 🌐 **CORS Enabled** - Use it from any domain
- 🌍 **Multi-language** - Auto-detects browser language (EN, ES, FR, DE, JA, ZH)

## 📖 Usage

### Endpoints

| Endpoint | Style | Description |
|----------|-------|-------------|
| /faviconV1 | Rounded | Generates favicon with rounded corners (rx="8") |
| /faviconV2 | Square | Generates favicon with square corners (rx="0") |

### Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| url | Domain to generate the favicon (required) | google.com |
| size | Output size in pixels (default: 256) | 128 |
| color | Custom HEX color (default: random) | 4285f4 |

### Examples

**Rounded (faviconV1):**
https://letter-it.b4.cc.cd/faviconV1?url=google.com&size=128&color=4285f4

**Square (faviconV2):**
https://letter-it.b4.cc.cd/faviconV2?url=github.com&size=64&color=24292e

**Without color (random):**
https://letter-it.b4.cc.cd/faviconV1?url=twitter.com&size=256

## 🛠️ Installation

### 1. Clone the repository
git clone https://github.com/quasvx/Letter-It.git
cd Letter-It

### 2. File structure
/
├── functions/
│   ├── faviconV1.js    # Rounded corners
│   └── faviconV2.js    # Square corners
├── images/
│   ├── favicon.png     # Rounded favicon image
│   └── faviconv2.png   # Square favicon image
├── public/
│   └── index.html      # Documentation page
└── README.md

### 3. Deploy to Cloudflare Pages

**Option A: CLI**
npx wrangler pages deploy .

**Option B: Git**
git push origin main

**Option C: Dashboard**
1. Go to Cloudflare Dashboard -> Pages
2. Connect your repository
3. Set output directory: public
4. Deploy

## 💻 Usage in your website

<!-- As a favicon (rounded) -->
<link rel="icon" href="https://letter-it.b4.cc.cd/faviconV1?url=your-domain.com&size=64&color=4285f4">

<!-- As a favicon (square) -->
<link rel="icon" href="https://letter-it.b4.cc.cd/faviconV2?url=your-domain.com&size=64&color=4285f4">

<!-- As an avatar -->
<img src="https://letter-it.b4.cc.cd/faviconV1?url=user.com&size=128&color=ff0000" alt="Avatar">

## 📝 Error responses

| Code | Description |
|------|-------------|
| 400 | url is required or invalid format |
| 400 | size must be a positive number |
| 400 | color must be a valid 6-digit HEX |
| 400 | Invalid parameters |

## 🎯 Popular color examples

# Google Blue
?url=google.com&color=4285f4

# GitHub Dark
?url=github.com&color=24292e

# Twitter Blue
?url=twitter.com&color=1da1f2

# YouTube Red
?url=youtube.com&color=ff0000

# Spotify Green
?url=spotify.com&color=1db954

## 🌍 Multi-language Support

The documentation page automatically detects your browser language and displays content in:

- English (default)
- Spanish
- French
- German
- Japanese
- Chinese

## 💖 Support

If you find this project useful, consider supporting its development:

**Support the project:** https://go.link-it.cc.cd/donate

## 📄 License

MIT © 2026 Letter-It

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss any changes.

---

**Made with ❤️ and Cloudflare Pages Functions**
