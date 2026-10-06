# 部署包说明

这是从 portfolio-site/ 打包出来的**可直接上传**的静态站点。

## 内容

| 路径 | 说明 |
|---|---|
| `index.html` / `works.html` | 页面 |
| `assets/` | 样式、脚本、压缩后的图片（`assets/img`） |
| `作品集/` | 原始素材，**仅作为图片兜底，可以删** |
| `.nojekyll` | GitHub Pages 用，别删 |

## 部署方式

### A. GitHub Pages（推荐）
1. GitHub 新建一个 **public** 仓库
2. 把本目录里的**所有文件**上传到仓库根目录
3. 仓库 Settings → Pages → Source 选 "Deploy from a branch"，分支 main、目录 / (root)
4. 等约 1 分钟，访问 `https://<用户名>.github.io/<仓库名>/`

### B. Vercel / Netlify
把本目录直接拖到它们的网页上传区，无需任何构建配置。

### C. 自有服务器
把本目录内容上传到网站根目录即可。

## 想更小？

`作品集/` 只是图片兜底。只要 `assets/img/` 完整，
删掉 `作品集/` 也能正常运行，包体积能小一大截。

## 更新内容

改完 portfolio-site/ 里的文件后，重新运行 build_site.mjs，再上传覆盖即可。
