# Student crud using by Node.js and postgresql databse


Backend dependencies
cd backend 
npm install 
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
npm run dev

Swagger URL
http://localhost:5000/student-api/#/

# API Endpoints

# Auth
POST /auth/register 
POST /auth/login 

# Student
POST /api/student/create-student
