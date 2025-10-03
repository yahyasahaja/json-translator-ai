# 🚀 Netlify Deployment Guide

This guide will help you deploy the JSON Translator to Netlify.

## 📋 Prerequisites

- GitHub repository with your code
- Netlify account
- OpenAI API key

## 🔧 Deployment Steps

### 1. Connect to Netlify

1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Select your repository

### 2. Configure Build Settings

**Build Command:** `npm run build`
**Publish Directory:** `.next`
**Node Version:** 18

### 3. Environment Variables (Optional)

**Note:** Users enter their API key directly in the app's UI. Environment variables are optional and mainly for:
- Providing a default API key
- Server-side API key management
- Testing purposes

If you want to set a default API key, add in Netlify dashboard → Site settings → Environment variables:

```
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

**For most users:** No environment variables needed - they'll enter their API key in the app!

### 4. Deploy

Click "Deploy site" and wait for the build to complete.

## 🛠️ Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test locally
npm run preview
```

## 🔍 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] API endpoints work
- [ ] File upload works
- [ ] Translation works (test with dummy API key)
- [ ] Environment variables are set
- [ ] SSL certificate is active

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (should be 18)
- Verify all dependencies are installed
- Check for TypeScript errors

### API Errors
- Verify OpenAI API key is set
- Check API key has sufficient credits
- Test with dummy API key first

### Performance Issues
- Enable Netlify's CDN
- Check bundle size
- Optimize images and assets

## 📊 Monitoring

- Use Netlify Analytics for traffic insights
- Monitor API usage in OpenAI dashboard
- Set up error tracking (Sentry, LogRocket)

## 🔒 Security

- Never commit API keys to repository
- Use environment variables for sensitive data
- Enable HTTPS redirect
- Set up proper CORS policies

## 📈 Optimization

- Enable Netlify's edge functions for better performance
- Use Netlify's image optimization
- Implement caching strategies
- Monitor bundle size and optimize

## 🆘 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally with `npm run preview`
4. Check OpenAI API status
