# API Documentation

## Tours

### GET /api/v1/tours
- **Description:** Get all the tours
- **Response:** 
  - `200 OK`
  - JSON array of tour objects

### POST /api/v1/tours
- **Description:** Create a new tour
- **Request Body:** 
  - JSON object containing tour details
- **Response:**
  - `201 Created`
  - JSON object of the created tour

### GET /api/v1/tours/:id
- **Description:** Get a specific tour by ID
- **Response:** 
  - `200 OK`
  - JSON object of the tour

### PATCH /api/v1/tours/:id
- **Description:** Update a tour
- **Request Body:** 
  - JSON object containing updated tour details
- **Response:**
  - `200 OK`
  - JSON object of the updated tour

### DELETE /api/v1/tours/:id
- **Description:** Delete a tour
- **Response:**
  - `204 No Content`

### GET /api/v1/tours/aliasQuery
- **Description:** Alias query for tours
- **Response:** 
  - `200 OK`
  - JSON array of tours

### GET /api/v1/tours/tour-stats
- **Description:** Get tour statistics
- **Response:** 
  - `200 OK`
  - JSON object containing statistics

### GET /api/v1/tours/monthly-plan
- **Description:** Get the monthly plan
- **Response:** 
  - `200 OK`
  - JSON array of plan details

### GET /api/v1/tours/within/:distance/center/:latlng/unit/:unit
- **Description:** Get tours within a certain distance
- **Params:**
  - `distance` (Number): The radius to search within
  - `latlng` (String): The latitude and longitude in the format "lat,lng"
  - `unit` (String): The unit of distance ('mi' or 'km')
- **Response:** 
  - `200 OK`
  - JSON array of tours within the specified radius

### GET /api/v1/tours/distances/:latlng/unit/:unit
- **Description:** Get distances to tours from a specified point
- **Params:**
  - `latlng` (String): The latitude and longitude in the format "lat,lng"
  - `unit` (String): The unit of distance ('mi' or 'km')
- **Response:** 
  - `200 OK`
  - JSON object containing distances

## Users

### GET /api/v1/users
- **Description:** Get all users
- **Response:** 
  - `200 OK`
  - JSON array of user objects

### POST /api/v1/users/signup
- **Description:** Sign up a new user
- **Request Body:** 
  - JSON object containing user details
- **Response:**
  - `201 Created`
  - JSON object of the created user

### POST /api/v1/users/login
- **Description:** Sign in a user
- **Request Body:** 
  - JSON object containing login credentials
- **Response:**
  - `200 OK`
  - JSON object containing user details and token

### POST /api/v1/users/forgotPassword
- **Description:** Request password reset
- **Request Body:** 
  - JSON object containing email
- **Response:**
  - `200 OK`
  - JSON message

### PATCH /api/v1/users/resetPassword/:token
- **Description:** Reset password
- **Request Body:** 
  - JSON object containing new password
- **Response:**
  - `200 OK`
  - JSON object of the updated user

### PATCH /api/v1/users/updatePassword
- **Description:** Update password
- **Request Body:** 
  - JSON object containing current and new passwords
- **Response:**
  - `200 OK`
  - JSON object of the updated user

### DELETE /api/v1/users/deleteMe
- **Description:** Delete current user
- **Response:**
  - `204 No Content`

### DELETE /api/v1/users/:id
- **Description:** Delete a user by ID
- **Response:**
  - `204 No Content`

### PATCH /api/v1/users/updateMe
- **Description:** Update current user details
- **Request Body:** 
  - JSON object containing updated user details
- **Response:**
  - `200 OK`
  - JSON object of the updated user

### GET /api/v1/users/me
- **Description:** Get current user details
- **Response:**
  - `200 OK`
  - JSON object of the current user

## Reviews

### GET /api/v1/reviews
- **Description:** Get all reviews
- **Response:** 
  - `200 OK`
  - JSON array of review objects

### POST /api/v1/reviews
- **Description:** Create a new review
- **Request Body:** 
  - JSON object containing review details
- **Response:**
  - `201 Created`
  - JSON object of the created review

### PATCH /api/v1/reviews/:id
- **Description:** Update a review by ID
- **Request Body:** 
  - JSON object containing updated review details
- **Response:**
  - `200 OK`
  - JSON object of the updated review

### DELETE /api/v1/reviews/:id
- **Description:** Delete a review by ID
- **Response:**
  - `204 No Content`

### GET /api/v1/reviews/:id
- **Description:** Get a specific review by ID
- **Response:**
  - `200 OK`
  - JSON object of the review

### POST /api/v1/tours/:tourId/reviews
- **Description:** Create a new review on a specific tour
- **Request Body:** 
  - JSON object containing review details
- **Response:**
  - `201 Created`
  - JSON object of the created review

### GET /api/v1/tours/:tourId/reviews
- **Description:** Get all reviews for a specific tour
- **Response:**
  - `200 OK`
  - JSON array of review objects
