# Healthcare Management Platform for Clinical Operations

## 🏥 Overview

The **Healthcare Management Platform for Clinical Operations** is a centralized healthcare platform developed as part of the **Infosys Springboard** project.

The platform is designed to support clinical operations by bringing patient information, appointments, healthcare vitals, consent information, and other relevant clinical data into a unified system.

The system combines a **React frontend**, **Java Spring Boot backend**, **PostgreSQL database**, **JWT-based authentication**, **role-based authorization**, and **Kafka-based vital streaming** to provide an organized and secure healthcare management solution.

---

## 🎯 Problem Statement

Healthcare information can be fragmented across different systems, making it difficult for clinical staff to obtain a complete view of patient information.

Manual management of patient records and appointments can also be inefficient, while sensitive healthcare information requires secure and controlled access.

The platform addresses these challenges through:

* Centralized healthcare data management
* Patient 360° view
* Digital consent management
* Appointment management
* Vital data management
* Kafka-based vital streaming
* Secure authentication
* Role-based access control
* Centralized clinical dashboards

The project presentation identifies fragmented data, manual inefficiency, access control, and lack of a centralized view as the primary challenges addressed by the platform.

---

# ✨ Key Features

## 👤 Patient 360° UI

The **Patient 360° UI** provides a unified view of relevant patient information.

It brings important information related to a patient together so that clinical users can access the information through a centralized interface.

The Patient 360° view can include:

* Patient information
* Healthcare records
* Appointments
* Patient vitals
* Consent information
* Other relevant clinical information

### Benefits

* Provides a centralized patient view
* Improves accessibility of patient information
* Supports clinical decision-making workflows
* Reduces the need to navigate across multiple systems

The database component also includes a dedicated `06_patient360_view.sql` script, indicating a database view associated with the Patient 360° functionality.

---

# ❤️ Kafka Vital Streaming

The **Kafka Vital Streaming** component handles the streaming of patient vital information through an event-driven data flow.

The component is intended to support the movement of continuously generated vital information through Kafka before it becomes available to the healthcare platform.

### Vital Streaming Flow

```text
Patient Vital Data
        │
        ▼
┌─────────────────┐
│ Kafka Producer  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Kafka Topic   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Kafka Consumer  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Spring Boot     │
│ Backend         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Patient 360° UI │
└─────────────────┘
```

This provides a streaming-based approach for handling patient vital information within the clinical platform.

---

# 📝 Consent Management

The **Consent Management** component provides digital management of patient consent information.

It helps maintain structured consent records and supports controlled access to healthcare information.

### Key Functions

* Maintain patient consent records
* Manage consent information
* Track consent status
* Associate consent information with patient records
* Support controlled access to sensitive healthcare information

Consent management is one of the core modules identified in the project architecture.

---

# 👨‍⚕️ Patient Management

The Patient Management module organizes patient information and records.

It provides a structured approach to storing and managing patient-related healthcare information.

The database is designed around core healthcare entities including **Users, Patients, Appointments, Consents, and Vitals**.

---

# 📅 Appointment Management

The Appointment Management module supports the organization and management of healthcare appointments.

It provides a centralized way of handling appointment-related information and contributes to more efficient clinical workflows.

---

# 📊 Healthcare Dashboard

The Healthcare Dashboard provides a centralized view of relevant healthcare information.

It helps users access information from different healthcare modules through an organized interface.

The dashboard is included as one of the core modules of the platform.

---

# 🔐 Authentication & Authorization

Security is a key part of the platform because healthcare information is sensitive.

The platform uses:

* JWT-based authentication
* Role-based authorization
* User authentication
* Role verification
* Authorized access

### Authentication Flow

```text
User Login
    │
    ▼
Credential Validation
    │
    ▼
JWT Token
    │
    ▼
Role Verification
    │
    ▼
Authorized Access
    │
    ▼
Healthcare Modules
```

The documented security architecture includes user login, JWT token generation, role verification, and authorized access.

---

# 🏗️ System Architecture

The platform follows a layered architecture.

```text
                    ┌───────────────────────┐
                    │    React Frontend     │
                    │                       │
                    │  Patient 360° UI      │
                    │  Dashboard            │
                    │  Consent Management   │
                    │  Patient Management   │
                    │  Appointments         │
                    └───────────┬───────────┘
                                │
                             REST APIs
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Spring Boot        │
                    │      Backend         │
                    │                       │
                    │ Business Logic        │
                    │ Authentication        │
                    │ Authorization         │
                    └───────┬───────┬───────┘
                            │       │
                 ┌──────────┘       └───────────┐
                 ▼                              ▼
        ┌─────────────────┐             ┌─────────────────┐
        │   PostgreSQL    │             │      Kafka      │
        │    Database     │             │ Vital Streaming │
        │                 │             │                 │
        │ Users           │             │ Producer        │
        │ Patients        │             │ Topic           │
        │ Appointments    │             │ Consumer        │
        │ Consents        │             │                 │
        │ Vitals          │             └─────────────────┘
        └─────────────────┘
```

The documented architecture consists of a React client layer, Spring Boot services layer, and PostgreSQL core data layer.

---

# 🗄️ Database

The project uses **PostgreSQL** as the database.

The repository contains a dedicated **`MediSphere_Database`** directory containing SQL scripts for setting up and organizing the database.

### Database Scripts

```text
MediSphere_Database/
│
├── 01_medisphere_schema.sql
├── 02_create_synthea_tables.sql
├── 03_primary_keys.sql
├── 04_foreign_keys.sql
├── 05_indexes.sql
└── 06_patient360_view.sql
```

### Database Setup Responsibilities

The SQL scripts cover:

* Database schema creation
* Synthea-related tables
* Primary key definitions
* Foreign key relationships
* Database indexes
* Patient 360° database view

The project's documented core entities include:

* Users
* Patients
* Appointments
* Consents
* Vitals

The database architecture emphasizes structured data organization, referential integrity, and CRUD operations.

---

# 🛠️ Technology Stack

| Layer                  | Technology               |
| ---------------------- | ------------------------ |
| **Frontend**           | React                    |
| **Build Tool**         | Vite                     |
| **Backend**            | Java                     |
| **Backend Framework**  | Spring Boot              |
| **Backend Build Tool** | Maven                    |
| **Database**           | PostgreSQL               |
| **Authentication**     | JWT                      |
| **Authorization**      | Role-Based Authorization |
| **Streaming**          | Apache Kafka             |
| **Version Control**    | Git & GitHub             |

The project presentation identifies React, Java, Spring Boot, Maven, PostgreSQL, JWT, role-based authorization, Git, and GitHub as the core technology stack.

---

# 📂 Repository Structure

The repository contains separate areas for the frontend, backend, and database components.

```text
Healthcare-Management-Platform/
│
├── backend/
│
├── frontend/
│
├── MediSphere_Database/
│   ├── 01_medisphere_schema.sql
│   ├── 02_create_synthea_tables.sql
│   ├── 03_primary_keys.sql
│   ├── 04_foreign_keys.sql
│   ├── 05_indexes.sql
│   └── 06_patient360_view.sql
│
├── medisphere-backend/
│   ├── backend/
│   ├── Dockerfile
│   ├── Procfile
│   ├── pom.xml
│   ├── railway.toml
│   └── render.yaml
│
├── medisphere-frontend-final/
│   └── medisphere-frontend-project/
│       ├── src/
│       ├── public/
│       ├── index.html
│       ├── package.json
│       ├── package-lock.json
│       └── vite.config.js
│
├── .gitignore
├── README.md
└── TODO.md
```

> The repository currently contains multiple backend/frontend project directories. The structure above reflects the directories visible in the current repository and may be reorganized as development progresses.

---

# ▶️ Running the Project

## Backend

The backend is a Java Spring Boot application managed using Maven.

The backend project contains:

```text
backend/
├── src/
├── pom.xml
├── Dockerfile
├── Procfile
├── railway.toml
└── render.yaml
```

To run the backend, open the backend project directory and use the Maven configuration provided by the project.

Example:

```bash
mvn spring-boot:run
```

---

## Frontend

The frontend is a React application using Vite.

The frontend contains:

```text
frontend/
├── src/
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The exact commands may vary depending on which frontend directory is used as the active application.

---

# 🔄 Clinical Data Flow

The overall platform workflow can be represented as:

```text
                  User
                   │
                   ▼
                Login
                   │
                   ▼
          Authentication
                   │
                   ▼
              JWT Token
                   │
                   ▼
          Role Verification
                   │
                   ▼
          Authorized Access
                   │
          ┌────────┼─────────┐
          │        │         │
          ▼        ▼         ▼
      Patient   Consent   Appointment
       360°       Mgmt.      Mgmt.
          │
          ▼
      Patient Data
          │
          ▼
      PostgreSQL
```

For vital information:

```text
Vital Source
     │
     ▼
Kafka Producer
     │
     ▼
Kafka Topic
     │
     ▼
Kafka Consumer
     │
     ▼
Spring Boot Backend
     │
     ▼
Patient 360° UI
```

---

# 🔒 Security

The platform incorporates security mechanisms to protect sensitive healthcare information.

### Security Features

* JWT authentication
* Role-based authorization
* User authentication
* Role verification
* Authorized access
* Controlled access to healthcare information
* Digital consent management

---

# 📈 Benefits

### Centralized Management

Healthcare information is unified within a single platform.

### Patient 360° View

Clinical users can access relevant patient information through a consolidated interface.

### Efficient Clinical Operations

Centralized patient records, appointments, vitals, and consent information help organize clinical workflows.

### Vital Data Streaming

Kafka supports the streaming flow of patient vital information.

### Secure Access

JWT authentication and role-based authorization provide controlled access to sensitive information.

### Better Data Organization

PostgreSQL provides structured storage for healthcare information.

The project identifies centralized management, secure access, operational efficiency, and better organization as key outcomes.

---

# 👥 Team Contributions

| Team Member       | Contribution                         |
| ----------------- | ------------------------------------ |
| **Megha**         | Frontend Development & Documentation |
| **Sirisha**       | Frontend Development                 |
| **Khushi**        | Backend Development                  |
| **Kartik Sarode** | Backend Development & Documentation  |
| **Sri Kruthi**    | Database Design & Development        |
| **Mohammed Arsh** | Database Design & Development        |

The team contributions are listed in the project presentation.

---

# 🚀 Future Scope

The platform can be extended with:

* Real-time health monitoring
* Advanced analytics and reporting
* Telemedicine integration
* Notifications and reminders
* Mobile application
* AI-assisted healthcare analytics

These enhancements are part of the documented future scope of the project.

---

# 📌 Project Information

**Project Title:** Healthcare Management Platform for Clinical Operations

**Application:** MediSphere

**Program:** Infosys Springboard

**Domain:** Healthcare / Clinical Operations

**Frontend:** React + Vite

**Backend:** Java + Spring Boot + Maven

**Database:** PostgreSQL

**Streaming:** Apache Kafka

**Authentication:** JWT

**Authorization:** Role-Based Authorization

**Version Control:** Git + GitHub

---

# ⚠️ Repository Security

Do **not** commit sensitive or generated files to GitHub.

The repository should exclude:

```text
node_modules/
.env
```

The `.env` file visible in the frontend project should remain local if it contains environment variables, credentials, API keys, database URLs, or other secrets.

A `.gitignore` should contain appropriate entries such as:

```gitignore
node_modules/
.env
.env.*
!.env.example
target/
dist/
```

If an `.env` file has **already been pushed to GitHub and contains real credentials**, simply adding it to `.gitignore` is not enough. The exposed credentials should be rotated/replaced.

---

# 📄 License

This project is developed for educational and project purposes as part of the **Infosys Springboard** program.
