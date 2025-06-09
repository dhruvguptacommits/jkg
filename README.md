# NestJS Backend for User and Document Management

## Overview
This is a NestJS backend application for user authentication, user management, document management, and ingestion processes. It uses PostgreSQL as the database, JWT for authentication, and a microservices architecture for ingestion.

## Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

## Setup Instructions

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd nestjs-backend
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables
The \`.env\` file is already included with default values. Ensure PostgreSQL is configured to match these settings:
\`\`\`
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=nestjs_db
JWT_SECRET=secretKey
\`\`\`

### 4. Run the Application Locally (Without Docker)
1. Ensure PostgreSQL is running and the database \`nestjs_db\` is created:
   \`\`\`bash
   psql -U postgres -c "CREATE DATABASE nestjs_db;"
   \`\`\`
2. Run the application:
   \`\`\`bash
   npm run start:dev
   \`\`\`

### 5. Run Using Docker
1. Build and start the services:
   \`\`\`bash
   docker-compose up --build
   \`\`\`
2. The application will be available at \`http://localhost:3000\`.

### 6. Generate Test Data
To populate the database with test data (1000 users, 100,000 documents):
\`\`\`bash
npx ts-node scripts/generate-test-data.ts
\`\`\`

### 7. Run Unit Tests
\`\`\`bash
npm run test
\`\`\`

## API Endpoints
- **Authentication**
  - \`POST /auth/register\` - Register a new user
  - \`POST /auth/login\` - Login and get JWT token
  - \`POST /auth/logout\` - Logout (requires JWT)
- **User Management**
  - \`POST /users/:id/role\` - Update user role (admin only)
  - \`DELETE /users/:id\` - Delete user (admin only)
- **Document Management**
  - \`POST /documents\` - Create a document
  - \`GET /documents\` - List documents
  - \`GET /documents/:id\` - Get a document
  - \`POST /documents/:id\` - Update a document
  - \`DELETE /documents/:id\` - Delete a document
  - \`POST /documents/upload\` - Upload a document file
- **Ingestion**
  - \`POST /ingestion/trigger\` - Trigger ingestion process
  - \`GET /ingestion/:id\` - Get ingestion status

## Deployment
The application is Dockerized and can be deployed using Docker Compose. For cloud deployment:
1. Push the Docker image to a registry (e.g., Docker Hub).
2. Use a Kubernetes cluster or cloud provider (e.g., AWS ECS) to deploy the image.
3. Configure environment variables in the cloud environment.

## CI/CD Pipeline
A basic CI/CD pipeline can be set up using GitHub Actions:
1. On push to \`main\`, run tests and build the Docker image.
2. Push the image to a registry.
3. Deploy to a cloud provider using a deployment script.

## Design Decisions
- **Modularity**: Separate modules for auth, users, documents, and ingestion.
- **Authentication**: JWT with role-based access control.
- **Database**: PostgreSQL with TypeORM for scalability.
- **Microservices**: TCP-based microservices for ingestion.
- **Testing**: Unit tests with 70%+ coverage.
- **Scalability**: Handles large datasets with efficient queries.
