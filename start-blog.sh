#!/bin/bash
pkill -f "next dev"
echo "等待3秒..."
sleep 3
echo "启动开发服务器..."
pnpm dev
echo "启动完成！"
