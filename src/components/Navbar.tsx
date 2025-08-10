import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="flex justify-between p-4 border-b">
      <Link href="/">Bugun Nima Yeymiz?</Link>
      {user ? (
        <button
          onClick={() => {
            import("@/lib/supabase").then(({ supabase }) => {
              supabase.auth.signOut();
            });
          }}
        >
          Chiqish
        </button>
      ) : (
        <Link href="/login">Kirish</Link>
      )}
    </nav>
  );
}
