# Component Library — NutriSense AI

All components are written in TypeScript and styled with TailwindCSS and shadcn/ui.

---

## Layout Components

### Navbar

**Props**

```ts
export interface NavbarProps {
  items: Array<{ label: string; href: string }>;
  onSignInClick?: () => void;
  onSignOutClick?: () => void;
  userName?: string;
}
```

**Usage**

```tsx
<Navbar
  items={[{ label: "Supplements", href: "/supplements" }]}
  onSignInClick={handleSignIn}
  userName="Taha"
/>
```

---

### Footer

**Props**

```ts
export interface FooterProps {
  links: Array<{ label: string; href: string }>;
  copyright: string;
}
```

**Usage**

```tsx
<Footer
  links={[{ label: "Privacy", href: "/privacy" }]}
  copyright="© 2026 NutriSense AI"
/>
```

---

### Sidebar

**Props**

```ts
export interface SidebarProps {
  sections: Array<{
    title: string;
    items: Array<{ label: string; href: string }>;
  }>;
  isOpen: boolean;
  onClose: () => void;
}
```

**Usage**

```tsx
<Sidebar
  sections={[
    { title: "Explore", items: [{ label: "Foods", href: "/nutrition" }] },
  ]}
  isOpen={isSidebarOpen}
  onClose={closeSidebar}
/>
```

---

## UI Components

### Button

**Props**

```ts
export interface ButtonProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Usage**

```tsx
<Button variant="secondary" onClick={handleClick}>
  Learn More
</Button>
```

---

### Card

**Props**

```ts
export interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  children?: React.ReactNode;
}
```

**Usage**

```tsx
<Card title="Creatine" description="Supports power and strength." />
```

---

### Input

**Props**

```ts
export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "search";
  disabled?: boolean;
}
```

**Usage**

```tsx
<Input value={query} onChange={setQuery} placeholder="Search supplements" />
```

---

### Badge

**Props**

```ts
export interface BadgeProps {
  variant?: "default" | "secondary" | "outline";
  children: React.ReactNode;
}
```

**Usage**

```tsx
<Badge variant="outline">Popular</Badge>
```

---

### Modal

**Props**

```ts
export interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

**Usage**

```tsx
<Modal title="Confirm" isOpen={isOpen} onClose={closeModal}>
  Are you sure?
</Modal>
```

---

## Feature Components

### SupplementCard

**Props**

```ts
export interface SupplementCardProps {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  onOpen: (id: string) => void;
}
```

**Usage**

```tsx
<SupplementCard
  id="sup_123"
  name="Whey Protein Isolate"
  imageUrl="/images/whey.jpg"
  category="Proteins"
  onOpen={openSupplement}
/>
```

---

### FoodTable

**Props**

```ts
export interface FoodTableProps {
  rows: Array<{
    id: string;
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  }>;
  onSort: (column: "calories" | "proteins" | "carbs" | "fats") => void;
}
```

**Usage**

```tsx
<FoodTable rows={foods} onSort={sortByColumn} />
```

---

### ChatWidget

**Props**

```ts
export interface ChatWidgetProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSend: (message: string) => void;
  isLoading?: boolean;
}
```

**Usage**

```tsx
<ChatWidget
  isOpen={isOpen}
  onOpen={openChat}
  onClose={closeChat}
  onSend={sendMessage}
  isLoading={isLoading}
/>
```

---

### ChatMessage

**Props**

```ts
export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  links?: Array<{ text: string; url: string }>;
  timestamp: string;
}
```

**Usage**

```tsx
<ChatMessage
  role="assistant"
  content="Here are top protein sources."
  links={[{ text: "Chicken", url: "/nutrition/foods/chicken" }]}
  timestamp="2026-02-06T12:00:00.000Z"
/>
```
