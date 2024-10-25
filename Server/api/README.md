
## 🛠 **API - Server Setup & Details**

The **Server** directory contains the core backend functionality for the **Tectonify** live chat system. This API is designed to handle user authentication, chat interactions, and manage real-time communication between users and admins. The server integrates with the frontend for seamless operation.

### **Directory Structure Overview**

- **config/**: Configuration files for server setup, including environment variables and database connections.
- **env-files/**: Contains environment files to manage sensitive credentials.
- **features/**: Modular components for the system's key features.
- **helper/**: Helper functions to assist various server-side operations.
- **middleware/**: Middleware to manage request processing, authentication, and error handling.
- **migrations/**: Database migration files to ensure the database schema evolves smoothly.
- **models/**: Contains the data models representing entities such as users and chats, mapped to the database.
- **public/uploads/chaticons/**: Directory where uploaded chat icons are stored.
- **routes/**: Contains route definitions to handle different API endpoints.
- **test/**: Test cases for validating server-side functionalities.
- **uploads/chaticons/**: Stores user-uploaded icons used during chat sessions.
- **util/**: Utility functions for repeated tasks across the server.
- **www/**: The static website files and configurations for the chat application, including `index.html` and `app.js`.

### **Key Files**

- **app.js**: The main application file to initialize the Express.js server, set up middleware, and configure routes.
- **README.md**: The documentation for the server configuration and setup instructions.
- **logger.js**: A custom logging utility to track and debug server-side events.
- **package.json & package-lock.json**: Dependency management files for setting up and running the project.

### **Installation & Setup**

Clone the repository and navigate to the **Server** directory:

```bash
git clone https://github.com/arshita08/Tectonify.git
cd Tectonify/Server
```

Install server dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```
