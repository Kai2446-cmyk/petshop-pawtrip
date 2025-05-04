import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import CartIcon from "../public/img/cart.png";
import DropdownProfile from "./DropdownProfile";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, role")
          .eq("id", user.id)
          .single();

        if (!error) {
          setProfile(profileData);
          fetchCartCount(user.id);
        }
      }
    };

    fetchUserAndProfile();
  }, []);

  const fetchCartCount = async (userId) => {
    const { data, error } = await supabase
      .from("cart")
      .select("id")
      .eq("user_id", userId);
    if (!error && data) {
      setCartCount(data.length);
    }
  };

  return (
    <header className="py-6 w-full left-0 bg-white shadow-md relative z-50">
      <div className="container mx-auto flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 items-center justify-between px-6">
        
        {/* Logo + Nav */}
        <div className="flex items-center gap-x-10">
          <Link 
            href="/" 
            className="text-3xl lg:text-4xl font-bold text-orange-800 hover:text-orange-500 transition-all whitespace-nowrap"
          >
            PawTrip
          </Link>

          <nav className="text-xl lg:text-lg flex gap-x-8 text-gray-700">
            <Link href="/products" className="hover:text-orange-500 transition-all">Products</Link>
            <Link href="/pets" className="hover:text-orange-500 transition-all">Pets</Link>
            <Link href="/services" className="hover:text-orange-500 transition-all">Services</Link>
            <Link href="/about" className="hover:text-orange-500 transition-all">About</Link>
            <Link href="/blog" className="hover:text-orange-500 transition-all">Blog</Link>
            <Link href="/contact" className="hover:text-orange-500 transition-all">Contact</Link>
          </nav>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-x-4 ml-auto">
          {/* Cart */}
          {user && (
            <Link href="/cart" className="relative">
              <Image src={CartIcon} alt="Cart" width={28} height={28} className="cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Login / Dropdown Profile */}
          {!user ? (
            <Link href="/login">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                Login
              </button>
            </Link>
          ) : (
            <DropdownProfile profileImage={profile?.avatar_url} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
