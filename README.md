# 🏠 FriendNest

A modern social media platform built with React, Node.js, and MongoDB that allows users to connect, share posts, stories, and interact with each other in a secure environment.

![FriendNest](https://img.shields.io/badge/FriendNest-Social%20Platform-blue)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-8.17.1-47A248)
![Security](https://img.shields.io/badge/Security-Hardened-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Project Structure](#-project-structure)

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Authentication** using Clerk
- **User Profiles** with customizable avatars and cover photos
- **User Discovery** - Find and connect with other users
- **Profile Management** - Update personal information and settings

### 📱 Social Features
- **Post Creation** - Share text and images with hashtag support
- **Stories** - Create and view temporary stories
- **Comments System** - Interactive commenting on posts
- **Like/Unlike Posts** - Express reactions to content
- **Real-time Messaging** - Direct messaging between connected users

### 🔗 Connection System
- **Connection Requests** - Send and accept connection requests
- **Follow/Unfollow** - Follow users to see their content
- **Connection Management** - Manage your network of friends

### 🛡️ Security Features
- **XSS Protection** - DOMPurify sanitization for user content
- **Rate Limiting** - Prevents abuse and DDoS attacks
- **Input Validation** - Comprehensive validation for all user inputs
- **File Upload Security** - Secure image uploads with type/size validation
- **Authorization** - Proper access control for all operations

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library
- **DOMPurify** - XSS protection

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Clerk** - Authentication service
- **Cloudinary** - Image hosting
- **Server-Sent Events (SSE)** - Real-time communication
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

### DevOps & Tools
- **Vercel** - Frontend deployment
- **MongoDB Atlas** - Cloud database
- **Inngest** - Background job processing
- **Nodemailer** - Email functionality

## 📸 Screenshots

### 🏠 Home Feed
![Home Feed](https://res.cloudinary.com/dpfmucera/image/upload/v1756542120/feed_vwgvxi.png)
*Main feed showing posts from connections and followed users with like, comment, and share functionality*

### 💬 Messaging System
![Messaging](https://res.cloudinary.com/dpfmucera/image/upload/v1756542120/messages_rkz3x8.png)
*Real-time messaging interface for direct communication between connected users*

### 📖 Story Creation
![Add Story](https://res.cloudinary.com/dpfmucera/image/upload/v1756542119/add_story_fnfvdu.png)
*Create and share temporary stories with images and text*

### 👤 User Profile
![User Profile](https://res.cloudinary.com/dpfmucera/image/upload/v1756542120/user_profile_fec2zv.png)
*User profile page with posts, connections, and profile management options*

### 🔗 Connections Management
![Connections](https://res.cloudinary.com/dpfmucera/image/upload/v1756542119/connections_mlnfo9.png)
*Manage your network of friends and connections*

### 🔍 User Discovery
![Discover People](https://res.cloudinary.com/dpfmucera/image/upload/v1756542119/discover_people_gxsmvf.png)
*Find and connect with new users through search and discovery features*

### ✍️ Create Post
![Create Post](https://res.cloudinary.com/dpfmucera/image/upload/v1756542119/create_post_apgxhh.png)
*Create new posts with text content and image uploads*

---

**📱 Responsive Design:** All screens are optimized for both desktop and mobile devices, providing a seamless user experience across all platforms.

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Clerk account for authentication
- Cloudinary account for image hosting

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/subirxd/FriendNest.git
   cd FriendNest
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd BackEnd && npm install
   
   # Install frontend dependencies
   cd ../FrontEnd && npm install
   ```

3. **Environment Setup** (see [Environment Setup](#-environment-setup))

4. **Run the application**
   ```bash
   # From root directory - runs both frontend and backend
   npm run dev
   
   # Or run separately:
   npm run backend  # Backend only
   npm run frontend # Frontend only
   ```

## ⚙️ Environment Setup

### Backend Environment Variables
Create a `.env` file in the `BackEnd` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER_NAME=friendnest

# Inngest (Background Jobs)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Frontend Environment Variables
Create a `.env` file in the `FrontEnd` directory:

```env
# API Configuration
VITE_BASE_URL=http://localhost:4000

# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 📖 Usage

### For Users
1. **Sign Up/Login** - Use Clerk authentication to create an account
2. **Complete Profile** - Add profile picture, cover photo, and bio
3. **Discover Users** - Search and find other users to connect with
4. **Create Posts** - Share text and images with hashtags
5. **Interact** - Like, comment, and share posts
6. **Connect** - Send connection requests and build your network
7. **Message** - Chat with your connections in real-time

### For Developers
- **API Endpoints** - RESTful API with comprehensive documentation
- **Real-time Features** - Server-Sent Events (SSE) for live updates
- **Security** - Built-in protection against common vulnerabilities
- **Scalable Architecture** - Modular design for easy maintenance

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/user/data` - Get user data
- `PUT /api/user/update` - Update user profile
- `POST /api/user/discover` - Discover users

### Post Endpoints
- `POST /api/post/add` - Create new post
- `GET /api/post/feed` - Get user feed
- `POST /api/post/like` - Like/unlike post

### Comment Endpoints
- `POST /api/comment/add` - Add comment
- `DELETE /api/comment/delete` - Delete comment
- `GET /api/comment/get` - Get post comments

### Connection Endpoints
- `POST /api/user/connect` - Send connection request
- `POST /api/user/accept` - Accept connection
- `POST /api/user/reject` - Reject connection
- `GET /api/user/connections` - Get user connections

### Message Endpoints
- `GET /api/message/get` - Get messages
- `POST /api/message/send` - Send message
- `GET /api/message/:userId` - Real-time messaging

## 🛡️ Security Features

### Implemented Security Measures
- ✅ **XSS Protection** - DOMPurify sanitization
- ✅ **Rate Limiting** - 100 requests/15min, 5 auth requests/15min
- ✅ **Input Validation** - Comprehensive validation for all inputs
- ✅ **File Upload Security** - Type and size validation
- ✅ **CORS Protection** - Configured for specific origins
- ✅ **Security Headers** - Helmet.js implementation
- ✅ **Authentication** - Clerk-based secure authentication
- ✅ **Authorization** - Proper access control

### Security Best Practices
- Environment variables for sensitive data
- Input sanitization and validation
- Rate limiting to prevent abuse
- Secure file upload handling
- Error handling without information disclosure
- HTTPS enforcement in production

## 📁 Project Structure

```
FriendNest/
├── BackEnd/                 # Backend server
│   ├── Config/             # Configuration files
│   ├── Controllers/        # Route controllers
│   ├── Middlewares/        # Custom middlewares
│   ├── Models/             # Database models
│   ├── Routes/             # API routes
│   ├── Utils/              # Utility functions
│   └── index.js            # Server entry point
├── FrontEnd/               # React frontend
│   ├── src/
│   │   ├── Components/     # Reusable components
│   │   ├── Pages/          # Page components
│   │   ├── Services/       # API services
│   │   ├── Slices/         # Redux slices
│   │   └── Reducer/        # Redux store
│   └── public/             # Static assets
├── package.json            # Root package.json
└── README.md              # This file
```

## 🙏 Acknowledgments

- **Clerk** for authentication services
- **Cloudinary** for image hosting
- **Tailwind CSS** for styling
- **React Community** for the amazing ecosystem


**Made with ❤️ by Sudipta**

*Connect, Share, and Build Relationships with FriendNest!*
