# Clinic Management System

The **Clinic Management System** is a full-stack web application designed to streamline the management of clinics, including patient records, appointments, invoices, and more. It provides an intuitive interface for administrators and staff to manage clinic operations efficiently.

---

## Features

### 1. **Patient Management**
   - Add, update, and delete patient records.
   - View patient history and medical records.
   - Search and filter patients by name, email, or phone number.

### 2. **Appointment Management**
   - Schedule, update, and cancel appointments.
   - View upcoming, pending, and cancelled appointments.
   - Send appointment reminders via email.

### 3. **Invoice Management**
   - Create, update, and delete invoices.
   - View and download invoices as PDFs.
   - Track invoice status (Paid/Pending).

### 4. **File Management**
   - Upload and manage patient files (e.g., medical records, prescriptions).
   - Restrict file access to authorized users only.
   - Download and preview files securely.

### 5. **User Authentication**
   - Secure login and registration system.
   - Role-based access control (Admin, Staff).
   - JWT-based authentication with access and refresh tokens.

### 6. **Responsive Design**
   - Fully responsive and mobile-friendly UI.
   - Built with modern design principles for a seamless user experience.

---

## Technologies Used

### Frontend
- **React.js**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **React Router**: For client-side routing.
- **Axios**: For making HTTP requests to the backend.
- **React-to-PDF**: For generating and downloading PDFs.

### Backend
- **Node.js**: A JavaScript runtime for building the backend.
- **Express.js**: A web framework for Node.js.
- **MongoDB**: A NoSQL database for storing application data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB.
- **JWT**: For user authentication and authorization.
- **Nodemailer**: For sending emails (e.g., appointment reminders).

### File Storage
- **Appwrite**: A backend-as-a-service platform for file storage and management.

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (or MongoDB Atlas for cloud-based database)
- Appwrite (for file storage)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Fahadboi66/ZORO-CLINIC-MGT-SYSTEM.git
   ```

2. Navigate to the `frontend` directory:
   ```bash
   cd {root_folder}/frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the `frontend` directory and add the following environment variables:
   ```env
   VITE_APP_API_URL=http://localhost:4000
   VITE_APP_APPWRITE_PROJECTID={{PROJECT_ID}}
   VITE_APP_APPWRITE_ENDPOINT={{APPWRITE_API_URL}}
   VITE_APP_APPWRITE_BUCKETID={{APPWRITE_BUCKET_ID}}
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd {root_folder}/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:
   ```env
   PORT=4000
   MONGO_DB_URL='{{MONGO_DB_URL}}'
   ACCESS_TOKEN_SECRET="{{SECRET_CODE}}"
   ACCESS_TOKEN_EXPIRY=10d
   REFRESH_TOKEN_SECRET="{{SECRET_CODE}}"
   REFRESH_TOKEN_EXPIRY=30d
   NODE_ENV="development"
   EMAIL_USER="{{EMAIL}}"
   EMAIL_PASS="{{PASSWORD}}"
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

---

## Environment Variables

### Frontend
| Variable Name               | Description                          | Example Value                     |
|-----------------------------|--------------------------------------|-----------------------------------|
| `VITE_APP_API_URL`          | Backend API URL                      | `http://localhost:4000`           |
| `VITE_APP_APPWRITE_PROJECTID` | Appwrite Project ID                 | `{{PROJECT_ID}}`                  |
| `VITE_APP_APPWRITE_ENDPOINT` | Appwrite API Endpoint               | `{{APPWRITE_API_URL}}`            |
| `VITE_APP_APPWRITE_BUCKETID` | Appwrite Bucket ID                  | `{{APPWRITE_BUCKET_ID}}`          |

### Backend
| Variable Name               | Description                          | Example Value                     |
|-----------------------------|--------------------------------------|-----------------------------------|
| `PORT`                      | Port for the backend server          | `4000`                            |
| `MONGO_DB_URL`              | MongoDB connection URL               | `mongodb://localhost:27017/clinic`|
| `ACCESS_TOKEN_SECRET`       | Secret key for access tokens         | `{{SECRET_CODE}}`                 |
| `ACCESS_TOKEN_EXPIRY`       | Expiry time for access tokens        | `10d`                             |
| `REFRESH_TOKEN_SECRET`      | Secret key for refresh tokens        | `{{SECRET_CODE}}`                 |
| `REFRESH_TOKEN_EXPIRY`      | Expiry time for refresh tokens       | `30d`                             |
| `NODE_ENV`                  | Node.js environment                  | `development`                     |
| `EMAIL_USER`                | Email address for sending emails     | `{{EMAIL}}`                       |
| `EMAIL_PASS`                | Email password                       | `{{PASSWORD}}`                    |

---


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

- **Fahad Zafar**  
  Email: fahadzafarmayo123@gmail.com 
  GitHub: [Fahadboi66](https://github.com/your-username)

