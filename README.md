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
