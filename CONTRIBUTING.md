# Contributing to Best Of Everything

Thank you for your interest in contributing to Best Of Everything! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Be respectful and inclusive
- Focus on what is best for the community
- Show empathy towards other community members
- Provide constructive feedback
- Accept constructive criticism gracefully

## Getting Started

### Types of Contributions

We welcome many types of contributions:

- 🐛 Bug reports and fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX improvements
- 🧪 Tests
- 🔧 Performance improvements
- 🌐 Translations (future)

### Before You Start

1. Check existing [issues](https://github.com/yourusername/best-of-everything/issues)
2. Look for duplicate feature requests or bug reports
3. For large changes, create an issue first to discuss the approach

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for database)

### Setup Steps

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/yourusername/best-of-everything.git
   cd best-of-everything
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   # Add your Supabase credentials to .env.local
   ```

4. **Setup database**
   - Create a Supabase project
   - Run the SQL from `supabase/schema.sql`
   - Update environment variables

5. **Start development server**
   ```bash
   npm run dev
   ```

### Development Database

For development, you can:
- Use your own Supabase project
- Use the shared development database (contact maintainers)
- Use Docker with local PostgreSQL (future)

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-product-categories`
- `bugfix/fix-voting-bug`
- `docs/update-readme`
- `refactor/improve-database-queries`

### Commit Guidelines

Follow conventional commits:
```
type(scope): description

feat(auth): add Google OAuth integration
fix(voting): prevent duplicate votes
docs(readme): update deployment instructions
style(ui): improve mobile responsiveness
refactor(database): optimize product queries
test(voting): add unit tests for vote validation
```

### Code Quality

- Write TypeScript for type safety
- Follow existing code style
- Add comments for complex logic
- Keep components small and focused
- Use meaningful variable names

## Submitting Changes

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Provide clear description
   - Link related issues
   - Add screenshots if UI changes

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactor

## Testing
- [ ] Tests pass locally
- [ ] Added new tests (if applicable)
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots of UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define interfaces for data structures
- Use proper typing, avoid `any`
- Export types from `types/` directory

### React/Next.js

- Use functional components with hooks
- Follow Next.js 13+ app directory structure
- Use `'use client'` directive when needed
- Implement proper error boundaries

### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing (4px base unit)
- Use semantic color names

### Database

- Use meaningful table and column names
- Add proper indexes for performance
- Include RLS policies for security
- Document complex queries

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Write unit tests for utility functions
- Add integration tests for API endpoints
- Test error conditions and edge cases
- Mock external dependencies

### Test Structure

```typescript
describe('Component/Function Name', () => {
  it('should do expected behavior', () => {
    // Arrange
    // Act
    // Assert
  })

  it('should handle error case', () => {
    // Test error scenarios
  })
})
```

## Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props with TypeScript
- Include usage examples in README
- Update API documentation for changes

### README Updates

When adding features:
- Update feature list
- Add configuration steps if needed
- Include new environment variables
- Update screenshots if UI changed

### API Documentation

Document new endpoints:
- Parameters and types
- Response format
- Error codes
- Usage examples

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version number updated
- [ ] Changelog updated
- [ ] Database migrations (if any)
- [ ] Deployment tested

## Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: For security issues or private matters

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to Best Of Everything! 🎉