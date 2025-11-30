# TRTL Cooling Solutions - Deployment Guide

## 🚀 Free Deployment to Production

This guide will help you deploy your TRTL Cooling Solutions AC Service Billing application to production using **completely FREE** hosting services.

### Architecture Overview
- **Frontend (React)**: Vercel (Free)
- **Backend (Node.js/Express)**: Render (Free)
- **Database (MongoDB)**: MongoDB Atlas (Free)

---

## Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create Account & Cluster
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email (FREE tier)
3. Click "Build a Database"
4. Choose **FREE (M0 Sandbox)** tier - 512MB storage
5. **Provider**: AWS
6. **Region**: Choose closest to you (e.g., Mumbai for India)
7. **Cluster Name**: `trtl-cooling` or keep default
8. Click "Create"

### 1.2 Create Database User
1. Navigate to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. **Username**: `trtladmin`
4. **Password**: Click "Autogenerate Secure Password" and **SAVE IT**
5. **User Privileges**: "Read and write to any database"
6. Click "Add User"

### 1.3 Configure Network Access
1. Navigate to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.4 Get Connection String
1. Navigate to **Database** (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. **Driver**: Node.js, **Version**: 4.1 or later
5. Copy the connection string:
   ```
   mongodb+srv://trtladmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password from step 1.2
7. Add database name after `.net/`: `trtl-cooling`
8. Final format:
   ```
   mongodb+srv://trtladmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/trtl-cooling?retryWrites=true&w=majority
   ```
9. **SAVE THIS CONNECTION STRING** - You'll need it for backend deployment

---

## Step 2: Setup GitHub Repository

### 2.1 Initialize Git (if not already done)
```bash
cd /Users/doddakulanagendrababu/ac-service-billing
git init
git add .
git commit -m "Initial commit - TRTL Cooling Solutions"
```

### 2.2 Create GitHub Repository
1. Visit: https://github.com/new
2. **Repository name**: `trtl-cooling-solutions`
3. **Visibility**: Public or Private (your choice)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/trtl-cooling-solutions.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Visit: https://render.com
2. Sign up with GitHub (FREE)
3. Authorize Render to access your GitHub repositories

### 3.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `trtl-cooling-solutions`
3. Configure settings:

   **Basic Settings:**
   - **Name**: `trtl-cooling-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`

   **Build & Start:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

   **Instance Type:**
   - Select **Free** tier

### 3.3 Add Environment Variables
Click "Advanced" → "Add Environment Variable" and add these:

```
PORT=5000
NODE_ENV=production

# MongoDB Connection (use your string from Step 1.4)
MONGODB_URI=mongodb+srv://trtladmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/trtl-cooling?retryWrites=true&w=majority

# JWT Secret (change this to something secure)
JWT_SECRET=trtl_secret_key_2025_secure_change_this

# Company Details
COMPANY_NAME=TRTL Cooling Solutions
COMPANY_TAGLINE=Cooling You Can Trust
COMPANY_PAN=DJYPM4672Q
COMPANY_PHONE=+91-8179697191
COMPANY_EMAIL=info@trtlcooling.com

# Bill Address
COMPANY_BILL_ADDRESS=D.No.2-12, Kollapalem, Kaja, Krishna DT, Andhra Pradesh - 521150

# Office Address
COMPANY_OFFICE_ADDRESS=Plot no-721, Huda Colony, Chanda Nagar, Hyderabad-500050

# Bank Details
BANK_ACCOUNT_NAME=M Picheswara Rao
BANK_ACCOUNT_NO=782701505244
BANK_IFSC=ICIC0007827
BANK_BRANCH=Salarpuria Sattva

# Payment Terms
PAYMENT_TERMS=30 Days credit

# Frontend URL (will update after frontend deployment)
FRONTEND_URL=*
```

### 3.4 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Once deployed, **SAVE YOUR BACKEND URL**:
   ```
   https://trtl-cooling-backend.onrender.com
   ```
4. Test it by visiting: `https://trtl-cooling-backend.onrender.com/api/health`
   - You should see: `{"status":"OK","message":"AC Service Billing API is running"}`

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Update Frontend Environment Variable
Before deploying, update the production environment file:

**File**: `frontend/.env.production`
```
REACT_APP_API_URL=https://trtl-cooling-backend.onrender.com/api
```

Replace `trtl-cooling-backend` with your actual backend name from Step 3.4.

Commit this change:
```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push
```

### 4.2 Create Vercel Account
1. Visit: https://vercel.com
2. Sign up with GitHub (FREE)
3. Authorize Vercel to access your GitHub repositories

### 4.3 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository: `trtl-cooling-solutions`
3. Configure settings:

   **Framework Preset**: Create React App

   **Root Directory**: `frontend`

   **Build Settings:**
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

   **Environment Variables:**
   Click "Environment Variables" and add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://trtl-cooling-backend.onrender.com/api`
   - **Environment**: Production

### 4.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build and deployment
3. Once deployed, you'll get a URL like:
   ```
   https://trtl-cooling-solutions.vercel.app
   ```

### 4.5 Update Backend CORS (Important!)
Now update your backend's `FRONTEND_URL` environment variable in Render:

1. Go to Render Dashboard → Your Web Service
2. Navigate to "Environment" tab
3. Find `FRONTEND_URL` variable
4. Update value to: `https://trtl-cooling-solutions.vercel.app`
5. Save changes (Render will auto-redeploy)

---

## Step 5: Verification & Testing

### 5.1 Test Backend
Visit: `https://your-backend.onrender.com/api/health`
- Expected: `{"status":"OK","message":"AC Service Billing API is running"}`

### 5.2 Test Frontend
1. Visit: `https://your-frontend.vercel.app`
2. Application should load
3. Try these operations:
   - Navigate to Customers → Add Customer
   - Add a Camp
   - Upload Work Order
   - Generate Bill

### 5.3 Test Database Connection
- Add a customer in the frontend
- If successful, MongoDB connection is working

---

## Optional: Custom Domain

### Free Subdomain (Automatic)
Your apps are already live at:
- Frontend: `https://trtl-cooling-solutions.vercel.app`
- Backend: `https://trtl-cooling-backend.onrender.com`

### Custom Domain (Paid - $10-15/year)
If you want `www.trtlcooling.com`:

1. **Buy Domain**: Namecheap, GoDaddy, Google Domains
2. **Add to Vercel**:
   - Go to Project Settings → Domains
   - Add your domain
   - Update DNS records as instructed
3. **Update CORS**: Update `FRONTEND_URL` in Render to your new domain

---

## Important Notes

### Free Tier Limitations
1. **Render Backend**:
   - Spins down after 15 minutes of inactivity
   - First request after sleep takes ~30-60 seconds to wake up
   - 750 hours/month free (enough for continuous operation)

2. **MongoDB Atlas**:
   - 512MB storage (sufficient for small-medium usage)
   - Shared CPU
   - No backups on free tier

3. **Vercel Frontend**:
   - 100GB bandwidth/month
   - Unlimited requests
   - Automatic HTTPS
   - Global CDN

### Security Recommendations
1. Change `JWT_SECRET` to a strong random string
2. Enable MongoDB authentication logs
3. Regularly backup your database manually
4. Monitor usage on all platforms

### Future Updates
When you make code changes:

1. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. **Auto-deployment**:
   - Vercel: Auto-deploys on push
   - Render: Auto-deploys on push

---

## Troubleshooting

### Backend won't start
- Check Render logs: Dashboard → Your Service → Logs
- Verify MongoDB connection string
- Check all environment variables are set

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` in Vercel environment variables
- Check CORS settings in backend
- Open browser DevTools → Network tab to see errors

### Database connection failed
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check database user credentials
- Test connection string in MongoDB Compass

### Render backend sleeping
- This is normal on free tier
- First request wakes it up (takes 30-60 seconds)
- Consider keeping it alive with a ping service (optional)

---

## Support & Resources

- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs

---

## Quick Reference URLs

After deployment, bookmark these:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **MongoDB Dashboard**: https://cloud.mongodb.com
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password saved
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string saved
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] All environment variables added to Render
- [ ] Backend URL saved and tested
- [ ] Frontend .env.production updated
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL saved
- [ ] Backend CORS updated with frontend URL
- [ ] Application tested end-to-end

---

🎉 **Congratulations!** Your TRTL Cooling Solutions application is now live and accessible worldwide!
