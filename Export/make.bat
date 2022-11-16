@echo off
cls
echo Exporting
pyinstaller --noconfirm --onefile --console --icon "Export\app.ico" -n "SimplXP" --add-data "python.json;." --add-data "package.json;." --add-data "Main.ts;."  "Start.py" --upx-dir "C:\upx\upx.exe"
rmdir /s /q build
if not exist "_Publish_" mkdir "_Publish_"
move /y dist\SimplXP.exe _Publish_\SimplXP.exe
rmdir /s /q dist
del SimplXP.spec
cls
echo Exported