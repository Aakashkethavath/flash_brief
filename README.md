<h1 align="center">
  📰 Flash_Brief News App
  <br />
  <img src="https://readme-typing-svg.herokuapp.com/?lines=Stay+updated+with+top+headlines;Powered+by+React+and+NewsAPI;Responsive+Design+with+Dark+Mode&center=true&width=500&height=45" alt="Typing SVG" />
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue" />
  <img src="https://img.shields.io/badge/Node.js-18-green" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" />
</p>

---

## 🚀 Features
- 🌐 Filter by country and category
- 📱 Responsive UI for all devices
- 🌙 Dark / Light theme toggle
- ⚡ Fast and modern React front-end
- 🛡️ Custom Rate Limiter and secure CORS setup
- 🌍 News powered by [NewsAPI](https://newsapi.org)

---

## 🛠️ Tech Stack

<p>
  <img src="https://img.shields.io/badge/React.js-(Vite)-blue" />
  <img src="https://img.shields.io/badge/Node.js-API-green" />
  <img src="https://img.shields.io/badge/Express.js-Backend-lightgrey" />
  <img src="https://img.shields.io/badge/TailwindCSS-Styling-blueviolet" />
</p>

---

## 📁 Folder Structure

The project uses a clear separation of concerns between the frontend and backend:

```
  Flash_Brief/
│
├── client/                 # React frontend (Vite)
│   ├── src/
│   ├── public/
│   ├── vercel.json         # Vercel deployment config
│   └── vite.config.js
│
├── server/                 # Node.js/Express backend
│   ├── server.js           # Main Express application
│   ├── render.yaml         # Render deployment config
│   └── .env                # API keys and environment variables
│
└── render.yaml             # Root Render configuration
```

---

## ⚙️ How to Run Locally

### 1. Setup the Backend
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `server` directory and add your NewsAPI key:
   ```env
   API_KEY=your_newsapi_key_here
   PORT=3000
   ```
4. Start the backend server: `npm start`
   *(It will run on http://localhost:3000)*

### 2. Setup the Frontend
1. Open a new terminal and navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
   *(It will run on http://localhost:5173 and proxy API requests to your local backend)*

---

## 🚀 Deployment

The project is optimized for a split-deployment strategy:
- **Frontend**: [Vercel](https://vercel.com) (Configured via `client/vercel.json`)
- **Backend API**: [Render](https://render.com) (Configured via `server/render.yaml`)

**Environment Variables for Production:**
- **Vercel (Frontend)**: Add `VITE_API_URL=<Your Render Backend URL>`
- **Render (Backend)**: Add `NODE_ENV=production`, `API_KEY=<Your Key>`, and `FRONTEND_URL=<Your Vercel URL>`

---

## 🤝 Contributing

Contributions are welcome!  
Fork this repo and submit a pull request.

---
<p align="center">
  Made with ❤️ by <strong>Akash_ktvth</strong>
</p>
