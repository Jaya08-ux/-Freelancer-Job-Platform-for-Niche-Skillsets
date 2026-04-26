# SkillNiche

SkillNiche is a freelancer marketplace for specialized skills like AI prompt engineering, blockchain auditing, cybersecurity, and UI micro-interactions. It includes JWT authentication, role-based dashboards, job posting, proposals, bookmarks, recommendations, dark mode, and a basic Socket.io chat.

## Folder Structure

```text
skillniche-platform/
|-- package.json
|-- .env.example
|-- README.md
|-- public/
|   |-- index.html
|   |-- login.html
|   |-- register.html
|   |-- jobs.html
|   |-- job-details.html
|   |-- freelancer-dashboard.html
|   |-- client-dashboard.html
|   |-- profile.html
|   |-- css/
|   |   `-- styles.css
|   `-- js/
|       |-- api.js
|       |-- app.js
|       |-- auth.js
|       |-- dashboard.js
|       |-- jobs.js
|       `-- profile.js
`-- server/
    |-- config/
    |   `-- db.js
    |-- controllers/
    |   |-- authController.js
    |   |-- jobController.js
    |   |-- proposalController.js
    |   `-- userController.js
    |-- middleware/
    |   `-- authMiddleware.js
    |-- models/
    |   |-- Job.js
    |   |-- Proposal.js
    |   `-- User.js
    |-- routes/
    |   |-- authRoutes.js
    |   |-- jobRoutes.js
    |   |-- proposalRoutes.js
    |   `-- userRoutes.js
    `-- server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`.

If you do not create a `.env` file, the app now falls back to:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/skillniche
```

3. Start MongoDB locally, or point `MONGODB_URI` to your MongoDB Atlas cluster.

4. Run the project:

```bash
npm run dev
```

5. Open `http://localhost:5000`.

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/skillniche
JWT_SECRET=replace_with_a_secure_secret
```

## Features

- JWT authentication with freelancer/client roles
- Freelancer and client profile management
- Job posting, browsing, filtering, and bookmarking
- Proposal submission with accept/reject workflow
- Dashboard summaries for both roles
- Freelancer recommendations based on skill overlap
- Basic job completion rating
- Socket.io powered direct chat rooms
- Dark mode toggle

## Notes

- Tailwind is loaded through the CDN for a simple beginner-friendly setup.
- Profile images and portfolio links are stored as text URLs.
- The chat system is intentionally lightweight and uses room names generated on the client.
