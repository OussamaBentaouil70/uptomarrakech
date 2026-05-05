#!/usr/bin/env node

/**
 * Set admin custom claim on a Firebase user
 * Usage: node scripts/set-admin-claim.mjs <email>
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/set-admin-claim.mjs <email>');
  process.exit(1);
}

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(process.cwd(), 'uptomarrakech-de58f-firebase-adminsdk-fbsvc-9cf6695a11.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`Service account file not found: ${serviceAccountPath}`);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'uptomarrakech-de58f',
});

const auth = admin.auth();

(async () => {
  try {
    // Get user by email
    const user = await auth.getUserByEmail(email);
    console.log(`Found user: ${user.uid} (${user.email})`);

    // Set custom claim
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log(`✓ Custom claim 'admin: true' set for ${email}`);
    console.log('The claim will be active on the next login.');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
