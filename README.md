🚀 LeadGenius AI

LeadGenius AI is an AI-powered B2B lead discovery and sales outreach assistant that helps users find potential companies and generate personalized cold outreach emails instantly using AI.

🔗 Live Demo:
https://leadgenius-ai-two.vercel.app/

🧠 Problem Statement

Sales teams spend a significant amount of time manually searching for potential leads and writing outreach emails.

LeadGenius AI solves this problem by:

Automatically generating B2B leads based on industry or search queries

Creating personalized sales outreach emails using AI

Providing a simple interface for quick lead discovery

✨ Features
🔎 AI Lead Discovery

Enter a query like:

AI startups in India

The system generates relevant companies using AI.

📧 AI SDR Email Generator

Generate personalized cold outreach emails for any company.

Example output:

Subject: Helping Locus.sh improve logistics efficiency

Hi Locus.sh Team,

I recently came across Locus.sh and was impressed by the innovative
AI-driven logistics optimization solutions your team is building.
⚡ Fast AI Inference

Uses high-speed LLM inference powered by Groq.

🧑‍💻 Simple SaaS Interface

Minimal and clean UI built for quick lead generation.

🏗️ Tech Stack

Frontend

Next.js

Backend

Next.js API Routes

AI

Groq LLM API

Database

Prisma ORM

SQLite

Styling

Tailwind CSS

Deployment

Vercel

⚙️ Installation

Clone the repository:

git clone https://github.com/YOUR_USERNAME/leadgenius-ai.git

Navigate into the project:

cd leadgenius-ai

Install dependencies:

npm install
🔑 Environment Variables

Create a .env file and add:

GROQ_API_KEY=your_groq_api_key
DATABASE_URL="file:./dev.db"
▶️ Run the Project

Start the development server:

npm run dev

Open:

http://localhost:3000
📂 Project Structure
leadgenius-ai
│
├── app
│   ├── api
│   │   ├── leads
│   │   │    route.ts
│   │   └── email
│   │        route.ts
│   │
│   └── page.tsx
│
├── lib
│   └── groq.ts
│
├── prisma
│   └── schema.prisma
│
├── public
├── .env
├── package.json
🚀 Future Improvements

Possible improvements:

Lead scoring (Hot / Warm / Cold leads)

Export leads to CSV

CRM integration

LinkedIn message generator

Company enrichment APIs

👨‍💻 Author

Sricharan

Built as part of exploring AI-powered SaaS applications and LLM workflows.

⭐ Support

If you like this project, consider giving it a star ⭐ on GitHub.
