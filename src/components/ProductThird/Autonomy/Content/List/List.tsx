import { useTranslation } from "react-i18next"
import { Card } from "./Card"

const DATA = [
  { id: 1, titleKey: "list.item1.title", subtitleKey: "list.item1.subtitle" },
  { id: 2, titleKey: "list.item2.title", subtitleKey: "list.item2.subtitle" },
  { id: 3, titleKey: "list.item3.title", subtitleKey: "list.item3.subtitle" },
];

export const List = () => {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col gap-[7px]">
      {DATA.map(({ id, titleKey, subtitleKey }) => (
        <Card
          key={id}
          title={t(titleKey)}
          subtitle={t(subtitleKey)}
        />
      ))}
    </div>
  );
};
