import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initializeDatabase } from './db/index.js';
import { setupRoutes } from './routes/index.js';
import { errorHandler } from './middleware/error.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? ['https://app.arthur-server.com']
      : [
          'http://192.168.0.33:5173',
	        'http://localhost:5173',
          /https:\/\/.*\.webcontainer\.io$/,
          'https://stackblitz.com'
        ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(express.json());

// Initialize database before starting the server
initializeDatabase()
  .then(() => {
    // Setup routes
    setupRoutes(app);

    // Error handling
    app.use(errorHandler);

    // Health check endpoint
    app.get('/api/health', async (req, res) => {
      try {
        res.json({ status: 'ok' });
      } catch (error) {
        res
          .status(500)
          .json({ status: 'error', message: 'Database connection failed' });
      }
    });

    const PORT = process.env.PORT || 3010;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
