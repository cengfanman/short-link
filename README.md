# 短链接生成器

一个使用 Next.js 构建的简单而强大的短链接生成器，采用Redis进行数据持久化。

## 功能特性

- 🔗 **短链接生成**: 将长URL转换为简短易分享的链接
- 🔄 **智能重定向**: 支持301永久重定向到原始URL
- 🛡️ **输入验证**: 完整的URL验证和标准化处理
- 💾 **Redis存储**: 使用Vercel Redis进行高性能数据持久化
- 🎨 **现代界面**: 响应式Web界面，支持一键复制
- 🧪 **完整测试**: 包含单元测试覆盖核心功能
- ☁️ **云端部署**: 优化适配Vercel平台部署
- 🔧 **多环境支持**: 开发和生产环境均可使用Redis

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
- **数据库**: Vercel Redis (标准Redis客户端)

## 环境变量

### Redis配置
```bash
# .env.local
REDIS_URL="redis://username:password@host:port"
NODE_ENV=development
```

### 获取Redis URL
1. 在Vercel Dashboard创建Redis数据库
2. 复制连接URL到 `.env.local`
3. 或使用Vercel CLI拉取环境变量：
```bash
vercel env pull .env.local
```

## 开发指南

### 安装依赖
```bash
pnpm install
```

### 环境设置
```bash
# 复制环境变量模板（如果存在）
cp .env.example .env.local

# 编辑 .env.local 添加Redis URL
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
│   ├── storage.ts         # Redis存储实现
│   ├── utils.ts           # 工具函数
│   ├── shortLinkService.ts # 业务逻辑服务
│   └── __tests__/         # 单元测试
```

## 存储方案

### Redis存储策略
项目采用智能存储选择：

- **Redis可用时**: 使用Vercel Redis（开发和生产环境）
- **Redis不可用时**: 文件存储 (`data/links.json`)
- **最终备用**: 内存存储

### Vercel Redis特性
- **高性能**: Redis兼容的内存数据库
- **持久化**: 数据自动备份和持久化
- **扩缩容**: 根据需求自动扩缩容
- **安全**: 内置SSL/TLS加密
- **监控**: 实时性能监控

### 数据结构
```redis
# 键格式
shortlink:{slug} -> {originalUrl}

# 示例
shortlink:ABC123G -> "https://example.com/very-long-url"

# 过期时间: 1年
TTL shortlink:ABC123G -> 31536000
```

## 设计决策

### 存储架构
使用标准Redis客户端而非Vercel特定包：
- 更好的灵活性和兼容性
- 完整的Redis功能支持
- 更容易测试和调试
- 支持多种部署平台

### 连接管理
- 智能连接检测和重连
- 连接复用和池化
- 优雅的错误处理和降级

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
1. **创建Redis数据库**
   ```bash
   # 在Vercel Dashboard -> Storage -> Create Database -> Redis
   ```

2. **连接GitHub仓库**
   - Fork项目到GitHub
   - 在Vercel导入仓库

3. **配置环境变量**
   - Vercel自动注入`REDIS_URL`
   - 或手动添加环境变量

4. **部署**
   ```bash
   git push origin main  # 自动触发部署
   # 或使用CLI
   vercel --prod
   ```

### 本地开发部署测试
1. **链接Vercel项目**
   ```bash
   vercel link
   ```

2. **拉取环境变量**
   ```bash
   vercel env pull .env.local
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

### 其他平台部署
部署到其他平台需要配置Redis实例：
- **Railway**: 添加Redis插件
- **Render**: 使用Render Redis
- **DigitalOcean**: 使用Managed Redis
- **AWS**: 使用ElastiCache
- **自托管**: 部署Redis容器

```bash
# Docker Compose示例
version: '3.8'
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
```

## 测试

项目包含完整的单元测试：
- Redis存储层测试
- 业务逻辑测试
- 工具函数测试
- API端点测试

运行测试：
```bash
pnpm test           # 运行所有测试
pnpm test:watch     # 监视模式
```

## 监控和调试

### Redis连接状态
应用启动时会显示存储类型：
```
Using Redis storage for persistent data storage  # Redis可用
Using file-based storage for development        # Redis不可用
```

### 错误处理
- 自动重连机制
- 优雅降级到文件存储
- 详细的错误日志

## 性能优化

- **连接复用**: 单例Redis客户端
- **过期策略**: 自动清理过期链接
- **内存优化**: 高效的数据结构
- **缓存策略**: Redis作为缓存层

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 添加测试并确保通过
4. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
5. 推送分支 (`git push origin feature/AmazingFeature`)
6. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。
