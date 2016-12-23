## 项目进度
>  项目完成进度为：60% ，具体分工的任务占比见 todo-list 和 doed-list

## todo－list
>  v3版本 计划引入vuex，实现对应demo页面的文件设计和demo页面的实现。（计划周五下班前－2016.12.23）（30%）

>  v4版本 计划收集和整理下写vuejs2 项目的一些前端开发规范草稿给到内部，到时候内部讨论确定（计划周六下班前－2016.12.24） （10%）

## doed－list
>  v1版本 完成项目目录设计（30%）

>  v2版本 项目完成vue－resource＋vue－router ＋ vuex＋ element－ui＋webpack 的引入，且项目中均有对应页面的实现。（30%）


## vuejs2-demo
> A Vue.js project

> demo项目选型： vuejs2+ vue－resource＋vue－router ＋ vuex＋ element－ui ＋webpack


## 创建步骤
``` bash
# 安装npm依赖
cnpm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```
## 部署方案
分离后前后端代码会存放在2个单独的 git 仓库中，构建过程也是分开的。后端构建时，需要依赖前端的构建结果。具体流程如下：

1. git pull 前端项目代码
2. npm run dist 构建前端（构建结果放在dist目录）
3. git pull 后端代码
4. 将前端的构建结果（dist目录里的文件）复制到后端工程中，这里的步骤暂时是人工手动处理，计划未来用gulp-sftp实现自动copy步骤, https://www.npmjs.com/package/gulp-sftp
5. 构建后端

## vuejs2前端开发规范
（待整理）

## 技术点相关资源：
（待整理）
