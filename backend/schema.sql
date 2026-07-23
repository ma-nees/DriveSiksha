-- DriveSiksha Multi-Tenant Database Schema
-- Run this script in the Supabase SQL Editor

-- ----------------------------------------------------
-- CLEANUP (Uncomment if you want a fresh slate)
-- ----------------------------------------------------
-- drop trigger if exists on_auth_user_created on auth.users;
-- drop function if exists public.handle_new_user();
-- drop function if exists public.get_auth_user_school_id();
-- drop table if exists public.invitations cascade;
-- drop table if exists public.audit_logs cascade;
-- drop table if exists public.subscription_history cascade;
-- drop table if exists public.subscriptions cascade;
-- drop table if exists public.notifications cascade;
-- drop table if exists public.branding_settings cascade;
-- drop table if exists public.schedules cascade;
-- drop table if exists public.payments cascade;
-- drop table if exists public.vehicles cascade;
-- drop table if exists public.students cascade;
-- drop table if exists public.instructors cascade;
-- drop table if exists public.profiles cascade;
-- drop table if exists public.branches cascade;
-- drop table if exists public.schools cascade;

-- ----------------------------------------------------
-- 1. TABLES DEFINITIONS
-- ----------------------------------------------------

-- Schools (Tenants)
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  school_name text not null,
  slug text not null unique,
  email text not null,
  phone text not null,
  logo text,
  address text,
  subscription_plan text not null default 'trial',
  status text not null default 'pending', -- pending, active, suspended
  created_at timestamp with time zone not null default now()
);

-- Branches
create table public.branches (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  address text,
  phone text,
  created_at timestamp with time zone not null default now()
);

-- Profiles (Users details linked to Auth.Users)
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  full_name text not null,
  email text not null unique,
  phone text not null unique,
  avatar text,
  role text not null default 'INSTRUCTOR', -- SYSTEM_SUPER_ADMIN, SCHOOL_SUPER_ADMIN, ADMIN, BRANCH_MANAGER, INSTRUCTOR, RECEPTIONIST, ACCOUNTANT
  status text not null default 'active', -- active, inactive
  last_login timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

-- Instructors
create table public.instructors (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  license_category text not null, -- B, C, etc.
  status text not null default 'active', -- active, inactive, on_leave
  created_at timestamp with time zone not null default now()
);

-- Students
create table public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  license_category text,
  status text not null default 'active', -- active, completed, suspended
  created_at timestamp with time zone not null default now()
);

-- Vehicles
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  name text not null,
  number_plate text not null,
  status text not null default 'active', -- active, maintenance, inactive
  created_at timestamp with time zone not null default now()
);

-- Payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  student_id uuid references public.students(id) on delete set null,
  amount numeric(10, 2) not null,
  payment_method text not null, -- cash, esewa, bank_transfer
  status text not null default 'completed', -- completed, pending, refunded
  remarks text,
  created_at timestamp with time zone not null default now()
);

-- Schedules (Lessons / Bookings)
create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  title text not null,
  description text,
  instructor_id uuid references public.instructors(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text not null default 'scheduled', -- scheduled, completed, cancelled
  created_at timestamp with time zone not null default now()
);

-- Branding Settings
create table public.branding_settings (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null unique references public.schools(id) on delete cascade,
  primary_color text not null default '#ef4444', -- default tailwind red
  sidebar_theme text not null default 'dark',
  logo_url text,
  website_url text,
  receipt_header text,
  receipt_footer text,
  updated_at timestamp with time zone not null default now()
);

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null unique references public.schools(id) on delete cascade,
  plan_name text not null default 'trial', -- trial, basic, premium, enterprise
  status text not null default 'active', -- active, expired, past_due
  start_date timestamp with time zone not null default now(),
  end_date timestamp with time zone not null,
  created_at timestamp with time zone not null default now()
);

-- Subscription History
create table public.subscription_history (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  plan_name text not null,
  amount numeric(10, 2) not null,
  payment_status text not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  created_at timestamp with time zone not null default now()
);

-- Audit Logs
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamp with time zone not null default now()
);

-- Invitations
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  email text not null,
  role text not null,
  token text not null unique,
  expires_at timestamp with time zone not null,
  accepted boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- ----------------------------------------------------
-- 2. INDEXES (For Query Optimization)
-- ----------------------------------------------------
create index idx_branches_school on public.branches(school_id);
create index idx_profiles_school on public.profiles(school_id);
create index idx_profiles_auth_user on public.profiles(auth_user_id);
create index idx_instructors_school on public.instructors(school_id);
create index idx_students_school on public.students(school_id);
create index idx_vehicles_school on public.vehicles(school_id);
create index idx_payments_school on public.payments(school_id);
create index idx_schedules_school on public.schedules(school_id);
create index idx_notifications_school on public.notifications(school_id);
create index idx_audit_logs_school on public.audit_logs(school_id);
create index idx_invitations_school on public.invitations(school_id);

-- ----------------------------------------------------
-- 3. HELPER FUNCTION FOR RLS (Tenant isolation)
-- ----------------------------------------------------

create or replace function public.get_auth_user_school_id()
returns uuid as $$
declare
  s_id uuid;
begin
  select school_id into s_id from public.profiles where auth_user_id = auth.uid() limit 1;
  return s_id;
end;
$$ language plpgsql security definer;

-- ----------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------

-- Enable RLS on every table
alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.branches enable row level security;
alter table public.instructors enable row level security;
alter table public.students enable row level security;
alter table public.vehicles enable row level security;
alter table public.payments enable row level security;
alter table public.schedules enable row level security;
alter table public.branding_settings enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;
alter table public.subscription_history enable row level security;
alter table public.audit_logs enable row level security;
alter table public.invitations enable row level security;

-- Schools Policies
create policy "Allow users to read their own school"
  on public.schools for select
  using (id = public.get_auth_user_school_id());

create policy "Allow school owners to update their own school"
  on public.schools for update
  using (id = public.get_auth_user_school_id());

-- Profiles Policies
create policy "Allow users to view profiles of their school"
  on public.profiles for select
  using (school_id = public.get_auth_user_school_id());

create policy "Allow users to update their own profile"
  on public.profiles for update
  using (auth_user_id = auth.uid());

create policy "Allow school admins to create/update staff profiles"
  on public.profiles for all
  using (
    school_id = public.get_auth_user_school_id() 
    and (
      select role from public.profiles where auth_user_id = auth.uid()
    ) in ('SCHOOL_SUPER_ADMIN', 'ADMIN')
  );

-- Branches Policies
create policy "Enforce school isolation for branches"
  on public.branches for all
  using (school_id = public.get_auth_user_school_id());

-- Instructors Policies
create policy "Enforce school isolation for instructors"
  on public.instructors for all
  using (school_id = public.get_auth_user_school_id());

-- Students Policies
create policy "Enforce school isolation for students"
  on public.students for all
  using (school_id = public.get_auth_user_school_id());

-- Vehicles Policies
create policy "Enforce school isolation for vehicles"
  on public.vehicles for all
  using (school_id = public.get_auth_user_school_id());

-- Payments Policies
create policy "Enforce school isolation for payments"
  on public.payments for all
  using (school_id = public.get_auth_user_school_id());

-- Schedules Policies
create policy "Enforce school isolation for schedules"
  on public.schedules for all
  using (school_id = public.get_auth_user_school_id());

-- Branding Settings Policies
create policy "Enforce school isolation for branding_settings"
  on public.branding_settings for all
  using (school_id = public.get_auth_user_school_id());

-- Notifications Policies
create policy "Enforce school isolation for notifications"
  on public.notifications for all
  using (school_id = public.get_auth_user_school_id());

-- Subscriptions Policies
create policy "Allow users to view their school subscription"
  on public.subscriptions for select
  using (school_id = public.get_auth_user_school_id());

-- Subscription History Policies
create policy "Allow users to view subscription invoices"
  on public.subscription_history for select
  using (school_id = public.get_auth_user_school_id());

-- Audit Logs Policies
create policy "Allow admins to view school audit logs"
  on public.audit_logs for select
  using (
    school_id = public.get_auth_user_school_id()
    and (
      select role from public.profiles where auth_user_id = auth.uid()
    ) in ('SCHOOL_SUPER_ADMIN', 'ADMIN')
  );

create policy "Allow system to insert audit logs"
  on public.audit_logs for insert
  with check (school_id = public.get_auth_user_school_id());

-- Invitations Policies
create policy "Allow admins to manage invitations"
  on public.invitations for all
  using (
    school_id = public.get_auth_user_school_id()
    and (
      select role from public.profiles where auth_user_id = auth.uid()
    ) in ('SCHOOL_SUPER_ADMIN', 'ADMIN')
  );

create policy "Allow public to retrieve invitation details"
  on public.invitations for select
  using (true); -- Public needs token checks before sign up

-- ----------------------------------------------------
-- 5. AUTOMATIC TRIGGER FOR REGISTRATION & ONBOARDING
-- ----------------------------------------------------

create or replace function public.handle_new_user()
returns trigger as $$
declare
  school_id uuid;
  school_slug text;
  metadata jsonb;
  s_name text;
  f_name text;
  u_phone text;
  invite_token text;
  invite_record record;
  default_branch_id uuid;
begin
  metadata := new.raw_user_meta_data;
  f_name := metadata->>'full_name';
  u_phone := metadata->>'phone';
  invite_token := metadata->>'invitation_token';
  
  -- Handle Null Names
  if f_name is null then
    f_name := 'Admin User';
  end if;
  if u_phone is null then
    u_phone := '';
  end if;

  -- Scenario A: User is accepting an invitation to join an existing school
  if invite_token is not null then
    select * into invite_record 
    from public.invitations 
    where token = invite_token and accepted = false and expires_at > now()
    limit 1;
    
    if invite_record.id is not null then
      -- Create profile linked to the existing school & branch from the invitation
      insert into public.profiles (id, auth_user_id, school_id, branch_id, full_name, email, phone, role, status)
      values (gen_random_uuid(), new.id, invite_record.school_id, invite_record.branch_id, f_name, new.email, u_phone, invite_record.role, 'active');
      
      -- Mark invitation as accepted
      update public.invitations 
      set accepted = true 
      where id = invite_record.id;
    else
      raise exception 'Invalid or expired invitation token';
    end if;
    
  -- Scenario B: User is registering a brand new Driving School (Tenant Owner)
  else
    s_name := metadata->>'school_name';
    if s_name is null then
      s_name := 'My Driving School';
    end if;
    
    -- Generate URL-friendly slug
    school_slug := lower(regexp_replace(s_name, '[^a-zA-Z0-9]+', '-', 'g'));
    -- Trim leading/trailing hyphens
    school_slug := trim(both '-' from school_slug);
    
    -- Create School
    insert into public.schools (school_name, slug, email, phone, status, subscription_plan)
    values (s_name, school_slug, new.email, u_phone, 'pending', 'trial')
    returning id into school_id;
    
    -- Create Main Branch
    insert into public.branches (school_id, name, address, phone)
    values (school_id, 'Main Branch', 'Kathmandu, Nepal', u_phone)
    returning id into default_branch_id;
    
    -- Create Owner Profile
    insert into public.profiles (id, auth_user_id, school_id, branch_id, full_name, email, phone, role, status)
    values (gen_random_uuid(), new.id, school_id, default_branch_id, f_name, new.email, u_phone, 'SCHOOL_SUPER_ADMIN', 'active');
    
    -- Create Default Branding Settings
    insert into public.branding_settings (school_id, primary_color, sidebar_theme, receipt_header)
    values (school_id, '#ef4444', 'dark', s_name);
    
    -- Create Trial Subscription (30 days)
    insert into public.subscriptions (school_id, plan_name, status, end_date)
    values (school_id, 'trial', 'active', now() + interval '30 days');
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
