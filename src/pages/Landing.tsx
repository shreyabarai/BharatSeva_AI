import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Users, FileCheck, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PersonaCard from "@/components/PersonaCard";
import { personas } from "@/data/schemes";
import heroBg from "@/assets/hero-bg.jpg";
import { useLang } from "@/contexts/LanguageContext";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  const stats = [
    { value: "500+", label: t("govSchemes") },
    { value: "28+", label: t("statesCovered") },
    { value: "10+", label: t("languagesCount") },
    { value: "Free", label: t("freeForever") },
  ];

  const features = [
    { icon: Search, title: t("smartEligibility"), desc: t("smartDesc") },
    { icon: Users, title: t("personaBased"), desc: t("personaDesc") },
    { icon: FileCheck, title: t("stepGuide"), desc: t("stepDesc") },
    { icon: Shield, title: t("trustedData"), desc: t("trustedDesc") },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
              🇮🇳 {t("digitalAssistant")}
            </Badge>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              {t("heroTitle").split(" ").slice(0, -1).join(" ")}
              <br />
              <span className="text-gradient-hero">{t("heroTitle").split(" ").slice(-1)}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              {t("bridgeDesc")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="gap-2 bg-gradient-hero text-primary-foreground shadow-sm hover:opacity-90 font-heading font-semibold"
                onClick={() => navigate("/eligibility")}
              >
                {t("checkEligibilityBtn")} <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-heading font-semibold"
                onClick={() => navigate("/schemes")}
              >
                {t("browseAllBtn")}
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card/80 p-4 shadow-card">
                <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Personas */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            {t("iamA")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("selectCategory")}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {personas.map((p, i) => (
            <PersonaCard key={p.id} {...p} index={i} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              {t("howItWorks")}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t("footerText")}
          </p>
        </div>
      </footer>
    </div>
  );
};

// Badge used locally
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${className}`}>
    {children}
  </span>
);

export default Landing;
