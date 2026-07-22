import { Request, Response } from 'express';
import crypto from 'crypto';
import { supabase } from '../lib/supabaseClient';

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, schoolName, email, phone, password, agreed } = req.body;

    if (!fullName || !schoolName || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!agreed) {
      return res.status(400).json({ error: 'You must agree to the Terms of Service and Privacy Policy' });
    }

    // Call Supabase signUp passing metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          school_name: schoolName,
          phone: phone,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Registration request received. Please check your email for confirmation.',
      user: data.user,
      session: data.session,
    });
  } catch (err: any) {
    console.error('Register Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Fetch matching user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', data.user.id)
      .single();

    // Fetch school
    let school = null;
    if (profile) {
      const { data: schoolData } = await supabase
        .from('schools')
        .select('*')
        .eq('id', profile.school_id)
        .single();
      school = schoolData;
    }

    return res.json({
      message: 'Login successful',
      token: data.session?.access_token,
      session: data.session,
      user: {
        ...data.user,
        profile,
      },
      school,
    });
  } catch (err: any) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return res.json({ message: 'Logged out successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Logout failed' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', req.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('*')
      .eq('id', profile.school_id)
      .single();

    return res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        profile,
      },
      school,
    });
  } catch (err: any) {
    console.error('Get Me Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { fullName, phone, avatar } = req.body;
    const updates: any = {};
    if (fullName) updates.full_name = fullName;
    if (phone) updates.phone = phone;
    if (avatar) updates.avatar = avatar;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('auth_user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Profile updated successfully', profile: data });
  } catch (err: any) {
    console.error('Update Profile Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const redirectTo = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Password reset link dispatched successfully to your email.' });
  } catch (err: any) {
    console.error('Forgot Password Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Since this endpoint requires authentication (which is granted temporarily by Supabase
    // when clicking reset password link), the Bearer token will be resolved by auth middleware.
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authorization reset token required' });
    }

    // Update password inside Supabase auth
    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Password updated successfully' });
  } catch (err: any) {
    console.error('Reset Password Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const inviteStaff = async (req: Request, res: Response) => {
  try {
    const { email, role, branchId } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(401).json({ error: 'Tenant context required' });
    }

    // Check permissions (only SCHOOL_SUPER_ADMIN or ADMIN can invite staff)
    const allowedInviterRoles = ['SCHOOL_SUPER_ADMIN', 'ADMIN'];
    if (!allowedInviterRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: only school admins can invite staff members' });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry

    // Save invitation details to invitations table
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .insert({
        school_id: req.user.schoolId,
        branch_id: branchId || null,
        email,
        role,
        token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (inviteError) {
      return res.status(400).json({ error: inviteError.message });
    }

    const host = process.env.FRONTEND_URL || 'http://localhost:3000';
    const inviteUrl = `${host}/accept-invitation?token=${token}`;

    // Print to console and return in API response
    console.log(`\n--- [INVITATION LOG] ---`);
    console.log(`TO: ${email}`);
    console.log(`ROLE: ${role}`);
    console.log(`LINK: ${inviteUrl}`);
    console.log(`-------------------------\n`);

    return res.status(201).json({
      message: 'Invitation generated successfully',
      invitation,
      inviteUrl,
    });
  } catch (err: any) {
    console.error('Invite Staff Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
