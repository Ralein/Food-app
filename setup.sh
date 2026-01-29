#!/bin/bash

echo "🚀 Setting up Food Ordering Application..."

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push
npx prisma db seed

echo "✅ Backend setup complete!"

# Frontend setup
cd ../frontend
echo "📦 Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"

cd ..
echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start backend:  cd backend && npm run start:dev"
echo "2. Start frontend: cd frontend && npm run dev"
echo ""
echo "Backend: http://localhost:3000/graphql"
echo "Frontend: http://localhost:3001"
