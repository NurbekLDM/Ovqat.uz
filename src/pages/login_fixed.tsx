import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { user } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/"); // Login bo'lgan bo'lsa bosh sahifaga yuboriladi
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("Xatolik: " + error.message);
    } else {
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      alert("Google orqali kirishda xatolik: " + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Tizimga kirish</h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Parol"
        className="border p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">
        Kirish
      </button>
      <p className="text-center text-sm text-gray-500">Yoki</p>
      <hr />

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 w-full"
      >
        Google orqali kirish
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Hisobingiz yo&apos;qmi?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Ro&apos;yxatdan o&apos;tish
        </Link>
      </p>
    </form>
  );
}
