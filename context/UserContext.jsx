import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    if (!user && !session) {
      fetchInitialSession();
    }
  }, []);

  const fetchInitialSession = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user);
      if (session?.user) {
        await getProfile(session.user.id);
      }
    } catch (error) {
      console.error("Error initializing session and profile", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      const { session, user } = data;
      setSession(session);
      setUser(user);

      if (user) {
        await getProfile(user.id);
      }
    } catch (error) {
      console.error("Exception during login", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    let authError = null;

    // User exists, but is fake. See https://supabase.com/docs/reference/javascript/auth-signup
    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      authError = {
        name: "AuthApiError",
        message: "User already exists",
      };
    } else if (error) {
      authError = {
        name: error.name,
        message: error.message,
      };
    }
    setLoading(false);
    return { auth: data, error: authError };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error.message);
    }
  };

  const getProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("profile_completed, avatar_url, first_name, last_name")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setUserProfile(data);
        setProfileCompleted(data.profile_completed);
      }
    } catch (error) {
      console.error("Error fetching profile", error.message);
    }
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: session.user.id,
        ...updates,
        updated_at: new Date(),
      });

      if (error) throw error;

      setProfileCompleted(true);
    } catch (error) {
      console.error("Error updating profile", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryList = async () => {
    setLoading(true);
    try {
      const userEmail = session.user.email;
      const { data, error } = await supabase
        .from("category")
        .select(`*`)
        .eq("created_by", userEmail);

      if (error) throw error;

      setCategoryList(data);
      console.log("CategoryList fetched:", data);
    } catch (error) {
      console.error("Error fetching CategoryList:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        loading,
        user,
        userProfile,
        session,
        profileCompleted,
        setProfileCompleted,
        categoryList,
        signIn,
        signUp,
        signOut,
        getProfile,
        updateProfile,
        getCategoryList,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
