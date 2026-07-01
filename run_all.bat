@echo off
echo Starting Talego Environment...

echo Starting Hardhat Local Node...
start "Hardhat Node" cmd /k "npx hardhat node"

echo Waiting for node to initialize (5 seconds)...
timeout /t 5 /nobreak >nul

echo Deploying Smart Contracts...
call npx hardhat run scripts/deploy.js --network localhost

echo Copying ABIs...
call node scripts/copy-abis.js

echo Starting Next.js Frontend...
start "Next.js Frontend" cmd /k "npm run dev"

echo Environment fully started!
echo You can close this window now.
