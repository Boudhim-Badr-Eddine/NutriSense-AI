## Quick Reference for GitHub Copilot

- Project: NutriSense AI - Supplements & Nutrition platform with AI chatbot
- Timeline: 10 days
- Tech: MERN + TypeScript + Gemini AI + RAG
- Key features: 4 pages, AI chatbot with RAG, search/filter, favorites
- Database: MongoDB with 4 main models
- Authentication: JWT
- Deployment: Render (backend) + Vercel (frontend)

# PROJECT CONTEXT FOR GITHUB COPILOT

## PROJECT OVERVIEW

**Project Name:** NutriSense AI  
**Description:** A modern web platform for supplements, dietary complements, and nutrition guides with an intelligent AI chatbot assistant.  
**Duration:** 1 month  
**Team:** 2 developers (Backend + Frontend)  
**Educational Context:** OFPPT - ISTA NTIC 2, Full Stack Digital Development (2nd Year)

---

## TEAM ROLES

### Badr Boudhim - Backend Developer & AI Integration (100%)

**Responsibilities:**

- Backend API development (Node.js + Express + TypeScript)
- MongoDB database design and implementation
- Authentication system (JWT)
- All CRUD operations for supplements, complements, foods
- **AI Chatbot system (100%):**
  - Google Gemini AI integration
  - RAG (Retrieval-Augmented Generation) system
  - Conversation history management
  - Context-aware responses using MongoDB data
- API security and validation
- Deployment (Render/Railway)

### Taha - Frontend Developer & UI/UX Designer

**Responsibilities:**

- Frontend development (Next.js 14 + TypeScript)
- UI/UX design (TailwindCSS + shadcn/ui)
- 4 main pages development
- Chatbot widget UI (interface only, logic by Badr)
- Search and filter components
- Responsive design
- API integration with backend
- Deployment (Vercel)

---

## TECH STACK

### Backend (Badr)

```javascript
{
  "runtime": "Node.js 20.x",
  "framework":  "Express. js",
  "language": "TypeScript",
  "database": "MongoDB Atlas (Free Tier)",
  "ODM": "Mongoose",
  "authentication": "JWT + Bcrypt",
  "AI": {
    "model": "Google Gemini AI (gemini-1.5-pro)",
    "framework": "LangChain. js",
    "technique": "RAG (Retrieval-Augmented Generation)"
  },
  "imageStorage": "Cloudinary (Free)",
  "hosting": "Render or Railway (Free Tier)"
}
```

### Frontend (Taha)

```javascript
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "styling": "TailwindCSS",
  "components": "shadcn/ui",
  "stateManagement": "React Query (TanStack Query)",
  "httpClient": "Axios",
  "icons": "Lucide React",
  "hosting": "Vercel (Free)"
}
```

---

## APPLICATION STRUCTURE

### Pages (4 Main Pages)

#### 1. Home Page (`/`)

**Purpose:** Welcome users and present the platform

**Sections:**

- Hero section with title, subtitle, CTA buttons
- "Our Services" section with 3 cards:
  - Supplements card → links to `/supplements`
  - Dietary Complements card → links to `/complements`
  - Nutrition Guide card → links to `/nutrition`
- "Why NutriSense AI?" section (benefits)
- "How it works?" section (3 steps)
- Footer with quick links and contact info

---

#### 2. Supplements Page (`/supplements`)

**Purpose:** Display catalog of sports supplements

**Main View:**

- Grid of supplement cards (responsive)
- Each card shows:
  - Product image
  - Name (e.g., "Whey Protein Isolate")
  - Category (e.g., "Proteins", "Creatine", "BCAA", "Pre-workout")
  - Optional badges ("Popular", "New")

**Features:**

- Real-time search bar (by name)
- Filters:
  - By category (Proteins, Creatine, BCAA, Pre-workout, Recovery)
  - By goal (Mass gain, Fat loss, Endurance, Recovery)
- Sorting (Alphabetical A-Z/Z-A, Popularity)

**Detail Page (`/supplements/[id]`):**

- Large product image
- Full name and category
- "Add to favorites" button (if authenticated)
- **Essential Information:**
  - Recommended dosage (e.g., "25-30g per serving")
  - Timing (e.g., "Post-workout", "Morning fasted")
  - Usage duration (e.g., "Daily")
- Complete description (what it is, how it works, proven benefits)
- Composition (ingredients list, nutritional values)
- Precautions & contraindications
- Scientific studies (optional links to PubMed)
- "Ask a question" button (opens chatbot with pre-filled context)

**Backend API Endpoints (Badr):**

```
GET    /api/supplements              # List with pagination, search, filters
GET    /api/supplements/: id          # Get single supplement details
POST   /api/supplements/: id/favorite # Add to user favorites
POST   /api/supplements              # Create (admin only)
PUT    /api/supplements/:id          # Update (admin only)
DELETE /api/supplements/:id          # Delete (admin only)
```

---

#### 3. Dietary Complements Page (`/complements`)

**Purpose:** Catalog of micronutrients (vitamins, minerals)

**Categories:**

- Vitamins (A, B complex, C, D, E, K)
- Minerals (Zinc, Magnesium, Calcium, Iron, Selenium)
- Antioxidants
- Essential fatty acids (Omega-3, Omega-6)
- Adaptogens (Ashwagandha, Rhodiola)

**Structure:** Same as Supplements page (grid, search, filters)

**Detail Page (`/complements/[id]`):**

- **Biological role** (what it does in the body)
- **Deficiency symptoms** (signs of low levels)
- **Natural food sources** (list of foods rich in this nutrient)
- **Recommended daily intake (RDI):**
  - By age group
  - By gender
  - Special cases (pregnancy, athletes)
- **Supplementation forms** (e.g., "Magnesium Citrate vs Oxide")
- **Interactions** (with other supplements/medications)
- **Contraindications**

**Backend API Endpoints (Badr):**

```
GET /api/complements
GET /api/complements/:id
GET /api/complements/category/:categoryName
```

---

#### 4. Nutrition Guide Page (`/nutrition`)

**Purpose:** Show top food sources of macronutrients

**Main View - 3 Sections:**

```
┌────────────────────────────────────┐
│  🥩 Top Protein Sources            │
│  Discover the richest protein foods│
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  🍞 Top Carbohydrate Sources       │
│  Find your energy sources          │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  🥑 Top Fat Sources                │
│  Healthy fats for your body        │
└────────────────────────────────────┘
```

**Ranking Page (e.g., `/nutrition/proteins`):**

Table/list displaying for each food (per 100g):

- Food name
- Calories (kcal)
- Proteins (g)
- Carbohydrates (g)
- Fats (g)
- Protein/Calorie ratio (efficiency)

**Example:**
| Food | Calories | Protein | Carbs | Fats | P/Cal Ratio |
|-----------------|----------|---------|-------|------|-------------|
| Chicken breast | 165 kcal | 31g | 0g | 3. 6g | 18.8% |
| Canned tuna | 116 kcal | 26g | 0g | 0.8g | 22.4% |
| Whole eggs | 155 kcal | 13g | 1. 1g | 11g | 8.4% |

**Features:**

- Dynamic sorting (by column click)
- Filters:
  - By type (Meats, Fish, Dairy, Vegetables, Supplements)
  - By diet (Vegetarian, Vegan, Lactose-free)
- Search bar for specific foods

**Detail Page (`/nutrition/foods/[id]`):**

- Complete nutritional profile (macros + key micronutrients)
- Nutritional benefits
- Meal ideas and serving suggestions
- Visual comparison with similar foods

**Backend API Endpoints (Badr):**

```
GET /api/foods                 # All foods
GET /api/foods/top-proteins    # Top protein sources
GET /api/foods/top-carbs       # Top carb sources
GET /api/foods/top-fats        # Top fat sources
GET /api/foods/: id             # Single food details
```

---

### Chatbot AI Widget (Floating)

**Location:** Bottom-right corner on ALL pages

**UI States:**

**Closed State:**

- Floating button with chat bubble icon
- Badge showing "AI"
- Subtle animation to attract attention

**Open State:**

- Chat window (400x600px desktop, fullscreen mobile)
- Header: "NutriSense AI Assistant" + close button
- Scrollable message area
- Input field with send button
- Character counter (max 500 chars)

**Responsibilities:**

**Taha (Frontend - UI Only):**

- ChatWidget component (container)
- ChatMessage component (display user/bot messages)
- ChatInput component (text input + send button)
- ChatHistory component (message list with scroll)
- FloatingButton component
- Animations and loading states
- "Typing..." indicator (3 animated dots)
- Suggestion buttons for common questions

**Badr (Backend - 100% Logic & AI):**

- AI service integration
- RAG system implementation
- Conversation management
- Response generation

---

## AI CHATBOT SYSTEM (Badr - 100%)

### Technology: RAG (Retrieval-Augmented Generation)

**Problem:** Generic LLMs don't know our specific database content.

**Solution:** RAG Process

```
User Question
    ↓
1. Extract keywords from question
    ↓
2. Search MongoDB collections (supplements, complements, foods)
    ↓
3. Build enriched context with relevant data
    ↓
4. Send to Gemini AI with:
   - System prompt
   - Retrieved context
   - Conversation history
    ↓
5. Generate response based on OUR data
    ↓
6. Extract clickable links [Product Name]
    ↓
7. Save to conversation history
    ↓
Return to frontend
```

### Example Conversation:

```
👤 User: "What is creatine?"

🔍 System searches MongoDB → finds "Creatine Monohydrate" supplement

🤖 Bot Response:
"Creatine is a natural compound stored in muscles that improves
performance during short, intense efforts.

📊 Recommended dosage: 5g per day
⏰ Timing: Before or after workout

➡️ More info: [Creatine Monohydrate](/supplements/creatine)

⚠️ Consult a healthcare professional before supplementation."
```

```
👤 User: "Which foods are high in protein?"

🔍 System searches Foods collection → finds Chicken, Tuna, Eggs

🤖 Bot Response:
"Here are the best protein sources:

🥩 Animal sources:
• [Chicken]:  31g protein/100g
• [Tuna]: 26g protein/100g
• [Eggs]: 13g protein/100g

➡️ See our [Nutrition Guide](/nutrition) for more options!"
```

### Chatbot Features:

✅ **Context-aware responses** (uses our MongoDB data)  
✅ **Conversation memory** (remembers previous messages)  
✅ **Automatic link generation** (clickable product/food links)  
✅ **Source citation** (mentions which products/foods referenced)  
✅ **Safety disclaimers** (health warnings when needed)  
✅ **Rate limiting** (max 20 messages/hour per user)  
✅ **Input validation** (max 500 characters)  
✅ **Error handling** (fallback messages if API fails)

### Backend Implementation (Badr):

**Files to create:**

```
backend/src/services/
├── aiService.ts          # Gemini AI integration
├── ragService.ts         # Search MongoDB + build context
├── promptService.ts      # System prompts and templates
└── conversationService.ts # Manage chat history
```

**Chat API Endpoint:**

```
POST /api/chat
Body: { message:  "user question", conversationId: "optional" }
Response: {
  response: "AI answer text",
  links: [{ text: "Product Name", url: "/supplements/slug" }],
  conversationId: "abc123"
}

GET /api/chat/history       # Get user's conversation history
DELETE /api/chat/history    # Clear conversation
```

---

## DATABASE SCHEMA (MongoDB - Mongoose)

### User Model

```javascript
{
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  name: String,
  favorites: {
    supplements: [ObjectId],  // References to Supplement._id
    complements: [ObjectId],  // References to Complement._id
    foods: [ObjectId]         // References to Food._id
  },
  createdAt:  Date,
  updatedAt:  Date
}
```

### Supplement Model

```javascript
{
  name: String (required),
  slug: String (unique, URL-friendly),
  category: String (enum: ["proteins", "creatine", "bcaa", "pre-workout", "recovery"]),
  description: String (long text),
  benefits: [String],
  dosage: String (e.g., "5g per day"),
  timing: String (e.g., "Post-workout"),
  duration: String (e.g., "Daily"),
  ingredients: [String],
  contraindications: [String],
  scientificStudies: [{
    title: String,
    url: String,
    summary: String
  }],
  images: [String],  // Cloudinary URLs
  goals: [String],   // ["mass", "cutting", "endurance"]
  popularity: Number (for sorting),
  createdAt: Date,
  updatedAt: Date
}
```

### Complement Model

```javascript
{
  name: String (required),
  slug: String (unique),
  category: String (enum:  ["vitamin", "mineral", "antioxidant", "omega", "adaptogen"]),
  description: String,
  biologicalRole: String (what it does in the body),
  deficiencySymptoms: [String],
  foodSources: [{
    food: String,
    quantityPer100g: Number,
    unit: String
  }],
  dailyIntake: {
    men: String,
    women: String,
    pregnant: String,
    athletes: String
  },
  supplementForms: [{
    form: String (e.g., "Citrate", "Oxide"),
    bioavailability: String
  }],
  interactions: [String],
  contraindications:  [String],
  images: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Food Model

```javascript
{
  name: String (required),
  slug: String (unique),
  category: String (e.g., "meat", "fish", "vegetable", "dairy"),
  type: String (enum: ["animal", "vegetal", "supplement"]),
  per100g: {
    calories: Number,
    proteins: Number,
    carbs:  Number,
    fats: Number,
    fiber: Number,
    vitamins: [{
      name: String,
      amount: Number,
      unit: String
    }],
    minerals: [{
      name: String,
      amount:  Number,
      unit: String
    }]
  },
  benefits: [String],
  mealIdeas: [String],
  dietaryTags: [String],  // ["vegan", "gluten-free", "lactose-free"]
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Model

```javascript
{
  userId: ObjectId (reference to User),
  messages: [{
    role: String (enum: ["user", "assistant"]),
    content: String,
    links: [{
      text: String,
      url: String
    }],
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## CODING CONVENTIONS

### General Rules

- **Language:** English for all code, comments, and variable names
- **File naming:** camelCase for files (userController.ts, not UserController.ts)
- **Component naming:** PascalCase for React components (ChatWidget. tsx)
- **Indentation:** 2 spaces
- **Quotes:** Single quotes for JS/TS strings
- **Semicolons:** Always use semicolons

### Git Commit Messages

```
Format: [Area]:  Brief description

Examples:
Backend: Add Gemini AI integration
Frontend: Create ChatWidget component
Fix: Resolve CORS issue in API
Docs: Update README with deployment steps
DB: Add indexes to Supplement model
```

### TypeScript Guidelines

- Always type function parameters and return values
- Use interfaces for object shapes
- Avoid `any` type (use `unknown` if needed)
- Enable strict mode in tsconfig.json

### React/Next.js Guidelines (Taha)

- Use functional components with hooks
- Prefer named exports over default exports
- Use React Query for server state
- Use React Context for global UI state (theme, modals)
- Follow Next.js 14 App Router conventions

### Backend Guidelines (Badr)

- Use async/await (no callbacks)
- Always handle errors with try/catch
- Use middleware for authentication checks
- Validate all inputs with express-validator
- Return consistent API responses:

  ```javascript
  // Success
  { success: true, data: {... } }

  // Error
  { success: false, error: "Error message" }
  ```

---

## ENVIRONMENT VARIABLES

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrisense

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro

# Image Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env. local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## API RESPONSE FORMATS

### Success Response

```javascript
{
  "success": true,
  "data": {
    // ...  response data
  },
  "message": "Optional success message"
}
```

### Error Response

```javascript
{
  "success": false,
  "error": "Error message",
  "details": "Optional detailed error info"
}
```

### Pagination Response

```javascript
{
  "success": true,
  "data": [... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## PROJECT GOALS

### Functional Goals

✅ Centralize supplement and nutrition information  
✅ Provide intelligent AI-powered assistance  
✅ Enable easy search and filtering  
✅ Allow users to save favorites  
✅ Maintain conversation context in chatbot

### Technical Goals

✅ Build a modern, scalable MERN stack application  
✅ Implement RAG system for AI chatbot  
✅ Create responsive, accessible UI  
✅ Ensure API security (JWT, validation)  
✅ Deploy on free cloud services

### Learning Goals

✅ Master Node.js + Express + TypeScript backend  
✅ Master Next.js 14 with App Router  
✅ Learn MongoDB schema design  
✅ Learn AI integration (Gemini + LangChain)  
✅ Practice Git collaboration workflow

---

## DEVELOPMENT WORKFLOW

### Branch Strategy

```
main (production)
  └── dev (development)
      ├── backend/feature-name (Badr's features)
      └── frontend/feature-name (Taha's features)
```

### Daily Workflow

```bash
# 1. Pull latest changes
git checkout dev
git pull origin dev

# 2. Create feature branch
git checkout -b backend/my-feature  # or frontend/my-feature

# 3. Work on feature with Copilot assistance

# 4. Commit and push
git add .
git commit -m "[Area]: Description"
git push origin backend/my-feature

# 5. Create Pull Request on GitHub
# 6. Review and merge to dev
```

---

## COPILOT USAGE GUIDELINES

### When Writing Code:

1. **Write descriptive comments** - Copilot uses them to generate code
2. **Start with function signatures** - Type the function declaration first
3. **Use clear variable names** - Helps Copilot understand context
4. **Accept/Reject suggestions wisely** - Review before accepting

### Example - Creating a Model (Badr):

```typescript
// In src/models/Supplement.ts

// Import mongoose
import mongoose from "mongoose";

// Create interface for Supplement document
// Copilot will suggest the full interface based on schema above

// Create Supplement schema with all fields from database schema
// Copilot will generate the schema

// Create and export Supplement model
// Copilot completes it
```

### Example - Creating a Component (Taha):

```tsx
// In components/SupplementCard.tsx

// Import React and necessary components
import React from "react";

// Create interface for SupplementCard props with id, name, image, category
// Copilot suggests interface

// Create SupplementCard component that displays supplement info in a card
// Copilot generates the full component
```

---

## TESTING CHECKLIST

### Backend (Badr)

- [ ] All API endpoints return correct status codes
- [ ] Authentication works (register, login, protected routes)
- [ ] Database queries are optimized (use indexes)
- [ ] AI chatbot returns relevant responses
- [ ] RAG system retrieves correct context
- [ ] Conversation history saves correctly
- [ ] Rate limiting works (max 20 messages/hour)
- [ ] Input validation prevents invalid data
- [ ] Error handling works for all edge cases

### Frontend (Taha)

- [ ] All pages render correctly
- [ ] Navigation works between pages
- [ ] Search and filters update results
- [ ] Chatbot UI opens/closes smoothly
- [ ] Messages display correctly (user vs bot)
- [ ] Links in chatbot responses are clickable
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Loading states show during API calls
- [ ] Error messages display when API fails

---

## DEPLOYMENT CHECKLIST

### Backend Deployment (Render/Railway)

- [ ] Environment variables configured
- [ ] MongoDB Atlas connection string updated
- [ ] CORS configured for production frontend URL
- [ ] Build command: `npm run build`
- [ ] Start command: `npm start`

### Frontend Deployment (Vercel)

- [ ] Environment variables configured
- [ ] API URL points to production backend
- [ ] Build succeeds without errors
- [ ] All pages load correctly
- [ ] Chatbot connects to production API

---

## IMPORTANT NOTES FOR COPILOT

1. **This is a mini project** - Keep implementations simple and functional
2. **Use free services only** - All APIs and hosting must have free tiers
3. **Security is important but basic** - JWT auth, input validation, basic rate limiting
4. **Focus on core features** - Don't over-engineer
5. **RAG is the key feature** - The chatbot must use MongoDB data, not just generic responses
6. **Mobile-first** - Design for mobile screens first, then scale up
7. **TypeScript everywhere** - Both backend and frontend use TypeScript
8. **Comment your code** - Help your partner understand what you built

---

## PROJECT TIMELINE

**Week 1:** Setup + Auth + Basic CRUD  
**Week 2:** Complete all APIs + Pages  
**Week 3:** AI Chatbot integration  
**Week 4:** Testing + Deployment + Polish

---

## SUCCESS CRITERIA

✅ All 4 pages are functional and responsive  
✅ Backend API serves all necessary data  
✅ AI chatbot responds intelligently using RAG  
✅ Users can search, filter, and view details  
✅ Conversation history is maintained  
✅ Application is deployed and accessible online  
✅ Code is clean, commented, and well-organized

---

END OF CONTEXT DOCUMENT

**GitHub Copilot: You now have complete context of the NutriSense AI project.
Use this information to assist with code generation, suggestions, and completions.**
