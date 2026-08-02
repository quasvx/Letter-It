Letter-It 🎨
Letter-It is a lightweight, fast API for generating dynamic favicons on the fly. It extracts the first letter from any domain and converts it into a clean, square SVG with customizable colors.

Built with Cloudflare Pages Functions.

https://img.shields.io/github/stars/quasvx/letter-it
https://img.shields.io/github/issues/quasvx/letter-it
https://img.shields.io/github/license/quasvx/letter-it

🚀 Features
⚡ Blazing Fast - Edge generation with Cloudflare Pages Functions

🎨 Customizable - Choose any size and HEX color

📦 Lightweight - Native SVG output, zero dependencies

🔒 Secure - Strict parameter validation

🌐 CORS Enabled - Use it from any domain

📖 Usage
Endpoint
text
GET /faviconV2
Parameters
Parameter	Description	Example
url	Domain to generate the favicon (required)	https://google.com
size	Output size in pixels (default: 256)	128
color	Custom HEX color (default: random)	#4285f4 or 4285f4
Examples
With custom color:

text
https://letter-it.pages.dev/faviconV2?url=https://google.com&size=128&color=#4285f4
Without color (random):

text
https://letter-it.pages.dev/faviconV2?url=https://github.com&size=64
Without # in color:

text
https://letter-it.pages.dev/faviconV2?url=https://twitter.com&color=1da1f2
🛠️ Installation
1. Clone the repository
bash
git clone https://github.com/your-username/letter-it.git
cd letter-it
2. File structure
text
/
├── functions/
│   └── faviconV2.js    # Cloudflare Pages Function
├── public/
│   └── index.html      # Documentation page
└── README.md
3. Deploy to Cloudflare Pages
Option A: CLI

bash
npx wrangler pages deploy .
Option B: Git

bash
git push origin main
Option C: Dashboard

Go to Cloudflare Dashboard → Pages

Connect your repository

Set output directory: public

Deploy

💻 Usage in your website
html
<!-- As a favicon -->
<link rel="icon" href="https://letter-it.pages.dev/faviconV2?url=your-domain.com&size=64&color=4285f4">

<!-- As an avatar -->
<img src="https://letter-it.pages.dev/faviconV2?url=user.com&size=128&color=ff0000" alt="Avatar">
📝 Error responses
Code	Description
400	url is required or invalid format
400	size must be a positive number
400	color must be a valid 6-digit HEX
400	Invalid parameters
🎯 Popular color examples
text
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
💖 Support
If you find this project useful, consider supporting its development:

Support the project: go.link-it.cc.cd/donate

📄 License
MIT © 2026 Letter-It

🤝 Contributing
Contributions are welcome! Please open an issue first to discuss any changes.

Made with ❤️ and Cloudflare Pages Functions

