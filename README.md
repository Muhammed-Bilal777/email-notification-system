# Email Notification System

## Overview

The Email Notification System is a full-stack web application that allows users to register, log in, send emails, and view sent emails. It provides real-time email status updates and uses MongoDB for data storage, Express.js for the backend, and vanilla JavaScript for the frontend.

## Features

### 1. User Authentication
- **Registration**: Users can create new accounts.
- **Login**: Registered users can log in to access the email system.
- **Logout**: Users can securely log out of their accounts.

#### Implementation:
- User data is stored in MongoDB using the User model.
- Passwords are hashed using bcrypt for security.
 

### 2. Email Sending
- Users can compose and send emails.
- Email details include recipient, subject, and message body.

#### Implementation:
- Emails are sent using Nodemailer with Mailtrap for testing.
- Email data is stored in MongoDB using the Email model.
- Real-time status updates are provided using Socket.io.

### 3. Real-time Email Status Updates
- Users receive immediate feedback on the status of sent emails.
- Possible statuses: pending, sent, failed.

#### Implementation:
- Socket.io is used to push real-time updates from the server to the client.
- The frontend updates the UI based on received status messages.

### 4. View Sent Emails
- Users can retrieve and view a list of their sent emails.
- Email list displays recipient, subject, status, and sent time.

#### Implementation:
- A GET API endpoint retrieves emails from MongoDB.
- The frontend fetches and displays emails when the user requests them.

### 5. Responsive UI
- The application features a clean, responsive user interface.
- Seamless transitions between registration, login, and email functionalities.

#### Implementation:
- HTML5 and CSS3 are used for structuring and styling.
- JavaScript handles dynamic content updates and form submissions.

## Technical Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **Email Service**: Nodemailer with Mailtrap
- **Authentication**: bcrypt for password hashing

## API Endpoints

1. `POST /api/register`: Register a new user
2. `POST /api/login`: Authenticate a user
3. `POST /api/send-email`: Send a new email
4. `GET /api/emails`: Retrieve sent emails

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `MAILTRAP_USERNAME`: Your Mailtrap username
   - `MAILTRAP_PASSWORD`: Your Mailtrap password
4. Run the server: `npm start`
5. Access the application at `http://localhost:3000`
 
 