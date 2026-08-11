-- Fix for infinite recursion (42P17) in RLS policies

-- 1. First, we need to drop the problematic policies
DROP POLICY IF EXISTS "Users can view gym profiles" ON public.profiles;
DROP POLICY IF EXISTS "Owner can manage gym profiles" ON public.profiles;

-- 2. Instead of querying `public.profiles` recursively, we should rely on the `gym_id` 
-- that is stored in the JWT claims if possible, OR use a SECURITY DEFINER function 
-- that bypasses RLS to check gym membership.

-- Create a SECURITY DEFINER function to get the user's gym_id without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_gym_id()
RETURNS UUID AS $$
DECLARE
  v_gym_id UUID;
BEGIN
  SELECT gym_id INTO v_gym_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
  RETURN v_gym_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Recreate the policies using the new function
CREATE POLICY "Users can view gym profiles"
  ON public.profiles FOR SELECT
  USING (
    gym_id = public.get_user_gym_id()
  );

CREATE POLICY "Owner can manage gym profiles"
  ON public.profiles FOR ALL
  USING (
    gym_id IN (
      SELECT id FROM public.gyms WHERE owner_id = auth.uid()
    )
  );

-- 4. Fix user_belongs_to_gym to also use the secure function to prevent recursion
CREATE OR REPLACE FUNCTION public.user_belongs_to_gym(check_gym_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN check_gym_id = public.get_user_gym_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
