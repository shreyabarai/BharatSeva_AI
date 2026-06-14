import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, CheckCircle2, Mic, MicOff } from "lucide-react";
import { indianStates, matchSchemes, type UserProfile, type SchemeMatch } from "@/data/schemes";
import SchemeCard from "@/components/SchemeCard";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useLang } from "@/contexts/LanguageContext";

const Eligibility = () => {
  const { t } = useLang();
  const steps = [t("personalInfo"), t("employment"), t("results")];
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPersona = searchParams.get("persona") || "general";

  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    age: 0,
    gender: "",
    income: 0,
    state: "",
    occupation: "",
    caste: "",
    persona: initialPersona,
  });
  const [results, setResults] = useState<SchemeMatch[]>([]);
  const [activeField, setActiveField] = useState<keyof UserProfile | null>(null);

  const update = (key: keyof UserProfile, value: string | number) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const handleSpeechResult = (text: string) => {
    if (!activeField) return;

    if (activeField === "age" || activeField === "income") {
      const num = parseInt(text.replace(/[^0-9]/g, ""));
      if (!isNaN(num)) update(activeField, num);
    } else {
      update(activeField, text.toLowerCase().trim());
    }
    setActiveField(null);
  };

  const { isListening, startListening, stopListening } = useSpeechToText(handleSpeechResult);

  const toggleListening = (field: keyof UserProfile) => {
    if (isListening && activeField === field) {
      stopListening();
      setActiveField(null);
    } else {
      setActiveField(field);
      startListening();
    }
  };

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

  const handleSubmit = () => {
    const matches = matchSchemes(profile);
    setResults(matches);
    setStep(2);
  };

  const canNext = () => {
    if (step === 0) return profile.age > 0 && profile.gender && profile.state;
    if (step === 1) return profile.occupation && profile.income >= 0;
    return true;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Stepper */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                i <= step
                  ? "bg-gradient-hero text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className="hidden text-sm font-medium text-foreground md:inline">{s}</span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border md:w-12" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-5"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground">{t("tellUsAboutYourself")}</h2>
            <p className="text-muted-foreground">{t("eligibilitySubtitle")}</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  {t("age")}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 ${isListening && activeField === "age" ? "text-destructive" : "text-muted-foreground"}`}
                    onClick={() => toggleListening("age")}
                  >
                    {isListening && activeField === "age" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </Label>
                <Input
                  type="number"
                  placeholder={t("enterAge")}
                  value={profile.age || ""}
                  onChange={(e) => update("age", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("gender")}</Label>
                <Select value={profile.gender} onValueChange={(v) => update("gender", v)}>
                  <SelectTrigger><SelectValue placeholder={t("selectGender")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("male")}</SelectItem>
                    <SelectItem value="female">{t("female")}</SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("state")}</Label>
                <Select value={profile.state} onValueChange={(v) => update("state", v)}>
                  <SelectTrigger><SelectValue placeholder={t("selectState")} /></SelectTrigger>
                  <SelectContent>
                    {indianStates.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("categoryOptional")}</Label>
                <Select value={profile.caste} onValueChange={(v) => update("caste", v)}>
                  <SelectTrigger><SelectValue placeholder={t("search")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="obc">OBC</SelectItem>
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                    <SelectItem value="ews">EWS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-5"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground">{t("employmentIncome")}</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("occupation")}</Label>
                <Select value={profile.occupation} onValueChange={(v) => update("occupation", v)}>
                  <SelectTrigger><SelectValue placeholder={t("selectOccupation")} /></SelectTrigger>
                  <SelectContent>
                    {occupations.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  {t("annualIncome")}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 ${isListening && activeField === "income" ? "text-destructive" : "text-muted-foreground"}`}
                    onClick={() => toggleListening("income")}
                  >
                    {isListening && activeField === "income" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 300000"
                  value={profile.income || ""}
                  onChange={(e) => update("income", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground">{t("matchedSchemes")}</h2>
              <p className="mt-1 text-muted-foreground">
                {t("found")} {results.filter((r) => r.status === "eligible").length} {t("eligibleSchemes")} {results.length}
              </p>
            </div>

            {/* Summary badges */}
            <div className="flex justify-center gap-3">
              <span className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                ✅ {results.filter((r) => r.status === "eligible").length} {t("eligible")}
              </span>
              <span className="rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning">
                ⚠️ {results.filter((r) => r.status === "possibly_eligible").length} {t("possiblyEligible")}
              </span>
              <span className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
                ❌ {results.filter((r) => r.status === "not_eligible").length} {t("notEligible")}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {results.map((r) => (
                <SchemeCard key={r.scheme.id} {...r} />
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={() => { setStep(0); setResults([]); }}>
                {t("startOver")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {step < 2 && (
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> {t("back")}
          </Button>
          <Button
            disabled={!canNext()}
            onClick={() => step === 1 ? handleSubmit() : setStep(step + 1)}
            className="gap-2 bg-gradient-hero text-primary-foreground hover:opacity-90"
          >
            {step === 1 ? t("findSchemes") : t("next")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Eligibility;
