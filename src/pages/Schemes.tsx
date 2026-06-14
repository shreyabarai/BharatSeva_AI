import { useState } from "react";
import { schemes } from "@/data/schemes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import SchemeCard from "@/components/SchemeCard";
import { useLang } from "@/contexts/LanguageContext";

const Schemes = () => {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    { value: "All", label: t("all") },
    { value: "Agriculture", label: t("agriculture") },
    { value: "Health", label: t("health") },
    { value: "Education", label: t("education") },
    { value: "Housing", label: t("housing") },
    { value: "Women", label: t("women") },
    { value: "Employment", label: t("employment") },
  ];

  const filtered = schemes.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-foreground">{t("browseTitle")}</h1>
      <p className="mt-2 text-muted-foreground">{t("browseSubtitle")}</p>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c.value}
              variant={selectedCategory === c.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(c.value)}
              className={selectedCategory === c.value ? "bg-gradient-hero text-primary-foreground" : ""}
            >
              {c.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-lg text-muted-foreground">{t("noMatchesFound")}</p>
        </div>
      )}
    </div>
  );
};

export default Schemes;
