import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CustomDropdown } from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);

    // Set document direction for RTL support
    document.documentElement.dir = languageCode === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = languageCode;
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <CustomDropdown
      trigger={
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        </Button>
      }
      items={languages.map((language) => ({
        label: `${language.nativeName}${
          i18n.language === language.code ? " ✓" : ""
        }`,
        value: language.code,
        onClick: () => changeLanguage(language.code),
      }))}
      align="end"
    />
  );
}
