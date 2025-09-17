# Deployment Guide

This guide will help you deploy the "Best Of Everything" voting website to production using free hosting services.

## Prerequisites

- GitHub account
- Supabase account (free tier)
- Vercel account (free tier)

## Step 1: Setup Supabase Database

### 1.1 Create Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details:
   - Name: `best-of-everything`
   - Database Password: Generate a strong password (save it securely)
   - Region: Choose closest to your users
4. Click "Create new project"

### 1.2 Setup Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and run the SQL commands
4. Verify tables are created in the Table Editor

### 1.3 Configure Authentication

1. Go to Authentication > Settings in Supabase
2. Configure Site URL: `http://localhost:3000` (update after deployment)
3. Add Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback` (update after deployment)

### 1.4 Optional: Setup Google OAuth

1. Go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID and Secret from Google Cloud Console
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`

### 1.5 Get API Keys

1. Go to Settings > API
2. Copy these values (you'll need them for deployment):
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (keep this secure!)

## Step 2: Prepare Code for Deployment

### 2.1 Update Environment Variables

1. Remove the placeholder `.env.local` file
2. Ensure your actual environment variables are in Vercel (not in git)

### 2.2 Update Supabase Configuration

Update the redirect URLs in your authentication settings after deployment.

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/best-of-everything.git
git push -u origin main
```

### 3.2 Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Build and Output Settings: (leave default)
   - Install Command: `npm install`
   - Build Command: `npm run build`

### 3.3 Add Environment Variables

In Vercel project settings > Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Get your deployment URL (e.g., `https://your-app.vercel.app`)

## Step 4: Update Supabase Settings

### 4.1 Update Authentication URLs

Go back to Supabase Authentication > Settings and update:

1. Site URL: `https://your-app.vercel.app`
2. Redirect URLs: Add `https://your-app.vercel.app/auth/callback`

### 4.2 Test the Deployment

1. Visit your deployed URL
2. Test user registration and login
3. Test adding a product
4. Test voting functionality
5. Verify email verification works

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain in Vercel

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 5.2 Update Supabase URLs

Update all authentication URLs in Supabase to use your custom domain.

## Step 6: Database Seeding (Optional)

To add initial data to your database:

### 6.1 Add Sample Categories

The schema already includes initial categories, but you can add more:

```sql
INSERT INTO categories (name, slug, description) VALUES
('Software', 'software', 'Software and applications'),
('Travel', 'travel', 'Travel gear and services'),
('Fitness', 'fitness', 'Fitness equipment and supplements');
```

### 6.2 Add Sample Products

You can add sample products through the UI or directly in the database.

## Monitoring and Maintenance

### Vercel Analytics

1. Enable Vercel Analytics in your project dashboard
2. Monitor performance and usage

### Supabase Monitoring

1. Monitor database usage in Supabase dashboard
2. Set up alerts for high usage
3. Monitor authentication metrics

### Error Tracking

Consider adding error tracking:
1. Sentry for error monitoring
2. LogRocket for user session recording
3. Vercel's built-in error tracking

## Scaling Considerations

### Database Scaling

Free Supabase tier includes:
- Up to 50,000 monthly active users
- 500MB database space
- 1GB bandwidth per month

For more usage, upgrade to Supabase Pro.

### Vercel Scaling

Free Vercel tier includes:
- 100GB bandwidth per month
- 1000 serverless function invocations per day

For more usage, upgrade to Vercel Pro.

### Performance Optimization

1. **Database Indexing**: Ensure proper indexes for search queries
2. **Image Optimization**: Use Next.js Image component for product images
3. **Caching**: Implement caching for frequently accessed data
4. **CDN**: Vercel provides global CDN automatically

## Security Checklist

- [ ] Environment variables are secure and not in git
- [ ] Database RLS policies are properly configured
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Authentication redirect URLs are updated
- [ ] Rate limiting is working
- [ ] Email verification is required for voting
- [ ] Suspicious activity detection is active

## Troubleshooting

### Common Issues

1. **Authentication not working**:
   - Check redirect URLs in Supabase
   - Verify environment variables
   - Check browser console for errors

2. **Database connection failed**:
   - Verify Supabase URL and keys
   - Check if Supabase project is active
   - Verify network connectivity

3. **Build failures**:
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Check build logs in Vercel

4. **Rate limiting not working**:
   - Verify middleware is configured
   - Check server-side validation

### Getting Help

1. Check Vercel and Supabase documentation
2. Review error logs in both platforms
3. Check GitHub issues
4. Create support tickets if needed

## Backup and Recovery

### Database Backups

1. Supabase automatically backs up your database
2. For additional safety, export data regularly:
   ```sql
   -- Export products
   COPY products TO '/path/to/products_backup.csv' DELIMITER ',' CSV HEADER;

   -- Export users (be careful with sensitive data)
   COPY profiles TO '/path/to/profiles_backup.csv' DELIMITER ',' CSV HEADER;
   ```

### Code Backups

- GitHub serves as your code backup
- Consider maintaining a mirror on GitLab or Bitbucket
- Tag releases for easy rollback

## Updates and Maintenance

### Regular Updates

1. **Dependencies**: Update npm packages monthly
2. **Security**: Monitor for security vulnerabilities
3. **Database**: Regular health checks and optimization
4. **Performance**: Monitor and optimize slow queries

### Deployment Updates

```bash
# Update code
git add .
git commit -m "Update: description of changes"
git push

# Vercel will automatically deploy
```

### Database Migrations

For schema changes:
1. Test changes in development
2. Create migration SQL scripts
3. Apply changes during low-traffic periods
4. Monitor for issues after deployment

This completes the deployment guide. Your voting website should now be live and accessible to users worldwide!