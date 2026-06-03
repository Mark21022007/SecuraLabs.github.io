# SecuraLabs — Safe • Simple • Reliable

Welcome to the official repository for **SecuraLabs**, a safety technology company dedicated to building drinkware protection for safer social spaces. 

This repository contains the source code for our responsive product website and interactive demo, hosted at [Mark21022007/SecuraLabs.github.io](https://github.com/Mark21022007/SecuraLabs.github.io).

---

## 🌟 About SecuraLabs & Ki-Liner

SecuraLabs was founded to shift safety from reactive to built-in. Our flagship product, **Ki-Liner**, is a passive, single-use safety layer designed to fit seamlessly into the normal service flow of venues, campuses, events, and hospitality operations.

### Key Features of Ki-Liner
* **Passive Protection:** Once placed inside drinkware, it works quietly without requiring any app, battery, or manual user action.
* **Smart Detection:** Designed to monitor chemical signatures associated with common drink-adulteration concerns (such as GHB, ketamine analogs, and benzodiazepines).
* **Gel-Lock Activation:** If a dangerous chemical threshold is crossed, a localized reaction alters the liner's structure, creating a gel-lock barrier to physically interrupt consumption.
* **Thermal & Cold Variants:** Available in standard and thermal variants to support different beverage service temperatures.

---

## 📁 Repository Structure

The website is built using modern web standards (**HTML5, JavaScript, and Tailwind CSS**) to deliver a fast, responsive, and visually stunning interactive experience.

```bash
├── index.html           # Home page featuring the main product benefits and scroll animation
├── about.html           # Company history, mission, leadership, and the product expansion roadmap
├── shop.html            # Product options (standard vs thermal) and interactive shopping cart
├── contact.html         # Partnership and inquiry contact form
├── faq.html             # Frequently Asked Questions about Ki-Liner detection and compliance
├── privacy.html         # Privacy policy
├── terms.html           # Terms and conditions
├── main.js              # Core interactivity (scroll-linked canvas animation, theme manager, shopping cart)
├── layout.js            # Shared page layouts (header, footer, and navigation components)
├── styles.css           # Styling overrides and custom utility classes
├── img/                 # Assets and product imagery (including generated webp assets)
└── extract_frames.py    # Python helper script to extract frames for the scroll-based video animation
```

---

## 🛠️ How to Run Locally

Since this is a static website, you can run it locally with any simple HTTP server:

### Option 1: VS Code Live Server
1. Open the project folder in VS Code.
2. Click **Go Live** in the status bar (requires the Live Server extension).

### Option 2: Python HTTP Server
Run the following command in the project directory:
```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

### Option 3: Node.js (serve)
If you have Node installed, you can use `npx`:
```bash
npx serve .
```

---

## 🚀 Deployment

The site is configured for automated deployment via **GitHub Pages**. Any changes pushed to the `main` branch of this repository will be instantly built and served at:
**[https://securalabs.github.io](https://securalabs.github.io)** (or your configured custom GitHub Pages URL).

## 🛡️ License

All rights reserved. Intellectual property, brand assets, and product concepts are proprietary to **SecuraLabs**.
