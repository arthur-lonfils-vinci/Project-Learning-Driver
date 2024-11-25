// generateSecretKey.js
import crypto from 'crypto';

// Generate a 64-byte random key and convert it to a hexadecimal string
const secretKey = crypto.randomBytes(64).toString('hex');

// Output the generated key
console.log('Generated JWT Secret Key:', secretKey);