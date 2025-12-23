# CS2 Polymarket Parser - PowerShell Install Script

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CS2 Polymarket Parser - Quick Install" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Node.js is installed" -ForegroundColor Green
node --version
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[OK] Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Build project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Build failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Installation completed successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run the example:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Or:" -ForegroundColor Yellow
Write-Host "  npm test" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
