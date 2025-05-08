# CRM Remont - Repair Shop Management System

![CRM Remont Logo](/client/public/repair-black.png#gh-light-mode-only)
![CRM Remont Logo](/client/public/repair-white.png#gh-dark-mode-only)

A modern CRM system for repair shop management that allows you to efficiently manage repair orders, clients, and devices.

## 🚀 Features

### 📋 Order Management
- Create, edit, and delete repair orders
- Track order status (pending, in progress, completed)
- Automatic order ID formatting and date-based sorting (newest first)
- Detailed information about problems and repair costs

### 👥 Client Management
- Complete client database with contact information
- View order history for each client
- Quick client search by name or phone number

### 📱 Device Management
- Device catalog with detailed information (brand, model, serial number)
- Automatic brand icon detection for visual identification
- Link devices to clients and orders

### 📊 Dashboard
- Overview of all active orders, clients, and devices
- Statistics and analytics for tracking business efficiency
- Quick access to the most important system functions

## 🛠️ Technologies

### Frontend
- **React** + **TypeScript** - for creating a modern and type-safe interface
- **Material UI 7** - for stylish and responsive design
- **React Hook Form** - for efficient form handling
- **Axios** - for API integration

### Backend
- **Node.js** + **Express** - for a fast and reliable server application
- **PostgreSQL** - for data storage
- **Sequelize ORM** - for convenient database operations
- **RESTful API** - for standardized client-server interaction

## 🚀 Getting Started

### Requirements
- Node.js (v16+ recommended)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crm-remont.git
   cd crm-remont
   ```

2. Install dependencies for both client and server:
   ```bash
   # For client
   cd client && npm install
   
   # For server
   cd ../server && npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database
   - Configure the settings in `server/config/config.json`

### Running the Application

Start the server and client in separate terminals:

- **Server:**
  ```bash
  cd server
  npm start
  ```

- **Client:**
  ```bash
  cd client
  npm run dev
  ```

The client will be available at `http://localhost:5143`.

## 📁 Project Structure

```
crm-remont/
├── client/                # React frontend
│   ├── public/           # Static files
│   ├── src/              # Source code
│   │   ├── common/       # Shared components
│   │   ├── features/     # Feature modules
│   │   ├── hooks/        # Custom hooks
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Main application component
│   └── package.json      # Client dependencies
│
├── server/               # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # API controllers
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   └── package.json      # Server dependencies
│
└── README.md             # Project documentation
```

## 📝 License

MIT

---

Developed with ❤️ for efficient repair shop management. For questions or suggestions, please create an issue or pull request.

# crm-remont
