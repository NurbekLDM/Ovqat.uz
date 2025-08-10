import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Email orqali tasdiqlash linki yuborildi!");
      router.push("/login");
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error.message);
  };

  return (
    <form onSubmit={handleSignup} className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Ro‘yxatdan o‘tish</h2>

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

      <button type="submit" className="bg-green-500 text-white px-4 py-2 w-full">
        Ro‘yxatdan o‘tish
      </button>

      <hr />

      <button
        type="button"
        onClick={handleGoogleSignup}
        className="bg-red-500 text-white px-4 py-2 w-full"
      >
        Google orqali kirish
      </button>
      <p className="text-center text-sm text-gray-500">
        Yoki
      </p>
      <p className="text-center text-sm text-blue-500 cursor-pointer" onClick={() => router.push("/login")}>
        Tizimga kirish
      </p>
    </form>
  );
}
