# Application Startup Guide

## ⚠️ Issue Detected: Backend Server Not Running

The 404 error you're experiencing is because the **backend Spring Boot server is not running** on port 8080.

---

## 🚀 How to Start the Application

### Prerequisites
1. **Java 17 or higher** installed
2. **Maven** installed (or use Maven wrapper)
3. **MongoDB** running on localhost:27017
4. **Node.js** installed (for frontend)

---

## Step 1: Start MongoDB

### Option A: MongoDB as a Service (Windows)
```powershell
# Start MongoDB service
net start MongoDB
```

### Option B: MongoDB Manually
```powershell
# Navigate to MongoDB bin directory
cd "C:\Program Files\MongoDB\Server\<version>\bin"

# Start MongoDB
mongod --dbpath "C:\data\db"
```

### Option C: MongoDB Docker
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Verify MongoDB is Running
```powershell
# Check if MongoDB is listening on port 27017
Test-NetConnection -ComputerName localhost -Port 27017
```

---

## Step 2: Start Backend (Spring Boot)

### Option A: Using Maven Wrapper (Recommended)
```powershell
# Navigate to Backend directory
cd Backend

# Run Spring Boot application
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

### Option B: Using Maven
```powershell
# Navigate to Backend directory
cd Backend

# Clean and run
mvn clean spring-boot:run
```

### Option C: Using IDE (IntelliJ IDEA / Eclipse)
1. Open the Backend folder in your IDE
2. Find `CoursebookingApplication.java`
3. Right-click and select "Run"

### Verify Backend is Running
```powershell
# Check if backend is listening on port 8080
Test-NetConnection -ComputerName localhost -Port 8080

# Or test the API
curl http://localhost:8080/api/students/all
```

**Expected Output:**
```
Server should start on port 8080
You should see Spring Boot ASCII art
Logs showing "Started CoursebookingApplication"
```

---

## Step 3: Start Frontend (React + Vite)

### In a New Terminal
```powershell
# Navigate to Frontend directory
cd Frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🔍 Troubleshooting

### Backend Won't Start

#### Issue: Port 8080 Already in Use
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### Issue: MongoDB Connection Failed
**Error:** `MongoSocketOpenException: Exception opening socket`

**Solution:**
1. Verify MongoDB is running
2. Check connection string in `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/coursebooking_db
   ```

#### Issue: Java Version Mismatch
**Error:** `Unsupported class file major version`

**Solution:**
```powershell
# Check Java version
java -version

# Should be Java 17 or higher
# If not, install Java 17+ and set JAVA_HOME
```

#### Issue: Maven Build Fails
```powershell
# Clean Maven cache
mvn clean

# Force update dependencies
mvn clean install -U

# Skip tests if needed
mvn clean install -DskipTests
```

---

### Frontend Won't Start

#### Issue: Port 5173 Already in Use
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process
taskkill /PID <PID> /F
```

#### Issue: Dependencies Not Installed
```powershell
# Delete node_modules and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

#### Issue: Cannot Connect to Backend
**Error:** `AxiosError: Network Error` or `404`

**Solution:**
1. Verify backend is running on port 8080
2. Check API base URL in `Frontend/src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```

---

## 🧪 Testing the Application

### Test Backend Endpoints

#### 1. Get All Students
```powershell
curl http://localhost:8080/api/students/all
```

#### 2. Get All Courses
```powershell
curl http://localhost:8080/api/courses/all
```

#### 3. Search Courses
```powershell
curl "http://localhost:8080/api/courses/search?keyword=programming"
```

#### 4. Get All Enrollments
```powershell
curl http://localhost:8080/api/enrollments/all
```

### Test Frontend
1. Open browser: `http://localhost:5173`
2. Navigate to different pages
3. Try CRUD operations
4. Test search functionality

---

## 📝 Quick Start Commands

### Start Everything (3 Terminals)

**Terminal 1 - MongoDB:**
```powershell
# If using service
net start MongoDB

# Or if using Docker
docker start mongodb
```

**Terminal 2 - Backend:**
```powershell
cd Backend
mvnw spring-boot:run
```

**Terminal 3 - Frontend:**
```powershell
cd Frontend
npm run dev
```

---

## 🔧 Development Workflow

### Making Changes to Backend
1. Stop the backend server (Ctrl+C)
2. Make your changes
3. Restart: `mvnw spring-boot:run`
4. Spring Boot will recompile automatically

### Making Changes to Frontend
1. Make your changes
2. Vite will hot-reload automatically
3. No need to restart the server

---

## 📊 Application URLs

| Service | URL | Status Check |
|---------|-----|--------------|
| MongoDB | mongodb://localhost:27017 | `Test-NetConnection localhost -Port 27017` |
| Backend API | http://localhost:8080/api | `curl http://localhost:8080/api/students/all` |
| Frontend | http://localhost:5173 | Open in browser |

---

## 🐛 Common Errors and Solutions

### Error: "Failed to load resource: 404"
**Cause:** Backend server not running

**Solution:**
```powershell
cd Backend
mvnw spring-boot:run
```

### Error: "MongoSocketOpenException"
**Cause:** MongoDB not running

**Solution:**
```powershell
net start MongoDB
# or
docker start mongodb
```

### Error: "Port 8080 already in use"
**Cause:** Another application using port 8080

**Solution:**
```powershell
# Find and kill the process
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Error: "CORS policy blocked"
**Cause:** CORS not configured properly

**Solution:** Already configured in `CorsConfig.java`, ensure backend is running

---

## ✅ Verification Checklist

Before testing the application:

- [ ] MongoDB is running on port 27017
- [ ] Backend is running on port 8080
- [ ] Frontend is running on port 5173
- [ ] No console errors in backend
- [ ] No console errors in frontend
- [ ] Can access http://localhost:5173 in browser
- [ ] API endpoints respond correctly

---

## 🎯 Next Steps

Once everything is running:

1. **Test Student Management**
   - Add a new student
   - Edit student details
   - Search for students
   - Delete a student

2. **Test Course Management**
   - Add a new course
   - Edit course details
   - Search for courses
   - Delete a course (without enrollments)

3. **Test Enrollment Management**
   - Enroll a student in a course
   - View enrollments
   - Cancel an enrollment

---

## 📞 Need Help?

If you're still experiencing issues:

1. Check backend console for error messages
2. Check browser console (F12) for frontend errors
3. Verify all services are running
4. Check MongoDB connection
5. Ensure correct ports are being used

---

## 🚀 Production Deployment

For production deployment:

1. Build the backend:
   ```powershell
   cd Backend
   mvn clean package
   ```

2. Build the frontend:
   ```powershell
   cd Frontend
   npm run build
   ```

3. Deploy the JAR file and static files to your server

---

**Remember:** Always start MongoDB first, then Backend, then Frontend!
