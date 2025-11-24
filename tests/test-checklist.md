# BSOS Front-End Navigation & UI Verification Checklist

This checklist covers manual navigation and UI validation for all main pages and dashboards in the BSOS platform. Use this to verify that each page loads, navigation works, forms are functional, and no broken API calls or UI issues are present before deployment.

## Main Dashboards
- [ ] /dashboard (root)
- [ ] /dashboard/admin
- [ ] /dashboard/manager
- [ ] /dashboard/supervisor
- [ ] /dashboard/cleaner
- [ ] /dashboard/client
- [ ] /dashboard/owner

## Key Pages
- [ ] /login
- [ ] /register
- [ ] /profile
- [ ] /team
- [ ] /team/manage
- [ ] /tasks
- [ ] /tasks/new
- [ ] /tasks/[id]/edit
- [ ] /properties
- [ ] /properties/new
- [ ] /properties/manage
- [ ] /properties/[id]
- [ ] /properties/[id]/edit
- [ ] /finance
- [ ] /finance/invoices
- [ ] /notifications
- [ ] /debug/sentry
- [ ] /mobile-test
- [ ] /test

## Manual Verification Steps
1. Navigate to each page via the UI or direct URL.
2. Confirm page loads without errors.
3. Check navigation links and sidebar/menu for correct routing.
4. For each form, verify:
   - All fields render correctly
   - Validation works (required, format, etc.)
   - Submitting the form triggers the expected API call
   - Success/error messages display as expected
5. Check for broken images, missing icons, or layout issues.
6. Review toast/alert notifications for correct behavior.
7. For dashboard pages, confirm role-based content loads.
8. For debug/sentry, test error/event buttons and confirm Sentry event capture.

## Notes
- Mark any issues found and flag for fix before deployment.
- Use automated Playwright tests for regression where possible.
- Update this checklist as new pages/features are added.
