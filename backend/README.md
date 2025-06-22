# ElderCare Backend API

A robust Node.js/Express backend API for the ElderCare application with MongoDB Atlas integration.

## Features

- **Authentication & Authorization**: JWT-based auth with secure password hashing
- **User Management**: Complete user profile and settings management
- **Security**: Rate limiting, CORS, helmet security headers
- **Validation**: Comprehensive input validation with express-validator
- **Error Handling**: Centralized error handling with detailed responses
- **Database**: MongoDB with Mongoose ODM
- **Logging**: Morgan HTTP request logging
- **Environment**: Configurable environments with dotenv

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: morgan
- **Development**: nodemon

## Quick Start

### Prerequisites

- Node.js 16 or higher
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/signup` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/logout` | User logout | Private |
| GET | `/me` | Get current user | Private |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/me` | Get user profile | Private |
| PUT | `/me` | Update user profile | Private |
| PUT | `/me/settings` | Update user settings | Private |
| DELETE | `/me` | Deactivate account | Private |
| GET | `/stats` | Get user statistics | Private |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/health` | Server health status | Public |

## Request/Response Examples

### User Registration
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "age": 65,
  "gender": "Male",
  "primaryCaregiver": "Jane Doe"
}
```

### User Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Update Profile
```bash
PUT /api/users/me
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "fullName": "John Smith",
  "age": 66,
  "primaryCaregiver": "Jane Smith"
}
```

## Database Schema

### User Model
```javascript
{
  email: String (required, unique),
  username: String (required, unique),
  password: String (required, hashed),
  fullName: String (required),
  age: Number (optional),
  gender: String (enum: Male/Female/Other),
  primaryCaregiver: String (optional),
  isActive: Boolean (default: true),
  lastLogin: Date,
  settings: {
    notifications: {
      email: Boolean,
      push: Boolean,
      sms: Boolean
    },
    privacy: {
      profileVisibility: String (public/private),
      shareHealthData: Boolean
    },
    preferences: {
      language: String,
      timezone: String,
      theme: String (light/dark)
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Rate Limiting**: 100 requests/15min general, 5 requests/15min auth
- **Password Security**: bcrypt with salt rounds of 12
- **JWT Security**: Configurable expiration and secret
- **Input Validation**: Comprehensive validation for all inputs
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers protection
- **Error Handling**: No sensitive data exposure

## Development

### Scripts
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm test         # Run tests (placeholder)
```

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: JWT expiration time
- `FRONTEND_URL`: Frontend URL for CORS

### Error Handling
The API uses centralized error handling with consistent response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

### Validation
All inputs are validated using express-validator with detailed error messages for:
- Email format and uniqueness
- Username format and uniqueness
- Password strength requirements
- Name format validation
- Age range validation
- Gender enum validation

## Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use strong JWT secret
   - Configure MongoDB Atlas connection
   - Set appropriate CORS origins

2. **Security Considerations**
   - Use HTTPS in production
   - Implement additional rate limiting if needed
   - Monitor and log security events
   - Regular security updates

3. **Performance**
   - Enable MongoDB indexes
   - Implement caching if needed
   - Monitor memory usage
   - Use PM2 for process management

## Contributing

1. Follow existing code style
2. Add validation for new endpoints
3. Include error handling
4. Update documentation
5. Test thoroughly

## License

MIT License - see LICENSE file for details