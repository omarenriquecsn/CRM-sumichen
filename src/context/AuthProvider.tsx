import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import { UserData } from "./types";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  supabase.auth.getSession().then((session) => {
    if (session.data.session) {
      setCurrentUser(session.data.session.user);
      setSession(session.data.session);
    }
  });
}, []);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("vendedores")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw new Error(`Error fetching user data: ${error.message}`);
      }

      if (!data) {
        throw new Error(`No user data found for userId: ${userId}`);
      }

      const { data: user } = await supabase.auth.getUser();
      console.log(user.user?.email);

      return {
        id: data.id,
        email: user.user?.email || "",
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
        activo: data.activo,
        telefono: data.telefono,
        avatar: user.user?.user_metadata?.avatar_url || "",
      };
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      throw error;
    }
  }, []);

  const refreshUserData = async () => {
    try {
      if (!currentUser) {
        setUserData(null);
        toast.error("Usuario no logueado");
        window.location.href = "/login";
        return;
      }
      const data = await fetchUserData(currentUser?.id);
      setUserData(data);
    } catch (error) {
      console.error(error);
      setUserData(null);
    }
  };

 
useEffect(() => {
  const fetchSession = async () => {
    try {
      const session = await supabase.auth.getSession();
      if (session) {
        setSession(session.data.session);
        localStorage.setItem('supabase_session', JSON.stringify(session.data.session));
      } else {
        await supabase.auth.refreshSession();
        const newSession = await supabase.auth.getSession();
        if (newSession) {
          setSession(newSession.data.session);
          localStorage.setItem('supabase_session', JSON.stringify(newSession.data.session));
        }
      }
    } catch (error) {
      console.error(error);
      setTimeout(fetchSession, 1000); // Reintenta establecer la sesión después de 1 segundo
    }
  };
  fetchSession();
}, []);

  useEffect(() => {
    const fetchInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        const data = await fetchUserData(session.user.id);
        setUserData(data);
      }
      setLoading(false);
    };

    fetchInitialSession();

    const authSubscription = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setCurrentUser(session?.user ?? null);

        if (session?.user) {
          const data = await fetchUserData(session.user.id);
          setUserData(data);
        } else {
          setUserData(null);
        }

        setLoading(false);
      }
    );

    return () => authSubscription.data.subscription.unsubscribe();
  }, [fetchUserData]);

  const COLUMNAS_VENDEDOR = {
    ID: "id",
    NOMBRE: "nombre",
    APELLIDO: "apellido",
    ROL: "rol",
  };

  const crearPerfilVendedor = async (userData: {
    id: string;
    nombre: string;
    apellido: string;
    rol?: string;
  }) => {
    const { error: profileError } = await supabase.from("vendedores").insert({
      [COLUMNAS_VENDEDOR.ID]: userData.id,
      [COLUMNAS_VENDEDOR.NOMBRE]: userData.nombre,
      [COLUMNAS_VENDEDOR.APELLIDO]: userData.apellido,
      [COLUMNAS_VENDEDOR.ROL]: userData.rol || "vendedor",
    });

    if (profileError) {
      console.error("Error creando perfil:", profileError);
      throw profileError;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: { nombre: string; apellido: string; rol?: string }
  ) => {
    try {
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

      if (data.user) {
        await crearPerfilVendedor({ ...userData, id: data.user.id });
      }

      return data;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // If the sign in is successful, you can set the current user and session here
      setCurrentUser(data.user);
      setSession(data.session);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
   
      console.log(supabase.auth);
      const session = supabase.auth.getSession();
      if (!session) {
        console.warn("No hay sesión activa");
      } else {
        await supabase.auth.signOut();
      }
      localStorage.removeItem("sb-syaiyhcnqhhzdhmifynh-auth-token");
      setCurrentUser(null);
      setSession(null);
      setUserData(null);
      setLoading(true);
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
