@echo off
echo ===================================================
echo   AGRIVIL MOBILE APP — ANDROID APK BUILD SCRIPT
echo ===================================================
echo.

set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr

echo [1/3] Navigating to mobile android directory...
cd /d "%~dp0mobile\android"

echo [2/3] Building AgriVil Consumer Debug APK...
call gradlew.bat :consumer:assembleDebug

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Gradle build failed. Check your Android SDK and Java installation.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/3] Copying APK to root apks folder...
if not exist "%~dp0apks" mkdir "%~dp0apks"
copy /y "%~dp0mobile\android\consumer\build\outputs\apk\debug\consumer-debug.apk" "%~dp0apks\agrivil-debug.apk"

echo.
echo ===================================================
echo   BUILD SUCCESSFUL!
echo   APK output: apks\agrivil-debug.apk
echo ===================================================
echo.
pause
