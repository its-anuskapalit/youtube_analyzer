📂 Project Structure
its-anuskapalit/
│
├── public/               # Static assets
├── src/                  # Main source code
├── supabase/             # Backend or database setup
├── .env                  # Environment variables
├── .gitignore            # Git ignored files
├── README.md             # Project documentation
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── eslint.config.js      # Linting configuration
└── tsconfig.*.json       # TypeScript configurations

⚙️ Tech Stack

Frontend: Vite + TypeScript + React

Styling: Tailwind CSS

Backend / Database: Supabase

Package Manager: Bun / npm

Linting & Formatting: ESLint

DevOps Tools (optional): Docker, GitHub Actions, CI/CD pipelines

🧠 Features

Modular code structure with reusable components

Supabase integration for authentication and data management

Tailwind for rapid and responsive UI design

Optimized builds using Vite

Environment-based configuration using .env

CI/CD ready setup for easy deployment

🪄 Getting Started
1️⃣ Clone the repository
git clone https://github.com/its-anuskapalit/its-anuskapalit.git
cd its-anuskapalit

2️⃣ Install dependencies
bun install
# or
npm install

3️⃣ Create a .env file

Add your environment variables inside .env:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

4️⃣ Run the development server
bun dev
# or
npm run dev

5️⃣ Build for production
bun run build
# or
npm run build

🧰 Scripts
Command	Description
bun dev	Run the development server
bun run build	Build for production
bun run lint	Run linter checks
bun start	Start production build
🚢 Deployment

This project can be deployed using:

Vercel

Netlify

Render

Supabase Hosting

Docker

Example with Vercel:

vercel deploy

🧑‍💻 Author

👩‍💻 Anuska Palit
📧 Connect on GitHub

💼 DevOps | AI | Full Stack Developer

📜 License

This project is licensed under the MIT License — feel free to use and modify it.
