import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Image from "next/image";
import dogWallpaper2 from "../public/dog-wallpaper2.png";
import googleIcon from "../public/google-icon.png";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signUp(
      { email, password },
      {
        options: {
          // setelah verifikasi, user akan diarahkan ke /login di production
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        },
      }
    );

    if (error) {
      setError(error.message);
    } else {
      setMessage("Cek email Anda untuk verifikasi. Setelah konfirmasi, silakan login.");
    }

    setLoading(false);
  };

  return (
    <div className="relative h-screen w-screen flex justify-center items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url(${dogWallpaper2.src})`,
          }}
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Title */}
      <h1 className="absolute top-10 text-3xl md:text-4xl font-bold text-white text-center">
        Segera Daftarkan Akun di <br />
        <span className="text-yellow-300">PawTrip PetShop</span> 🐾
      </h1>

      {/* Form */}
      <div className="relative z-10 bg-[#BDA697] bg-opacity-95 p-8 rounded-2xl shadow-lg w-[400px] text-center">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}

        <form onSubmit={handleRegister} className="space-y-4 mt-4">
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
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Sudah punya akun?{" "}
          <span
            className="text-yellow-400 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>

        <div
          className="flex items-center justify-center mt-4 border rounded-full p-3 cursor-pointer"
          onClick={() => alert("Google Sign Up coming soon!")}
        >
          <Image src={googleIcon} alt="Google" width={30} height={30} />
          <span className="ml-2">Sign up with Google</span>
        </div>
      </div>
    </div>
  );
}
