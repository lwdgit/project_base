@echo off
goto :START

:CHECK
call :IF_EXIST node.exe
if %errorlevel%==1 (
    echo ���ϵͳû�а�װnode,�޷����б���
    pause
    exit
)

call :IF_EXIST reasy.cmd
if %errorlevel%==1 (
    echo ���ϵͳû�а�װreasy���빤�ߣ������Զ���װ ,������Ҫ������
    npm install -g reasy --registry=https://registry.npm.taobao.org
    echo reasy���빤�߰�װ�ɹ�
)
goto :eof


:IF_EXIST
SETLOCAL&PATH %PATH%;%~dp0;%cd%
if "%~$PATH:1"=="" exit /b 1
exit /b 0    

:COMPILE
echo ���ڽ��б���...
reasy release -d ./dist -r ./src -wL -f ./src/fis3-conf.js
exit /b 0

:START
rd /q /s dist
call :CHECK
goto :COMPILE
pause
exit /b 1


