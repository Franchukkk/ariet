import { useTranslation } from "react-i18next"
import { Card } from "./Card"

export const List = () => {
  const { t } = useTranslation("common");

  const DATA = [
    {
      title: t("ups.autonomy.title"),
      subtitle: t("ups.autonomy.subtitle"),
    },
    {
      title: t("ups.battery.title"),
      subtitle: t("ups.battery.subtitle"),
    },
    {
      title: t("ups.hr_series.title"),
      subtitle: t("ups.hr_series.subtitle"),
    },
  ];

  return (
    <div className="flex flex-col gap-[7px]">
      {DATA.map(({ title, subtitle }, i) => (
        <Card key={i} title={title} subtitle={subtitle} />
      ))}
    </div>
  );
};
