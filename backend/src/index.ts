import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRouter from './routes/auth.routes';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: '*', // Adjust to process.env.FRONTEND_URL for production
    credentials: true,
  })
);

app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount routes
app.use('/api/auth', authRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    supabaseUrl: process.env.SUPABASE_URL ? 'configured' : 'missing',
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`===============================================`);
  console.log(`🚀 DriveSiksha Supabase API Proxy running on:`);
  console.log(`   http://localhost:${port}`);
  console.log(`   SUPABASE URL: ${process.env.SUPABASE_URL || 'not set'}`);
  console.log(`===============================================`);
});
export default app;
