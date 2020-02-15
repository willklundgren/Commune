# Replace "dev" variable in App.js
((Get-Content -path .\src\App.js -Raw) -replace 'var dev = true','var dev = false') | Set-Content -path .\src\App.js

# Re-build
npm run build

# scp to the cloud at 52.246.250.124
echo "Pushing build folder to cloud..."
scp -r ./build willklundgren@52.246.250.124:~BetterplayTest

