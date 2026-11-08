# CivicWatch Launch Script
# Starts both Backend Server and Frontend Client in separate windows

Write-Host "Starting CivicWatch Full-Stack Application..." -ForegroundColor Cyan

# 1. Start Backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting CivicWatch Backend (Express + MongoDB Atlas)...' -ForegroundColor Green; cd '$PSScriptRoot\server'; node server.js"

# 2. Start Frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting CivicWatch Frontend (Vite + React)...' -ForegroundColor Yellow; cd '$PSScriptRoot\civicwatch-landing-login'; npm run dev"

Write-Host "Both servers launched successfully!" -ForegroundColor Green
Write-Host "Backend API:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend App: http://localhost:5173" -ForegroundColor White
