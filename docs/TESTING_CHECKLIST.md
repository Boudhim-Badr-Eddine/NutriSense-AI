# Testing Checklist

Use this checklist to validate NutriSense AI before release. Each item includes clear, repeatable steps.

## Backend API Tests

- [ ] Authentication (register, login, logout, profile)
  - Step 1: POST `/api/auth/register` with valid user data.
  - Step 2: Verify 201 response and JWT token returned.
  - Step 3: POST `/api/auth/login` with the same credentials.
  - Step 4: Verify 200 response and JWT token returned.
  - Step 5: GET `/api/auth/profile` with Authorization header.
  - Step 6: Verify profile data matches the user.
  - Step 7: Logout (if endpoint exists) and confirm token invalidation.

- [ ] Supplements CRUD
  - Step 1: GET `/api/supplements` and verify pagination fields.
  - Step 2: POST `/api/supplements` as admin with valid payload.
  - Step 3: GET `/api/supplements/:id` and verify created fields.
  - Step 4: PUT `/api/supplements/:id` with updated values.
  - Step 5: DELETE `/api/supplements/:id` and verify removal.

- [ ] Complements CRUD
  - Step 1: GET `/api/complements` and verify pagination fields.
  - Step 2: POST `/api/complements` as admin with valid payload.
  - Step 3: GET `/api/complements/:id` and verify created fields.
  - Step 4: PUT `/api/complements/:id` with updated values.
  - Step 5: DELETE `/api/complements/:id` and verify removal.

- [ ] Foods CRUD
  - Step 1: GET `/api/foods` and verify pagination fields.
  - Step 2: POST `/api/foods` as admin with valid payload.
  - Step 3: GET `/api/foods/:id` and verify created fields.
  - Step 4: PUT `/api/foods/:id` with updated values.
  - Step 5: DELETE `/api/foods/:id` and verify removal.

- [ ] Chat AI (send message, history, clear)
  - Step 1: POST `/api/chat` with valid message payload.
  - Step 2: Verify 200 response includes `response` text and `conversationId`.
  - Step 3: GET `/api/chat/history` and verify conversation exists.
  - Step 4: DELETE `/api/chat/history` and verify history clears.

- [ ] Error responses (400, 401, 404, 500)
  - Step 1: Send invalid payload to a write endpoint, expect 400.
  - Step 2: Call protected endpoint without token, expect 401.
  - Step 3: Call missing resource ID, expect 404.
  - Step 4: Simulate server error, expect 500 with error format.

- [ ] Rate limiting (chat endpoint)
  - Step 1: Send more than allowed messages in a short window.
  - Step 2: Verify 429 response and error message.

- [ ] Input validation (invalid data rejected)
  - Step 1: Send missing required fields, expect 400.
  - Step 2: Send invalid enum values, expect 400.
  - Step 3: Send invalid types, expect 400.

- [ ] Authorization (admin routes protected)
  - Step 1: Call admin routes as normal user, expect 403.
  - Step 2: Call admin routes as admin, expect success.

## Frontend Component Tests

- [ ] Home page renders
  - Step 1: Load `/`.
  - Step 2: Verify hero, services, benefits, and how-it-works sections appear.

- [ ] All navigation links work
  - Step 1: Click navbar links to each main page.
  - Step 2: Verify correct routes and titles.

- [ ] Login/register forms work
  - Step 1: Submit register form with valid data.
  - Step 2: Verify redirect to home or success state.
  - Step 3: Submit login form with valid data.
  - Step 4: Verify authenticated UI state.

- [ ] Form validation shows errors
  - Step 1: Submit login/register with missing fields.
  - Step 2: Verify inline error messages.

- [ ] Logout clears user state
  - Step 1: Logout using UI.
  - Step 2: Verify user info and favorites are cleared.

- [ ] Supplements page loads and displays cards
  - Step 1: Load `/supplements`.
  - Step 2: Verify grid renders supplement cards.

- [ ] Search filters supplements
  - Step 1: Enter search query.
  - Step 2: Verify results match the query.

- [ ] Category filter works
  - Step 1: Select category filter.
  - Step 2: Verify results are filtered.

- [ ] Pagination works
  - Step 1: Navigate to next page.
  - Step 2: Verify new results and page indicator.

- [ ] Detail pages load correct data
  - Step 1: Open a supplement/complement/food detail page.
  - Step 2: Verify title, description, and key fields.

- [ ] Favorite button works (logged in)
  - Step 1: Click favorite on a card.
  - Step 2: Verify UI updates and state persists.

- [ ] Favorite requires login (logged out)
  - Step 1: Click favorite while logged out.
  - Step 2: Verify login prompt/alert appears.

- [ ] Complements page works
  - Step 1: Load `/complements`.
  - Step 2: Verify cards, filters, and pagination.

- [ ] Nutrition guide landing page
  - Step 1: Load `/nutrition`.
  - Step 2: Verify three cards and info section.

- [ ] Protein/carbs/fats rankings load
  - Step 1: Load `/nutrition/proteins`, `/nutrition/carbs`, `/nutrition/fats`.
  - Step 2: Verify tables render with data.

- [ ] Food table sorts correctly
  - Step 1: Sort by a column header.
  - Step 2: Verify order changes as expected.

- [ ] Food detail page displays nutrition
  - Step 1: Open a food detail page.
  - Step 2: Verify macros, vitamins, minerals, and charts.

- [ ] Chat widget opens/closes
  - Step 1: Click the floating chat button.
  - Step 2: Verify chat opens; click close to hide.

- [ ] Chat sends messages
  - Step 1: Send a message.
  - Step 2: Verify message appears in history.

- [ ] Chat displays AI responses
  - Step 1: Send a message.
  - Step 2: Verify response appears with assistant styling.

- [ ] Links in chat are clickable
  - Step 1: Click a link in the response.
  - Step 2: Verify navigation to linked page.

- [ ] "Ask AI" button works on detail pages
  - Step 1: Click "Ask AI" on a detail page.
  - Step 2: Verify chat opens with prefilled message.

- [ ] Error messages display on API failure
  - Step 1: Simulate API failure (offline or mock error).
  - Step 2: Verify error component appears.

- [ ] Loading skeletons show while fetching
  - Step 1: Throttle network.
  - Step 2: Verify skeletons appear before data.

## Mobile Responsive Tests

- [ ] Hamburger menu works on mobile
  - Step 1: Open navbar on a small screen.
  - Step 2: Verify menu opens and links work.

- [ ] Chat widget is fullscreen on mobile
  - Step 1: Open chat on a small screen.
  - Step 2: Verify fullscreen layout.

- [ ] Food table shows cards on mobile
  - Step 1: Open foods page on mobile.
  - Step 2: Verify card layout instead of table.

- [ ] All pages readable on small screens
  - Step 1: Scroll each main page.
  - Step 2: Verify text and layout are legible.

- [ ] Touch targets are large enough
  - Step 1: Tap buttons and inputs.
  - Step 2: Verify no mis-taps.

- [ ] No horizontal scroll
  - Step 1: Scroll each page horizontally.
  - Step 2: Verify no overflow.

## Performance Tests

- [ ] Pages load in < 3 seconds
  - Step 1: Use browser performance tools.
  - Step 2: Verify LCP < 3s on main pages.

- [ ] Images lazy load
  - Step 1: Scroll image-heavy pages.
  - Step 2: Verify images load as they enter view.

- [ ] Chat widget does not block page load
  - Step 1: Hard refresh home page.
  - Step 2: Verify main content renders before chat.

- [ ] No console errors
  - Step 1: Open DevTools console.
  - Step 2: Verify no errors on navigation.

- [ ] No memory leaks
  - Step 1: Navigate between pages for 3-5 minutes.
  - Step 2: Verify memory usage stabilizes.

## Cross-Browser Tests

- [ ] Chrome (desktop & mobile)
  - Step 1: Run core flows on Chrome.
  - Step 2: Verify visuals and interactions.

- [ ] Firefox
  - Step 1: Run core flows on Firefox.
  - Step 2: Verify visuals and interactions.

- [ ] Safari (desktop & mobile)
  - Step 1: Run core flows on Safari.
  - Step 2: Verify visuals and interactions.

- [ ] Edge
  - Step 1: Run core flows on Edge.
  - Step 2: Verify visuals and interactions.
