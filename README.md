# UpToMarrakech Next.js Rebuild

Modern Next.js + Firebase rebuild of the original WordPress website.

## Features

- Public category pages:
  - Accommodation (with filters by location and rooms)
  - Night clubs
  - Activities
  - Beach clubs
  - Transport / Car rental
  - Transport / Tourist transport
  - Spa
- Item detail pages with reservation request form
- Admin dashboard:
  - Login with Firebase Auth
  - Create categories and items
  - Upload images to Cloudinary free tier
  - View reservation inquiries
- Firestore-backed data model for categories, items, and inquiries

## Tech stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- Firebase Auth + Firestore
- Cloudinary (free image upload/storage alternative to Firebase Storage)

## 1) Environment setup

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required values:

- Firebase:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)
- Cloudinary:
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (unsigned preset)
- Admin defaults (UI convenience):
  - `NEXT_PUBLIC_ADMIN_EMAIL`
  - `NEXT_PUBLIC_ADMIN_PASSWORD`

## 2) Firebase setup

In your Firebase project:

1. Enable **Authentication** > Email/Password.
2. Create the admin user (example):
   - Email: `admin@uptomarrakech.local`
   - Password: `uptomarrakech@@123`
3. Enable **Firestore Database**.
4. Deploy security rules:

```bash
npm i -g firebase-tools
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules
```

Rules file used: `firestore.rules`.

## 3) Cloudinary free upload setup

1. Create a free Cloudinary account.
2. Go to **Settings > Upload** and create an **unsigned upload preset**.
3. Put cloud name + preset in `.env.local`.

## 4) Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 5) Build checks

```bash
npm run lint
npm run build
```

## 6) Deploy on Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Add all `.env.local` variables to Vercel Project Settings.
4. Deploy.

## 7) Import existing WordPress data (images + items)

This project includes a migration script:

- `npm run import:wordpress`
  - Scrapes WordPress products/categories from `https://uptomarrakech.com/wp-json/wp/v2`
  - Extracts item images (featured + gallery images from content)
  - Writes output JSON to:
    - `scripts/output/wordpress-import.json`
- `npm run import:wordpress:firestore`
  - Does the same scrape, then writes categories/items directly to Firestore.

To import directly to Firestore, set:

- `FIREBASE_SERVICE_ACCOUNT_PATH=absolute/path/to/service-account.json`

Example (PowerShell):

```powershell
$env:FIREBASE_SERVICE_ACCOUNT_PATH="C:\path\to\service-account.json"
npm run import:wordpress:firestore
```

## Notes

- `storage.rules` is included but locked by default because this build uses Cloudinary for free image hosting.
- You can still paste external WordPress image URLs directly when creating items.
