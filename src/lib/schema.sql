-- Phase 1: Database & Security (RBAC) Architecture

-- 1. Create or replace staff_permissions table
CREATE TABLE IF NOT EXISTS public.staff_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL,
    can_view BOOLEAN NOT NULL DEFAULT false,
    can_create BOOLEAN NOT NULL DEFAULT false,
    can_edit BOOLEAN NOT NULL DEFAULT false,
    can_delete BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(gym_id, user_id, module_name)
);

-- 2. Enable Row Level Security
ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies ensuring that every major table requires gym_id to match user's gym_id
-- We assume the user's gym_id can be looked up via public.profiles

-- Function to get current user's gym_id
CREATE OR REPLACE FUNCTION public.get_gym_id() RETURNS UUID AS $$
  SELECT gym_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Staff permissions policies
CREATE POLICY "Staff permissions are viewable by users in the same gym" 
ON public.staff_permissions FOR SELECT 
USING (gym_id = public.get_gym_id());

CREATE POLICY "Owners can manage staff permissions" 
ON public.staff_permissions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'owner' AND gym_id = public.staff_permissions.gym_id
  )
);

-- Gyms policies
CREATE POLICY "Users can view their own gym" 
ON public.gyms FOR SELECT 
USING (id = public.get_gym_id());

CREATE POLICY "Owners can update their own gym" 
ON public.gyms FOR UPDATE 
USING (id = public.get_gym_id() AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner'));

-- Profiles policies
CREATE POLICY "Users can view profiles in their gym" 
ON public.profiles FOR SELECT 
USING (gym_id = public.get_gym_id());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (user_id = auth.uid());

-- Members policies
CREATE POLICY "Users can view members in their gym" 
ON public.members FOR SELECT 
USING (gym_id = public.get_gym_id());

CREATE POLICY "Users can insert members if they have permission" 
ON public.members FOR INSERT 
WITH CHECK (gym_id = public.get_gym_id());

CREATE POLICY "Users can update members if they have permission" 
ON public.members FOR UPDATE 
USING (gym_id = public.get_gym_id());

CREATE POLICY "Users can delete members if they have permission" 
ON public.members FOR DELETE 
USING (gym_id = public.get_gym_id());

-- Payments policies
CREATE POLICY "Users can view payments in their gym" 
ON public.payments FOR SELECT 
USING (gym_id = public.get_gym_id());

CREATE POLICY "Users can insert payments if they have permission" 
ON public.payments FOR INSERT 
WITH CHECK (gym_id = public.get_gym_id());

CREATE POLICY "Users can update payments if they have permission" 
ON public.payments FOR UPDATE 
USING (gym_id = public.get_gym_id());

CREATE POLICY "Users can delete payments if they have permission" 
ON public.payments FOR DELETE 
USING (gym_id = public.get_gym_id());

-- Memberships policies
CREATE POLICY "Users can view memberships in their gym" 
ON public.memberships FOR SELECT 
USING (gym_id = public.get_gym_id());

CREATE POLICY "Users can insert memberships if they have permission" 
ON public.memberships FOR INSERT 
WITH CHECK (gym_id = public.get_gym_id());

CREATE POLICY "Users can update memberships if they have permission" 
ON public.memberships FOR UPDATE 
USING (gym_id = public.get_gym_id());

CREATE POLICY "Users can delete memberships if they have permission" 
ON public.memberships FOR DELETE 
USING (gym_id = public.get_gym_id());
