# 短链接生成器

一个使用 Next.js 构建的简单而强大的短链接生成器。

## 功能特性

- 🔗 **短链接生成**: 将长URL转换为简短易分享的链接
- 🔄 **智能重定向**: 支持301永久重定向到原始URL
- 🛡️ **输入验证**: 完整的URL验证和标准化处理
- 💾 **持久化存储**: 开发环境使用文件存储，生产环境使用Vercel KV
- 🎨 **现代界面**: 响应式Web界面，支持一键复制
- 🧪 **完整测试**: 包含单元测试覆盖核心功能
- ☁️ **云端部署**: 优化适配Vercel平台部署

## API 端点

### 生成短链接
```http
POST /api/links
Content-Type: application/json

{
  "url": "https://example.com/very-long-url"
}
```

**响应:**
```json
{
  "shortUrl": "http://localhost:3000/s/ABC123G"
}
```

### 访问短链接
```http
GET /s/:slug
```

成功时返回301重定向到原始URL，失败时返回404错误。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: 自定义CSS（响应式设计）
- **测试**: Jest + Testing Library
- **ID生成**: nanoid
- **存储**: Vercel KV (生产) / 文件存储 (开发)

## 开发指南

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 运行测试
```bash
pnpm test
```

### 构建生产版本
```bash
pnpm build
pnpm start
```

## 项目结构

```
src/
├── app/
│   ├── api/links/          # 短链接生成API
│   ├── s/[slug]/          # 重定向路由
│   ├── page.tsx           # 主页面
│   ├── layout.tsx         # 应用布局
│   └── globals.css        # 全局样式
├── lib/
│   ├── storage.ts         # 多环境存储方案
│   ├── utils.ts           # 工具函数
│   ├── shortLinkService.ts # 业务逻辑服务
│   └── __tests__/         # 单元测试
```

## 存储方案

### 多环境存储策略
项目采用智能存储选择：

- **开发环境**: 文件存储 (`data/links.json`)
- **生产环境**: Vercel KV (托管Redis服务)
- **备用方案**: 内存存储

### Vercel KV 配置
生产环境使用Vercel KV进行数据持久化：
- 无需手动配置，Vercel自动注入环境变量
- 高性能Redis兼容存储
- 自动扩缩容和备份

## 设计决策

### 短码生成
使用 `nanoid` 生成7位URL安全的短标识符：
- 避免易混淆字符（如 0/O, 1/l/I）
- 碰撞概率极低
- URL安全，无需编码

### 样式方案
采用自定义CSS而非CSS框架：
- 完全响应式设计（移动端优先）
- 现代视觉设计（渐变、阴影、动画）
- 跨浏览器兼容
- 轻量级，无外部依赖

### 错误处理
- 完整的输入验证
- 有意义的错误消息
- 适当的HTTP状态码
- 防止常见安全问题

## 部署

### Vercel 部署（推荐）
1. 连接GitHub仓库到Vercel
2. 自动检测Next.js项目
3. 启用Vercel KV存储
4. 自动部署

### 其他平台
- **Netlify**: 支持serverless函数
- **Railway**: 容器化部署
- **Docker**: 容器化部署

## 环境变量

生产环境无需手动配置环境变量，Vercel会自动注入KV相关变量。

## 测试

项目包含完整的单元测试：
- 存储层测试
- 业务逻辑测试
- 工具函数测试
- API端点测试

运行测试：
```bash
pnpm test
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。
