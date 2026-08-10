-- 1. branches
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ALTER members
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_status_check;
ALTER TABLE members ADD CONSTRAINT members_status_check CHECK (status IN ('active', 'inactive', 'expired', 'blocked', 'frozen'));
ALTER TABLE members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE members ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
ALTER TABLE members ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;
ALTER TABLE members ADD COLUMN IF NOT EXISTS referral_source TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS blood_group TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS goal TEXT;

-- 3. membership_freezes
CREATE TABLE IF NOT EXISTS membership_freezes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    adjusted_days INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. membership_history
CREATE TABLE IF NOT EXISTS membership_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('created', 'renewed', 'cancelled', 'frozen', 'unfrozen', 'expired')),
    details JSONB DEFAULT '{}'::jsonb,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    duration_text TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. pt_plans
CREATE TABLE IF NOT EXISTS pt_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    duration_months INT DEFAULT 0,
    duration_days INT DEFAULT 0,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. trainers
CREATE TABLE IF NOT EXISTS trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    specialization TEXT,
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. pt_memberships
CREATE TABLE IF NOT EXISTS pt_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    pt_plan_id UUID NOT NULL REFERENCES pt_plans(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    original_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    final_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    due_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. batches
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
    description TEXT,
    max_capacity INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. batch_members
CREATE TABLE IF NOT EXISTS batch_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. body_measurements
CREATE TABLE IF NOT EXISTS body_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    measurement_date DATE DEFAULT CURRENT_DATE,
    weight NUMERIC(5,1),
    height NUMERIC(5,1),
    bmi NUMERIC(4,1),
    body_fat_percentage NUMERIC(4,1),
    chest NUMERIC(5,1),
    waist NUMERIC(5,1),
    hip NUMERIC(5,1),
    arm NUMERIC(5,1),
    thigh NUMERIC(5,1),
    custom_measurements JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. enquiries
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    source TEXT CHECK (source IN ('walk_in', 'phone', 'online', 'referral', 'social_media', 'other')),
    interested_plan TEXT,
    budget NUMERIC(10,2),
    notes TEXT,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    follow_up_date DATE,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'hot', 'warm', 'cold', 'follow_up', 'converted', 'lost')),
    converted_member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. enquiry_followups
CREATE TABLE IF NOT EXISTS enquiry_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
    notes TEXT,
    follow_up_date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. workout_plans
CREATE TABLE IF NOT EXISTS workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    goal TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 15. workout_plan_items
CREATE TABLE IF NOT EXISTS workout_plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    exercise_name TEXT NOT NULL,
    sets INT,
    reps INT,
    weight NUMERIC(5,1),
    duration_minutes INT,
    rest_seconds INT,
    notes TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 16. member_workout_plans
CREATE TABLE IF NOT EXISTS member_workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
    trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 17. member_custom_fields
CREATE TABLE IF NOT EXISTS member_custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'dropdown', 'boolean', 'textarea')),
    options JSONB,
    is_required BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(gym_id, field_name)
);

-- 18. invoice_items
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INT DEFAULT 1,
    unit_price NUMERIC(10,2),
    total NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 19. notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('expiry', 'payment_due', 'birthday', 'new_member', 'payment_received', 'pt_expiry', 'new_enquiry', 'expense_added')),
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 20. message_templates
CREATE TABLE IF NOT EXISTS message_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('birthday', 'expiry', 'renewal', 'payment_due', 'welcome', 'offer', 'custom')),
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(gym_id, name)
);

-- 21. activity_logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 22. expense_categories
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(gym_id, name)
);

-- 23. device_sessions
CREATE TABLE IF NOT EXISTS device_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    device_name TEXT,
    device_type TEXT,
    ip_address TEXT,
    user_agent TEXT,
    last_active TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 24. attendance_devices
CREATE TABLE IF NOT EXISTS attendance_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL CHECK (device_type IN ('manual', 'qr', 'biometric')),
    device_identifier TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    last_ping TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Apply Triggers
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT unnest(ARRAY[
            'branches', 'membership_freezes', 'membership_history', 'services', 'pt_plans', 
            'trainers', 'pt_memberships', 'batches', 'batch_members', 'body_measurements', 
            'enquiries', 'enquiry_followups', 'workout_plans', 'workout_plan_items', 
            'member_workout_plans', 'member_custom_fields', 'invoice_items', 'notifications', 
            'message_templates', 'activity_logs', 'expense_categories', 'device_sessions', 
            'attendance_devices'
        ])
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS set_updated_at ON %I;
            CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();
        ', t, t);
    END LOOP;
END;
$$;

-- Enable RLS and Create Policies
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT unnest(ARRAY[
            'branches', 'membership_freezes', 'membership_history', 'services', 'pt_plans', 
            'trainers', 'pt_memberships', 'batches', 'batch_members', 'body_measurements', 
            'enquiries', 'enquiry_followups', 'workout_plans', 'workout_plan_items', 
            'member_workout_plans', 'member_custom_fields', 'invoice_items', 'notifications', 
            'message_templates', 'activity_logs', 'expense_categories', 'device_sessions', 
            'attendance_devices'
        ])
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Gym users can access their gym data" ON %I;', t);
        EXECUTE format('
            CREATE POLICY "Gym users can access their gym data" ON %I
            FOR ALL
            USING (user_belongs_to_gym(gym_id));
        ', t);
    END LOOP;
END;
$$;

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_branches_gym_id ON branches(gym_id);
CREATE INDEX IF NOT EXISTS idx_branches_status ON branches(status);

CREATE INDEX IF NOT EXISTS idx_members_branch_id ON members(branch_id);

CREATE INDEX IF NOT EXISTS idx_membership_freezes_gym_id ON membership_freezes(gym_id);
CREATE INDEX IF NOT EXISTS idx_membership_freezes_member_id ON membership_freezes(member_id);
CREATE INDEX IF NOT EXISTS idx_membership_freezes_status ON membership_freezes(status);
CREATE INDEX IF NOT EXISTS idx_membership_freezes_dates ON membership_freezes(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_membership_history_gym_id ON membership_history(gym_id);
CREATE INDEX IF NOT EXISTS idx_membership_history_member_id ON membership_history(member_id);

CREATE INDEX IF NOT EXISTS idx_services_gym_id ON services(gym_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

CREATE INDEX IF NOT EXISTS idx_pt_plans_gym_id ON pt_plans(gym_id);
CREATE INDEX IF NOT EXISTS idx_pt_plans_status ON pt_plans(status);

CREATE INDEX IF NOT EXISTS idx_trainers_gym_id ON trainers(gym_id);
CREATE INDEX IF NOT EXISTS idx_trainers_status ON trainers(status);

CREATE INDEX IF NOT EXISTS idx_pt_memberships_gym_id ON pt_memberships(gym_id);
CREATE INDEX IF NOT EXISTS idx_pt_memberships_member_id ON pt_memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_pt_memberships_status ON pt_memberships(status);
CREATE INDEX IF NOT EXISTS idx_pt_memberships_dates ON pt_memberships(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_batches_gym_id ON batches(gym_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);

CREATE INDEX IF NOT EXISTS idx_batch_members_gym_id ON batch_members(gym_id);
CREATE INDEX IF NOT EXISTS idx_batch_members_member_id ON batch_members(member_id);

CREATE INDEX IF NOT EXISTS idx_body_measurements_gym_id ON body_measurements(gym_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_member_id ON body_measurements(member_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_date ON body_measurements(measurement_date);

CREATE INDEX IF NOT EXISTS idx_enquiries_gym_id ON enquiries(gym_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_date ON enquiries(follow_up_date);

CREATE INDEX IF NOT EXISTS idx_enquiry_followups_gym_id ON enquiry_followups(gym_id);
CREATE INDEX IF NOT EXISTS idx_enquiry_followups_enquiry_id ON enquiry_followups(enquiry_id);

CREATE INDEX IF NOT EXISTS idx_workout_plans_gym_id ON workout_plans(gym_id);

CREATE INDEX IF NOT EXISTS idx_workout_plan_items_gym_id ON workout_plan_items(gym_id);
CREATE INDEX IF NOT EXISTS idx_workout_plan_items_plan_id ON workout_plan_items(workout_plan_id);

CREATE INDEX IF NOT EXISTS idx_member_workout_plans_gym_id ON member_workout_plans(gym_id);
CREATE INDEX IF NOT EXISTS idx_member_workout_plans_member_id ON member_workout_plans(member_id);
CREATE INDEX IF NOT EXISTS idx_member_workout_plans_status ON member_workout_plans(status);

CREATE INDEX IF NOT EXISTS idx_member_custom_fields_gym_id ON member_custom_fields(gym_id);

CREATE INDEX IF NOT EXISTS idx_invoice_items_gym_id ON invoice_items(gym_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

CREATE INDEX IF NOT EXISTS idx_notifications_gym_id ON notifications(gym_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);

CREATE INDEX IF NOT EXISTS idx_message_templates_gym_id ON message_templates(gym_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_gym_id ON activity_logs(gym_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_expense_categories_gym_id ON expense_categories(gym_id);

CREATE INDEX IF NOT EXISTS idx_device_sessions_gym_id ON device_sessions(gym_id);
CREATE INDEX IF NOT EXISTS idx_device_sessions_user_id ON device_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_attendance_devices_gym_id ON attendance_devices(gym_id);
CREATE INDEX IF NOT EXISTS idx_attendance_devices_status ON attendance_devices(status);

-- Default Expense Categories
INSERT INTO expense_categories (gym_id, name, is_default) 
SELECT id, unnest(ARRAY['Rent','Electricity','Equipment','Maintenance','Salary','Marketing','Supplies','Other']), true 
FROM gyms 
ON CONFLICT DO NOTHING;
