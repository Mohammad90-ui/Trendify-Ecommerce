# Trendify - Full-Stack E-Commerce Application

Trendify is a modern, full-stack e-commerce web application built with React on the frontend and Node.js/Express on the backend. It features user authentication, product management, shopping cart, wishlist, order processing, and secure payments via Stripe. The app includes admin panels for managing users, products, and orders.

## Features

### User Features
- **User Registration & Authentication**: Secure login and signup with JWT tokens.
- **Product Browsing**: View products by category, search, and pagination.
- **Shopping Cart**: Add/remove items, update quantities, and persist cart across sessions.
- **Wishlist**: Save favorite products for later.
- **Order Management**: Place orders, view order history, and track status.
- **Payment Integration**: Secure payments using Stripe.
- **User Profiles**: Update personal information and view order history.
- **Responsive Design**: Optimized for desktop and mobile using Tailwind CSS.

### Admin Features
- **User Management**: View, edit, and delete user accounts.
- **Product Management**: Add, edit, delete, and manage product inventory.
- **Order Management**: View and update order statuses.
- **File Uploads**: Upload product images.

### Additional Features
- **Dark/Light Theme Toggle**: Switch between themes for better user experience.
- **Toast Notifications**: Real-time feedback for actions like adding to cart or login.
- **Error Handling**: Comprehensive error handling with custom middleware.
- **Data Seeding**: Populate the database with sample users and products for development.

## Tech Stack

### Frontend
- **React**: UI library for building the user interface.
- **Vite**: Fast build tool and development server.
- **Redux Toolkit**: State management for cart, user auth, and API calls.
- **React Router**: Client-side routing.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: HTTP client for API requests.
- **Stripe Elements**: For secure payment forms.
- **React Icons & Heroicons**: Icon libraries.

### Backend
- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database with Mongoose ODM.
- **JWT**: JSON Web Tokens for authentication.
- **bcryptjs**: Password hashing.
- **Stripe**: Payment processing.
- **Multer**: File upload handling.
- **CORS**: Cross-origin resource sharing.
- **Dotenv**: Environment variable management.

### Development Tools
- **Nodemon**: Auto-restart server during development.
- **ESLint**: Code linting.
- **PostCSS & Autoprefixer**: CSS processing.

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- Stripe account for payment processing

### Backend Setup
1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Seed the database with sample data:
   ```
   npm run data:import
   ```

5. Start the backend server:
   ```
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The app will run on `http://localhost:3000`.

### Production Build
1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Set `NODE_ENV=production` in the backend `.env` file.

3. Start the backend server:
   ```
   cd backend
   npm start
   ```

## Usage

### User Flow
1. **Browse Products**: Visit the home page to view featured products.
2. **Search & Filter**: Use the search bar and pagination to find products.
3. **Add to Cart/Wishlist**: Click on products to view details and add to cart or wishlist.
4. **Checkout**: Proceed to cart, enter shipping info, select payment, and place order.
5. **Payment**: Complete payment securely via Stripe.
6. **Profile**: Manage account details and view order history.

### Admin Flow
1. Login as an admin user (sample admin: email `admin@example.com`, password `123456`).
2. Access admin panels via the header dropdown.
3. Manage users, products, and orders from the respective screens.

## API Endpoints

### Products
- `GET /api/products` - Get all products (with search, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Users
- `POST /api/users` - Register user
- `POST /api/users/auth` - Authenticate user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `GET /api/orders` - Get user's orders
- `GET /api/orders/all` - Get all orders (admin)

### Uploads
- `POST /api/upload` - Upload image

### Stripe
- `GET /api/config/stripe` - Get Stripe publishable key
- `POST /webhook` - Stripe webhook for payment confirmation

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Product images sourced from Unsplash.
- Inspired by various e-commerce platforms like Shopify and Amazon.
- Built following best practices for MERN stack development.
