# Art Menu System with Sanity CMS

一個使用 Vue.js 和 Sanity CMS 構建的互動式藝術菜單系統。

## 功能特色

- 🎨 **動態菜單系統**: 每個主廚有專屬的三題問答表單
- 📱 **響應式設計**: 支援各種設備
- 🔒 **安全寫入**: 通過 Netlify Functions 安全寫入 Sanity
- 🌐 **跨裝置同步**: 所有數據存儲在 Sanity CMS 中
- ⚡ **即時加載**: 使用 Sanity 的 CDN 快速加載數據

## 技術棧

- **前端**: Vue 3 + Vite
- **後端**: Sanity CMS
- **部署**: Netlify
- **服務**: Netlify Functions

## 項目結構

```
src/
├── sanityClient.js      # Sanity 客戶端配置
├── sanityService.js     # 數據服務層
├── sanitySchemas.js     # Schema 定義
├── views/
│   ├── ChefSelect.vue   # 主廚選擇頁面
│   ├── ChefDetail.vue   # 三題表單頁面
│   ├── Receipt.vue      # 收據確認頁面
│   └── Orders.vue       # 訂單管理頁面
netlify/
├── functions/
│   └── create-order.js  # 創建訂單的服務函數
└── toml                 # Netlify 配置
```

## 安裝和設置

### 1. 克隆項目

```bash
git clone <repository-url>
cd art-menu-system
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 環境變數設置

複製 `.env.example` 到 `.env`：

```bash
cp .env.example .env
```

編輯 `.env` 文件，設置你的 Sanity 配置：

```env
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2025-01-01
```

### 4. Sanity Studio 設置

1. 在 Sanity 管理面板中創建項目
2. 安裝並配置 schema（參考 `sanitySchemas.js`）
3. 生成 API token 並設置讀寫權限

### 5. Netlify 部署設置

在 Netlify 中設置以下環境變數：

```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_API_TOKEN=your_write_token
```

## Sanity Schema

### ChefMenu Schema

```javascript
{
  name: 'chefMenu',
  title: 'Chef Menu',
  type: 'document',
  fields: [
    { name: 'title', title: 'Chef Title', type: 'string' },
    { name: 'order', title: 'Display Order', type: 'number' },
    {
      name: 'question1',
      title: 'Question 1 (Percentage)',
      type: 'object',
      // ... percentage slider config
    },
    {
      name: 'question2',
      title: 'Question 2 (Single Choice)',
      type: 'object',
      // ... 4 options config
    },
    {
      name: 'question3',
      title: 'Question 3 (Range)',
      type: 'object',
      // ... range slider config
    }
  ]
}
```

### Order Schema

```javascript
{
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'customer',
      title: 'Customer',
      type: 'object',
      fields: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' }
      ]
    },
    {
      name: 'order',
      title: 'Order Details',
      type: 'object',
      fields: [
        { name: 'chefId', type: 'string' },
        { name: 'chefTitle', type: 'string' },
        {
          name: 'answers',
          type: 'object',
          fields: [
            { name: 'question1', type: 'number' },
            { name: 'question2', type: 'string' },
            { name: 'question3', type: 'number' }
          ]
        }
      ]
    }
  ]
}
```

## 開發

### 本地開發

```bash
npm run dev
```

### 建置生產版本

```bash
npm run build
```

### 本地測試 Netlify Functions

```bash
npm install -D netlify-cli
npx netlify dev
```

## 部署

1. 推送到 Git 倉庫
2. 在 Netlify 中連接倉庫
3. 設置環境變數
4. 部署完成！

## API 端點

### 創建訂單

```
POST /.netlify/functions/create-order
```

請求體：

```json
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "order": {
    "chefId": "chef_id",
    "chefTitle": "Chef Name",
    "answers": {
      "question1": 75,
      "question2": "Option A",
      "question3": 8
    }
  }
}
```

## 許可證

MIT License
