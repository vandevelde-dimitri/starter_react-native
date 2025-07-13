// lib/AuthContext.tsx
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
    session: Session | null;
    loading: boolean;
}>({ session: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        };

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        getSession();

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
