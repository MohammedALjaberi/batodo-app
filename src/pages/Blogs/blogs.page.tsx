import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";

const BlogsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FileText className="h-24 w-24 text-muted-foreground/50 mb-6" />
        <h1 className="text-3xl font-bold mb-2">
          {t("blogs.title", "Blogs")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("blogs.comingSoon", "Coming soon...")}
        </p>
      </div>
    </div>
  );
};

export default BlogsPage;

