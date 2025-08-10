import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";

interface AuthProps {
  children: React.ReactNode;
}

const Auth = ({ children }: AuthProps) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p className="text-center mt-10">Yuklanmoqda...</p>;
  }

  return <>{children}</>;
};

export default Auth;
