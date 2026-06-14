import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { schemes } from "@/data/schemes";
import SchemeCard from "@/components/SchemeCard";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLang();
  
  const categories = [
    { value: "All", label: t("all") },
    { value: "Agriculture", label: t("agriculture") },
    { value: "Health", label: t("health") },
    { value: "Education", label: t("education") },
    { value: "Housing", label: t("housing") },
    { value: "Women", label: t("women") },
    { value: "Employment", label: t("employment") },
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showChat, setShowChat] = useState(false);

  const filtered = schemes.filter((s) => {
    const matchCat = category === "All" || s.category === category;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Simple recommendation: first 4 schemes
  const recommended = schemes.slice(0, 4);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="border-b border-border bg-muted/30 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              {t("welcome")}, {user?.displayName || user?.email?.split("@")[0]} 👋
            </h1>
            <p className="mt-1 text-muted-foreground">{t("heroDesc")}</p>
            <Button
              className="mt-4 gap-2 bg-gradient-hero text-primary-foreground hover:opacity-90 font-heading font-semibold"
              onClick={() => navigate("/eligibility")}
            >
              {t("checkEligibility")} <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Recommended */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">{t("recommendedSchemes")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      </section>

      {/* Browse All */}
      <section className="mx-auto max-w-6xl px-4 py-4">
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">{t("allSchemes")}</h2>

        {/* Search + Categories */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <Button
                key={c.value}
                size="sm"
                variant={category === c.value ? "default" : "outline"}
                onClick={() => setCategory(c.value)}
                className={category === c.value ? "bg-gradient-hero text-primary-foreground" : ""}
              >
                {c.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10">{t("noSchemesFound")}</p>
        )}
      </section>

      {/* Chatbot FAB */}
      <button
        onClick={() => navigate("/chat")}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground shadow-lg hover:opacity-90 transition-transform hover:scale-105"
        aria-label={t("chatbot")}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Home;
