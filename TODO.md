# Mega Bags Website - Deployment TODO

## Step 1: Remove/Rebrand Replit Infrastructure
- [x] Delete `.replit`
- [x] Delete `.replitignore`
- [x] Delete `replit.md`
- [x] Clean `.gitignore` Replit section
- [x] Clean `pnpm-workspace.yaml` Replit packages & references
- [x] Clean `artifacts/megabags/package.json` Replit devDependencies
- [x] Fix `artifacts/megabags/vite.config.ts` (remove Replit plugins, fix env defaults)
- [x] Delete `pnpm-lock.yaml`

## Step 2: Fix & Prepare the Codebase
- [ ] Run `pnpm install`
- [ ] Run build to verify production build
- [ ] Fix any TypeScript/build errors

## Step 3: GitHub Repository Creation & Push
- [ ] `git init`
- [ ] `git add .`
- [ ] `git commit -m "Initial commit: Mega Bags website setup by Vipin Yadav"`
- [ ] `gh repo create Mega-Bags-Website --public --source=. --push`
- [ ] Push main branch

## Step 4: Vercel Deployment
- [ ] `vercel` to link project
- [ ] `vercel --prod`
- [ ] Provide final URLs

