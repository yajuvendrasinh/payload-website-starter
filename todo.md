# Payload CMS - Branding & Seeding TODO

This list summarizes the current project status and the remaining steps to achieve full branding consistency across local and production environments.

## Current Status
- [x] **Branding Fix (Code)**: Forced `filter: none` on the `Logo` component.
- [x] **Seeding Script**: Created `src/scripts/fix-branding-and-seed.ts` to initialize Home page and navigation.
- [x] **GitHub Sync**: All code changes pushed to the `main` branch.
- [!] **Branding Inconsistency**: Header logo is still blue on production (Footer is orange).
- [!] **Database Discrepancy**: Local database has 1 page; Production database has 0 pages.

## TODO List

### Level 1: Database Synchronization
- [ ] **Verify Production DB**: Confirm if the `POSTGRES_URL` in the local `.env` matches the Vercel production environment variable.
- [ ] **Run Migration/Seed on Prod**: Ensure the `fix-branding-and-seed.ts` script is executed against the production database.
- [ ] **Verification**: Check `https://payload-website-starter-blond-iota.vercel.app/api/pages` for `totalDocs: 1`.

### Level 2: Branding Polish
- [ ] **Force Header Logo Style**: Add an aggressive global CSS rule to prevent any theme-based filters from recoloring the header logo to the default blue.
- [ ] **Cache Purge**: Verify if Vercel deployment/CDN is caching the old `favicon.svg` or stylesheets.

### Level 3: Final Validation
- [ ] **Home Page Visibility**: Confirm the "Home" page correctly renders at the root URL.
- [ ] **Visual Audit**: Confirm orange branding in Header, Footer, and Admin panel on the live site.
