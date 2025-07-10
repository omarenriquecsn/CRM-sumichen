import { User, Session } from '@supabase/supabase-js';

export interface UserData {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'vendedor' | 'admin';
  activo: boolean;
  telefono?: string;
  avatar?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { nombre: string; apellido: string; rol?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}