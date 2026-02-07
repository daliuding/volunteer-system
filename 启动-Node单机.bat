@echo off
chcp 65001 >nul
title 志愿者服务管理系统 - Node 单机

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js。请先安装 Node.js 并重启命令提示符。
    echo 下载地址: https://nodejs.org/
    echo 详见「安装指南.txt」。
    pause
    exit /b 1
)

cd /d "%~dp0"

if not exist "node_modules" (
    echo 首次运行，正在安装根目录依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo 依赖安装失败，请检查网络或参考安装指南。
        pause
        exit /b 1
    )
)
if not exist "frontend\node_modules" (
    echo 正在安装前端依赖...
    cd frontend
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo 前端依赖安装失败，请检查网络或参考安装指南。
        pause
        exit /b 1
    )
)

echo 正在启动后端与前端...
echo 启动成功后，请在浏览器访问: http://localhost:5173
echo 默认账号: admin  密码: 1234
echo 关闭本窗口即可停止服务。
echo.

start "" cmd /c "timeout /t 8 /nobreak >nul && start http://localhost:5173"
call npm run dev

pause
