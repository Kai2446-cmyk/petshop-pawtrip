import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Image from "next/image";
import dogWallpaper from "../public/dog-wallpaper.png";
import googleIcon from "../public/google-icon.png";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isProfileIncomplete = (profile) => {
    const incomplete =
      !profile ||
      !profile.full_name?.trim() ||
      !profile.address?.trim() ||
      !profile.phone?.trim() ||
      !profile.role?.trim() ||
      !profile.avatar_url?.trim();

    console.log("📦 Profile:", profile);
    console.log("❗ Is profile incomplete?", incomplete);
    return incomplete;
  };

  const checkAndRedirect = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, address, phone, role, avatar_url")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("⚠️ Gagal ambil profil:", error.message);
        router.replace("/complete-profile");
        return;
      }

      if (isProfileIncomplete(profile)) {
        router.replace("/complete-profile");
      } else {
        router.replace("/");
      }
    } catch (err) {
      console.error("🔥 Error saat checkAndRedirect:", err);
      router.replace("/complete-profile");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (user?.id) {
      await checkAndRedirect(user.id);
    } else {
      setError("Gagal mengambil data user.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user?.id) {
          await checkAndRedirect(session.user.id);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="relative h-screen w-screen flex justify-center items-center">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${dogWallpaper.src})` }}
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <h1 className="absolute top-10 text-3xl md:text-4xl font-bold text-white text-center">
        Selamat Datang di <br />
        <span className="text-yellow-300">PawTrip PetShop</span> 🐾
      </h1>

      <div className="relative z-10 bg-[#BDA697] bg-opacity-95 p-8 rounded-2xl shadow-lg w-[400px] text-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full rounded-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full rounded-full"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-3 w-full rounded-full mt-2"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Belum memiliki akun?{" "}
          <span
            className="text-yellow-400 cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Daftar
          </span>
        </p>

        <div
          className="flex items-center justify-center mt-4 border rounded-full p-3 cursor-pointer"
          onClick={() => alert("Google Sign In coming soon!")}
        >
          <Image src={googleIcon} alt="Google" width={30} height={30} />
          <span className="ml-2">Sign in with Google</span>
        </div>
      </div>
    </div>
  );
}
