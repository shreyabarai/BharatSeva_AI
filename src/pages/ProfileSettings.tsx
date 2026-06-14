import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Calendar, Phone, Mail, MapPin, 
  CreditCard, Wallet, Briefcase, AlertTriangle, Save,
  ArrowLeft
} from "lucide-react";
import { useProfile, UserProfile } from "@/contexts/ProfileContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { indianStates } from "@/data/schemes";

const ProfileSettings = () => {
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile || {
    fullName: "",
    dob: "",
    age: 0,
    gender: "",
    mobile: "",
    email: "",
    address: { state: "", district: "", pin: "" },
    aadhaar: "",
    incomeRange: 0,
    casteCategory: "",
    occupation: "",
    disabilityStatus: false,
  });

  const handleSave = async () => {
    await updateProfile(formData);
    toast({
      title: "Profile Updated",
      description: "Your information has been saved for future autofills.",
    });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="mx-auto max-w-2xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg">My Profile</h1>
          </div>
          <Button size="sm" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
            <User className="h-4 w-4" /> Personal Details
          </div>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Full Name</label>
              <Input 
                value={formData.fullName} 
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                placeholder="As per Aadhaar" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Age</label>
                <Input 
                  type="number" 
                  value={formData.age} 
                  onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Gender</label>
                <select 
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
            <Phone className="h-4 w-4" /> Contact & Address
          </div>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Mobile Number</label>
              <Input 
                value={formData.mobile} 
                onChange={e => setFormData({...formData, mobile: e.target.value})}
                placeholder="10-digit number" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">State</label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.address?.state}
                onChange={e => setFormData({
                  ...formData, 
                  address: { ...formData.address!, state: e.target.value }
                })}
              >
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
            <Wallet className="h-4 w-4" /> Eligibility Data
          </div>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Annual Family Income</label>
              <Input 
                type="number" 
                value={formData.incomeRange} 
                onChange={e => setFormData({...formData, incomeRange: parseInt(e.target.value)})}
                placeholder="₹ Yearly" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Category (Caste)</label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.casteCategory}
                onChange={e => setFormData({...formData, casteCategory: e.target.value})}
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Aadhaar Number (Optional)</label>
              <Input 
                value={formData.aadhaar} 
                onChange={e => setFormData({...formData, aadhaar: e.target.value})}
                placeholder="12-digit number" 
              />
              <p className="text-[10px] text-muted-foreground italic">Your Aadhaar is stored locally and masked for security.</p>
            </div>
          </div>
        </section>

        <div className="p-4 rounded-xl bg-muted/50 border border-border flex gap-3 items-start">
          <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ensure all details match your official documents. Incorrect information may lead to rejection of government applications.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
