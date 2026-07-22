import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabaseClient';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  schoolId: string;
  branchId: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Authentication middleware using Supabase token verification
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify Supabase access token (JWT)
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ error: 'Invalid or expired session token' });
    }

    // Fetch user details from public.profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('school_id, branch_id, role')
      .eq('auth_user_id', authUser.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ error: 'User profile not found or database sync failed' });
    }

    req.user = {
      id: authUser.id,
      email: authUser.email || '',
      role: profile.role,
      schoolId: profile.school_id,
      branchId: profile.branch_id,
    };

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Role authorization check
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: role ${req.user.role} does not have permission to perform this action`,
      });
    }

    next();
  };
};
