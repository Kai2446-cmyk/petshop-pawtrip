// pages/_app.js
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ChatWidget from '../components/ChatWidget';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter(); // inisialisasi router untuk akses path
  const isAdminRoute = router.pathname.startsWith("/admin"); // cek apakah path admin

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
      {user && !isAdminRoute && <ChatWidget user={user} />} {/* Tampilkan ChatWidget hanya jika bukan di halaman admin */}
    </>
  );
}

export default MyApp;
