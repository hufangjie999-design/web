@echo off
REM ============================================================
REM deploy.cmd —— 双击即可「打包 + 提交 + 推送上线」
REM 效果等同：node build_site.mjs --deploy
REM 前置条件：dist\.git 已存在并配好 origin（首次需要手工建一次，见 README）
REM ============================================================
setlocal
set SCRIPT_DIR=%~dp0
where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 找不到 node，请先安装 Node.js 或使用 DSH 捆绑的 node。
  pause
  exit /b 1
)
node "%SCRIPT_DIR%build_site.mjs" --deploy %*
echo.
pause
