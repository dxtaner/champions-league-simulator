# 🏆 Champions League Simulator

This is a web-based **Champions League Simulator** application built using **Node.js**, **Express**, and **EJS** template engine. The project follows the **MVC (Model-View-Controller)** architecture to manage teams, generate tournament fixtures, and simulate matches seamlessly.

## 🚀 Features

*   **Automated Fixture Generation:** Dynamically generates tournament fixtures using the custom `fixtureGenerator` utility.
*   **MVC Architecture:** Clean codebase separation with dedicated models, views, and controllers.
*   **Database Seeding:** Includes a `seed.js` script to quickly populate the database with initial tournament and team data.
*   **Dynamic UI:** Responsive views powered by EJS and styled with custom CSS.

---
## 📁 Project Structure

```text
├── config/             # Database and server configurations
├── controllers/        # Business logic (e.g., tournamentController.js)
├── models/             # Database schemas (e.g., Tournament models)
├── public/css/         # Static stylesheets
├── routes/             # App routing (e.g., tournamentRoutes.js)
├── utils/              # Helper utilities (e.g., fixtureGenerator.js)
├── views/              # EJS templates for rendering the UI
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies and scripts
├── seed.js             # Initial database population script
└── server.js           # Application entry point
```

---

---

## 🛠️ Installation & Setup

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone [https://github.com](https://github.com/dxtaner/champions-league-simulator)
cd champions-league-simulator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed the Database
Before starting the server, run the seed script to populate your database with initial data:
```bash
node seed.js
```

### 4. Start the Application
Run the main server file:
```bash
node server.js
```

The application should now be running locally. Open your browser and navigate to `http://localhost:3000` (or the port specified in your config).

---

## 🧰 Technologies Used

*   **Backend:** Node.js, Express
*   **Frontend Views:** EJS (Embedded JavaScript templates), CSS
*   **Architecture:** Model-View-Controller (MVC)
