# SkinSight Backend API

Welcome to the **SkinSight Backend API**, built with [AdonisJS v6](https://adonisjs.com). This backend powers core features such as authentication, user assessment, skincare product recommendations (with ML), education/news content, face/ingredient scanning, and chatbot support.

## 🧩 Tech Stack

- **Framework**: AdonisJS v6
- **Language**: TypeScript
- **Database**: MariaDB (Lucid ORM)
- **Caching**: Redis
- **Authentication**: Bearer Token (with verification middleware)
- **Validation**: VineJS with Custom Validators
- **Machine Learning**: External recommendation module (From ML team)
- **Storage**: Local file system (profile, scan uploads)
- **UV Index API**: External Open Source API for UV index data
- **Rate Limiting**: @adonisjs/limiter
- **ChatBot**: Custom integration for user queries using N8N
- **Load Testing**: K6

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/ZumaAkbarID/skinsight-backend.git

# Install dependencies
npm install

# Copy .env config
cp .env.example .env

# Generate app key & run migrations
node ace generate:key
node ace migration:run --seed

# Start dev server
npm run dev
```

## 📁 Project Structure (Key Files)

| Path              | Description                         |
| ----------------- | ----------------------------------- |
| `app/controllers` | All route controllers               |
| `app/validators`  | Request validators                  |
| `app/models`      | Lucid ORM models                    |
| `start/routes.ts` | Main routes file                    |
| `start/kernel.ts` | Middleware config                   |
| `helpers/`        | Custom business logic helpers       |
| `public/uploads/` | File uploads (profile, scans, etc.) |

## 🔐 Auth & Middleware

- **Authentication**: Required for most routes (`middleware.auth()`)
- **User Verification**: Ensures user has verified OTP (`middleware.verifiedUser()`)
- **Rate Limiting**: Handled via `@adonisjs/limiter` (`throttle`)
- **Caching**: Redis used for caching external calls (news, recommendations, etc.)
- **Custom Validators**: For email uniqueness, password strength, etc.

## 🧪 API Endpoints

### Public Auth

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login user    |
| POST   | `/api/oauth2/google` | Google login  |

### Password Recovery

| Method | Endpoint                              | Description                        |
| ------ | ------------------------------------- | ---------------------------------- |
| POST   | `/api/forgot-password/generate-otp`   | Generate OTP for password recovery |
| POST   | `/api/forgot-password/resend-otp`     | Resend OTP for password recovery   |
| POST   | `/api/forgot-password/verify-otp`     | Verify OTP for password recovery   |
| POST   | `/api/forgot-password/reset-password` | Reset password                     |

### Protected Routes (`auth + verifiedUser`)

| Method | Endpoint                            | Description            |
| ------ | ----------------------------------- | ---------------------- |
| POST   | `/api/auth/logout`                  | Logout user            |
| GET    | `/api/user/profile`                 | Get user profile       |
| PUT    | `/api/user/profile`                 | Update user profile    |
| POST   | `/api/user/change-password`         | Change password        |
| POST   | `/api/assessment`                   | Submit skin assessment |
| POST   | `/api/scan/face`                    | Upload face scan       |
| GET    | `/api/scan/face/history`            | View face scan history |
| POST   | `/api/scan/ingredients`             | OCR ingredients        |
| GET    | `/api/scan/ingredients/history`     | OCR history            |
| GET    | `/api/scan/ingredients/history/:id` | OCR history detail     |

### Products

| Method | Endpoint                          | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/product/recommendations`    | Get ML-based product recommendations |
| GET    | `/api/product/all`                | List + filter products               |
| GET    | `/api/product/types-and-brands`   | Distinct types + brands              |
| GET    | `/api/product/brand/:brand`       | Get product types by brand           |
| GET    | `/api/product/brand/:brand/:type` | Get products by brand & type         |

### Education

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| POST   | `/api/educations`        | Get education content |
| POST   | `/api/educations/detail` | Get education detail  |

### News

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | `/api/news`        | Paginated news list     |
| POST   | `/api/news/detail` | Get news article detail |

### Chatbot

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| POST   | `/api/chat/send-message` | Chatbot integration |

### Misc

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| GET    | `/api/current-uv-index` | External UV index |
| GET    | `/api/ads`              | Promotional ads   |

## 📸 File Upload Endpoints

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/profile_pictures/*` | Serve profile picture |
| GET    | `/scan_faces/*`       | Serve face scan       |
| GET    | `/ingredients_ocr/*`  | Serve OCR image       |
| GET    | `/brands/*`           | Serve brand image     |

## 🧠 Redis Usage

Cached endpoints:

- `NewsController`
- `NewsDetailsController`
- `EducationsController`
- `RecommendationsController`
- `UVIndexController`
- `ProductsController`

Redis CLI examples:

```bash
# See all keys
redis-cli KEYS '*'

# Clear cache for news
redis-cli --scan --pattern "news:*" | xargs redis-cli DEL
```

## ✅ Environment Variables

```env
PORT=3333
HOST=127.0.0.1
APP_KEY=your_app_key
DB_CONNECTION=pg
REDIS_CONNECTION=local
```

## ✨ Team Members

| Name          | Role             | Github Profile                                 |
| ------------- | ---------------- | ---------------------------------------------- |
| Zuma Gamtenk  | Backend          | [@ZumaAkbarID](https://github.com/ZumaAkbarID) |
| Wahid Gamtenk | Machine Learning | [@Hazz-i](https://github.com/Hazz-i)           |
| Niken Gamtenk | Mobile Dev       | [@nikenlis](https://github.com/nikenlis)       |

## 🤝 Contributing

Pull requests are welcome. Please ensure code is clean and tested.

## 📝 License

MIT © TULALIT Team — SkinSight Project
