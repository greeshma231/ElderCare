# ElderCare Backend API

A secure Express.js backend with MongoDB Atlas integration for the ElderCare application.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **MongoDB Atlas Integration**: Cloud database with Mongoose ODM
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for security best practices
- **Error Handling**: Centralized error handling with meaningful responses
- **CORS Support**: Configured for frontend integration
- **Logging**: Morgan for request logging

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Authenticate user and get JWT token
- `POST /api/auth/logout` - Logout user (client-side token removal)

### User Management
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/me/settings` - Update user settings
- `DELETE /api/users/me` - Deactivate user account

### Health Check
- `GET /health` - API health status

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS

### 3. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds of 12
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 
  - General: 100 requests per 15 minutes
  - Auth endpoints: 5 attempts per 15 minutes
- **Input Validation**: Comprehensive validation rules
- **Security Headers**: Helmet.js protection
- **CORS Configuration**: Restricted to frontend domain

## 📊 Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  passwordHash: String (required),
  fullName: String (required),
  age: Number (optional),
  gender: String (optional),
  primaryCaregiver: String (optional),
  isActive: Boolean (default: true),
  lastLogin: Date,
  settings: {
    voiceAssistant: Boolean,
    medicationAlerts: Boolean,
    appointmentAlerts: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### User Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test User",
    "age": 65,
    "gender": "Male"
  }'
```

### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'
```

### Get Profile (with JWT token)
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚨 Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

## 📝 Logging

- Development: Detailed request logging with Morgan 'dev' format
- Production: Combined log format for better monitoring

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | Required |
| `JWT_SECRET` | Secret for JWT token signing | Required |
| `JWT_EXPIRES_IN` | JWT token expiration time | 7d |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🚀 Deployment

1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas is accessible from your hosting IP
3. Update CORS settings for production frontend URL
4. Set `NODE_ENV=production`
5. Use a process manager like PM2 for production

## 📞 Support

For issues or questions, please check the API documentation or contact the development team.