#!/bin/bash

# 构建项目
echo "开始构建项目..."
npm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "构建失败，退出脚本"
    exit 1
fi

echo "构建成功！"

# 推送代码
echo "开始推送代码..."
git add --all
git commit -m "Deploy: 更新构建文件"
git push -u origin main

echo "推送完成！"
