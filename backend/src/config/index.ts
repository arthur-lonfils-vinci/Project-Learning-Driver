export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET, // Provide a fallback or throw an error if not set
  database: {
    path: './data/app.db',
    saveInterval: 5000 // Save every 5 seconds
  }
};

console.log('Environment Variables Loaded:', {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});


// Check if jwtSecret is defined
if (!config.jwtSecret) {
  throw new Error('JWT secret must be defined in environment variables');
}