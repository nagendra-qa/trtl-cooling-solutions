# Admin Setup Guide

## Overview
Your admin authentication system is now ready! Admin users can access `/admin` to login and manage customers and camps.

## Features

### Admin Portal
- **URL**: `/admin` - Admin login page
- **Dashboard**: `/admin/dashboard` - Admin management panel
- Secure JWT-based authentication
- Session management with localStorage
- Protected routes with automatic token verification

### Admin Capabilities
- Manage Customers (add, edit, delete)
- Manage Camps (add, edit, delete)
- View quick statistics
- Secure logout

## Creating Your First Admin User

You need to create the first admin user before you can login. There are two ways:

### Method 1: Using API endpoint (Recommended)

1. Start your backend server:
```bash
cd backend
npm install
npm run dev
```

2. Create the first admin using curl or Postman:
```bash
curl -X POST http://localhost:5000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123",
    "email": "admin@trtl.com"
  }'
```

**Note**: The setup endpoint only works when NO admin exists. After creating the first admin, this endpoint is automatically disabled for security.

### Method 2: Using MongoDB directly

If you prefer, you can create an admin directly in MongoDB, but you'll need to hash the password manually.

## Testing the Admin Login

1. Start both backend and frontend:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

2. Navigate to: `http://localhost:3000/admin`

3. Login with the credentials you created:
   - Username: `admin`
   - Password: `Admin@123` (or whatever you set)

4. You should be redirected to `/admin/dashboard`

## Admin Dashboard Features

Once logged in, you'll see:
- **Customers Tab**: Full CRUD operations for customer management
- **Camps Tab**: Full CRUD operations for camp management
- **User Info**: Display logged-in admin username
- **Logout**: Secure logout that clears session
- **Public Site Link**: Quick link back to public website

## Security Features

✅ Password hashing with bcryptjs
✅ JWT token authentication
✅ Token verification on protected routes
✅ Automatic redirect if not authenticated
✅ Secure logout that clears tokens
✅ Setup endpoint disabled after first admin

## Environment Variables

Add these to your `.env` file in the backend folder:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=your-mongodb-connection-string
```

**IMPORTANT**: Change the JWT_SECRET in production!

## API Endpoints

### Admin Authentication
- `POST /api/admin/setup` - Create first admin (disabled after first admin exists)
- `POST /api/admin/login` - Login and get JWT token
- `GET /api/admin/verify` - Verify JWT token (protected)
- `POST /api/admin/change-password` - Change admin password (protected)

### Example Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "username": "admin",
    "email": "admin@trtl.com"
  }
}
```

## Token Management

The token is stored in `localStorage` and automatically included in all API requests via axios interceptor. Token expires after 24 hours.

## Troubleshooting

### "Invalid credentials" error
- Make sure the admin user was created successfully
- Check username and password are correct
- Username is case-insensitive (automatically converted to lowercase)

### Redirected back to login after login
- Check browser console for errors
- Verify backend is running and accessible
- Check JWT_SECRET is set in backend

### "Admin already exists" on setup
- This is normal - setup endpoint is disabled after first admin
- Use the login page with existing credentials
- To create additional admins, you'll need to add a separate admin management feature

## Next Steps

1. ✅ Create your first admin user using the setup endpoint
2. ✅ Test login at `/admin`
3. ✅ Verify you can access the dashboard
4. ✅ Test customer and camp management
5. ⚠️ Change JWT_SECRET in production
6. ⚠️ Consider disabling the setup endpoint in production
7. 📊 Deploy to Vercel with environment variables

## Production Deployment

When deploying to Vercel:

1. Add environment variables in Vercel dashboard:
   - `JWT_SECRET`
   - `MONGODB_URI`

2. The setup endpoint will still work once after deployment to create the first admin

3. After creating the admin, the endpoint automatically disables itself

## Adding More Admins

To add more admin users later, you can either:
1. Create an admin management page (add to dashboard)
2. Use MongoDB directly
3. Create a separate API endpoint (with admin authentication required)

Would you like me to create an admin management feature to add/remove admin users?
