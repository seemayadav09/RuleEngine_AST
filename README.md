# Rule Engine Application - README

## Overview

This Rule Engine application is designed to manage and evaluate complex rules using Abstract Syntax Trees (AST). It supports creating, combining, evaluating, and modifying rules through a GUI-based React frontend. The backend is powered by Node.js and SQLite3 for persistent rule storage and efficient processing.

## Features

- **Create Rule**: Users can create new rules by providing a rule string.
- **Combine Rules**: Multiple rules can be combined using logical operators (AND/OR).
- **Evaluate Rule**: Evaluate a specific rule against user-provided data.
- **Modify Rule**: Modify existing rules by providing a new rule string.
- **Persistent Storage**: Rules are stored in a SQLite3 database for future retrieval and processing.

## System Design Choices

1. **Frontend**: Built with React, using Material-UI (MUI) for a modern, responsive interface. It allows users to interact with the rule engine in a simple and intuitive manner.
2. **Backend**: A Node.js Express server handles API requests and processes rules using an Abstract Syntax Tree (AST) model. SQLite3 is chosen for its lightweight, easy-to-use nature, making the application simple to set up.
3. **AST Representation**: Rules are parsed into an AST format to allow flexible and efficient evaluation, combination, and modification of rules.
4. **Persistence**: The backend uses SQLite3 for rule storage, ensuring rules persist between sessions and are efficiently managed.

## Requirements

1. **Frontend**:
   - React 18+
   - Material-UI (MUI)
   - Axios for making HTTP requests

2. **Backend**:
   - Node.js 18+
   - Express.js
   - SQLite3
   - Body-Parser middleware
   - CORS middleware for enabling cross-origin requests

## Dependencies

Ensure the following dependencies are installed for both the frontend and backend:

### Frontend

Install the following packages:
```bash
npm install @mui/material axios react react-dom
```

### Backend

Install the following packages:
```bash
npm install express sqlite3 body-parser cors
```

Alternatively, you can use Docker to containerize the backend server and SQLite3:

### Docker Setup (Optional)
```bash
# Build the Docker image for the Node.js backend
docker build -t rule-engine-backend .

# Run the container
docker run -p 5000:5000 rule-engine-backend
```

### Podman Setup (Optional)
```bash
# Build the backend using Podman
podman build -t rule-engine-backend .

# Run the container
podman run -p 5000:5000 rule-engine-backend
```

## Installation and Setup

### 1. Frontend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the React application:
   ```bash
   npm start
   ```

   This will start the React frontend on `http://localhost:3000`.

### 2. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`.

4. **Database**: SQLite3 will automatically create the `rules.db` file and initialize the necessary schema.

### 3. Running the Application

1. Ensure the backend server is running on `http://localhost:5000`.
2. Run the frontend React application.
3. Open `http://localhost:3000` in your browser to interact with the Rule Engine GUI.

## API Endpoints

### 1. Create Rule
**Endpoint**: `/create_rule`
- **Method**: POST
- **Body**:
  ```json
  {
    "rule_string": "age > 30 AND department = 'Sales'"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "ast": { ... }
  }
  ```

### 2. Combine Rules
**Endpoint**: `/combine_rules`
- **Method**: POST
- **Body**:
  ```json
  {
    "rule_strings": ["age > 30", "department = 'Sales'"]
  }
  ```
- **Response**:
  ```json
  {
    "id": 2,
    "ast": { ... }
  }
  ```

### 3. Evaluate Rule
**Endpoint**: `/evaluate_rule`
- **Method**: POST
- **Body**:
  ```json
  {
    "rule_id": 1,
    "data": {
      "age": 35,
      "department": "Sales"
    }
  }
  ```
- **Response**:
  ```json
  {
    "result": true
  }
  ```

### 4. Modify Rule
**Endpoint**: `/modify_rule`
- **Method**: POST
- **Body**:
  ```json
  {
    "rule_id": 1,
    "new_rule_string": "age < 50 AND department = 'HR'"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "ast": { ... }
  }
  ```

## Testing the Application

1. Use the GUI in the React application to interact with the rule engine.
2. Use tools like Postman or cURL to manually test API endpoints.

## Future Enhancements

- Add user authentication to manage rule ownership.
- Implement advanced rule combination logic beyond `AND` and `OR`.
- Add validation checks on input data to ensure better error handling.
- Expand the GUI with visual representation of AST structures for better rule management.

## Contact

For any issues or inquiries, please reach out to the project maintainer at seemayadav982002@gmail.com.
