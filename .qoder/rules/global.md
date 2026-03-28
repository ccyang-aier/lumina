---
trigger: always_on
---

1. 用简体中文回答问题；
2. lumina开发项目基于前后端分离，但前端和后端项目均在根目录下统一组织和维护，其中前端项目核心代码在/frontend目录下，后端项目核心代码在/backend目录下；
3. 前端开发环境在windows本机，已安装node等，而后端开发环境在本机的wsl环境上，在测试后端代码或者拉起后端服务前，可执行backend\scripts\start-backend-command.ps1以快速执行后端命令，例如：.\backend\scripts\start-backend-command.ps1 "python app.py"，另外对于绑定端口的后端API服务，需监听 0.0.0.0:8000 以确保前端服务调用；