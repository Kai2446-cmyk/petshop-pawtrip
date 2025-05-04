// lib/profile.js
import { supabase } from './supabase';

// ✅ CREATE or UPDATE profile setelah signup
export async function createProfile({ full_name, address, phone, role = 'user', avatar_url = null }) {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Gagal mendapatkan user:", authError);
    return { error: authError };
  }

  const { error } = await supabase.from('profiles').upsert([
    {
      id: user.id,
      full_name,
      address,
      phone,
      role,
      avatar_url
    }
  ]);

  if (error) {
    console.error("Gagal membuat profil:", error);
    return { error };
  }

  return { success: true };
}

// ✅ GET profil user yang sedang login
export async function getCurrentProfile() {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Gagal mendapatkan user:", authError);
    return { error: authError };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Gagal mengambil profil:", error);
    return { error };
  }

  return { profile: data };
}

// ✅ UPDATE profil user
export async function updateProfile({ full_name, address, phone, avatar_url }) {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) return { error: authError };

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, address, phone, avatar_url })
    .eq('id', user.id);

  if (error) return { error };

  return { success: true };
}
