'use client';

import { supabase } from "@/context/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href ='/login';
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error verifying authentication:', error);
        window.location.href ='/login';
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        window.location.href ='/login';
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}