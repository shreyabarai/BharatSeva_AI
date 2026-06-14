import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, LogOut, Languages } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang, type Lang } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "ml", label: "മലയാളം" },
  { code: "ur", label: "اردو" },
  { code: "mr", label: "मराठी" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();

  const links = [
    { to: "/home", label: t("home") },
    { to: "/eligibility", label: t("checkEligibility") },
    { to: "/schemes", label: t("browseSchemes") },
    { to: "/profile", label: "Profile" },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success(t("logoutSuccess") || "Logged out");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/home" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground">
            BHARATSeva<span className="text-accent">AI</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to}>
              <Button
                variant={location.pathname === l.to ? "secondary" : "ghost"}
                size="sm"
                className="font-medium"
              >
                {l.label}
              </Button>
            </Link>
          ))}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2 gap-2 text-xs font-medium text-muted-foreground">
                <Languages className="h-4 w-4" />
                {languages.find(l => l.code === lang)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <Button size="sm" variant="ghost" onClick={handleLogout} className="ml-1 gap-1.5">
              <LogOut className="h-3.5 w-3.5" /> {t("logout")}
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start font-medium" size="sm">
                {l.label}
              </Button>
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    lang === l.code 
                      ? "bg-gradient-hero text-primary-foreground border-transparent" 
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            {user && (
              <Button size="sm" variant="ghost" onClick={handleLogout} className="w-full justify-start gap-1.5">
                <LogOut className="h-3.5 w-3.5" /> {t("logout")}
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
