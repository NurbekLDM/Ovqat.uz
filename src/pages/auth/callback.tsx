import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        router.push("/login?error=auth_callback_failed");
        return;
      }

      if (data.session) {
        // Login muvaffaqiyatli bo'lsa bosh sahifaga yo'naltirish
        router.push("/");
      } else {
        // Session yo'q bo'lsa login sahifasiga yo'naltirish
        router.push("/login");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🍽️ Ovqat.uz</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">
            Tizimga kirishni yakunlamoqda...
          </p>
        </div>
      </div>
    </div>
  );
}
