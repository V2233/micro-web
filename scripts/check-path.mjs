import { resolve,join } from 'path';
import { pluginInfo } from '../../dist/env.js'

// 获取当前工作目录
const currentDir = process.cwd();

// 项目根目录
const projectRoot = resolve(join(pluginInfo.ROOT_PATH,'frontend'));

// 检查当前目录是否为子项目根目录
if (currentDir !== projectRoot) {
  console.log('跳过Micro前端依赖，如需要请在前端工作目录安装依赖。');
  process.exit(0);
}

if (!/yarn|pnpm/.test(process.env.npm_execpath || '')) {
    console.warn(
      `\u001b[33m @Micro-plugin/frontend must using pnpm as the package manager ` +
        `for package build scripts to work properly.\u001b[39m\n`,
    )
    process.exit(0)
}

console.log('@Micro-Plugin/frontend 开始安装依赖...');