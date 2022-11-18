@echo off
cls
echo Exporting
pyinstaller --noconfirm --onefile --console --icon "Export\app.ico" -n "SimplXP" --add-data "python.json;." --add-data "package.json;." --add-data "Main.ts;."  "Start.py" --upx-dir "C:\upx\upx.exe"
rmdir /s /q build
move /y dist\SimplXP.exe Export\SimplXP.exe
rmdir /s /q dist
del SimplXP.spec
cls
echo Exported