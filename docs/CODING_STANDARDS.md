# Coding Standards — NutriSense AI

## Git Commit Messages

**Format:** `type(scope): subject`

### Types

- `feat` — New feature
- `fix` — Bug fix
- `chore` — Maintenance or tooling
- `docs` — Documentation only
- `refactor` — Code changes without feature/bug impact
- `test` — Tests only

### Examples

- `feat(auth): add JWT refresh flow`
- `fix(api): handle invalid ObjectId`
- `docs(readme): add deployment steps`

---

## Branch Naming

**Format:** `type/description`

### Examples

- `feat/chat-widget`
- `fix/cors-headers`
- `docs/api-contract`

---

## Code Review Checklist

- [ ] Functionality meets requirements and edge cases are covered
- [ ] No `any` types; interfaces used for data contracts
- [ ] Input validation present on all endpoints
- [ ] Error handling uses `ApiError` and consistent response format
- [ ] Security: no hardcoded secrets or sensitive logging
- [ ] Tests added or updated when behavior changes
- [ ] Documentation updated (API, schema, or UI) where applicable
- [ ] UI components follow design system and accessibility basics
- [ ] Performance: no unnecessary re-renders or N+1 database queries

---

## Testing Requirements

- **Backend**
  - Unit tests for services and utilities
  - Integration tests for API endpoints
  - Validate authentication, authorization, and error responses
- **Frontend**
  - Component tests for UI and hooks
  - Page-level tests for critical flows
  - Verify loading and error states

---

## Documentation Requirements

- JSDoc for all exported functions and public APIs
- Update API contract on new or modified endpoints
- Update database schema doc on data model changes
- Update component library when UI props or behaviors change
