# OptimAI - Career Guide
This project is an all-in-one career development platform built with **Next.js** and **Prisma**. It offers users a comprehensive environment to practice and improve their skills through quizzes and a performance dashboard that provides **real-time AI-powered suggestions**. Beyond practice, the platform enables users to create, enhance, and download professional **resumes** and **cover letters** with the assistance of AI. Additionally, it features an industrial insights dashboard to keep users informed about current trends and opportunities, helping them prepare effectively for their careers.  

## Table of Contents

- Project Overview

- Features

- Tech Stack

- Getting Started

- Setup

- Environment Variables

- Prisma Setup

- Running the Project

- Project Snapshots
  
- Deployment

- Folder Structure

- Disclaimer

### Project Overview
This project is a comprehensive career development platform designed to help users enhance their skills and prepare for job opportunities. It combines interactive quizzes, AI-powered performance suggestions, resume and cover letter creation with AI enhancements, and an industry insights dashboard to provide a seamless and personalized experience for career growth.

### Features

> **Interactive Quizzes:** Practice various topics with quizzes designed to improve your skills.

> **Performance Dashboard:** Track your progress and get real-time AI-powered feedback and suggestions.

> **Resume Builder:** Create, enhance, and download professional resumes using AI assistance.

> **Cover Letter Generator:** Build personalized cover letters with AI support.

> **Industrial Insight Dashboard:** Stay updated with current trends, job market insights, and industry news.

> **User Authentication:** Secure login and registration features.

> **Real-time Updates:** Dynamic content updates and seamless user experience with Next.js server components.

### Tech Stack
- **Frontend:** Next.js (React framework) with server-side rendering and API routes.

- **Backend**: Node.js with Prisma ORM for database access.

- **Database**: PostgreSQL (or your choice of relational DB) via Prisma.

- **AI Integration:** AI services for resume and cover letter enhancement, performance suggestions.

- **Styling**: Tailwind CSS / your CSS framework.

- **Deployment**: Vercel for easy cloud deployment.

### Getting Started
  Follow these steps to run the project locally:
  **Setup**
1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/yourproject.git
cd yourproject
```
2. **Install dependencies:**

```bash
npm install
```
 ---
 ### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL=your_database_connection_string
NEXT_PUBLIC_API_KEY=your_api_key_here
AI_SERVICE_KEY=your_ai_service_key_here
# Add other necessary keys here
```

*Make sure to replace the placeholder values with your actual credentials.*

---
### Prisma Setup

1. Generate Prisma client after updating the schema:

```bash
npx prisma generate
```

2. Apply migrations to your database:

```bash
npx prisma migrate dev --name init
```

---
### Running the Project

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---
### Project Snapshots
## HomePage
![HomePage](https://github.com/user-attachments/assets/96ccc092-0be8-40bf-be35-d0e4b5413872)


## Interview Prep Dashboard
![interview](https://github.com/user-attachments/assets/02db7c85-a79b-4794-818d-4034cc868c64)


## Industrial Insights
![screencapture-optima-aii-vercel-app-dashboard-2025-06-03-14_29_40](https://github.com/user-attachments/assets/684f0ab3-2f51-491a-b7c3-55e0d540f7a6)

---
## Deployment

The project is optimized for deployment on Vercel. To deploy:

1. Push your code to GitHub.
2. Connect your GitHub repository to Vercel.
3. Configure environment variables in Vercel dashboard.
4. Vercel will automatically build and deploy your application.

---
## Folder Structure

```
/app              # Next.js app directory containing pages and components
/lib              # Helper libraries, Prisma client setup, API utilities
/actions          # Server actions for data fetching and mutations
/components       # Reusable UI components
/prisma           # Prisma schema and migration files
/public           # Static assets like images and icons
/styles           # Global and component-level styles
```

---
### Disclaimer:
This project is intended solely for educational and learning purposes. It is not designed to promote or facilitate any unethical, illegal, or unauthorized activities. Users are expected to use this project responsibly and in accordance with applicable laws and ethical standards.
