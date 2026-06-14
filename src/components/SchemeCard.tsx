import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, FileText, Download, Share2, Send } from "lucide-react";
import type { Scheme, SchemeMatch } from "@/data/schemes";
import { useState } from "react";
import { generateSchemePDF, shareOnWhatsApp } from "@/lib/pdf-utils";
import SchemeApplicationDialog from "@/components/SchemeApplicationDialog";
import { useLang } from "@/contexts/LanguageContext";
import { translateScheme } from "@/lib/scheme-translations";

type Props = SchemeMatch | { scheme: Scheme };

const SchemeCard = (props: Props) => {
  const { t, lang } = useLang();
  const scheme = translateScheme(props.scheme, lang);
  const hasMatch = "status" in props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const statusConfig = {
    eligible: { icon: CheckCircle2, label: t("eligible"), className: "bg-success/10 text-success border-success/20" },
    possibly_eligible: { icon: AlertTriangle, label: t("possiblyEligible"), className: "bg-warning/10 text-warning border-warning/20" },
    not_eligible: { icon: XCircle, label: t("notEligible"), className: "bg-destructive/10 text-destructive border-destructive/20" },
  };

  const handleDownloadPDF = () => {
    const blob = generateSchemePDF(scheme);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${scheme.name.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card className="overflow-hidden border-border shadow-card transition-all hover:shadow-card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="font-heading text-base font-semibold leading-tight">
              {scheme.name}
            </CardTitle>
            {hasMatch && (
              <Badge variant="outline" className={`shrink-0 gap-1 ${statusConfig[props.status].className}`}>
                {(() => { const Icon = statusConfig[props.status].icon; return <Icon className="h-3 w-3" />; })()}
                {statusConfig[props.status].label}
              </Badge>
            )}
          </div>
          <Badge variant="secondary" className="w-fit text-xs">{scheme.category}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{scheme.description}</p>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm font-medium text-foreground">💰 {t("benefits")}: {scheme.benefits}</p>
          </div>

          {hasMatch && (
            <>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("matchConfidence")}</span>
                  <span>{props.confidence}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${
                      props.confidence >= 80 ? "bg-success" : props.confidence >= 50 ? "bg-warning" : "bg-destructive"
                    }`}
                    style={{ width: `${props.confidence}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">{props.reason}</p>
            </>
          )}

          <div className="space-y-1.5">
            <p className="flex items-center gap-1 text-xs font-medium text-foreground">
              <FileText className="h-3 w-3" /> {t("documents")}
            </p>
            <div className="flex flex-wrap gap-1">
              {scheme.documents.map((doc) => (
                <Badge key={doc} variant="outline" className="text-xs font-normal">{doc}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              className="w-full gap-2 bg-gradient-hero text-primary-foreground hover:opacity-90"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              {t("applyNow")} <Send className="h-3 w-3" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 text-xs"
                onClick={() => window.open(scheme.applyUrl, "_blank")}
              >
                {t("details")} <ExternalLink className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 px-2"
                onClick={handleDownloadPDF}
                title={t("downloadPDF")}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 px-2"
                onClick={() => shareOnWhatsApp(scheme)}
                title={t("shareWhatsApp")}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <SchemeApplicationDialog
        scheme={scheme}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default SchemeCard;
