@echo off

set listUrl=https://raw.githubusercontent.com/yurei-dll/psmp-mods/main/list.txt
set listTemp=%TEMP%\psmp-modlist.txt
set outFolder=%APPDATA%\.minecraft\mods

echo [41mMultiple mods will be downloaded to '%outFolder%'[0m
echo To view the list yourself, visit: %listUrl%
pause

echo.
echo Downloading mod list...
curl -s "%listUrl%" --ssl-no-revoke --output "%listTemp%"
echo.

cd %outFolder%
for /f %%i in (%listTemp%) do (
  echo Downloading %%i
  curl "%%i" --ssl-no-revoke -O
)

echo.
echo Done
pause
