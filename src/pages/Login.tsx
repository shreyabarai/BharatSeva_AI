import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Loader2, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useSpeechToText } from "@/hooks/use-speech-to-text";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();

  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);

  const { isListening, startListening, stopListening } = useSpeechToText((text) => {
    if (activeVoiceField === "name") setName(text);
    if (activeVoiceField === "email") setEmail(text.toLowerCase().replace(/\s/g, ""));
    setActiveVoiceField(null);
  });

  const toggleVoice = (field: string) => {
    if (isListening && activeVoiceField === field) {
      stopListening();
      setActiveVoiceField(null);
    } else {
      setActiveVoiceField(field);
      startListening();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      toast.success(isLogin ? "Signed in!" : "Account created!");
      navigate("/home");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border-border shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition"
            >
              {lang === "en" ? "हिंदी" : "English"}
            </button>
          </div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="font-heading text-2xl font-bold">
            {isLogin ? t("welcomeBack") : t("createAccount")}
          </CardTitle>
          <CardDescription>
            {isLogin ? t("signinDesc") : t("signupDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  {t("fullName")}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 ${isListening && activeVoiceField === "name" ? "text-destructive" : "text-muted-foreground"}`}
                    onClick={() => toggleVoice("name")}
                  >
                    {isListening && activeVoiceField === "name" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </Label>
                <Input
                  placeholder={t("fullName")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                {t("email")}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${isListening && activeVoiceField === "email" ? "text-destructive" : "text-muted-foreground"}`}
                  onClick={() => toggleVoice("email")}
                >
                  {isListening && activeVoiceField === "email" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t("password")}</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 font-heading font-semibold"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? t("signIn") : t("createAccount")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isLogin ? t("noAccount") : t("haveAccount")}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {isLogin ? t("signUp") : t("signIn")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
