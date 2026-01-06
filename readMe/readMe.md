## Project - Shopping Cart E-commerce Project

## Overview

This project is a RESTful Backend API for an E-commerce application built using Node.js, Express js and MongoDb. It supports user authentication, product management, cart and order handling, images upload using Cloudinary and secure online payments integrated with Stripe Payment Gateway. This project follows a clean MVC structure. It also follows JWT based authentication, authorization and proper validation to ensure a secure and scalable Backend system. This project backend system provides all the essential API's required for an e-commerce platform: 

- Users can register, login, browse products, add items to cart, place orders, cancel orders and make payments
- orders are securely linked with Stripe payment gateway
- Product images are uploaded and stored using Cloudinary
- JWT based authentication ensures secure access
- Scalable architecture with clean seperation of rotes, controllers, models and middlewares

## Tech Stack

**Backend**

- **Node.js** 
- **Express.js** 

**Database**

- **MongoDB** 
- **Mongoose** 

**Authentication & Security**

- **JWT Authentication** 
- **Bcrypt for password hashing** 

**File Upload**

- **Cloudinary**
- **Multer**

**Payments**

- **Stripe Payment Gateway**
- **Stripe Webhooks**

**Tools**

- **Postman ( API Testing )**
- **dotenv**


## Features

### User Model

- User registration and login
- Secure Password Hashing
- JWT Authentication
- Upload and store user profile image in Cloudinary
- create, update, get user details

### Product Model

- Create, Update and Delete Products
- Upload product images using Cloudinary
- Get product list and product details based on filters, product id

### Cart Model

- Add Products to cart
- Update cart items
- Remove items from cart
- View Cart Details

### Order Module

- Place order from Cart
- Cancel Order(only if cancellable)
- Order status manage
- Prevent Duplicate Payments

### Payment Module(Stripe)

- Create Stripe Payment Intent
- Secure Card Payments
- Webhook based payment confirmation
- Auto update order status after payment success

### Coudinary Integration

- Secure Cloud Image Storage
- Upload User profile images
- Upload Product Images

## Environment Variable

Create a .env file in the root directory and add some variable name with value:
  MONGO_URI , CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET, JWT_SECRET_KEY, STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET


##  Installation & Setup

### 1.  Clone the Repository

     git clone <repoLink>

### 2.  Install Dependencies

     npm install

### 3.  Start the server

     node src/index.js

## Payment Flow(Stripe)

- User places an order
- Backend creates Stripe Payment Intent
- Client completes Card Payment
- Stripe webhook confirms payment
- Order status automatically updated to paid & completed

## Authentication Flow

- Login returns JWT token
- Token must be sent in headers
- Middleware validates token for protected routes

## Key Learnings

- Real world REST API architecture
- Secure authentication & authorization
- Cloudinary image handling
- MongoDB data modeling
- Stripe payment integration and webhooks


## License

This Project is for learning purpose
