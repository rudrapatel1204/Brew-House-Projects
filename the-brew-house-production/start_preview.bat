@echo off
echo ========================================================
echo   THE BREW HOUSE — AESTHETIC SOCIAL CAFE & CREATIVE HUB
echo   Crafted for WebBlaze Studio | Alkapuri, Vadodara
echo ========================================================
echo.
echo Launching index.html in your default web browser...
start index.html
echo.
echo Starting local web server at http://localhost:8080 ...
echo (Press Ctrl+C to stop the server)
echo.
python -m http.server 8080
pause
