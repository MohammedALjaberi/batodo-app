import { useTranslation } from "react-i18next";

const EmptyView = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>{t("empty.noTasks")}</p>
      <p className="text-sm mt-1">{t("empty.getStarted")}</p>
    </div>
  );
};

export default EmptyView;
