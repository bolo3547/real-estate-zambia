# Zambia Property

A premium, production-grade real estate web application for Zambia, built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## 🏠 Features

### For Everyone
- Browse property listings (Houses, Land, Commercial, Lodges)
- Advanced search with filters (location, price, type, bedrooms)
- Responsive, mobile-first design
- Premium African aesthetic with elegant UI

### For Property Owners & Agents
- Create and manage property listings
- Upload multiple property images
- Track views and inquiries
- Dashboard with analytics
- WhatsApp integration for inquiries

### For Administrators
- Approve/reject property listings
- Manage users and roles
- Feature properties on homepage
- Platform analytics

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **Image Storage**: Cloudinary
- **Validation**: Zod

## 🎨 Design System

The application follows a "luxury, clean, African-premium" aesthetic:

- **Primary Green**: `#1F3D2B` (Deep forest green)
- **Dark Green**: `#162C1F` (For headers and accents)
- **Gold Accent**: `#C9A65A` (Premium highlights)
- **Soft Gold**: `#E6D3A3` (Subtle backgrounds)
- **Cream Background**: `#F7F5EF` (Warm off-white)

### Typography
- **Sans Serif**: Inter (UI elements)
- **Serif**: Playfair Display (Headlines)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zambia-property.git
   cd zambia-property
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # (Optional) Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── properties/    # Property CRUD
│   │   └── admin/         # Admin endpoints
│   ├── admin/             # Admin pages
│   ├── auth/              # Auth pages (login, register)
│   ├── dashboard/         # User dashboard
│   ├── properties/        # Property listing pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── navigation/        # Header, footer
│   ├── property/          # Property-related components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
├── lib/                   # Utility functions
│   ├── auth.ts           # JWT utilities
│   ├── cloudinary.ts     # Image upload
│   ├── prisma.ts         # Database client
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Zod schemas
├── styles/               # Global styles
└── types/                # TypeScript types
```

## 🔐 User Roles

| Role | Capabilities |
|------|-------------|
| **PUBLIC** | Browse listings, save favorites, send inquiries |
| **LANDLORD** | All PUBLIC + Create/manage own property listings |
| **AGENT** | All LANDLORD + Access to analytics, multiple listings |
| **ADMIN** | Full platform access, user management, approvals |

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh tokens

### Properties
- `GET /api/properties` - List properties (with filters)
- `POST /api/properties` - Create property (auth required)
- `GET /api/properties/[id]` - Get property details
- `PATCH /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property
- `POST /api/properties/[id]/images` - Upload images

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `PATCH /api/admin/users/[id]/approve` - Approve/reject user
- `PATCH /api/admin/properties/[id]/approve` - Approve/reject property
- `PATCH /api/admin/properties/[id]/feature` - Feature property

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Docker

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@zambiaproperty.com or open an issue.

---

Built with ❤️ for Zambia
