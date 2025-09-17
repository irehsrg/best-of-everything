# Best Of Everything - Product Voting Website

A comprehensive product voting website where users can find and vote on the best products in any category. Built with Next.js, Supabase, and deployed on Vercel.

## Features

### Core Functionality
- **Product Discovery**: Search and browse products across various categories
- **Community Voting**: Users can upvote products they own/recommend (one vote per user per product)
- **Product Submission**: Add new products with descriptions and categories
- **Ranking System**: Products ranked by votes with visible vote counts
- **Flexible Categories**: Tag-based categorization system

### User Features
- **Authentication**: Email/password and Google OAuth sign-in
- **User Profiles**: View voting history and user stats
- **Email Verification**: Required for voting to prevent spam
- **Responsive Design**: Works seamlessly on mobile and desktop

### Security & Anti-Manipulation
- **Rate Limiting**: Prevents excessive voting and product submissions
- **Suspicious Activity Detection**: Advanced algorithms to detect vote manipulation
- **Email Verification**: Required before users can vote
- **Database-level Constraints**: Ensures one vote per user per product

### Technical Features
- **Fast Search**: Full-text search across product names and descriptions
- **Real-time Updates**: Vote counts update instantly
- **Pagination**: Efficient loading of large product lists
- **Filtering**: Sort by votes, recency, or name; filter by categories and time ranges

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Deployment**: Vercel (free hosting)
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### 1. Setup Environment Variables

Copy `.env.local.example` to `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

1. Create a new Supabase project
2. Run the SQL commands from `supabase/schema.sql` in your Supabase SQL editor
3. Enable Google OAuth in Supabase Auth settings (optional)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Database Schema

### Tables

#### `profiles`
- User profile information extending Supabase auth
- Email verification status
- Created/updated timestamps

#### `products`
- Product information (name, description, categories)
- Vote count tracking
- Verification status
- User who added the product

#### `votes`
- User votes with unique constraint per user/product
- Automatic vote count updates via triggers

#### `categories`
- Predefined categories with product counts
- Automatic count updates via triggers

### Security

- Row Level Security (RLS) enabled on all tables
- Policies for user access control
- Database triggers for automatic count updates

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── profile/           # User profile page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── auth-form.tsx      # Authentication form
│   ├── auth-modal.tsx     # Authentication modal
│   ├── header.tsx         # Navigation header
│   ├── product-card.tsx   # Product display card
│   ├── product-list.tsx   # Product listing
│   ├── add-product-form.tsx # Product submission form
│   ├── search-bar.tsx     # Search functionality
│   └── search-filters.tsx # Filtering options
├── contexts/              # React contexts
│   └── auth-context.tsx   # Authentication state
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client config
│   ├── supabase-server.ts # Server-side Supabase
│   ├── database.ts        # Database operations
│   ├── rate-limit.ts      # Rate limiting logic
│   └── anti-manipulation.ts # Security checks
├── types/                 # TypeScript definitions
│   ├── database.ts        # Database types
│   └── index.ts          # General types
├── supabase/             # Database schema
│   └── schema.sql        # Database setup SQL
└── middleware.ts         # Next.js middleware
```

## Development

### Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding Features

1. **New Components**: Add to `components/` directory
2. **Database Changes**: Update `supabase/schema.sql` and types
3. **New Pages**: Add to `app/` directory following Next.js 13+ app structure
4. **API Functions**: Add to `lib/database.ts` for data operations

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy automatically on git push

### Environment Variables

Required for production:
- Supabase URL and keys
- Any additional API keys for external services

## Security Considerations

### Anti-Manipulation Measures

1. **Rate Limiting**: 20 votes per minute, 5 product submissions per 5 minutes
2. **Account Verification**: Email verification required for voting
3. **Suspicious Activity Detection**:
   - Rapid voting patterns
   - New accounts with high activity
   - Voting only for products by same user
   - Multiple votes (prevented by DB constraints)

4. **Content Quality Checks**:
   - Minimum description length
   - Duplicate product detection
   - Spam content filtering

### Database Security

- Row Level Security (RLS) policies
- Unique constraints to prevent duplicate votes
- Server-side validation for all operations
- Automatic triggers for data consistency

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions:
1. Check the GitHub issues
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Product comparison features
- [ ] User reputation system
- [ ] API for third-party integrations
- [ ] Mobile app development
- [ ] Advanced search with filters
- [ ] Product image upload and optimization
- [ ] Social features (following users, sharing)
- [ ] Admin panel for content moderation
- [ ] Advanced reporting and analytics