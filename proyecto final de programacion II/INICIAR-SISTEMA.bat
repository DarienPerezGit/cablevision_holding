@echo off
cls
echo.
echo ====================================================
echo   SISTEMA GESTION HOLDING CABLEVISION
echo   Integracion Frontend-Backend
echo ====================================================
echo.

echo [1/3] Verificando directorios...

set "BACKEND_DIR=C:\Users\jesus\OneDrive\Escritorio\proyecto programacion II\cablevision-holding"
set "FRONTEND_DIR=C:\Users\jesus\OneDrive\Escritorio\proyecto programacion II\Bootstrap"

if not exist "%BACKEND_DIR%" (
    echo ❌ ERROR: No se encuentra el directorio del backend
    echo Directorio esperado: %BACKEND_DIR%
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo ❌ ERROR: No se encuentra el directorio del frontend
    echo Directorio esperado: %FRONTEND_DIR%
    pause
    exit /b 1
)

echo ✅ Directorios verificados correctamente

echo.
echo [2/3] Iniciando Backend Spring Boot...
echo.
echo 🔄 Cambiando al directorio del backend...
cd /d "%BACKEND_DIR%"

echo 🔄 Verificando si el puerto 8080 está libre...
powershell -Command "Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue" > nul 2>&1
if %errorlevel% == 0 (
    echo ⚠️  ADVERTENCIA: Puerto 8080 ya está en uso
    echo ¿Desea continuar de todas formas? (S/N)
    set /p choice=
    if /i not "%choice%"=="s" (
        echo Operación cancelada
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Iniciando Spring Boot...
echo Esto puede tomar unos minutos la primera vez...
echo.

REM Verificar si existe Maven Wrapper
if exist "mvnw.cmd" (
    echo 📦 Usando Maven Wrapper...
    start "Backend Spring Boot" cmd /k "mvnw.cmd spring-boot:run"
) else if exist "mvnw" (
    echo 📦 Usando Maven Wrapper (Linux style)...
    start "Backend Spring Boot" cmd /k "mvnw spring-boot:run"
) else (
    echo 📦 Usando Maven del sistema...
    start "Backend Spring Boot" cmd /k "mvn spring-boot:run"
)

echo.
echo [3/3] Preparando Frontend...
echo.
echo 🔄 Cambiando al directorio del frontend...
cd /d "%FRONTEND_DIR%"

echo ⏳ Esperando a que el backend se inicie completamente...
echo (Esto puede tomar 30-60 segundos)

REM Esperar 30 segundos para que Spring Boot se inicie
timeout /t 30 /nobreak

echo.
echo 🌐 Abriendo frontend en el navegador...

REM Abrir el archivo index.html en el navegador predeterminado
start "" "index.html"

echo.
echo ====================================================
echo   SISTEMA INICIADO CORRECTAMENTE
echo ====================================================
echo.
echo 🟢 Backend ejecutándose en: http://localhost:8080
echo 🔵 Frontend abierto en navegador
echo 📊 Consola H2: http://localhost:8080/h2-console
echo.
echo USUARIOS DE PRUEBA:
echo - Admin:     admin / admin123
echo - Vendedor:  vendedor1 / vend123  
echo - Asesor:    asesor1 / ases123
echo.
echo ⚡ Para diagnosticar problemas, abre la consola del
echo   navegador (F12) y ejecuta: diagnosticarSistema()
echo.
echo ❌ Para cerrar el sistema, cierra ambas ventanas
echo   (esta y la del Spring Boot)
echo.
pause