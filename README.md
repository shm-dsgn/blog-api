<img src='https://drive.google.com/uc?id=10aEwKjOdN8nxq_IRALMt8WQz-qc8OTce' width=108px/>

# BlogOn by shm.

A simple blog app that lets users create blog posts with images, edit them and delete them.

[Live Website Link](https://shm-blog-app.onrender.com)

[API Link](blog-api-production-bcb5.up.railway.app)

You can see the frontend code here: [Frontend repository](https://github.com/shm-dsgn/blogApp)

[![CodeFactor](https://www.codefactor.io/repository/github/shm-dsgn/blog-api/badge)](https://www.codefactor.io/repository/github/shm-dsgn/blog-api)

## Tech Stack

MERN Stack:

![MongoDB](https://img.shields.io/badge/-MongoDB-22272e?logo=mongodb) ![Express](https://img.shields.io/badge/-Express-22272e?logo=express) ![React](https://img.shields.io/badge/-React-22272e?logo=react) ![Node.js](https://img.shields.io/badge/-Node.js-22272e?logo=node.js)

## Technologies Used

- **aws-sdk** (to interact with various AWS services)
- **bcrypt** (for password hashing)
- **cors** (helps in enabling CORS)
- **dotenv** (to load environment variables from a .env file into process.env)
- **jsonwebtoken** (for creating and verifying JSON Web Tokens (JWTs) for user authentication and authorization)
- **mongoose** (for interacting with MongoDB and helps in defining schemas, models, and performing database operations)
- **multer** (a middleware used for handling multipart/form-data)
- **multer-s3** (an extension of Multer for uploading files to Amazon S3)

## Installation

To run the BlogOn API project locally, follow these steps:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/shm-dsgn/blog-api.git
```

2. Navigate to the project directory:

```bash
cd blog-api
```

3. Create a `.env` file in the project directory.
4. Create the follwing variables in the `.env` file:

```bash
JWT_SECRET = <Any string of your choice>
DB_USER = <MondoDB Database username>
DB_PASSWORD = <MondoDB Database password>
AWS_ACCESS_KEY_ID = <AWS access key id of the user who has permissions of S3 >
AWS_SECRET_ACCESS_KEY = <AWS secret access key of the user who has permissions of S3 >
AWS_BUCKET_NAME = <S3 bucket name>
```

5. Change the Mongoose connection string in `index.js` to your own MongoDB connection string.

```ts
mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@<example>.mongodb.net/...`
);
```

6. In the project directory, you can run `npm install` to install the project dependencies.

```bash
npm install
```

## Usage

To start the development backend server and view the BlogOn API, run the following command:

```bash
npm start
```

This will launch the application on a local development server, typically at [http://localhost:3001](http://localhost:3001).

## Features

- /auth routes for user authentication
  - /login route for user login
  - /register route for user registration
- /post routes for blog post CRUD operations
  - / route for getting all blog posts
  - /create route for creating a new blog post
  - /:id route for getting a blog post by id
  - /edit route for updating a blog post
  - /delete/:id route for deleting a blog post by id
