import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";

export interface UserProfile {
  fullName: string;
  dob: string;
  age: number;
  gender: string;
  mobile: string;
  email: string;
  address: {
    state: string;
    district: string;
    pin: string;
  };
  aadhaar?: string; // Masked for display
  incomeRange: number;
  casteCategory: string;
  occupation: string;
  disabilityStatus: boolean;
  disabilityDetails?: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  getMaskedAadhaar: () => string;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      const userId = user?.uid || "guest";
      const savedProfile = localStorage.getItem(`user_profile_extended_${userId}`);
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error("Failed to parse extended profile", e);
        }
      } else {
        // Fallback to basic profile if exists
        const basicProfile = localStorage.getItem(`user_profile_${userId}`);
        if (basicProfile) {
          try {
            const basic = JSON.parse(basicProfile);
            setProfile({
              fullName: user?.displayName || "",
              email: user?.email || "",
              age: basic.age || 0,
              gender: basic.gender || "",
              incomeRange: basic.income || 0,
              state: basic.state || "",
              occupation: basic.occupation || "",
              dob: "",
              mobile: "",
              address: { state: basic.state || "", district: "", pin: "" },
              casteCategory: basic.caste || "",
              disabilityStatus: false,
            } as UserProfile);
          } catch (e) {}
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    const userId = user?.uid || "guest";
    const newProfile = { ...profile, ...data } as UserProfile;
    setProfile(newProfile);
    localStorage.setItem(`user_profile_extended_${userId}`, JSON.stringify(newProfile));
    
    // Sync with basic profile for chatbot compatibility
    localStorage.setItem(`user_profile_${userId}`, JSON.stringify({
      age: newProfile.age,
      gender: newProfile.gender,
      income: newProfile.incomeRange,
      state: newProfile.address.state,
      occupation: newProfile.occupation,
      caste: newProfile.casteCategory
    }));
  };

  const getMaskedAadhaar = useCallback(() => {
    if (!profile?.aadhaar) return "";
    const clean = profile.aadhaar.replace(/\s/g, "");
    if (clean.length < 12) return profile.aadhaar;
    return "**** **** " + clean.slice(-4);
  }, [profile?.aadhaar]);

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile, getMaskedAadhaar }}>
      {children}
    </ProfileContext.Provider>
  );
};
