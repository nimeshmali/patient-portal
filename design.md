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

I chose React because it’s fast, component-driven, and easy to scale. TypeScript helps catch issues early and keeps the codebase predictable. The React ecosystem (Router, Axios, hooks) covers everything I need without extra setup.
Frameworks like Angular felt too heavy, and Vue lacked the ecosystem I needed.

---
### Q2. What backend framework did you choose and why?

**Framework: Express.js with Node.js and TypeScript**

**Reasoning:**

Express is lightweight, flexible, and fits well with a TypeScript frontend. Node’s non-blocking model works great for file uploads. Middleware like Multer, CORS, and error handling plug in cleanly.
Flask/Django were unnecessary since I didn’t need Python-specific features or a heavy framework. also alembic setup felt little complex.

---

### Q3. What database did you choose and why?

**Database: PostgreSQL**

**Reasoning:**

The data is structured and relational, so Postgres fits well. It’s reliable, ACID-compliant, scalable, and has strong JSON support for future extensions. I used Drizzle ORM for typed queries.
SQLite isn’t ideal for concurrency, and MongoDB isn’t needed since the data isn’t flexible or unstructured.

---

### Q4. If you were to support 1,000 users, what changes would you consider?

#### Performance & Scalability

- If the user base grows, I’d include:

- Multiple backend instances behind a load balancer

- Postgres connection pooling + read replicas

- Move file storage to S3 with signed URLs

- Redis caching for frequent queries

- JWT authentication and user-level access control

- Monitoring (Sentry, DataDog)

- Rate-limiting, HTTPS, and security headers

- Automated backups and versioning

- Containerization + CI/CD for smoother deployments

Overall, the idea is to split load, secure data, and improve reliability while keeping costs manageable.
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


<a id="3-api-specification"></a>
## 3. API Specification

### **1\. Upload Document**

**POST /documents/upload**Uploads a PDF (max 5MB). Assigns a unique filename and stores metadata.

**Responses:**

*   201 → Uploaded
    
*   400 → Invalid type/size or no file
    
*   500 → DB or server issue
    

### **2\. List Documents**

**GET /documents**Returns all documents sorted by newest first.

**Responses:**

*   200 → List of documents
    
*   500 → Database error
    

### **3\. Download Document**

**GET /documents/:id**Streams the PDF file for download.

**Responses:**

*   200 → Returns file
    
*   404 → File not found
    
*   500 → Server error



<a id="4-data-flow-description"></a>
## 4. Data Flow Description

1.  User uploads a PDF via React form
    
2.  File → Multer → Server filesystem
    
3.  Metadata saved in PostgreSQL
    
4.  Frontend fetches list of files
    
5.  Download triggers a GET request returning the binary stream


<a id="5-assumptions"></a>
## 5. Assumptions

*   Only PDFs are allowed
    
*   Max size: 5MB
    
*   Files are stored locally for now
    
*   No authentication in the initial version
    
*   Single-user system, so multi-tenant access control not required yet