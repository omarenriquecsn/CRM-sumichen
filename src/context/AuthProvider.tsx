import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import { UserData } from "./types";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("vendedores")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user data:", error);
        return null;
      }

      if (!data) {
        console.warn("No user data found for userId:", userId);
        return null;
      }

      const userSesion = await supabase.auth.getUser();
      const user: User | null = userSesion.data.user;

      return {
        id: data.id,
        email: user?.email || "",
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
        activo: data.activo,
        telefono: data.telefono,
        avatar: user?.user_metadata?.avatar_url || "",
      };
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      return null;
    }
  }, []);

  const refreshUserData = async () => {
    if (currentUser) {
      const data = await fetchUserData(currentUser.id);
      setUserData(data);
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id).then(setUserData);
      }
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);

      if (session?.user) {
        const data = await fetchUserData(session.user.id);
        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signUp = async (
    email: string,
    password: string,
    userData: { nombre: string; apellido: string; rol?: string }
  ): Promise<{ user: User | null; session: Session | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre: userData.nombre,
          apellido: userData.apellido,
          rol: userData.rol || "vendedor",
        },
      },
    });

    if (error) {
      throw error;
    }

    // Si el usuario se crea exitosamente, crear el perfil en la tabla vendedores
    if (data.user) {
      const { error: profileError } = await supabase.from("vendedores").insert({
        id: data.user.id,
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: (userData.rol as "vendedor" | "admin") || "vendedor",
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        throw profileError;
      }
    }

    // Return the user and session
    return { user: data.user, session: data.session };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    localStorage.removeItem("sb-syaiyhcnqhhzdhmifynh-auth-token");
    setCurrentUser(null);
    setSession(null);
    setUserData(null);
    setLoading(true);
    window.location.href = "/login";
  };

  const value = {
    currentUser,
    session,
    userData,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
