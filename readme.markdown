├── src/                    # 核心源代码
│   ├── api/               # 接口定义层（示例中的dish.ts）
│   ├── icons/             # SVG图标系统（使用vue-svgicon管理）
│   ├── layout/            # 全局布局组件
│   ├── permission.ts      # 登录安全权限控制（导航守卫逻辑）
│   ├── router.ts/         # 路由配置（包含动态路由逻辑）
│   ├── store/             # Vuex状态管理（使用装饰器语法）
│   ├── styles/            # 全局样式（含ElementUI覆盖样式）
│   ├── views/             # 页面级组件（业务视图）
│
├── public/                # 静态资源（直接复制到dist）
│   ├── index.html         # 应用入口模板
│   └── manifest.json      # PWA配置清单
│
├── tests/                 # 测试相关（单元测试 & E2E测试）
├── dist/                  # 生产构建输出目录（自动生成）
├── .env.*                 # 多环境配置（开发/生产/UAT）
│
├── vue.config.js          # Vue CLI自定义配置（包含：
│                          # - 代理配置
│                          # - 全局SCSS注入
│                          # - PWA配置
│                          # - 构建优化配置）
│
├── tsconfig.json          # TypeScript编译配置
└── package.json           # 项目依赖和脚本命令
关键功能模块说明：
权限控制系统 (src/permission.ts)
使用路由守卫实现访问控制
依赖js-cookie校验token
结合nprogress显示加载进度条
根据meta.notNeedAuth字段判断免鉴权路由

状态管理 (src/store/)
使用vuex-module-decorators实现装饰器语法
示例中看到用户模块UserModule
设备类型管理（移动端适配）

构建配置 (vue.config.js)
开发服务器代理配置（解决跨域）
全局SCSS变量/混合注入
生产环境source map配置
PWA基础配置

CI/CD (.gitlab-ci.yml)
定义两阶段流水线（依赖安装 & 构建部署）
使用npm run build:uat进行测试环境构建
依赖缓存优化（node_modules缓存）
图标系统 (src/icons/)

使用vue-svgicon自动生成SVG组件
通过yarn svg命令更新图标组件
支持三种使用方式（Unicode/Class/Symbol）
该项目采用典型的前后端分离架构，具备完整的权限控制、多环境支持、自动化测试和持续集成能力，适合中大型管理后台类应用的开发。
根据提供的代码片段和文件结构，以下是项目主要目录和文件的职责分析：
