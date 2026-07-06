# Script para baixar e instalar o PocketBase no Windows (64-bit)

$Version = "0.22.14"
$Url = "https://github.com/pocketbase/pocketbase/releases/download/v$Version/pocketbase_${Version}_windows_amd64.zip"
$BackendDir = Resolve-Path "."
$ZipPath = Join-Path $BackendDir "pocketbase.zip"

Write-Host "Iniciando download do PocketBase v$Version..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $Url -OutFile $ZipPath

Write-Host "Extraindo arquivos..." -ForegroundColor Cyan
Expand-Archive -Path $ZipPath -DestinationPath $BackendDir -Force

Write-Host "Limpando arquivos temporários..." -ForegroundColor Cyan
Remove-Item -Path $ZipPath -Force

Write-Host "PocketBase instalado com sucesso na pasta backend!" -ForegroundColor Green
Write-Host "Para rodar o servidor, execute: .\pocketbase.exe serve" -ForegroundColor Yellow
