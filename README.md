# 🎓 Schoold – Online Learning Platform

**Schoold** is a modern web application for an online learning experience. It provides an interactive interface to explore courses and view details, using clean and modular design principles.

## 🚀 Tech Stack

- **Vite** – Fast frontend tooling
- **HTML5** – Page structure and markup
- **SCSS** – Modular and maintainable styling
- **TypeScript** – Strongly typed JavaScript

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

## 🛠 Setup & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/CristinaM02/Schoodl.git
   cd Schoodl
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎨 Styling

The project uses SCSS for all styling, with variables, mixins, and nesting for clean and reusable code.
The main SCSS file is imported directly in main.ts:

```ts
import  './styles/style.scss';
```

There is no need to manually compile SCSS – Vite handles it automatically during development.


## 📊 Data

All course information are stored locally in JSON format and can be found in the public/data/ directory:

    public/
    └── data/
        ├── courses.json
        └── instructors.json
        
These files are loaded and used to populate content dynamically in the application.


## 🧼 Linting

Linting can be run using the following command:

```bash
npm run lint
```


## 📁 Project Structure

    Schoodl/
    ├── public/
    │   ├── data/
    │   │   ├── courses.json
    │   │   └── instructors.json
    │   └── vite.svg
    ├── src/
    │   ├── assets/
    │   │   ├── courses
    |   |   |   └── images
    │   │   └── images
    │   ├── styles/
    │   │   ├── reset.css
    │   │   └── style.scss
    │   ├── utils/
    │   │   └── vite-env.d.ts
    │   ├── all.ts
    │   ├── courses.ts
    │   └── main.ts
    ├── .gitignore
    ├── contact.html
    ├── courses.html
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── stylelint.config.js
    └── tsconfig.json