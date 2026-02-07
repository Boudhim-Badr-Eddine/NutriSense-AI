# API Contract — NutriSense AI

## Base URLs

- **Development:** http://localhost:5000/api
- **Production:** https://api.nutrisense-ai.com/api

## Authentication

- **Method:** JWT
- **Header:** `Authorization: Bearer <token>`

## Response Format

```ts
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  error: string;
  details?: string;
}
```

## Common Types

```ts
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: Pagination;
}

export interface Link {
  text: string;
  url: string;
}
```

---

# Authentication

## POST /auth/register

- **Auth:** None

### Request Body

```ts
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
```

### Response Body

```ts
export interface RegisterResponseData {
  user: UserResponse;
  token: string;
}

export type RegisterResponse =
  | ApiSuccessResponse<RegisterResponseData>
  | ApiErrorResponse;
```

---

## POST /auth/login

- **Auth:** None

### Request Body

```ts
export interface LoginRequest {
  email: string;
  password: string;
}
```

### Response Body

```ts
export interface LoginResponseData {
  user: UserResponse;
  token: string;
}

export type LoginResponse =
  | ApiSuccessResponse<LoginResponseData>
  | ApiErrorResponse;
```

---

## GET /auth/profile

- **Auth:** Required

### Response Body

```ts
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  favorites: FavoritesResponse;
  createdAt: string;
  updatedAt: string;
}

export interface FavoritesResponse {
  supplements: string[];
  complements: string[];
  foods: string[];
}

export type ProfileResponse =
  | ApiSuccessResponse<UserResponse>
  | ApiErrorResponse;
```

---

## POST /auth/logout

- **Auth:** Required

### Response Body

```ts
export interface LogoutResponseData {
  message: string;
}

export type LogoutResponse =
  | ApiSuccessResponse<LogoutResponseData>
  | ApiErrorResponse;
```

---

# Supplements

## GET /supplements

- **Auth:** Optional

### Query Parameters

- `page?: number`
- `limit?: number`
- `search?: string`
- `category?: 'proteins' | 'creatine' | 'bcaa' | 'pre-workout' | 'recovery'`
- `goal?: 'mass' | 'cutting' | 'endurance'`
- `sort?: 'name-asc' | 'name-desc' | 'popularity-desc'`

### Response Body

```ts
export interface SupplementResponse {
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
  scientificStudies: ScientificStudy[];
  images: string[];
  goals: Array<"mass" | "cutting" | "endurance">;
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScientificStudy {
  title: string;
  url: string;
  summary: string;
}

export type ListSupplementsResponse =
  | PaginatedResponse<SupplementResponse>
  | ApiErrorResponse;
```

---

## GET /supplements/:id

- **Auth:** Optional

### Response Body

```ts
export type GetSupplementResponse =
  | ApiSuccessResponse<SupplementResponse>
  | ApiErrorResponse;
```

---

## POST /supplements

- **Auth:** Required (admin)

### Request Body

```ts
export type CreateSupplementRequest = Omit<
  SupplementResponse,
  "id" | "createdAt" | "updatedAt"
>;
```

### Response Body

```ts
export type CreateSupplementResponse =
  | ApiSuccessResponse<SupplementResponse>
  | ApiErrorResponse;
```

---

## PUT /supplements/:id

- **Auth:** Required (admin)

### Request Body

```ts
export type UpdateSupplementRequest = Partial<CreateSupplementRequest>;
```

### Response Body

```ts
export type UpdateSupplementResponse =
  | ApiSuccessResponse<SupplementResponse>
  | ApiErrorResponse;
```

---

## DELETE /supplements/:id

- **Auth:** Required (admin)

### Response Body

```ts
export interface DeleteSupplementResponseData {
  id: string;
}

export type DeleteSupplementResponse =
  | ApiSuccessResponse<DeleteSupplementResponseData>
  | ApiErrorResponse;
```

---

## POST /supplements/:id/favorite

- **Auth:** Required

### Response Body

```ts
export interface FavoriteSupplementResponseData {
  favorites: FavoritesResponse;
}

export type FavoriteSupplementResponse =
  | ApiSuccessResponse<FavoriteSupplementResponseData>
  | ApiErrorResponse;
```

---

# Complements

## GET /complements

- **Auth:** Optional

### Query Parameters

- `page?: number`
- `limit?: number`
- `search?: string`
- `category?: 'vitamin' | 'mineral' | 'antioxidant' | 'omega' | 'adaptogen'`
- `sort?: 'name-asc' | 'name-desc'`

### Response Body

```ts
export interface ComplementResponse {
  id: string;
  name: string;
  slug: string;
  category: "vitamin" | "mineral" | "antioxidant" | "omega" | "adaptogen";
  description: string;
  biologicalRole: string;
  deficiencySymptoms: string[];
  foodSources: ComplementFoodSource[];
  dailyIntake: ComplementDailyIntake;
  supplementForms: ComplementForm[];
  interactions: string[];
  contraindications: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ComplementFoodSource {
  food: string;
  quantityPer100g: number;
  unit: string;
}

export interface ComplementDailyIntake {
  men: string;
  women: string;
  pregnant: string;
  athletes: string;
}

export interface ComplementForm {
  form: string;
  bioavailability: string;
}

export type ListComplementsResponse =
  | PaginatedResponse<ComplementResponse>
  | ApiErrorResponse;
```

---

## GET /complements/:id

- **Auth:** Optional

### Response Body

```ts
export type GetComplementResponse =
  | ApiSuccessResponse<ComplementResponse>
  | ApiErrorResponse;
```

---

## GET /complements/category/:categoryName

- **Auth:** Optional

### Response Body

```ts
export type ComplementsByCategoryResponse =
  | PaginatedResponse<ComplementResponse>
  | ApiErrorResponse;
```

---

## POST /complements

- **Auth:** Required (admin)

### Request Body

```ts
export type CreateComplementRequest = Omit<
  ComplementResponse,
  "id" | "createdAt" | "updatedAt"
>;
```

### Response Body

```ts
export type CreateComplementResponse =
  | ApiSuccessResponse<ComplementResponse>
  | ApiErrorResponse;
```

---

## PUT /complements/:id

- **Auth:** Required (admin)

### Request Body

```ts
export type UpdateComplementRequest = Partial<CreateComplementRequest>;
```

### Response Body

```ts
export type UpdateComplementResponse =
  | ApiSuccessResponse<ComplementResponse>
  | ApiErrorResponse;
```

---

## DELETE /complements/:id

- **Auth:** Required (admin)

### Response Body

```ts
export interface DeleteComplementResponseData {
  id: string;
}

export type DeleteComplementResponse =
  | ApiSuccessResponse<DeleteComplementResponseData>
  | ApiErrorResponse;
```

---

# Foods

## GET /foods

- **Auth:** Optional

### Query Parameters

- `page?: number`
- `limit?: number`
- `search?: string`
- `category?: string`
- `type?: 'animal' | 'vegetal' | 'supplement'`
- `dietaryTag?: string`
- `sort?: 'name-asc' | 'name-desc' | 'protein-desc'`

### Response Body

```ts
export interface FoodResponse {
  id: string;
  name: string;
  slug: string;
  category: string;
  type: "animal" | "vegetal" | "supplement";
  per100g: FoodPer100g;
  benefits: string[];
  mealIdeas: string[];
  dietaryTags: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodPer100g {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber: number;
  vitamins: NutrientAmount[];
  minerals: NutrientAmount[];
}

export interface NutrientAmount {
  name: string;
  amount: number;
  unit: string;
}

export type ListFoodsResponse =
  | PaginatedResponse<FoodResponse>
  | ApiErrorResponse;
```

---

## GET /foods/top-proteins

- **Auth:** Optional

### Query Parameters

- `limit?: number`

### Response Body

```ts
export type TopProteinsResponse =
  | ApiSuccessResponse<FoodResponse[]>
  | ApiErrorResponse;
```

---

## GET /foods/top-carbs

- **Auth:** Optional

### Query Parameters

- `limit?: number`

### Response Body

```ts
export type TopCarbsResponse =
  | ApiSuccessResponse<FoodResponse[]>
  | ApiErrorResponse;
```

---

## GET /foods/top-fats

- **Auth:** Optional

### Query Parameters

- `limit?: number`

### Response Body

```ts
export type TopFatsResponse =
  | ApiSuccessResponse<FoodResponse[]>
  | ApiErrorResponse;
```

---

## GET /foods/:id

- **Auth:** Optional

### Response Body

```ts
export type GetFoodResponse =
  | ApiSuccessResponse<FoodResponse>
  | ApiErrorResponse;
```

---

## POST /foods

- **Auth:** Required (admin)

### Request Body

```ts
export type CreateFoodRequest = Omit<
  FoodResponse,
  "id" | "createdAt" | "updatedAt"
>;
```

### Response Body

```ts
export type CreateFoodResponse =
  | ApiSuccessResponse<FoodResponse>
  | ApiErrorResponse;
```

---

## PUT /foods/:id

- **Auth:** Required (admin)

### Request Body

```ts
export type UpdateFoodRequest = Partial<CreateFoodRequest>;
```

### Response Body

```ts
export type UpdateFoodResponse =
  | ApiSuccessResponse<FoodResponse>
  | ApiErrorResponse;
```

---

## DELETE /foods/:id

- **Auth:** Required (admin)

### Response Body

```ts
export interface DeleteFoodResponseData {
  id: string;
}

export type DeleteFoodResponse =
  | ApiSuccessResponse<DeleteFoodResponseData>
  | ApiErrorResponse;
```

---

# Chat

## POST /chat

- **Auth:** Required

### Request Body

```ts
export interface ChatRequest {
  message: string;
  conversationId?: string;
}
```

### Response Body

```ts
export interface ChatResponseData {
  response: string;
  links: Link[];
  conversationId: string;
}

export type ChatResponse =
  | ApiSuccessResponse<ChatResponseData>
  | ApiErrorResponse;
```

---

## GET /chat/history

- **Auth:** Required

### Response Body

```ts
export interface ChatMessageResponse {
  role: "user" | "assistant";
  content: string;
  links: Link[];
  timestamp: string;
}

export interface ChatHistoryResponseData {
  conversationId: string;
  messages: ChatMessageResponse[];
}

export type ChatHistoryResponse =
  | ApiSuccessResponse<ChatHistoryResponseData>
  | ApiErrorResponse;
```

---

## DELETE /chat/history

- **Auth:** Required

### Response Body

```ts
export interface ClearChatHistoryResponseData {
  conversationId: string;
  message: string;
}

export type ClearChatHistoryResponse =
  | ApiSuccessResponse<ClearChatHistoryResponseData>
  | ApiErrorResponse;
```
