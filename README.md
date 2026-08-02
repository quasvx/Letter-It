Letter-It 🎨
Letter-It is a lightweight, fast API for generating dynamic favicons on the fly. It extracts the first letter from any domain and converts it into a clean, square SVG with customizable colors.

Built with Cloudflare Pages Functions.


🚀 Features
⚡ Blazing Fast - Edge generation with Cloudflare Pages Functions

🎨 Customizable - Choose any size and HEX color

📦 Lightweight - Native SVG output, zero dependencies

🔒 Secure - Strict parameter validation

🌐 CORS Enabled - Use it from any domain

📖 Usage
Endpoint

GET /faviconV2
Parameters
Parameter	Description	Example
url	Domain to generate the favicon (required)	https://google.com
size	Output size in pixels (default: 256)	128
color	Custom HEX color (default: random)	#4285f4 or 4285f4
Examples
With custom color:

https://letter-it.pages.dev/faviconV2?url=https://google.com&size=128&color=#4285f4

Without color (random):

https://letter-it.pages.dev/faviconV2?url=https://github.com&size=64

Without # in color:

https://letter-it.pages.dev/faviconV2?url=https://twitter.com&size=256&color=1da1f2

💻 Usage in your website


(<)link rel="icon" href="https://letter-it.pages.dev/faviconV2?url=https://your-domain.com&size=64&color=4285f4"(>)

dont place the "(" and ")"

<!-- As an avatar -->
(<)img src="https://letter-it.pages.dev/faviconV2?url=https://user.com&size=128&color=ff0000" alt="Avatar"(>)

📝 Error responses
Code	Description
400	url is required or invalid format
400	size must be a positive number
400	color must be a valid 6-digit HEX
400	Invalid parameters
🎯 Popular color examples

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

