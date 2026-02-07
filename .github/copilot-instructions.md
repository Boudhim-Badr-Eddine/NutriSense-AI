# Copilot Instructions — NutriSense AI

## 1) Project Overview

NutriSense AI is a MERN stack platform for supplements, dietary complements, and nutrition guides with an AI chatbot assistant. The system provides searchable catalogs, detail views, and context-aware recommendations using MongoDB data and Google Gemini AI.

---

## 2) Coding Standards

- **TypeScript strict mode** is required in all projects.
- **No `any` types**. Use `unknown` with proper narrowing when needed.
- **Use interfaces** for all data structures and API contracts.
- **Naming conventions**:
  - Files/functions: `camelCase`
  - React components/classes: `PascalCase`
- **Import order**:
  1. External libraries
  2. Internal modules (absolute imports)
  3. Components
  4. Types
  5. Styles

---

## 3) Backend Patterns

- **Controller pattern** using a `catchAsync` wrapper to handle async errors.
- **API response format**:
  ```json
  { "success": true, "data": { } }
  { "success": false, "data": null, "error": "Message" }
  ```
- **Custom error handling** using `ApiError` class.
- **Middleware chain** order:
  `authenticate → authorize → validate → controller`

---

## 4) Frontend Patterns

- **Functional components** with TypeScript.
- **Custom hooks** for data fetching using React Query.
- Use **`'use client'`** for interactive components in Next.js App Router.
- **Component structure**:
  1. Imports
  2. Types
  3. Component
  4. Export

---

## 5) File Structure

### Backend

```
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  types/
```

### Frontend

```
frontend/
  app/
  components/
    ui/
    layout/
    features/
  hooks/
  lib/
  types/
```

---

## 6) Security Rules

- **No hardcoded secrets** in code.
- **Input validation** on all endpoints.
- **Parameterized queries only**.
- **CORS** must be configured properly.
- **Rate limiting** on sensitive routes (auth, chat, etc.).

---

## 7) Comment Guidelines

- Use **JSDoc for all exported functions**.
- Explain **WHY**, not WHAT.
- **No commented-out code**.

---

## 8) Example Code Patterns

### Controller Example

```ts
import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/apiError";
import { catchAsync } from "../utils/catchAsync";
import { supplementService } from "../services/supplementService";
import { SupplementResponse } from "../types/supplementTypes";

/**
 * Fetch a supplement by ID.
 * WHY: Encapsulates domain fetching and keeps controllers thin.
 */
export const getSupplementById = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const supplement: SupplementResponse | null =
      await supplementService.getById(id);

    if (!supplement) {
      return next(new ApiError("Supplement not found", 404));
    }

    res.status(200).json({
      success: true,
      data: supplement,
    });
  },
);
```

### Custom Hook Example

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/apiClient";
import { SupplementResponse } from "@/types/supplementTypes";

interface UseSupplementByIdResult {
  data: SupplementResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetch supplement detail for a stable data contract across pages.
 */
export const useSupplementById = (id: string): UseSupplementByIdResult => {
  const query = useQuery<SupplementResponse, Error>({
    queryKey: ["supplement", id],
    queryFn: async () =>
      apiClient.get<SupplementResponse>(`/supplements/${id}`),
    enabled: Boolean(id),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error ?? null,
  };
};
```

### API Route Example (Express)

```ts
import { Router } from "express";

import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { getSupplementById } from "../controllers/supplementController";
import { getSupplementByIdSchema } from "../validators/supplementValidators";

const router = Router();

router.get(
  "/supplements/:id",
  authenticate,
  authorize("user", "admin"),
  validate(getSupplementByIdSchema),
  getSupplementById,
);

export default router;
```

### Component Example

```tsx
"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { SupplementResponse } from "@/types/supplementTypes";

interface SupplementCardProps {
  supplement: SupplementResponse;
}

/**
 * Display a supplement summary card for browsing.
 */
export const SupplementCard = ({ supplement }: SupplementCardProps) => {
  return (
    <article className="rounded-lg border p-4 shadow-sm">
      <Image
        alt={supplement.name}
        src={supplement.images[0]}
        width={320}
        height={200}
        className="mb-3 w-full rounded-md object-cover"
      />
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{supplement.name}</h3>
        <Badge>{supplement.category}</Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {supplement.description}
      </p>
    </article>
  );
};
```
