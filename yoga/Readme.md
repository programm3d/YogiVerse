# Complete API Endpoints Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Login User
**POST** `/auth/login`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## User Endpoints

### 3. Get User Profile
**GET** `/users/profile`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "profilePic": "https://res.cloudinary.com/...",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Update Profile Picture
**PATCH** `/users/profile-pic`

**Rate Limit:** 20 requests per hour

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
profilePic: [image file] (jpg, png, jpeg - max 5MB)
```

**Response:**
```json
{
  "message": "Profile picture updated successfully",
  "profilePic": "https://res.cloudinary.com/..."
}
```

## Post Endpoints

### 5. Get All Posts
**GET** `/posts`

**Response:**
```json
[
  {
    "_id": "post_id",
    "userId": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "profilePic": "https://res.cloudinary.com/..."
    },
    "title": "My Awesome Project",
    "description": "This is a great project",
    "contentLink": "https://res.cloudinary.com/video_url",
    "tags": ["javascript", "react"],
    "difficultyLevel": "Medium",
    "likes": 5,
    "comments": [
      {
        "userId": {
          "_id": "commenter_id",
          "username": "commenter"
        },
        "text": "Great work!",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 6. Upload Video Only
**POST** `/posts/upload-video`

**Rate Limit:** 20 requests per hour

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
video: [video file] (mp4, mov, avi, mkv, webm - max 100MB)
```

**Response:**
```json
{
  "message": "Video uploaded successfully",
  "videoUrl": "https://res.cloudinary.com/video_url",
  "publicId": "post_videos/abc123"
}
```

### 7. Create Post (with optional video)
**POST** `/posts`

**Rate Limit:** 10 requests per hour

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
title: "My New Project" (required)
description: "This is my latest project" (optional)
tags: "javascript,node.js,express" (optional - comma separated)
difficultyLevel: "Hard" (optional - Hard/Medium/Low)
video: [video file] (optional - mp4, mov, avi, mkv, webm - max 100MB)
```

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "post_id",
    "userId": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "title": "My New Project",
    "description": "This is my latest project",
    "contentLink": "https://res.cloudinary.com/video_url",
    "tags": ["javascript", "node.js", "express"],
    "difficultyLevel": "Hard",
    "likes": 0,
    "comments": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 8. Get User's Own Posts
**GET** `/posts/my-posts`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
[
  {
    "_id": "post_id",
    "userId": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "title": "My Project",
    "description": "Project description",
    "contentLink": "https://res.cloudinary.com/video_url",
    "tags": ["javascript"],
    "difficultyLevel": "Medium",
    "likes": 3,
    "comments": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 9. Update Post (description and/or video)
**PUT** `/posts/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
description: "Updated description for my project" (optional)
video: [new video file] (optional - replaces existing video)
```

**Response:**
```json
{
  "message": "Post updated successfully",
  "post": {
    "_id": "post_id",
    "userId": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "title": "My Project",
    "description": "Updated description for my project",
    "contentLink": "https://res.cloudinary.com/new_video_url",
    "tags": ["javascript"],
    "difficultyLevel": "Medium",
    "likes": 3,
    "comments": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 10. Delete Own Post
**DELETE** `/posts/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

**Note:** This also deletes the associated video from Cloudinary

### 11. Admin Delete Post
**DELETE** `/posts/admin/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Note:** Only users with `role: "admin"` can access this endpoint

**Response:**
```json
{
  "message": "Post deleted successfully by admin"
}
```

**Note:** This also deletes the associated video from Cloudinary

### 12. Add Comment to Post
**POST** `/posts/:id/comments`

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "This is a great project! Well done."
}
```

**Response:**
```json
{
  "message": "Comment added successfully",
  "comments": [
    {
      "userId": {
        "_id": "user_id",
        "username": "commenter"
      },
      "text": "This is a great project! Well done.",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 13. Search Posts by Tag
**GET** `/posts/search?tag=javascript`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- `tag`: The tag to search for (required)

**Example Request:**
```
GET /posts/search?tag=react
```

**Response:**
```json
[
  {
    "_id": "post_id",
    "userId": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "profilePic": "https://res.cloudinary.com/..."
    },
    "title": "React Project",
    "description": "A React application",
    "contentLink": "https://res.cloudinary.com/video_url",
    "tags": ["react", "javascript"],
    "difficultyLevel": "Medium",
    "likes": 8,
    "comments": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Rate Limiting Details

### General API Limit
- **Limit:** 100 requests per 15 minutes
- **Applies to:** All endpoints
- **Headers returned:**
  ```
  RateLimit-Limit: 100
  RateLimit-Remaining: 95
  RateLimit-Reset: 1640995200
  ```

### Authentication Endpoints
- **Limit:** 5 requests per 15 minutes
- **Applies to:** `/auth/register`, `/auth/login`

### Post Creation
- **Limit:** 10 requests per hour
- **Applies to:** `POST /posts`

### File Uploads
- **Limit:** 20 requests per hour
- **Applies to:** `/users/profile-pic`, `/posts/upload-video`

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Access token missing"
}
```

### 403 Forbidden
```json
{
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "message": "Post not found"
}
```

### 413 Payload Too Large
```json
{
  "message": "File too large"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Detailed error message"
}
```

## File Upload Specifications

### Profile Pictures
- **Endpoint:** `PUT /users/profile-pic`
- **Supported formats:** jpg, png, jpeg
- **Max file size:** 5MB
- **Storage folder:** `profile_pics/`
- **Transformations:** Resized to max 500x500px

### Videos
- **Endpoints:** `POST /posts`, `PUT /posts/:id`, `POST /posts/upload-video`
- **Supported formats:** mp4, mov, avi, mkv, webm
- **Max file size:** 100MB
- **Storage folder:** `post_videos/`
- **Transformations:**
    - Quality: auto
    - Format: auto
    - Max resolution: 1280x720px

## Authentication Notes

- **JWT Token:** Include in `Authorization: Bearer jwt_token_here` header
- **Token expiry:** 24 hours
- **Admin privileges:** Required for admin-specific endpoints
- **Post ownership:** Users can only update/delete their own posts (except admins)
- **Auto-cleanup:** Videos are automatically deleted from Cloudinary when posts are deleted

## Field Validation

### User Registration/Login:
- `username`: Required, string
- `email`: Required, unique, valid email format
- `password`: Required, string (hashed with bcrypt)
- `role`: Optional, enum ["user", "admin"], defaults to "user"

### Post Creation/Update:
- `title`: Required for creation, string
- `description`: Optional, string
- `tags`: Optional, array of strings (can be comma-separated in form-data)
- `difficultyLevel`: Optional, enum ["Hard", "Medium", "Low"]
- `video`: Optional, video file

### Comments:
- `text`: Required, string, max 200 characters

## Testing with Postman/Thunder Client

### 1. Register/Login first:
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Use the returned token in subsequent requests:
```
Authorization: Bearer your_jwt_token_here
```

### 3. Test video upload:
```
POST http://localhost:3000/api/posts
Authorization: Bearer your_jwt_token_here
Content-Type: multipart/form-data

Form fields:
- title: "My Video Project"
- description: "Check out this demo"
- tags: "javascript,react"
- difficultyLevel: "Medium"
- video: [select video file]
```

## Summary

**Total Endpoints:** 13
- **Authentication:** 2 endpoints
- **User Management:** 2 endpoints
- **Post Management:** 9 endpoints

**Key Features:**
- JWT authentication with role-based access
- Video uploads to Cloudinary with auto-optimization
- Rate limiting for security
- Automatic file cleanup
- Tag-based search functionality
- Comment system
- Admin capabilities for content moderation