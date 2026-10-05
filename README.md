# DoctoNest

DoctoNest is a medical replacement platform for connecting healthcare professionals with medical establishments in Morocco. It allows doctors, healthcare employers, and administrators to manage profiles, job opportunities, applications, documents, and communication in a centralized system.

## Overview

The platform is designed for:

- Doctors looking for temporary replacement missions
- Medical institutions and employers looking for qualified professionals
- Administrators managing users, documents, and platform activity
- Public visitors browsing available medical opportunities and announcements

DoctoNest helps streamline the medical staffing process by making it easier to:
- publish and discover replacement missions
- create and manage professional profiles
- upload diplomas, CVs, and supporting documents
- review applications
- manage approvals and verification workflows

## Key Features

- User authentication and authorization
  - Register / login
  - Forgot password / reset password
  - JWT-based session handling
- Role-based dashboards
  - Replacement doctor dashboard
  - Employer dashboard
  - Admin dashboard
- Mission management
  - post missions
  - search missions
  - track applications
  - update status
- Professional profile management
  - personal information
  - education history
  - work experience
  - document uploads
- Document verification
  - upload CV, diploma, identity documents
  - admin review workflow
- Announcements and public listings
- Email notifications using Nodemailer
- Responsive UI built with Next.js and Tailwind CSS

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- PostgreSQL
- Neon Database / PostgreSQL-compatible hosting
- JWT authentication
- Nodemailer
- bcryptjs

## Project Structure

```bash
Doctonest/
├── app/
│   ├── api/                  # API routes
│   ├── dashboard/            # Role-based dashboards
│   ├── login/                # Login page
│   ├── register/             # Registration flow
│   ├── forgot-password/      # Password recovery
│   ├── reset-password/       # Reset password flow
│   ├── annonces/             # Public announcements
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/               # Reusable UI components
├── lib/                     # Database and auth helpers
├── public/                  # Static assets and uploads
├── scripts/                 # SQL schema and seed scripts
├── styles/                  # CSS styles
├── .gitignore
├── SETUP.md
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm or yarn
- PostgreSQL database
- A `.env.local` file configured

## Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/doctonest
JWT_SECRET=medical-replacement-platform-secret-key-2024
NODE_ENV=development
```

## Database Setup

This project expects a PostgreSQL database.

You can use:
- Neon (recommended)
- local PostgreSQL
- any hosted PostgreSQL provider

To initialize the database schema:
1. Open the SQL files in `scripts/`
2. Run `scripts/01-create-tables.sql`
3. Optionally run `scripts/02-seed-data.sql` for sample data

## Installation

```bash
npm install
```

## Running the App

Development mode:

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Available Scripts

```bash
npm run dev      # Start the app in development mode
npm run build    # Create a production build
npm run start    # Run the production build
npm run lint     # Run lint checks
```

## Demo Accounts

If you run the seed data, you can use:

- Replacement Doctor  
  - Email: `demo@replacement.com`
  - Password: `demo123`

- Employer  
  - Email: `demo@employer.com`
  - Password: `demo123`

- Admin  
  - Email: `admin@medreplace.com`
  - Password: `admin123`

## Deployment

This project is configured for deployment on Vercel and is designed to work with a PostgreSQL database hosted externally.

For production deployment:
- set your environment variables in your hosting platform
- ensure `DATABASE_URL` is configured correctly
- verify database migrations/schema are loaded
- deploy the app from your repository

## Notes

- The app uses a role-based workflow for doctors, employers, and administrators.
- Some features depend on database tables and seeded data.
- Detailed setup instructions are available in `SETUP.md`.

## License

This project is currently unlicensed unless you specify one.

## Contact

For questions or collaboration, you can reach out through the project owner or contact details available on the live platform.

---

If you want, I can also generate:
- a more professional French version
- a shorter “startup-friendly” README
- a version specifically optimized for GitHub/portfolio presentation
- a README with badges, screenshots, and deployment links
