# Database Schema — NutriSense AI

This document defines MongoDB collections, TypeScript interfaces, validation rules, and recommended indexes.

---

## User

### TypeScript Interface

```ts
export interface UserDocument {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  favorites: {
    supplements: string[];
    complements: string[];
    foods: string[];
  };
  createdAt: string;
  updatedAt: string;
}
```

### Fields & Validation

- `email`: string, required, unique, lowercase, trim, email format
- `password`: string, required, min length 8, hashed with bcrypt
- `name`: string, required, trim
- `role`: string, required, enum: `['user', 'admin']`
- `favorites.supplements`: ObjectId[], default `[]`
- `favorites.complements`: ObjectId[], default `[]`
- `favorites.foods`: ObjectId[], default `[]`
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

### Indexes

- `{ email: 1 }` unique
- `{ role: 1 }`

---

## Supplement

### TypeScript Interface

```ts
export interface SupplementDocument {
  id: string;
  name: string;
  slug: string;
  category: "proteins" | "creatine" | "bcaa" | "pre-workout" | "recovery";
  description: string;
  benefits: string[];
  dosage: string;
  timing: string;
  duration: string;
  ingredients: string[];
  contraindications: string[];
  scientificStudies: Array<{
    title: string;
    url: string;
    summary: string;
  }>;
  images: string[];
  goals: Array<"mass" | "cutting" | "endurance">;
  popularity: number;
  createdAt: string;
  updatedAt: string;
}
```

### Fields & Validation

- `name`: string, required, trim
- `slug`: string, required, unique, lowercase, trim
- `category`: string, required, enum
- `description`: string, required
- `benefits`: string[], default `[]`
- `dosage`: string, required
- `timing`: string, required
- `duration`: string, required
- `ingredients`: string[], default `[]`
- `contraindications`: string[], default `[]`
- `scientificStudies`: array of objects with `title`, `url`, `summary`
- `images`: string[], default `[]`
- `goals`: string[], enum items `['mass', 'cutting', 'endurance']`
- `popularity`: number, default 0
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

### Indexes

- `{ slug: 1 }` unique
- `{ category: 1 }`
- `{ goals: 1 }`
- `{ popularity: -1 }`
- Text index on `{ name: 'text', description: 'text' }`

---

## Complement

### TypeScript Interface

```ts
export interface ComplementDocument {
  id: string;
  name: string;
  slug: string;
  category: "vitamin" | "mineral" | "antioxidant" | "omega" | "adaptogen";
  description: string;
  biologicalRole: string;
  deficiencySymptoms: string[];
  foodSources: Array<{
    food: string;
    quantityPer100g: number;
    unit: string;
  }>;
  dailyIntake: {
    men: string;
    women: string;
    pregnant: string;
    athletes: string;
  };
  supplementForms: Array<{
    form: string;
    bioavailability: string;
  }>;
  interactions: string[];
  contraindications: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Fields & Validation

- `name`: string, required, trim
- `slug`: string, required, unique, lowercase, trim
- `category`: string, required, enum
- `description`: string, required
- `biologicalRole`: string, required
- `deficiencySymptoms`: string[], default `[]`
- `foodSources`: array of objects with `food`, `quantityPer100g`, `unit`
- `dailyIntake`: object with `men`, `women`, `pregnant`, `athletes` (all required)
- `supplementForms`: array of objects with `form`, `bioavailability`
- `interactions`: string[], default `[]`
- `contraindications`: string[], default `[]`
- `images`: string[], default `[]`
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

### Indexes

- `{ slug: 1 }` unique
- `{ category: 1 }`
- Text index on `{ name: 'text', description: 'text' }`

---

## Food

### TypeScript Interface

```ts
export interface FoodDocument {
  id: string;
  name: string;
  slug: string;
  category: string;
  type: "animal" | "vegetal" | "supplement";
  per100g: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    fiber: number;
    vitamins: Array<{ name: string; amount: number; unit: string }>;
    minerals: Array<{ name: string; amount: number; unit: string }>;
  };
  benefits: string[];
  mealIdeas: string[];
  dietaryTags: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
}
```

### Fields & Validation

- `name`: string, required, trim
- `slug`: string, required, unique, lowercase, trim
- `category`: string, required
- `type`: string, required, enum `['animal', 'vegetal', 'supplement']`
- `per100g.calories`: number, required, min 0
- `per100g.proteins`: number, required, min 0
- `per100g.carbs`: number, required, min 0
- `per100g.fats`: number, required, min 0
- `per100g.fiber`: number, required, min 0
- `per100g.vitamins`: array of `{ name, amount, unit }`
- `per100g.minerals`: array of `{ name, amount, unit }`
- `benefits`: string[], default `[]`
- `mealIdeas`: string[], default `[]`
- `dietaryTags`: string[], default `[]`
- `image`: string, required
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

### Indexes

- `{ slug: 1 }` unique
- `{ category: 1 }`
- `{ type: 1 }`
- `{ dietaryTags: 1 }`
- Text index on `{ name: 'text', category: 'text' }`

---

## Conversation

### TypeScript Interface

```ts
export interface ConversationDocument {
  id: string;
  userId: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    links: Array<{ text: string; url: string }>;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

### Fields & Validation

- `userId`: ObjectId, required, ref `User`
- `messages.role`: string, enum `['user', 'assistant']`, required
- `messages.content`: string, required, max length 2000
- `messages.links`: array of `{ text, url }`, default `[]`
- `messages.timestamp`: Date, default `Date.now`
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

### Indexes

- `{ userId: 1 }`
- `{ 'messages.timestamp': -1 }`
