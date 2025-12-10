# Design Document - Patient Portal

## Table of Contents
1. [Tech Stack Choices](#1-tech-stack-choices)
2. [Architecture Overview](#2-architecture-overview)
3. [API Specification](#3-api-specification)
4. [Data Flow Description](#4-data-flow-description)
5. [Assumptions](#5-assumptions)

---
<a id="1-tech-stack-choices"></a>
## 1. Tech Stack Choices

### Q1. What frontend framework did you use and why?

**Framework: React 18 with TypeScript**

**Reasoning:**

1. **Component-Based Architecture**: React's component model allows for reusable UI elements, making it easy to build the DocumentCard, DocumentUpload, and DocumentList components independently and compose them together.

2. **Virtual DOM Performance**: React's virtual DOM efficiently updates only the changed parts of the UI, which is crucial when rendering lists of documents that may frequently update.

3. **Rich Ecosystem**: React has extensive libraries and tools (React Router for navigation, Axios for HTTP requests) that accelerate development without reinventing the wheel.

4. **TypeScript Integration**: React works seamlessly with TypeScript, providing type safety across the entire frontend codebase. This catches errors at compile time and improves IDE autocomplete.

5. **Modern Tooling**: Vite as the build tool provides instant HMR (Hot Module Replacement) and optimized production builds, significantly improving developer experience.

6. **Community & Resources**: React's large community means abundant documentation, tutorials, and third-party solutions for common problems.

**Why Not Vue or Angular?**
- Vue: While simpler to learn, React's larger ecosystem and better TypeScript support made it the better choice.
- Angular: Too heavyweight for this project; its opinionated structure would be overkill for a document management system.

---
### Q2. What backend framework did you choose and why?

**Framework: Express.js with Node.js and TypeScript**

**Reasoning:**

1. **JavaScript Everywhere**: Using Node.js allows JavaScript/TypeScript on both frontend and backend, enabling code sharing (types, interfaces, utilities) and reducing context switching for developers.

2. **Non-Blocking I/O**: Node.js's event-driven architecture is perfect for file upload/download operations, which are I/O-intensive. Multiple users can upload files concurrently without blocking.

3. **Middleware Ecosystem**: Express's middleware pattern makes it easy to add functionality like CORS, body parsing, error handling, and file upload handling (Multer) in a modular way.

4. **Lightweight & Flexible**: Express is minimal and unopinionated, giving us control over the architecture without unnecessary boilerplate.

5. **Mature File Upload Support**: Multer is the de-facto standard for handling multipart/form-data in Express, with extensive documentation and battle-tested reliability.

6. **Easy Deployment**: Node.js applications are easy to containerize (Docker) and deploy to various platforms (Vercel, AWS, Heroku).

**Why Not Flask or Django?**
- Flask: While lightweight, Python's file handling and concurrency model is less suited for real-time file uploads compared to Node.js's event loop.
- Django: Too opinionated and heavyweight for this project; we don't need its ORM, admin panel, or other built-in features.

---

### Q3. What database did you choose and why?

**Database: PostgreSQL**

**Reasoning:**

1. **ACID Compliance**: PostgreSQL guarantees data consistency, which is critical when managing medical documents. If a file upload fails, the database transaction can be rolled back to maintain consistency.

2. **Relational Data Model**: Our document metadata (id, filename, filepath, filesize, created_at) fits perfectly into a relational schema. Relationships are simple and queries are straightforward.

3. **JSON Support**: PostgreSQL's native JSON support allows future extensibility (e.g., storing document tags, user preferences) without schema changes.

4. **Full-Text Search**: If we need to implement document search in the future, PostgreSQL's full-text search capabilities are excellent.

5. **Scalability**: PostgreSQL handles millions of rows efficiently with proper indexing. We created an index on `created_at` for fast sorting.

6. **Open Source & Free**: No licensing costs, strong community support, and wide adoption in production environments.

7. **Type Safety with Drizzle ORM**: Drizzle ORM provides TypeScript-first database access with SQL-like syntax, giving us type safety without sacrificing performance.

**Why Not SQLite?**
- SQLite is file-based and doesn't support concurrent writes well. Multiple users uploading simultaneously would cause locking issues.
- No user management or advanced security features.
- Not suitable for production deployments with multiple server instances.

**Why Not MongoDB?**
- Document metadata is structured and relational; NoSQL would be overkill.
- Lack of ACID transactions in older versions could compromise data integrity.
- No need for flexible schemas in this use case.

---

### Q4. If you were to support 1,000 users, what changes would you consider?

#### Performance & Scalability

1. **Load Balancing**
   - Deploy multiple backend instances behind a load balancer (Nginx, AWS ALB)
   - Use sticky sessions for file uploads to prevent upload interruption
   - Implement health checks for automatic failover

2. **Database Optimization**
   - **Connection Pooling**: Use PgBouncer to manage database connections efficiently
   - **Read Replicas**: Create PostgreSQL read replicas for listing/searching documents
   - **Database Indexing**: Add indexes on frequently queried fields (user_id, created_at, filename)
   - **Query Optimization**: Use `EXPLAIN ANALYZE` to identify slow queries
   - **Pagination**: Implement cursor-based pagination for document listings

3. **File Storage**
   - **Move to Object Storage**: Migrate from local filesystem to AWS S3, Google Cloud Storage, or Azure Blob Storage
     - Eliminates single point of failure
     - Infinite scalability
     - Built-in redundancy and durability
   - **CDN Integration**: Use CloudFront or Cloudflare CDN for faster document downloads globally
   - **Signed URLs**: Generate time-limited, secure URLs for downloads instead of proxying through backend

4. **Caching Strategy**
   - **Redis Cache**: Cache document metadata to reduce database queries
   - **Application-Level Caching**: Cache frequently accessed documents in memory
   - **Browser Caching**: Set appropriate `Cache-Control` headers for static assets
   - **CDN Edge Caching**: Cache documents at edge locations for faster access

#### Authentication & Authorization

5. **User Authentication**
   - Implement JWT-based authentication (using libraries like `jsonwebtoken`)
   - Add user registration and login endpoints
   - Hash passwords with bcrypt (12+ rounds)
   - Implement refresh tokens for security

6. **Authorization & Multi-Tenancy**
   - Add `user_id` column to documents table
   - Implement row-level security in PostgreSQL
   - Ensure users can only access their own documents
   - Add role-based access control (admin, user, viewer)

#### Monitoring & Observability

7. **Logging & Monitoring**
   - **Structured Logging**: Use Winston or Pino for structured JSON logs
   - **Application Monitoring**: Integrate DataDog, New Relic, or Sentry
   - **Error Tracking**: Set up Sentry for real-time error alerts
   - **Performance Monitoring**: Track API response times, database query times
   - **Uptime Monitoring**: Use Pingdom or UptimeRobot

8. **Metrics & Analytics**
   - Track upload/download success rates
   - Monitor storage usage per user
   - Set up alerts for error rate spikes or slow performance

#### Security Enhancements

9. **Security Hardening**
   - **Rate Limiting**: Implement rate limiting per user/IP (using `express-rate-limit`)
   - **HTTPS Only**: Enforce HTTPS in production with SSL certificates
   - **Helmet.js**: Add security headers (CSP, XSS protection, etc.)
   - **File Scanning**: Integrate virus scanning (ClamAV) before storing files
   - **Input Validation**: Validate all inputs with libraries like Joi or Zod
   - **CORS Configuration**: Restrict CORS to specific domains in production

#### Reliability & Backup

10. **Backup & Disaster Recovery**
    - **Automated Backups**: Daily PostgreSQL backups to S3 with point-in-time recovery
    - **File Backups**: Enable S3 versioning for document recovery
    - **Disaster Recovery Plan**: Document recovery procedures and RTO/RPO targets
    - **Geographic Redundancy**: Replicate data across multiple AWS regions

#### Infrastructure & DevOps

11. **Containerization & Orchestration**
    - **Docker**: Containerize both frontend and backend applications
    - **Kubernetes**: Use K8s for orchestration, auto-scaling, and self-healing
    - **CI/CD Pipeline**: Automate testing and deployment with GitHub Actions, GitLab CI, or Jenkins
    - **Infrastructure as Code**: Use Terraform or AWS CloudFormation

12. **Auto-Scaling**
    - Configure horizontal pod autoscaling in Kubernetes based on CPU/memory
    - Scale database connections dynamically
    - Use AWS Auto Scaling Groups for EC2 instances

#### Code Quality & Testing

13. **Testing & Quality Assurance**
    - **Unit Tests**: Achieve 80%+ code coverage with Jest
    - **Integration Tests**: Test API endpoints with Supertest
    - **E2E Tests**: Implement Playwright or Cypress for end-to-end testing
    - **Load Testing**: Use k6 or Artillery to simulate 1,000 concurrent users

#### Cost Optimization

14. **Cost Management**
    - **S3 Lifecycle Policies**: Move old documents to Glacier for archival storage
    - **Database Resource Sizing**: Right-size PostgreSQL instance based on usage patterns
    - **Reserved Instances**: Purchase reserved capacity for predictable workloads

#### Summary of Changes

| Category | Current State | At 1,000 Users |
|----------|--------------|----------------|
| **Backend** | Single Node.js instance | Multiple instances behind load balancer |
| **Database** | Single PostgreSQL | Primary + read replicas + connection pooling |
| **File Storage** | Local filesystem | AWS S3 + CloudFront CDN |
| **Caching** | None | Redis for metadata + CDN for files |
| **Authentication** | None | JWT-based auth with user isolation |
| **Monitoring** | Console logs | DataDog/New Relic + Sentry |
| **Security** | Basic validation | Rate limiting + virus scanning + HTTPS |
| **Backup** | Manual | Automated daily backups + versioning |
| **Infrastructure** | Single server | Kubernetes cluster with auto-scaling |

---

<a id="2-architecture-overview"></a>
## 2. Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENT BROWSER                            │
│                         (React + TypeScript)                         │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐                │
│  │    Home     │  │   Upload    │  │  Documents   │                │
│  │    Page     │  │    Page     │  │     Page     │                │
│  └─────────────┘  └─────────────┘  └──────────────┘                │
│         │                 │                  │                       │
│         └─────────────────┴──────────────────┘                       │
│                            │                                         │
│                    React Router DOM                                  │
│                            │                                         │
│                     Axios HTTP Client                                │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │ (Port 5173 → 5000)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVER                               │
│                    (Node.js + Express + TypeScript)                  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                        MIDDLEWARE LAYER                       │   │
│  │  ┌──────┐  ┌──────────┐  ┌────────────┐  ┌───────────────┐  │   │
│  │  │ CORS │  │   Body   │  │   Multer   │  │     Error     │  │   │
│  │  │      │  │  Parser  │  │  (Upload)  │  │    Handler    │  │   │
│  │  └──────┘  └──────────┘  └────────────┘  └───────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                             │                                        │
│  ┌──────────────────────────▼───────────────────────────────────┐   │
│  │                      ROUTING LAYER                            │   │
│  │                                                                │   │
│  │  POST   /documents/upload      → Upload Controller           │   │
│  │  GET    /documents             → List Controller             │   │
│  │  GET    /documents/:id         → Download Controller         │   │
│  │  DELETE /documents/:id         → Delete Controller           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                             │                                        │
│  ┌──────────────────────────▼───────────────────────────────────┐   │
│  │                    CONTROLLER LAYER                           │   │
│  │  ┌──────────────────────────────────────────────────────┐    │   │
│  │  │          Document Controller                         │    │   │
│  │  │  • Validate file type & size                        │    │   │
│  │  │  • Generate unique filename                         │    │   │
│  │  │  • Handle business logic                            │    │   │
│  │  │  • Coordinate between Model & File System           │    │   │
│  │  └──────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                             │                                        │
│  ┌──────────────────────────▼───────────────────────────────────┐   │
│  │                      MODEL LAYER                              │   │
│  │  ┌──────────────────────────────────────────────────────┐    │   │
│  │  │          Document Model (Drizzle ORM)                │    │   │
│  │  │  • create(data)                                      │    │   │
│  │  │  • findAll()                                         │    │   │
│  │  │  • findById(id)                                      │    │   │
│  │  │  • deleteById(id)                                    │    │   │
│  │  └──────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────┬───────────────────┘
                              │                   │
                   ┌──────────▼─────────┐  ┌──────▼──────┐
                   │    PostgreSQL      │  │ File System │
                   │     Database       │  │  (uploads/) │
                   │                    │  │             │
                   │  ┌──────────────┐  │  │  ┌────────┐ │
                   │  │  documents   │  │  │  │  PDFs  │ │
                   │  │   table      │  │  │  │        │ │
                   │  │              │  │  │  └────────┘ │
                   │  │ • id         │  │  │             │
                   │  │ • filename   │  │  └─────────────┘
                   │  │ • filepath   │  │
                   │  │ • filesize   │  │
                   │  │ • created_at │  │
                   │  └──────────────┘  │
                   └────────────────────┘
```

### Component Interaction Flow

#### 1. **Frontend → Backend Communication**
   - React components make HTTP requests via Axios
   - Axios configured with base URL: `http://localhost:5000`
   - All responses follow consistent `ApiResponse<T>` structure

#### 2. **Backend Request Processing**
   ```
   Request → CORS Middleware → Body Parser → Multer (if file) → Router → 
   Controller → Model → Database/Filesystem → Response
   ```

#### 3. **Database Layer**
   - Drizzle ORM provides type-safe database operations
   - Connection pooling via pg library
   - Schema defined in TypeScript for compile-time safety

#### 4. **File Storage Layer**
   - Files stored in `backend/uploads/` directory
   - Unique filenames: `originalname-timestamp-random.pdf`
   - Metadata stored in PostgreSQL, actual files on disk

---

<a id="3-api-specification"></a>
## 3. API Specification

### Base URL
```
http://localhost:5000
```

---

### 1. Upload Document

**Endpoint:** `POST /documents/upload`

**Description:** Upload a PDF document to the server. The file is validated for type (PDF only) and size (max 5MB). Duplicate filenames are allowed; a numeric suffix is automatically added to the filename.

**Request:**

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
```
file: <PDF_FILE>
```

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/documents/upload \
  -F "file=@/path/to/prescription.pdf"
```

**Example using JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/documents/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
```

**Success Response (201 Created):**
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

**400 Bad Request - File Too Large:**
```json
{
  "success": false,
  "error": "FILE_TOO_LARGE",
  "message": "File size exceeds the maximum limit of 5MB"
}
```

**400 Bad Request - Invalid File Type:**
```json
{
  "success": false,
  "error": "INVALID_FILE_TYPE",
  "message": "Only PDF files are allowed"
}
```

**400 Bad Request - No File Uploaded:**
```json
{
  "success": false,
  "error": "INVALID_REQUEST",
  "message": "No file uploaded"
}
```

**500 Internal Server Error - Database Failure:**
```json
{
  "success": false,
  "error": "DATABASE_ERROR",
  "message": "Failed to save document metadata"
}
```

---

### 2. List All Documents

**Endpoint:** `GET /documents`

**Description:** Retrieve a list of all uploaded documents, sorted by creation date (newest first). Returns metadata including filename, size, and upload timestamp.

**Request:**

**Headers:**
```
Content-Type: application/json
```

**Query Parameters:** None

**Example using cURL:**
```bash
curl http://localhost:5000/documents
```

**Example using JavaScript:**
```javascript
const response = await fetch('http://localhost:5000/documents');
const data = await response.json();
console.log(data.data); // Array of documents
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": [
    {
      "id": 3,
      "filename": "test-results.pdf",
      "filepath": "test-results-1702134567890-987654321.pdf",
      "filesize": 512000,
      "created_at": "2024-12-10T11:45:00.000Z"
    },
    {
      "id": 2,
      "filename": "prescription-2.pdf",
      "filepath": "prescription-1702123456789-456789123.pdf",
      "filesize": 180000,
      "created_at": "2024-12-10T10:35:00.000Z"
    },
    {
      "id": 1,
      "filename": "prescription.pdf",
      "filepath": "prescription-1702123456789-123456789.pdf",
      "filesize": 245632,
      "created_at": "2024-12-10T10:30:00.000Z"
    }
  ]
}
```

**Success Response (Empty List):**
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": []
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "DATABASE_ERROR",
  "message": "Failed to retrieve documents"
}
```

---

### 3. Download Document

**Endpoint:** `GET /documents/:id`

**Description:** Download a specific document by its ID. Returns the PDF file as a binary stream with appropriate headers for browser download.

**Request:**

**URL Parameters:**
- `id` (integer, required): The unique identifier of the document

**Headers:**
```
Content-Type: application/json
```

**Example using cURL:**
```bash
# Download and save with original filename
curl -O -J http://localhost:5000/documents/1

# Download and specify filename
curl http://localhost:5000/documents/1 -o my-document.pdf
```

**Example using JavaScript:**
```javascript
const response = await fetch('http://localhost:5000/documents/1');
const blob = await response.blob();

// Create download link
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'prescription.pdf';
document.body.appendChild(link);
link.click();
link.remove();
window.URL.revokeObjectURL(url);
```

**Success Response (200 OK):**

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="prescription.pdf"
Content-Length: 245632
```

**Body:**
```
<Binary PDF data stream>
```

**Error Responses:**

**400 Bad Request - Invalid ID:**
```json
{
  "success": false,
  "error": "INVALID_REQUEST",
  "message": "Invalid document ID"
}
```

**404 Not Found - Document Not in Database:**
```json
{
  "success": false,
  "error": "FILE_NOT_FOUND",
  "message": "Document not found"
}
```

**404 Not Found - File Not on Disk:**
```json
{
  "success": false,
  "error": "FILE_NOT_FOUND",
  "message": "File not found on server"
}
```

**500 Internal Server Error - Streaming Error:**
```json
{
  "success": false,
  "error": "FILE_NOT_FOUND",
  "message": "Error streaming file"
}
```

---

### 4. Delete Document

**Endpoint:** `DELETE /documents/:id`

**Description:** Permanently delete a document by its ID. Removes both the database record and the physical file from the server.

**Request:**

**URL Parameters:**
- `id` (integer, required): The unique identifier of the document to delete

**Headers:**
```
Content-Type: application/json
```

**Example using cURL:**
```bash
curl -X DELETE http://localhost:5000/documents/1
```

**Example using JavaScript:**
```javascript
const response = await fetch('http://localhost:5000/documents/1', {
  method: 'DELETE',
});

const data = await response.json();
console.log(data.message);
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Error Responses:**

**400 Bad Request - Invalid ID:**
```json
{
  "success": false,
  "error": "INVALID_REQUEST",
  "message": "Invalid document ID"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "FILE_NOT_FOUND",
  "message": "Document not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "DELETE_FAILED",
  "message": "Failed to delete document from database"
}
```

---

### Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

**Error Codes:**
- `FILE_TOO_LARGE`: File exceeds 5MB limit
- `INVALID_FILE_TYPE`: File is not a PDF
- `INVALID_REQUEST`: Malformed request or invalid parameters
- `FILE_NOT_FOUND`: Document doesn't exist in database or filesystem
- `DELETE_FAILED`: Unable to delete document
- `DATABASE_ERROR`: Database operation failed
- `UPLOAD_FAILED`: General upload error

---
<a id="4-data-flow-description"></a>
## 4. Data Flow Description

### Q5. File Upload Process (Step-by-Step)

#### Client-Side (Frontend)

1. **User Interaction**
   - User navigates to `/upload` page
   - User either drags a PDF file onto the drop zone OR clicks "Browse Files" button
   - React state updates with selected file: `setSelectedFile(file)`

2. **Client-Side Validation**
   - Check file type: `file.type === 'application/pdf'`
   - Check file size: `file.size <= 5MB (5,242,880 bytes)`
   - If validation fails:
     - Display error toast using Sonner
     - Reject file and return
   - If validation passes:
     - Display file preview with name and size
     - Enable "Upload Document" button

3. **File Upload Initiation**
   - User clicks "Upload Document" button
   - Set loading state: `setUploading(true)`
   - Create `FormData` object and append file:
     ```javascript
     const formData = new FormData();
     formData.append('file', selectedFile);
     ```

4. **HTTP Request**
   - Axios sends POST request to `http://localhost:5000/documents/upload`
   - Content-Type automatically set to `multipart/form-data`
   - Request includes file binary data

#### Server-Side (Backend)

5. **Request Reception**
   - Express server receives request at `/documents/upload`
   - Request passes through middleware chain:
     - **CORS middleware**: Validates origin
     - **Body parser**: Parses JSON (if any)

6. **Multer Middleware Processing**
   - Multer intercepts the request
   - **File Filter Validation**:
     - Check MIME type: `file.mimetype === 'application/pdf'`
     - Check file extension: `path.extname(file.originalname) === '.pdf'`
     - If invalid: Return error `INVALID_FILE_TYPE`
   - **File Size Validation**:
     - Check size against limit: `file.size <= MAX_FILE_SIZE`
     - If too large: Return error `FILE_TOO_LARGE`
   - **Filename Generation** (handles duplicates):
     ```javascript
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
     const sanitizedName = originalname.replace(/[^a-zA-Z0-9-_]/g, '_');
     const filename = `${sanitizedName}-${uniqueSuffix}.pdf`;
     ```
   - **File Storage**:
     - Save file to `backend/uploads/` directory
     - File stored with unique filename (e.g., `prescription-1702123456789-123456789.pdf`)

7. **Controller Processing**
   - `DocumentController.uploadDocument()` is invoked
   - Extract file metadata from `req.file`:
     ```javascript
     {
       originalname: "prescription.pdf",
       filename: "prescription-1702123456789-123456789.pdf",
       size: 245632,
       path: "uploads/prescription-1702123456789-123456789.pdf"
     }
     ```

8. **Database Operation**
   - Call `DocumentModel.create()` with metadata:
     ```javascript
     {
       filename: "prescription.pdf",      // Original name
       filepath: "prescription-1702...", // Unique stored name
       filesize: 245632                   // Bytes
     }
     ```
   - Drizzle ORM executes SQL INSERT:
     ```sql
     INSERT INTO documents (filename, filepath, filesize, created_at)
     VALUES ('prescription.pdf', 'prescription-1702...', 245632, NOW())
     RETURNING *;
     ```
   - PostgreSQL:
     - Generates auto-incrementing `id`
     - Sets `created_at` timestamp
     - Returns complete record

9. **Error Handling**
   - If database operation fails:
     - Delete the uploaded file from filesystem: `fs.unlinkSync(file.path)`
     - Return error response: `DATABASE_ERROR`
   - This ensures consistency (no orphaned files or database records)

10. **Success Response**
    - Controller formats response:
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
    - Send HTTP 201 (Created) response to client

#### Client-Side (Response Handling)

11. **Success Handling**
    - Axios receives successful response
    - Display success toast: "prescription.pdf uploaded successfully"
    - Clear selected file: `setSelectedFile(null)`
    - Reset file input
    - Set loading state: `setUploading(false)`
    - Navigate to `/documents` page after 1 second
    - Document appears in the list

12. **Error Handling**
    - If error received (4xx or 5xx):
      - Extract error code from response
      - Map error code to user-friendly message
      - Display error toast with specific message
      - Set loading state: `setUploading(false)`
      - User can retry upload

---

### File Download Process (Step-by-Step)

#### Client-Side (Frontend)

1. **User Interaction**
   - User navigates to `/documents` page
   - React component fetches and displays all documents
   - User clicks "Download" button on a document card

2. **API Request Initiation**
   - Extract document ID and filename
   - Call `documentService.downloadDocument(id, filename)`
   - Axios sends GET request to `http://localhost:5000/documents/:id`
   - Request includes document ID as URL parameter

#### Server-Side (Backend)

3. **Request Reception**
   - Express server receives request at `/documents/:id`
   - Route handler validates ID parameter:
     ```javascript
     const id = parseInt(req.params.id);
     if (isNaN(id) || id <= 0) {
       throw new AppError(400, 'INVALID_REQUEST', 'Invalid document ID');
     }
     ```

4. **Database Query**
   - Controller calls `DocumentModel.findById(id)`
   - Drizzle ORM executes SQL SELECT:
     ```sql
     SELECT * FROM documents WHERE id = $1 LIMIT 1;
     ```
   - PostgreSQL returns document metadata or `null`

5. **Document Validation**
   - If document not found in database:
     - Return 404 error: `FILE_NOT_FOUND` - "Document not found"
   - If document found:
     - Extract filepath: `document.filepath`

6. **Filesystem Check**
   - Construct file path: `path.join(uploadDir, document.filepath)`
   - Check if file exists on disk: `fs.existsSync(filePath)`
   - If file not found on disk:
     - Return 404 error: `FILE_NOT_FOUND` - "File not found on server"
     - (This indicates database record exists but file was deleted)

7. **Response Headers Setup**
   - Set HTTP headers for file download:
     ```javascript
     res.setHeader('Content-Type', 'application/pdf');
     res.setHeader('Content-Disposition', `attachment; filename="${document.filename}"`);
     res.setHeader('Content-Length', document.filesize.toString());
     ```
   - `Content-Type`: Browser knows it's a PDF
   - `Content-Disposition`: Browser downloads file instead of viewing
   - `Content-Length`: Browser shows download progress

8. **File Streaming**
   - Create read stream from file: `fs.createReadStream(filePath)`
   - Pipe stream to response: `fileStream.pipe(res)`
   - Benefits:
     - Memory efficient: Doesn't load entire file into memory
     - Streaming: Can handle large files
     - Backpressure: Automatically handles slow clients

9. **Error Handling**
   - If stream encounters error:
     - Check if headers already sent (to avoid double responses)
     - Return 500 error: `FILE_NOT_FOUND` - "Error streaming file"
     - Log error for debugging

#### Client-Side (Response Handling)

10. **Download Initiation**
    - Browser receives PDF file with headers
    - `Content-Disposition: attachment` triggers download dialog
    - Browser saves file with filename: `prescription.pdf` (original display name)

11. **Success Handling**
    - File downloaded to user's Downloads folder
    - Display success toast: "prescription.pdf downloaded successfully"
    - User can open or delete downloaded file

12. **Error Handling**
    - If error response (4xx or 5xx):
      - Display error toast with message
      - Examples:
        - Document not found (404)
        - File not found on server (404)
        - Error streaming file (500)

---

<a id="5-assumptions"></a>
## 5. Assumptions

### Q6. What assumptions did you make while building this?

#### File & Storage Assumptions

1. **File Type Restriction**
   - **Assumption**: Only PDF files should be accepted
   - **Rationale**: Medical documents are primarily PDF format; restricts security risks from executable files
   - **Validation**: MIME type check: `application/pdf` and extension check: `.pdf`
   - **Current Implementation**: Server-side validation in Multer and Controller
   - **Future Enhancement**: Add virus scanning (ClamAV) for malicious PDFs

2. **File Size Limit**
   - **Assumption**: Maximum file size is 5MB per upload
   - **Rationale**: 
     - Typical medical documents (prescriptions, lab reports) are under 5MB
     - Prevents abuse and excessive storage
     - Balances user experience (upload times) with practical use
   - **Stored In**: `MAX_FILE_SIZE=5242880` bytes in `.env`
   - **Validation**: Multer's `limits.fileSize` option and controller-level check

3. **Storage Location**
   - **Assumption**: Files stored on local filesystem at `backend/uploads/`
   - **Rationale**: 
     - Simplifies setup; no external service required
     - Works for development and small-scale deployments
   - **Limitation**: Single point of failure; not suitable for production at scale
   - **Production Recommendation**: Migrate to AWS S3, Google Cloud Storage, or Azure Blob Storage

4. **Unique Filenames**
   - **Assumption**: Duplicate filenames are allowed; system appends numeric suffix `(1)`, `(2)`, etc.
   - **Rationale**: 
     - Users might upload same document multiple times (e.g., updated prescription)
     - Preserves original filename for user recognition
     - Prevents data loss from accidental overwrites
   - **Implementation**: Loop through database until unique filename found

#### Database Assumptions

5. **Single Database Instance**
   - **Assumption**: PostgreSQL runs on a single local instance (`localhost:5432`)
   - **Rationale**: 
     - Sufficient for development and MVP
     - No replication or high availability setup
   - **Limitation**: Single point of failure in production
   - **Production Recommendation**: Use managed PostgreSQL (AWS RDS, Azure Database) with automated backups

6. **No User Authentication**
   - **Assumption**: No authentication/authorization implemented; all users can access all documents
   - **Rationale**: 
     - MVP focuses on core functionality
     - Simplifies initial development
     - Assumes trusted environment (e.g., local network or admin-only access)
   - **Security Risk**: Production must add JWT authentication and row-level security
   - **Future Implementation**: 
     - Add `user_id` column to documents table
     - Implement login/registration endpoints
     - Add authorization middleware to check document ownership

7. **No Audit Logging**
   - **Assumption**: No audit trail for who uploaded/downloaded/deleted documents
   - **Rationale**: MVP doesn't require compliance tracking
   - **Production Requirement**: Implement audit logging for HIPAA compliance
   - **Future Fields**:
     ```sql
     ALTER TABLE documents ADD COLUMN uploaded_by VARCHAR(255);
     CREATE TABLE audit_logs (
       id SERIAL PRIMARY KEY,
       document_id INTEGER,
       action VARCHAR(50),    -- 'upload', 'download', 'delete'
       user_id VARCHAR(255),
       timestamp TIMESTAMP DEFAULT NOW()
     );
     ```

#### Concurrency & Performance Assumptions

8. **Concurrent Uploads**
   - **Assumption**: System handles multiple simultaneous uploads via unique filenames
   - **Rationale**: 
     - Node.js event loop handles concurrent I/O naturally
     - Multer generates unique filenames preventing collisions
     - Database transactions ensure data consistency
   - **Limitation**: Single-threaded Node.js can be CPU-bound with many simultaneous operations
   - **Production Recommendation**: Implement connection pooling, load balancing, and microservices

9. **No Pagination**
   - **Assumption**: All documents are fetched and displayed at once
   - **Rationale**: MVP assumes reasonable dataset (< 1000 documents per user)
   - **Limitation**: Performance degrades with thousands of documents
   - **Production Recommendation**: Implement cursor-based pagination
     ```javascript
     GET /documents?limit=20&after=cursor
     ```

10. **No Caching**
    - **Assumption**: Document list is queried fresh from database every time
    - **Rationale**: Keeps implementation simple; data freshness is critical for medical docs
    - **Limitation**: Increased database load and slower response times at scale
    - **Production Recommendation**: Implement Redis caching with short TTL (5-10 seconds)

#### Error Handling Assumptions

11. **Transactional Safety**
    - **Assumption**: File upload and database operations are coordinated; orphaned files/records are prevented
    - **Rationale**: Medical documents require consistency; data integrity is critical
    - **Implementation**:
      - If database insert fails, file is deleted: `fs.unlinkSync(file.path)`
      - If file deletion fails, transaction rolls back
    - **Limitation**: Not true ACID transactions; race conditions possible in distributed systems
    - **Production Recommendation**: Use database-native file storage or distributed file systems with transactions

12. **Graceful Error Recovery**
    - **Assumption**: All errors are caught and returned as JSON responses with proper HTTP status codes
    - **Rationale**: Frontend can display meaningful error messages to users
    - **Implementation**: Centralized error handler middleware catches exceptions
    - **Limitation**: Some edge cases (network interruptions) might cause incomplete uploads

#### Client-Side Assumptions

13. **Modern Browser Environment**
    - **Assumption**: Users have modern browsers supporting ES2020, async/await, Fetch API
    - **Rationale**: React 18 and modern JavaScript require this
    - **Supported Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
    - **Limitation**: No support for IE11 or old mobile browsers
    - **Production Recommendation**: Implement transpilation and polyfills for broader compatibility

14. **Stable Network Connection**
    - **Assumption**: Users have stable internet for file uploads
    - **Rationale**: No retry logic or pause/resume functionality
    - **Limitation**: Large file uploads on slow networks may timeout
    - **Production Recommendation**: Implement chunked uploads with resumable capability (Uppy.js, Tus protocol)

#### Operational Assumptions

15. **Environment Variables Configuration**
    - **Assumption**: `.env` files are properly configured with correct database URL and upload directory
    - **Rationale**: Decouples configuration from code
    - **Risk**: Misconfiguration leads to service failures
    - **Mitigation**: 
      - Provide `.env.example` template
      - Validate all required env vars on startup
      - Log configuration on startup for debugging

16. **PostgreSQL Availability**
    - **Assumption**: PostgreSQL is running and accessible at the configured `DATABASE_URL`
    - **Rationale**: MVP assumes database is always available
    - **Limitation**: No retry logic or fallback
    - **Production Recommendation**: Implement connection pooling with retry logic

17. **Uploads Directory Writable**
    - **Assumption**: `backend/uploads/` directory exists and is writable by the Node.js process
    - **Rationale**: Files need to be stored somewhere
    - **Risk**: If directory missing or permissions wrong, uploads fail
    - **Mitigation**: Create directory on startup if missing

#### Medical/Healthcare Assumptions

18. **No Encryption**
    - **Assumption**: Files stored in plaintext on disk; no encryption at rest
    - **Rationale**: MVP for internal/testing use
    - **HIPAA Violation**: Production must encrypt sensitive medical data
    - **Production Recommendation**:
      - Encrypt files at rest using AES-256
      - Encrypt files in transit using HTTPS/TLS
      - Implement key management (AWS KMS, Vault)

19. **No Retention Policies**
    - **Assumption**: Documents are stored indefinitely once uploaded
    - **Rationale**: MVP keeps all documents
    - **HIPAA Consideration**: May need to comply with data retention/deletion requirements
    - **Production Recommendation**: Implement configurable retention policies

20. **No Compliance Framework**
    - **Assumption**: No HIPAA, GDPR, or other healthcare compliance measures
    - **Rationale**: MVP focuses on functionality
    - **Legal Risk**: Production for real patients requires compliance
    - **Production Recommendation**:
      - Implement HIPAA compliance (encryption, audit logs, access control)
      - GDPR compliance (data deletion, consent management)
      - Deploy in HIPAA-certified hosting (AWS GxP, Microsoft Azure for Healthcare)

---

## Summary

This design document outlines the architecture, technology choices, API specification, and operational assumptions for the Patient Portal application. The current implementation is suitable for development, testing, and small-scale deployments. For production use with real patients and compliance requirements, significant enhancements are needed in security, scalability, reliability, and regulatory compliance.

**Key Takeaways:**
- ✅ Functional MVP with core document management features
- ⚠️ Not production-ready for healthcare without security/compliance enhancements
- 🚀 Scalable architecture with clear upgrade path for 1,000+ users
- 📋 Clear documentation of assumptions for future development
