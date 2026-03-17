import { MoonStar, SunMedium } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
      className="rounded-full"
    >
      {theme === "dark" ? <SunMedium className="h-[18px] w-[18px]" /> : <MoonStar className="h-[18px] w-[18px]" />}
    </Button>
  );
}
