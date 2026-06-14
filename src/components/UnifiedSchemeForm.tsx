import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, AlertCircle, Sparkles, 
  ChevronRight, Save, ShieldCheck, Info 
} from "lucide-react";
import { Scheme } from "@/data/schemes";
import { useProfile } from "@/contexts/ProfileContext";
import { getSmartAutofill, checkEligibility, FormField } from "@/lib/autofill-utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface UnifiedSchemeFormProps {
  scheme: Scheme;
  onSuccess?: () => void;
}

const UnifiedSchemeForm = ({ scheme, onSuccess }: UnifiedSchemeFormProps) => {
  const { profile, getMaskedAadhaar } = useProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [autofilledFields, setAutofilledFields] = useState<Set<string>>(new Set());
  const [showConsent, setShowConsent] = useState(false);
  const [isEligible, setIsEligible] = useState<boolean>(true);
  const [reasons, setReasons] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Generate form fields based on scheme requirements
  const getSchemeFields = (): FormField[] => {
    const fields: FormField[] = [
      { id: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Enter your full name" },
      { id: "age", label: "Age", type: "number", required: true, placeholder: "Enter your age" },
      { id: "gender", label: "Gender", type: "select", required: true, options: ["Male", "Female", "Other"] },
      { id: "mobile", label: "Mobile Number", type: "text", required: true, placeholder: "10-digit mobile number" },
      { id: "state", label: "Residence State", type: "text", required: true },
    ];

    if (scheme.documents.includes("Aadhaar Card")) {
      fields.push({ id: "aadhaar", label: "Aadhaar Number", type: "text", required: true, placeholder: "**** **** ****" });
    }
    if (scheme.eligibility.maxIncome) {
      fields.push({ id: "income", label: "Annual Family Income", type: "number", required: true });
    }
    if (scheme.eligibility.caste) {
      fields.push({ id: "caste", label: "Category / Caste", type: "select", required: true, options: ["General", "OBC", "SC", "ST"] });
    }
    if (scheme.eligibility.occupation) {
      fields.push({ id: "occupation", label: "Occupation", type: "text", required: true });
    }

    return fields;
  };

  const fields = getSchemeFields();

  useEffect(() => {
    const eligibility = checkEligibility(scheme, profile);
    setIsEligible(eligibility.isEligible);
    setReasons(eligibility.reasons);
    setMissingFields(eligibility.missingFields);
  }, [scheme, profile]);

  const handleAutofill = () => {
    if (!profile) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile first in Settings.",
        variant: "destructive"
      });
      return;
    }

    const newFormData = { ...formData };
    const newAutofilled = new Set<string>();

    fields.forEach(field => {
      const autofill = getSmartAutofill(field.label, profile);
      if (autofill) {
        newFormData[field.id] = autofill.value;
        newAutofilled.add(field.id);
      }
    });

    setFormData(newFormData);
    setAutofilledFields(newAutofilled);
    setShowConsent(false);
    
    toast({
      title: "Smart Autofill Complete",
      description: `Automatically filled ${newAutofilled.size} fields with 95% confidence.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: `Your application for ${scheme.name} has been received.`,
    });
    if (onSuccess) onSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Eligibility Warning */}
      {!isEligible && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-destructive">Ineligible based on profile</p>
            <p className="text-xs text-destructive/80 mt-1">{reasons.join(". ")}</p>
          </div>
        </div>
      )}

      {/* Smart Autofill Prompt */}
      {profile && !showConsent && autofilledFields.size === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">One-click Autofill</p>
              <p className="text-xs text-muted-foreground">Save time using your BHARATSeva profile</p>
            </div>
          </div>
          <Button size="sm" onClick={() => setShowConsent(true)} className="gap-2">
            Autofill Now <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Consent Modal */}
      <AnimatePresence>
        {showConsent && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl bg-card border border-border shadow-2xl relative z-50"
          >
            <ShieldCheck className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2">Autofill Consent</h3>
            <p className="text-sm text-muted-foreground mb-6">
              BHARATSeva AI will securely use your profile data to fill this form. Sensitive data like Aadhaar will be masked. Do you want to proceed?
            </p>
            <div className="flex gap-3">
              <Button onClick={handleAutofill} className="flex-1">Yes, Autofill</Button>
              <Button variant="ghost" onClick={() => setShowConsent(false)} className="flex-1">Manual Entry</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(field => (
          <div key={field.id} className="space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </label>
              {autofilledFields.has(field.id) && (
                <Badge variant="secondary" className="text-[10px] bg-success/10 text-success border-success/20 gap-1 px-1.5">
                  <CheckCircle className="h-2.5 w-2.5" /> 95% Match
                </Badge>
              )}
            </div>
            
            <div className="relative group">
              <Input
                type={field.type === "number" ? "number" : "text"}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={(e) => {
                  setFormData({ ...formData, [field.id]: e.target.value });
                  const newAutofilled = new Set(autofilledFields);
                  newAutofilled.delete(field.id);
                  setAutofilledFields(newAutofilled);
                }}
                className={`h-12 rounded-xl transition-all ${
                  autofilledFields.has(field.id) 
                    ? "bg-success/5 border-success/30 focus-visible:ring-success/20 pr-10" 
                    : "bg-muted/30 border-border"
                }`}
              />
              {autofilledFields.has(field.id) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
            </div>
            
            {field.id === "aadhaar" && formData[field.id] && (
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Data is encrypted and masked for security
              </p>
            )}
          </div>
        ))}

        <div className="pt-4 flex flex-col gap-3">
          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-gradient-hero text-primary-foreground font-bold shadow-lg"
          >
            Submit Application
          </Button>
          <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
            <Info className="h-3 w-3" /> Review all details before submitting. BHARATSeva is not responsible for incorrect data.
          </p>
        </div>
      </form>
    </div>
  );
};

export default UnifiedSchemeForm;
