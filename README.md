# FinanceApp 💰

A modern personal finance web application built with Next.js 16, Supabase, and Tailwind CSS.

## Features

- 📊 Interactive expense and income tracking
- 📈 Visual charts and analytics
- 🏷️ Transaction categorization
- 📅 Period-based filtering
- 🎯 Smart onboarding flow
- 🌙 Dark mode interface
- 📱 Responsive design

## Tech Stack

- **Frontend**: Next.js 16, React 18, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts v3
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Supabase account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/neuronando-debug/drfezinho.git
   cd drfezinho
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Initialize the database**
   - Go to your Supabase project
   - Open the SQL Editor
   - Run the SQL from `supabase-schema.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### Quick Start

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   
   In Vercel Project Settings → Environment Variables, add:
   
   | Variable | Value | Scope |
   |----------|-------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | Production, Preview, Development |

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

### Security Checklist

Before deploying:

- ✅ Verify `.env.local` is in `.gitignore`
- ✅ Confirm only `NEXT_PUBLIC_*` variables are exposed
- ✅ Check Supabase RLS policies are enabled
- ✅ Ensure `SUPABASE_SERVICE_ROLE_KEY` is **NOT** in version control
- ✅ Review SECURITY.md for best practices

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (app)/           # Protected app pages
│   └── welcome/         # Onboarding flow
├── components/
│   ├── ui/              # Reusable UI components
│   ├── dashboard/       # Dashboard specific components
│   └── layout/          # Layout components
├── lib/
│   ├── supabase/        # Supabase client & server
│   └── utils.ts         # Utility functions
└── types/
    └── database.ts      # TypeScript type definitions
```

## Security

This application follows security best practices:

- **Row Level Security (RLS)**: Enabled on all database tables
- **Environment Variables**: Only public keys exposed to frontend
- **Authentication**: Secure session management via Supabase
- **Data Protection**: HTTPS enforced on production

See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

## Database Schema

The application uses the following main tables:

- **profiles**: User profile information
- **transactions**: Income/expense records with user isolation via RLS

See `supabase-schema.sql` for the complete schema.

## Contributing

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -am 'Add feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please reach out to neuronando@gmail.com

---

**Built with ❤️ using Next.js and Supabase**
