import { useTranslation } from "react-i18next"
import { Card } from "./Card"

export const List = () => {
  const { t } = useTranslation("common");

  const DATA = [
    {
      title: t("battery.autonomy.title"),
      subtitle: t("battery.autonomy.subtitle"),
    },
    {
      title: t("battery.reliable_battery.title"),
      subtitle: t("battery.reliable_battery.subtitle"),
    },
    {
      title: t("battery.hr_series.title"),
      subtitle: t("battery.hr_series.subtitle"),
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
