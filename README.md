# CongChungOnline Backend

This repository contains the backend code for **CongChungOnline**, a platform for online notarization services that leverages blockchain and NFT for document storage.

## Features

- **Document Upload:** Users can upload their documents for notarization.
- **Notary Service Selection:** Users can select from various notary services tailored to their needs.
- **Requester Information:** Users provide personal details for notarization requests.
- **Email Notifications:** Users are kept informed via email about the status of their notarization requests.
- **Firebase Integration:** Securely stores documents on Firebase Cloud Storage.
- **Blockchain & NFT Storage:** Document records are stored securely using blockchain technology and NFTs.
- **Authentication:** Uses JWT-based authentication for secure access.
- **Role-Based Access Control:** Provides different levels of access based on user roles (e.g., admin, customer, notary).

## Technologies

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Storage:** Firebase Cloud Storage
- **Authentication:** JWT, Passport.js
- **Validation:** Joi
- **Testing:** Jest
- **Security:** Helmet, Xss-Clean, Express-Mongo-Sanitize
- **Middleware:** Winston (logging), Morgan (HTTP request logging)
- **API Documentation:** Swagger
- **Environment Configuration:** Dotenv, Cross-env
- **Process Management:** PM2
- **Continuous Integration:** Travis CI
- **Code Quality:** Coveralls, Codacy
- **Pre-commit Hooks:** Husky, Lint-staged
- **Code Formatting:** ESLint, Prettier
- **Version Control:** Git

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ASE-UIT/congchungonline-be.git
   cd congchungonline-be
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Copy the `.env.example` file to `.env` and update the values as needed.

   ```bash
   cp .env.example .env
   ```

4. Start the server:

   ```bash
   npm start
   ```

## Environment Variables

```bash
# Port number
PORT=3000
HOST=http://localhost

# MongoDB URL
MONGODB_URL=mongodb://127.0.0.1:27017/node-boilerplate

# JWT Authentication
JWT_SECRET=thisisasamplesecret
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# SMTP (Email) Configuration
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com

# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=YOUR_GOOGLE_CALLBACK_URL

# GEMINI API Key (Google Generative AI)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Firebase Configuration
FIREBASE_TYPE=YOUR_FIREBASE_TYPE
FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
FIREBASE_PRIVATE_KEY_ID=YOUR_FIREBASE_PRIVATE_KEY_ID
FIREBASE_PRIVATE_KEY=YOUR_FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL=YOUR_FIREBASE_CLIENT_EMAIL
FIREBASE_CLIENT_ID=YOUR_FIREBASE_CLIENT_ID
FIREBASE_AUTH_URI=YOUR_FIREBASE_AUTH_URI
FIREBASE_TOKEN_URI=YOUR_FIREBASE_TOKEN_URI
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=YOUR_FIREBASE_AUTH_PROVIDER_X509_CERT_URL
FIREBASE_CLIENT_X509_CERT_URL=YOUR_FIREBASE_CLIENT_X509_CERT_URL
```

## API Documentation

The API documentation can be accessed at `/api-docs`. You can view the list of available APIs and their specifications by running the server and visiting `http://localhost:3000/v1/docs` in your browser.

## Testing

Run tests with:

```bash
npm test
```

For coverage reports:

```bash
npm run coverage
```

## Docker

If you want to run the application using Docker, you can use the following commands:

```bash
# Run the Docker container in development mode
npm run docker:dev

# Run the Docker container in production mode
npm run docker:prod
```

## License

This project is licensed under the MIT License.
