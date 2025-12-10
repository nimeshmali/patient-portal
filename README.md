# 🏥 Patient Portal - Medical Document Management System

A modern, full-stack web application for managing medical documents. Patients can securely upload, view, download, and delete their medical documents (prescriptions, test results, referral notes) through an intuitive interface.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Example API Calls](#example-api-calls)
- [Screenshots](#screenshots)
- [Environment Variables](#environment-variables)

---

## 🎯 Project Overview

Patient Portal is a healthcare document management platform that enables users to:

- **Upload** PDF medical documents with drag-and-drop functionality
- **View** all uploaded documents in a clean, organized interface
- **Download** documents for offline access
- **Delete** documents when no longer needed

The application features a modern UI built with React and shadcn/ui components, backed by a robust Node.js/Express API with PostgreSQL database using Drizzle ORM.

### Key Highlights

- ✅ **Secure File Handling** - PDF-only validation with 5MB size limit
- ✅ **Real-time Validation** - Client and server-side file validation
- ✅ **Duplicate Detection** - Handles duplicate file names
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Modern UI/UX** - Built with Tailwind CSS and shadcn/ui

---

## ✨ Features

### Document Management
- 📤 **Upload Documents**: Drag-and-drop or browse to upload PDF files
- 📁 **View Library**: Grid view of all uploaded documents with metadata
- 💾 **Download Files**: One-click download of any document
- 🗑️ **Delete Documents**: Secure deletion with confirmation dialog

### User Experience
- 🎨 **Modern Interface**: Clean, professional design with smooth animations
- 📱 **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- 🔔 **Toast Notifications**: Real-time feedback for all actions
- ⚡ **Loading States**: Visual indicators during async operations
- 🚨 **Error Handling**: User-friendly error messages

### Technical Features
- 🔒 **File Validation**: PDF-only with size and type checking
- 🔄 **Concurrent Upload Handling**: Unique filenames with timestamps
- 🛡️ **Edge Case Handling**: Duplicate files, incomplete uploads, errors
- 📊 **Database Integration**: Persistent storage with PostgreSQL
- 🎯 **Type Safety**: Full TypeScript coverage

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React 18** | UI Library | Component-based architecture, virtual DOM for performance |
| **TypeScript** | Type Safety | Catch errors at compile time, better IDE support |
| **Vite** | Build Tool | Lightning-fast HMR, optimized production builds |
| **TailwindCSS** | Styling | Utility-first CSS, rapid development, small bundle size |
| **shadcn/ui** | Component Library | Accessible, customizable components built on Radix UI |
| **React Router** | Routing | Declarative routing, code splitting support |
| **Axios** | HTTP Client | Promise-based, request/response interceptors |
| **date-fns** | Date Formatting | Lightweight, tree-shakable date utilities |

### Backend

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Node.js** | Runtime | JavaScript everywhere, non-blocking I/O |
| **Express** | Web Framework | Minimal, flexible, robust ecosystem |
| **TypeScript** | Type Safety | Consistent types across frontend and backend |
| **Drizzle ORM** | Database ORM | Type-safe, SQL-like syntax, excellent performance |
| **PostgreSQL** | Database | ACID compliance, relational data, reliability |
| **Multer** | File Upload | Multipart/form-data handling, file validation |

### Why These Choices?

**React + TypeScript + Vite**: Modern development experience with excellent DX, fast builds, and type safety.

**TailwindCSS + shadcn/ui**: Rapid UI development without sacrificing customization. shadcn/ui provides accessible components that can be modified directly in the codebase.

**Drizzle ORM**: Lightweight, type-safe alternative to heavier ORMs like TypeORM. SQL-like syntax makes it easier to write complex queries.

**PostgreSQL**: Industry-standard relational database with excellent support for JSON, full-text search, and complex queries.

**Multer**: De-facto standard for file uploads in Express, with extensive validation options.

---

## 📁 Project Structure

```
patient-portal/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── documents/
│   │   │   │   ├── DocumentCard.tsx
│   │   │   │   ├── DocumentList.tsx
│   │   │   │   └── DocumentUpload.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   └── ui/              # shadcn components
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── UploadDocument.tsx
│   │   │   └── ViewDocuments.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── backend/
    ├── src/
    │   ├── config/
    │   │   ├── database.ts
    │   │   └── schema.ts
    │   ├── controllers/
    │   │   └── documentController.ts
    │   ├── routes/
    │   │   └── documentRoutes.ts
    │   ├── models/
    │   │   └── documentModel.ts
    │   ├── middleware/
    │   │   ├── errorHandler.ts
    │   │   ├── upload.ts
    │   │   └── validator.ts
    │   ├── types/
    │   │   └── index.ts
    │   └── server.ts
    ├── uploads/
    ├── .env
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    └── drizzle.config.ts
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nimeshmali/patient-portal.git
cd patient-portal
```

### 2. Database Setup

Start PostgreSQL and create the database:

```bash
# Start PostgreSQL service
# On macOS with Homebrew:
brew services start postgresql

# On Linux:
sudo systemctl start postgresql

# On Windows: Start from Services or pgAdmin
```

Create the database:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE patient_portal;

-- Connect to the database
\c patient_portal

-- Create documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    filesize INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create index for better query performance
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

-- Exit
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Install additional dependencies
npm install express cors dotenv multer pg
npm install drizzle-orm
npm install -D typescript @types/node @types/express @types/cors @types/multer ts-node nodemon drizzle-kit @types/pg

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL Database URL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/patient_portal

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

Create uploads directory:

```bash
mkdir uploads
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Install additional dependencies
npm install react-router-dom axios date-fns
npm install -D @types/react-router-dom

# Initialize shadcn/ui
npx shadcn@latest init
# Choose: TypeScript: Yes, Style: Default, Base color: Slate, CSS variables: Yes

# Add shadcn components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add sonner
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add badge
npx shadcn@latest add alert
npx shadcn@latest add dialog

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Database connected successfully
✅ Server is running on http://localhost:5000
✅ API endpoints available at http://localhost:5000/
✅ Upload directory: uploads
```

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/
```

### Endpoints

#### 1. Upload Document

**POST** `/documents/upload`

Upload a PDF document.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: 
  - `file` (File): PDF file to upload

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "filename": "prescription.pdf",
    "filesize": 245632,
    "created_at": "2024-12-10T10:30:00.000Z"
  }
}
```

**Error Responses:**

File Too Large (400):
```json
{
  "success": false,
  "error": "FILE_TOO_LARGE",
  "message": "File size exceeds the maximum limit of 5MB"
}
```

Invalid File Type (400):
```json
{
  "success": false,
  "error": "INVALID_FILE_TYPE",
  "message": "Only PDF files are allowed"
}
```

Duplicate File (409):
```json
{
  "success": false,
  "error": "DUPLICATE_FILE",
  "message": "A file with this name already exists"
}
```

#### 2. Get All Documents

**GET** `/documents`

Retrieve all uploaded documents.

**Request:**
- Method: `GET`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": [
    {
      "id": 1,
      "filename": "prescription.pdf",
      "filepath": "prescription-1702123456789-123456789.pdf",
      "filesize": 245632,
      "created_at": "2024-12-10T10:30:00.000Z"
    },
    {
      "id": 2,
      "filename": "test-results.pdf",
      "filepath": "test-results-1702123456789-987654321.pdf",
      "filesize": 512000,
      "created_at": "2024-12-10T11:45:00.000Z"
    }
  ]
}
```

#### 3. Download Document

**GET** `/documents/:id`

Download a specific document.

**Request:**
- Method: `GET`
- URL Parameters:
  - `id` (integer): Document ID

**Response (Success - 200):**
- Content-Type: `application/pdf`
- Body: PDF file stream

**Error Response (404):**
```json
{
  "success": false,
  "error": "FILE_NOT_FOUND",
  "message": "Document not found"
}
```

#### 4. Delete Document

**DELETE** `/documents/:id`

Delete a specific document.

**Request:**
- Method: `DELETE`
- URL Parameters:
  - `id` (integer): Document ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Error Responses:**

Not Found (404):
```json
{
  "success": false,
  "error": "FILE_NOT_FOUND",
  "message": "Document not found"
}
```

Delete Failed (500):
```json
{
  "success": false,
  "error": "DELETE_FAILED",
  "message": "Failed to delete document"
}
```

---

## 🧪 Example API Calls

### Using cURL

#### 1. Upload a Document

```bash
curl -X POST http://localhost:5000/documents/upload \
  -F "file=@/path/to/your/document.pdf"
```

#### 2. Get All Documents

```bash
curl http://localhost:5000/documents
```

#### 3. Download a Document

```bash
curl -O -J http://localhost:5000/documents/1
```

#### 4. Delete a Document

```bash
curl -X DELETE http://localhost:5000/documents/1
```

### Using JavaScript (Fetch API)

#### 1. Upload a Document

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/documents/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data);
```

#### 2. Get All Documents

```javascript
const response = await fetch('http://localhost:5000/documents');
const data = await response.json();
console.log(data.data); // Array of documents
```

#### 3. Download a Document

```javascript
const response = await fetch('http://localhost:5000/documents/1');
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'document.pdf';
a.click();
```

#### 4. Delete a Document

```javascript
const response = await fetch('http://localhost:5000/documents/1', {
  method: 'DELETE',
});

const data = await response.json();
console.log(data);
```

### Using Postman

#### Upload Document
1. Create a new POST request
2. URL: `http://localhost:5000/documents/upload`
3. Body → form-data
4. Key: `file` (type: File)
5. Value: Select your PDF file
6. Send

#### Get All Documents
1. Create a new GET request
2. URL: `http://localhost:5000/documents`
3. Send

#### Download Document
1. Create a new GET request
2. URL: `http://localhost:5000/documents/1`
3. Send and Save Response

#### Delete Document
1. Create a new DELETE request
2. URL: `http://localhost:5000/documents/1`
3. Send

---

## 📸 Screenshots

### Landing Page
<!-- Add screenshot here -->
![Landing Page](./frontend/public/landingPage1.png)
![Landing Page](./frontend/public/landingPage2.png)
![Landing Page](./frontend/public/landingPage3.png)


*Modern landing page showcasing features and tech stack*

---

### Upload Document Page
<!-- Add screenshot here -->
![Upload Page](./frontend/public/uploadDocument.png)

*Drag-and-drop interface with file validation*

---

### Document Library
<!-- Add screenshot here -->
![Document Library](frontend\public\image.png)

*Grid view of all uploaded documents*

---

## 🔧 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

### Frontend (.env)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port in backend/.env
PORT=5001
```

### Database Connection Failed

1. Ensure PostgreSQL is running
2. Verify credentials in DATABASE_URL
3. Check if database exists
4. Test connection:
   ```bash
   psql -U postgres -d patient_portal
   ```

### CORS Errors

- Ensure backend is running on port 5000
- Check VITE_API_BASE_URL in frontend/.env
- Verify CORS is enabled in backend/src/server.ts

### File Upload Fails

1. Check uploads directory exists: `mkdir backend/uploads`
2. Verify file size is under 5MB
3. Ensure file is a valid PDF
4. Check backend logs for detailed error

### shadcn Components Not Found

```bash
cd frontend
npx shadcn@latest add button card toast input label badge alert dialog
```

---

## 👨‍💻 Author

Nimesh Mali - [GitHub](https://github.com/nimeshmali)

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database access
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

**Built with ❤️ for better healthcare document management**