🚀 Getting Started
Follow these steps to run the project on your local machine:

1️⃣ Start Docker

Make sure your Docker server is running.

2️⃣ Clone the Repository
git clone <your-repo-url>

3️⃣ Navigate to the Project Directory
cd <your-project-folder>

4️⃣ Build & Run Containers
Create images and start all containers:
docker-compose up -d --build

5️⃣ Run Existing Containers (if already created)
docker start react-frontend-container java-backend-container mysql-container

6️⃣ Access the Application
Once all containers are running, open your browser and visit:
http://localhost:5173

💡 Tip: Use docker ps to check running containers.
