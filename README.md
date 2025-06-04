# BorrowXchange

A secure peer-to-peer money lending platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 Secure user authentication
- 💰 Real-time wallet management
- 💸 Peer-to-peer money transfer
- 📩 Real-time notifications
- 🔄 Transaction status tracking
- 📊 Transaction history

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Bcrypt
- Swagger API Documentation

## Prerequisites

- Node.js v16+
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/borrowxchange.git
cd borrowxchange
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_password
JWT_LIFETIME=10d
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
PORT=3050
NODE_ENV=development
```

4. Start the development server
```bash
npm run dev
```

## API Documentation

Access the Swagger documentation at:
```
http://localhost:3050/api/docs
```

### Available Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

#### Transactions
- `POST /api/v1/transaction/initiateTransfer` - Initiate money transfer
- `POST /api/v1/transaction/accept/:id` - Accept incoming transfer
- `POST /api/v1/transaction/decline/:id` - Decline incoming transfer
- `GET /api/v1/transaction/transactions` - Get transaction history

#### Notifications
- `GET /api/v1/notification` - Get user notifications


## WebSocket Events

- `connection` - Client connected
- `join` - User joins their notification room
- `notification` - Real-time transaction notifications
- `disconnect` - Client disconnected

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:
```json
{
  "success": false,
  "message": "Error message here",
  "errors": []
}
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Real-time transaction validation
- Secure wallet management
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Your Name - [@Ikay14](https://github.com/Ikay14)

## Acknowledgments

- Express.js
- MongoDB
- Socket.IO
- Swagger UI