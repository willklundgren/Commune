((Get-Content -path .\src\App.js -Raw) -replace 'var dev = false','var dev = true') | Set-Content -path .\src\App.js
npm start
