

### ✅ `POST /api/auth/request-otp`

**Description:** Sends OTP for new user registration.

**Request:**

```json
{
  "email": "test@example.com",
  "username": "testuser"
}
```

**Success Response (200):**

```json
{
  "message": "OTP sent to your email."
}
```

**Error Responses:**

* `400`: Email or Username already exists

```json
{
  "message": "Email or Username already in use"
}
```

* `429`: Rate limit exceeded

```json
{
  "message": "Too many OTP requests. Try again in 120 seconds."
}
```

---

### ✅ `POST /api/auth/register`

**Description:** Registers user after verifying OTP.

**Request:**

```json
{
  "email": "test@example.com",
  "username": "testuser",
  "password": "StrongPass@123",
  "otp": "123456"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "user": {
    "id": "userId123",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

* `400`: Invalid or expired OTP

```json
{
  "message": "Invalid or expired OTP"
}
```

* `400`: Password doesn't meet requirements

```json
{
  "valid": false,
  "message": "Password must contain at least 8 characters, a number, a symbol, etc."
}
```

---

### ✅ `POST /api/auth/login`

**Description:** Logs in an existing user.

**Request:**

```json
{
  "email": "test@example.com",
  "password": "StrongPass@123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "userId123",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "profilePic": "http://..."
  }
}
```

**Error Responses:**

* `401`: Invalid credentials

```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

* `403`: Blocked account

```json
{
  "error": "Forbidden",
  "message": "Your account has been blocked"
}
```

---

### ✅ `GET /api/auth/logout`

**Description:** Logs out the user by clearing the cookie.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### ✅ `POST /api/auth/request-reset-otp`

**Description:** Sends OTP for password reset.

**Request:**

```json
{
  "email": "test@example.com"
}
```

**Success Response (200):**

```json
{
  "message": "OTP sent to your email for password reset"
}
```

**Error Responses:**

* `404`: Email not found

```json
{
  "message": "User with this email does not exist"
}
```

* `429`: Too many requests

```json
{
  "message": "Too many OTP requests. Try again in 200 seconds."
}
```

---

### ✅ `POST /api/auth/reset-password`

**Description:** Resets the password after OTP verification.

**Request:**

```json
{
  "email": "test@example.com",
  "otp": "123456",
  "newPassword": "NewStrong@123"
}
```

**Success Response (200):**

```json
{
  "message": "Password successfully reset"
}
```

**Error Responses:**

* `400`: Invalid or expired OTP

```json
{
  "message": "Invalid or expired OTP"
}
```

* `400`: Password validation failed

```json
{
  "valid": false,
  "message": "Password must include..."
}
```

* `404`: User not found

```json
{
  "message": "User not found"
}
```

--- 
 `userRoutes.js`, including:

* HTTP method and URL
* Expected request format
* Successful response
* Possible error responses

---

### ✅ `GET /api/user/profile`

**🔒 Auth Required:** Yes

**Description:** Get the logged-in user’s profile.

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "userId123",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "profilePic": "https://cloudinary.com/...",
    "status": "active"
  }
}
```

**Error Response:**

* `404` – User not found

```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

---

### ✅ `PATCH /api/user/profile`

**🔒 Auth Required:** Yes
**📦 Content-Type:** `multipart/form-data`

**Form Data Fields:**

* `profilePic` (optional): image file
* `name` (optional): string

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "userId123",
    "username": "testuser",
    "email": "test@example.com",
    "name": "Updated Name",
    "profilePic": "https://cloudinary.com/newpic.jpg"
  }
}
```

**Error Response:**

* `404` – User not found

```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

---

### ✅ `DELETE /api/user/profile/pic`

**🔒 Auth Required:** Yes

**Description:** Removes user's profile picture from Cloudinary.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile picture removed."
}
```

**Error Response:**

* `404` – User not found

```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

---

### ✅ `GET /api/user/all`

**🔒 Auth Required:** Yes
**🛡️ Admin Only**

**Query Parameters (optional):**

* `page` (default: 1)
* `limit` (default: 10)
* `search`: partial username (case-insensitive)

**Success Response (200):**

```json
{
  "success": true,
  "users": [
    {
      "_id": "userId1",
      "username": "testuser1",
      "email": "test1@example.com"
    },
    ...
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

**Error Response:**

* No specific errors unless a DB/internal error occurs.

---

### ✅ `PATCH /api/user/block/:id`

**🔒 Auth Required:** Yes
**🛡️ Admin Only**

**Description:** Block a user by ID.

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "userId123",
    "username": "testuser",
    "status": "blocked"
  }
}
```

**Error Response:**

* `404` – User not found

```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

---

### 🔄 Summary Table

| Route          | Method | Auth | Admin | Description                |
| -------------- | ------ | ---- | ----- | -------------------------- |
| `/profile`     | GET    | ✅    | ❌     | Get logged-in user profile |
| `/profile`     | PATCH  | ✅    | ❌     | Update name/profile pic    |
| `/profile/pic` | DELETE | ✅    | ❌     | Remove profile picture     |
| `/all`         | GET    | ✅    | ✅     | Get all users (paginated)  |
| `/block/:id`   | PATCH  | ✅    | ✅     | Block user by ID           |

---


 **Post API**, including authentication, method, purpose, request format, success & error responses.

---
## 🔁 Route Summary Table

| Route           | Method | Auth | Description                        |
| --------------- | ------ | ---- | ---------------------------------- |
| `/`             | POST   | ✅    | Create a new post                  |
| `/:id`          | PUT    | ✅    | Update your post                   |
| `/:id`          | DELETE | ✅    | Delete your post (Admin: Any post) |
| `/:id`          | GET    | ❌    | Get a single post                  |
| `/user/:userId` | GET    | ✅    | Get posts by a user                |
| `/feed/all`     | GET    | ❌    | Public feed (paginated)            |
| `/:id/like`     | POST   | ✅    | Like or unlike a post              |
| `/search/all`   | GET    | ✅    | Search posts                       |

---

## 📌 Route Details

---

### 🔹 `POST /api/post/`

**Description:** Create a new post (video upload supported)

**Auth Required:** ✅ Yes
**Content-Type:** `multipart/form-data`

**Form Fields:**

* `title` (required): string
* `description`: string
* `tags`: comma-separated string (e.g. `"react,nodejs"`)
* `difficultyLevel`: string
* `video`: video file (optional)

**Success Response:**

```json
{
  "success": true,
  "post": {
    "_id": "abc123",
    "title": "My Post",
    "contentLink": "https://res.cloudinary.com/...",
    "tags": ["react", "nodejs"]
  }
}
```

**Error Responses:**

* `400`: Title is required
* `500`: Cloudinary/file upload or DB error

---

### 🔹 `PUT /api/post/:id`

**Description:** Update your own post

**Auth Required:** ✅ Yes
**Body:** JSON

```json
{
  "title": "Updated Title",
  "description": "Updated desc",
  "tags": "newtag1,newtag2",
  "difficultyLevel": "intermediate"
}
```

**Success Response:**

```json
{
  "success": true,
  "post": { "_id": "abc123", "title": "Updated Title" }
}
```

**Error Responses:**

* `404`: Post not found or unauthorized
* `500`: Validation error or DB issue

---

### 🔹 `DELETE /api/post/:id`

**Description:** Delete a post (user: own post, admin: any post)

**Auth Required:** ✅ Yes

**Success Response:**

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error Response:**

* `404`: Post not found or not authorized
* `500`: Cloudinary or DB delete error

---

### 🔹 `GET /api/post/:id`

**Description:** Get a single post by ID

**Auth Required:** ❌ No

**Success Response:**

```json
{
  "success": true,
  "post": {
    "_id": "abc123",
    "title": "Some title",
    "userId": {
      "_id": "user123",
      "username": "john_doe",
      "profilePic": "https://..."
    },
    "likedBy": [ ... ]
  }
}
```

**Error Response:**

* `404`: Post not found

---

### 🔹 `GET /api/post/user/:userId`

**Description:** Get posts by a specific user (or own if `userId` omitted)

**Auth Required:** ✅ Yes
**Query Params:**

* `page`: default 1
* `limit`: default 10

**Success Response:**

```json
{
  "success": true,
  "posts": [...],
  "totalPages": 3,
  "currentPage": 1
}
```

---

### 🔹 `GET /api/post/feed/all`

**Description:** Public feed of all posts

**Auth Required:** ❌ No
**Query Params:** Same as above

**Success Response:** Same as user posts

---

### 🔹 `POST /api/post/:id/like`

**Description:** Like/unlike a post

**Auth Required:** ✅ Yes

**Success Response:**

```json
{
  "success": true,
  "likes": 10,
  "isLiked": true
}
```

**Error Response:**

* `404`: Post not found

---

### 🔹 `GET /api/post/search/all`

**Description:** Search posts by title, description, or tags

**Auth Required:** ✅ Yes
**Query Params:**

* `search`: keyword
* `page`, `limit`: pagination

**Success Response:**

```json
{
  "success": true,
  "posts": [...],
  "totalPages": 2,
  "currentPage": 1
}
```

---
**Comment API**, including endpoint purpose, methods, auth requirements, and example requests/responses.

---


## 🚨 Report API Documentation

---

### 📁 Route Prefix: `/api/report`

| Endpoint | Method | Auth | Role  | Description                    |
| -------- | ------ | ---- | ----- | ------------------------------ |
| `/`      | POST   | ✅    | User  | Create a new report for a post |
| `/`      | GET    | ✅    | Admin | Get paginated list of reports  |
| `/:id`   | DELETE | ✅    | Admin | Delete a specific report by ID |

---

## 📌 Detailed Route Descriptions

---

### 🔹 `POST /api/report`

**Description:** Allows a logged-in user to report a post.

**Auth Required:** ✅ Yes
**Body Parameters:**

```json
{
  "description": "This post contains spam",
  "postId": "665f9e3aab3d5f0012cf37ad"
}
```

**Success Response:**

```json
{
  "success": true,
  "report": {
    "_id": "6660c14764cb2b0011dbb6ff",
    "userId": "user_id_here",
    "postId": "665f9e3aab3d5f0012cf37ad",
    "description": "This post contains spam",
    "postUserId": "owner_of_the_post",
    "createdAt": "2025-06-09T12:30:00.000Z"
  }
}
```

**Error Responses:**

* `404`: Post not found
* `500`: Server error or DB issue

---

### 🔹 `GET /api/report`

**Description:** Fetch paginated list of all post reports.
**Accessible by Admin only.**

**Auth Required:** ✅ Yes
**Role Required:** `admin`
**Query Parameters:**

* `page`: Page number (default: 1)
* `limit`: Items per page (default: 10)

**Success Response:**

```json
{
  "success": true,
  "reports": [
    {
      "_id": "6660c14764cb2b0011dbb6ff",
      "description": "Offensive content",
      "userId": {
        "_id": "userId123",
        "username": "john_doe",
        "profilePic": "https://example.com/profile.jpg"
      },
      "postId": {
        "_id": "665f9e3aab3d5f0012cf37ad",
        "title": "Funny Cat Video",
        "contentLink": "https://cdn.com/video.mp4"
      },
      "postUserId": {
        "_id": "userIdOfPostOwner",
        "username": "poster_user"
      },
      "createdAt": "2025-06-09T12:30:00.000Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1
}
```

**Error Responses:**

* `403`: If a non-admin attempts access
* `500`: DB error

---

### 🔹 `DELETE /api/report/:id`

**Description:** Allows admin to delete a report by its ID.

**Auth Required:** ✅ Yes
**Role Required:** `admin`

**Success Response:**

```json
{
  "success": true,
  "message": "Report deleted"
}
```

**Error Response:**

* `404`: Report not found
* `500`: Server or DB error

---




## 🧾 Comment API Documentation
 **Report API**, which allows users to report posts and enables admins to manage those reports.

---

### 📁 Route Prefix: `/api/comment`

| Endpoint        | Method | Auth | Description                           |
| --------------- | ------ | ---- | ------------------------------------- |
| `/`             | POST   | ✅    | Create a new comment                  |
| `/post/:postId` | GET    | ✅    | Get paginated comments for a post     |
| `/:id`          | DELETE | ✅    | Delete a comment (self or admin only) |

---

## 📌 Detailed Route Descriptions

---

### 🔹 `POST /api/comment`

**Description:** Add a new comment to a post.

**Auth Required:** ✅ Yes
**Body:**

```json
{
  "text": "This is a comment",
  "postId": "665f9e3aab3d5f0012cf37ad"
}
```

**Success Response:**

```json
{
  "success": true,
  "comment": {
    "_id": "6660ae832234c80018e32de7",
    "userId": "user_id_here",
    "postId": "665f9e3aab3d5f0012cf37ad",
    "text": "This is a comment",
    "postUserId": "owner_of_the_post",
    "createdAt": "2025-06-09T10:00:00.000Z"
  }
}
```

**Error Responses:**

* `404`: Post not found
* `500`: Server or DB error

---

### 🔹 `GET /api/comment/post/:postId`

**Description:** Get comments for a specific post, sorted by:

1. Current user's comments first
2. Then others by newest

**Auth Required:** ✅ Yes
**Query Params:**

* `page`: default = 1
* `limit`: default = 10

**Success Response:**

```json
{
  "success": true,
  "comments": [
    {
      "_id": "6660ae832234c80018e32de7",
      "content": "Nice video!",
      "createdAt": "2025-06-09T10:00:00.000Z",
      "userId": "user_id_here",
      "user": {
        "username": "john_doe",
        "profilePic": "https://example.com/profile.jpg"
      }
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

**Error Responses:**

* `500`: Invalid `postId` or DB error

---

### 🔹 `DELETE /api/comment/:id`

**Description:** Delete a comment by ID
**Only the owner or an admin can delete.**

**Auth Required:** ✅ Yes

**Success Response:**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Error Responses:**

* `404`: Comment not found or unauthorized
* `500`: DB error

---







