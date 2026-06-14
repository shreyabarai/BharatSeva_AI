import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { indianStates, Scheme } from "@/data/schemes";
import { toast } from "sonner";
import { useLang } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { getSmartAutofill } from "@/lib/autofill-utils";
import { motion, AnimatePresence } from "framer-motion";

interface SchemeApplicationDialogProps {
  scheme: Scheme | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SchemeApplicationDialog = ({ scheme, open, onOpenChange }: SchemeApplicationDialogProps) => {
  const { t, lang } = useLang();
  const { profile } = useProfile();
  
  const occupations = [
    { value: "farmer", label: t("farmer") },
    { value: "student", label: t("student") },
    { value: "self-employed", label: t("selfEmployed") },
    { value: "business", label: t("businessOwner") },
    { value: "salaried", label: t("salaried") },
    { value: "unemployed", label: t("unemployed") },
    { value: "retired", label: t("retired") },
    { value: "homemaker", label: t("homemaker") },
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    state: "",
    occupation: "",
  });
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [autofilledFields, setAutofilledFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFormData({ fullName: "", phone: "", state: "", occupation: "" });
        setIsSubmitted(false);
        setAutofilledFields(new Set());
      }, 300);
    }
  }, [open]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newAutofilled = new Set(autofilledFields);
    newAutofilled.delete(field);
    setAutofilledFields(newAutofilled);
  };

  const handleAutofill = () => {
    if (!profile) {
      toast.error("Please complete your profile first");
      return;
    }

    const newFormData = { ...formData };
    const newAutofilled = new Set<string>();

    const mapping = [
      { key: "fullName", label: "Full Name" },
      { key: "phone", label: "Mobile Number" },
      { key: "state", label: "State" },
      { key: "occupation", label: "Occupation" },
    ];

    mapping.forEach(m => {
      const result = getSmartAutofill(m.label, profile);
      if (result) {
        (newFormData as any)[m.key] = String(result.value);
        newAutofilled.add(m.key);
      }
    });

    setFormData(newFormData);
    setAutofilledFields(newAutofilled);
    toast.success(`Smart Autofill applied (${newAutofilled.size} fields)`);
  };

  const handleSpeechResult = (text: string) => {
    if (!activeField) return;

    if (activeField === "phone") {
      const digits = text.replace(/[^0-9]/g, "");
      if (digits) updateField(activeField, digits);
    } else {
      updateField(activeField, text);
    }
    setActiveField(null);
  };

  const { isListening, startListening, stopListening } = useSpeechToText(handleSpeechResult);

  const toggleVoice = (field: string) => {
    if (isListening && activeField === field) {
      stopListening();
      setActiveField(null);
    } else {
      setActiveField(field);
      startListening();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast.success(t("applicationReceived"));
  };

  if (!scheme) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t("applicationReceived")}</h3>
              <p className="text-muted-foreground mt-2">
                {t("applicationSuccess")}
              </p>
            </div>
            <Button onClick={() => onOpenChange(false)} className="mt-4">{t("close")}</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("quickApplication")}</DialogTitle>
              <DialogDescription>
                {t("applyDesc")} <strong>{scheme.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            {/* Autofill Button */}
            {profile && autofilledFields.size === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Use saved profile data?</span>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={handleAutofill}>
                  Autofill
                </Button>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {t("fullName")}
                    {autofilledFields.has("fullName") && <CheckCircle2 className="h-3 w-3 text-success" />}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 ${isListening && activeField === "fullName" ? "text-destructive" : "text-muted-foreground"}`}
                    onClick={() => toggleVoice("fullName")}
                  >
                    {isListening && activeField === "fullName" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </Label>
                <Input
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className={autofilledFields.has("fullName") ? "border-success/50 bg-success/5" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {t("phone")}
                    {autofilledFields.has("phone") && <CheckCircle2 className="h-3 w-3 text-success" />}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 ${isListening && activeField === "phone" ? "text-destructive" : "text-muted-foreground"}`}
                    onClick={() => toggleVoice("phone")}
                  >
                    {isListening && activeField === "phone" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </Label>
                <Input
                  required
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={autofilledFields.has("phone") ? "border-success/50 bg-success/5" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {t("state")}
                  {autofilledFields.has("state") && <CheckCircle2 className="h-3 w-3 text-success" />}
                </Label>
                <Select
                  required
                  value={formData.state}
                  onValueChange={(v) => updateField("state", v)}
                >
                  <SelectTrigger className={autofilledFields.has("state") ? "border-success/50 bg-success/5" : ""}>
                    <SelectValue placeholder={t("selectState")} />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {t("occupation")}
                  {autofilledFields.has("occupation") && <CheckCircle2 className="h-3 w-3 text-success" />}
                </Label>
                <Select
                  required
                  value={formData.occupation}
                  onValueChange={(v) => updateField("occupation", v)}
                >
                  <SelectTrigger className={autofilledFields.has("occupation") ? "border-success/50 bg-success/5" : ""}>
                    <SelectValue placeholder={t("selectOccupation")} />
                  </SelectTrigger>
                  <SelectContent>
                    {occupations.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-4 flex flex-col gap-2">
                <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground">
                  {t("submitApplication")}
                </Button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" />
                  Data is processed securely and encrypted locally.
                </div>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SchemeApplicationDialog;
