# Deployment Guide for Event Planner

## Deploying to GitHub

1. Initialize git repository (if not already initialized):
   ```
   git init
   ```

2. Add all files and commit:
   ```
   git add .
   git commit -m "Initial commit"
   ```

3. Add remote origin (replace URL if different):
   ```
   git remote add origin https://github.com/Nithin123t/Event-Planner.git
   ```

4. Push to GitHub:
   ```
   git branch -M main
   git push -u origin main
   ```

## Deploying to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in or create an account.

2. Click on "New Project" and import your GitHub repository `Event-Planner`.

3. In the project settings, set the following build options:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Click "Deploy" to start the deployment.

5. After deployment, your app will be live at the provided Vercel URL.

## Notes

- Make sure your GitHub repository is public or you have connected your GitHub account to Vercel with appropriate permissions.
- The `vercel.json` file in the project root configures the build and output directory for Vercel.
