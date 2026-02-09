
-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance status enum
CREATE TYPE public.attendance_status AS ENUM ('Present', 'Absent');

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status public.attendance_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Create index for faster lookups
CREATE INDEX idx_attendance_employee_id ON public.attendance(employee_id);
CREATE INDEX idx_attendance_date ON public.attendance(date);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Public access policies (single admin, no auth)
CREATE POLICY "Allow all access to employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
