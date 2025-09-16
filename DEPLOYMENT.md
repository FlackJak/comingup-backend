# Deployment Instructions for Comingup.com

## Frontend Deployment (Next.js on Vercel)

1. Create a free account on [Vercel](https://vercel.com/).
2. Install Vercel CLI (optional):
   ```
   npm i -g vercel
   ```
3. From the project root, navigate to the frontend directory:
   ```
   cd comingup-frontend
   ```
4. Initialize deployment:
   ```
   vercel
   ```
5. Follow the prompts to link or create a new project.
6. Vercel will detect Next.js and deploy automatically.
7. After deployment, your frontend will be live on a vercel.app domain.
8. To redeploy after changes:
   ```
   vercel --prod
   ```

## Backend Deployment (Node.js GraphQL API on Render)

1. Create a free account on [Render](https://render.com/).
2. Create a new Web Service.
3. Connect your GitHub repository or manually deploy by pushing your backend code.
4. Set the build command:
   ```
   npm install
   ```
5. Set the start command:
   ```
   node server.js
   ```
6. Set environment variables on Render dashboard:
   - `MONGODB_URI` (your MongoDB connection string)
   - `JWT_SECRET` (your JWT secret key)
7. Deploy the service.
8. Render will provide a public URL for your backend API.
9. Update your frontend `graphqlClient.ts` endpoint to point to this URL.

## Additional Notes

- Ensure your MongoDB instance is accessible from Render.
- For production, consider using managed MongoDB services like MongoDB Atlas.
- Configure CORS properly on backend to allow frontend domain.
- Set up environment variables securely on both platforms.
- Monitor logs and usage on Vercel and Render dashboards.

---

If you want, I can help you with setting up GitHub repositories, pushing code, and configuring these deployments step-by-step.
