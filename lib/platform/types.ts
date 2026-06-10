export type UserRole = "client" | "admin";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  company: string | null;
  trip_interest: string | null;
  role: UserRole;
  created_at: string;
};

export type AiSettings = {
  id: boolean;
  monthly_credits: number;
  remaining_credits: number;
  updated_at: string;
};
