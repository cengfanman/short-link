# 短链接生成器

一个使用 Next.js 构建的简单而强大的短链接生成器API。

## 功能特性

- 🔗 **短链接生成**: 将长URL转换为简短易分享的链接
- 🔄 **智能重定向**: 支持301永久重定向到原始URL
- 🛡️ **输入验证**: 完整的URL验证和标准化处理
- 💾 **内存存储**: 使用内存存储（可扩展为持久化存储）
- 🎨 **现代界面**: 响应式Web界面，支持一键复制
- 🧪 **完整测试**: 包含单元测试覆盖核心功能

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
- **样式**: Tailwind CSS
- **测试**: Jest
- **ID生成**: nanoid

## 开发指南

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 启动开发服务器
```bash
npm run dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 运行测试
```bash
npm run test
# 或
pnpm test
```

### 构建生产版本
```bash
npm run build
npm run start
```

## 项目结构

```
src/
├── app/
│   ├── api/links/          # 短链接生成API
│   ├── s/[slug]/          # 重定向路由
│   └── page.tsx           # 主页面
├── lib/
│   ├── storage.ts         # 数据存储接口
│   ├── utils.ts           # 工具函数
│   ├── shortLinkService.ts # 业务逻辑服务
│   └── __tests__/         # 单元测试
```

## 设计决策

### 存储方案
目前使用内存存储以简化开发和测试。在生产环境中，建议使用以下存储方案：
- Redis（高性能缓存）
- PostgreSQL（持久化存储）
- DynamoDB（云端无服务器）

### 短码生成
使用 `nanoid` 生成7位URL安全的短标识符：
- 避免易混淆字符（如 0/O, 1/l/I）
- 碰撞概率极低
- URL安全，无需编码

### 错误处理
- 完整的输入验证
- 有意义的错误消息
- 适当的HTTP状态码
- 防止常见安全问题

## 部署

项目可以部署到多个平台：

- **Vercel**: 原生支持Next.js，推荐选择
- **Netlify**: 支持serverless函数
- **Railway**: 容器化部署
- **Cloudflare Workers**: 需要适配（未来计划）

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
