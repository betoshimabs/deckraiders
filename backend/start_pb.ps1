# Script para iniciar o servidor PocketBase localmente
Write-Host "Iniciando PocketBase local em http://127.0.0.1:8090..." -ForegroundColor Cyan
Write-Host "Acesse o Painel Administrativo em http://127.0.0.1:8090/_/" -ForegroundColor Green
Write-Host "Pressione Ctrl+C para encerrar o servidor." -ForegroundColor Yellow
.\pocketbase.exe serve
