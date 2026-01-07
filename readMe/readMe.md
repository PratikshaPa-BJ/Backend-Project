## Project - Shopping Cart E-commerce Project

## Overview

This project is a RESTful Backend API for an E-commerce application built using Node.js, Express js and MongoDb. It supports user authentication, product management, cart and order handling, images upload using Cloudinary and secure online payments integrated with Stripe Payment Gateway. This project follows a clean MVC architecture, uses JWT based authentication, authorization and proper validation to ensure a secure and scalable Backend system. This project backend system provides all the essential API's required for an e-commerce platform: 

- Users can register, login, browse products, add items to cart, place orders, cancel orders and make payments
- Products and cart management
- Product images are uploaded and stored using Cloudinary
- JWT based authentication ensures secure access
- orders are securely linked with Stripe payment gateway with webhook verification
- Scalable architecture with clean seperation of routes, controllers, models and middlewares

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

### User Module

- User registration and login
- Secure Password Hashing with bcrypt
- JWT based Authentication
- Upload and store user profile image in Cloudinary
- create, update, get user details

### Product Module

- Create, Update and Delete Products
- Upload product images using Cloudinary
- Get product list with filters 
- Get product details by product id

### Cart Module

- Add Products to cart
- Update cart items
- Remove products from cart
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
- Auto update order status after successfull payment

### Coudinary Integration

- Secure Cloud Image Storage
- Upload User profile images
- Upload Product Images

## Environment Variable

Create a .env file in the root directory and add some variable name with value:

```yaml
   MONGO_URI =your_mongodb_connection_string
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=coludinary_api_key
   CLOUD_API_SECRET=cloudinary_api_secret
   JWT_SECRET_KEY=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## API Documentation

### 🔐 User APIs

  | Method | Endpoint | Description |
  |--------|----------|-------------|
  | POST   |`/register` |  Register New User |
  | POST   | `/login` | user login |
  | GET   | `/users/:userId/profile` | Get user profile details |
  | PUT   | `/users/:userId/profile` | Update user profile details |

### 📦 Product APIs
    
    | Method | Endpoint | Description |
    |--------|----------|-------------|
    | POST   |`/products` |  Create New Product |
    | GET   | `/products` | Get all products by applying Filter |
    | GET   | `/products/:productId` | Get product by id |
    | PUT   | `/products/:productId` | Update product |
    | DELETE | `/products/:productId` | Delete product |

### 🛒 Cart APIs

    | Method | Endpoint | Description |
    |--------|----------|-------------|
    | POST   |`/users/:userId/cart` |  Add Product to cart  |
    | PUT  | `/users/:userId/cart` | Update cart  |
    | GET   | `/users/:userId/cart` | View Cart  |
    | DELETE | `/users/:userId/cart` | Delete Cart |

### 📑 Order APIs
     
    | Method | Endpoint | Description |
    |--------|----------|-------------|
    | POST   |`/users/:userId/order` |  User place order  |
    | PUT    | `/users/:userId/order` | User can cancel order(if cancellable)  |

### 💳 Payment APIs(Stripe)

    | Method | Endpoint | Description |
    |--------|----------|-------------|
    | POST   |`/api/payments/create-payment-intent` |  Create Stripe Payment Intent  |
    | PUT    | `/api/payments/payment/webhook` | Stripe webhook endpoint  |


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
- Stripe sends webhook event
- Backend verifies webhook
- Order status updated to paid & completed

## Authentication Flow

- Login returns JWT token
- Token must be sent in headers
- Middleware validates token for protected routes

## Key Learnings

- Real world REST API architecture
- Secure authentication & authorization
- Cloudinary image handling
- MongoDB data modeling
- Stripe payment integration with webhooks

## Author

This project is created by me(Pratiksha Parihari).

## License

This Project is created for learning purpose.
