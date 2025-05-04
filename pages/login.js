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

  // Tangani callback magic link / OAuth
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session) {
        router.replace("/"); // sukses login → beranda
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // jika success, listener di useEffect akan redirect
  };

  return (
    <div className="relative h-screen w-screen flex justify-center items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${dogWallpaper.src})` }}
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Title */}
      <h1 className="absolute top-10 text-3xl md:text-4xl font-bold text-white text-center">
        Selamat Datang di <br />
        <span className="text-yellow-300">PawTrip PetShop</span> 🐾
      </h1>

      {/* Form */}
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
