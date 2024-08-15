# Natourist - A Tour App

Natourist is a modern web application for booking and managing nature tours. It provides users with the ability to browse, book, and review various tours. The application is built using Node.js, Express, and MongoDB on the backend, with a responsive frontend powered by Pug and Leaflet for interactive maps.

## Features

- **User Authentication**: Secure sign-up, login, and logout functionalities.
- **Tour Management**: Browse , view detailed tour information, and book tours.
- **Payments Integration**: Seamless payment processing using Stripe.
- **Interactive Maps**: Display tour locations using Leaflet.js.
- **Responsive Design**: Mobile-first design ensuring a great user experience on any device.

## Technologies Used

- **Frontend**: 
  - Pug: Templating engine for server-side rendering.
  - Leaflet: Library for interactive maps.
  - Axios: For making HTTP requests from the frontend.
  
- **Backend**:
  - Node.js: JavaScript runtime.
  - Express.js: Web application framework.
  - MongoDB: NoSQL database for storing application data.
  - Mongoose: Object Data Modeling (ODM) library for MongoDB.
  - Stripe: Payment processing platform.
  
- **Others**:
  - Webpack: Module bundler.
  - Babel: JavaScript compiler for ES6+ features.
  - JWT: JSON Web Tokens for secure authentication.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB installed and running.
- Stripe account for payment processing.

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/natourist.git
    cd natourist
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root of your project and add the following variables:

    ```plaintext
    NODE_ENV=development
    DATABASE=your_mongodb_uri
    DATABASE_PASSWORD=your_mongodb_password
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=90d
    JWT_COOKIE_EXPIRES_IN=90
    STRIPE_SECRET_KEY=your_stripe_secret_key
    STRIPE_PUBLIC_KEY=your_stripe_public_key
    EMAIL_USERNAME=your_email_username
    EMAIL_PASSWORD=your_email_password
    EMAIL_HOST=your_email_host
    EMAIL_PORT=your_email_port
    ```

4. **Start the development server:**

    ```bash
    npm run dev
    ```

5. **Visit the application:**

    Open your browser and navigate to `http://127.0.0.1:3000/`.

### Building for Production

To create a production build of the application, run:

```bash
npm run build
