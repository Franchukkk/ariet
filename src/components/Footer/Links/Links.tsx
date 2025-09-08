import { useTranslation } from 'next-i18next'
import { List } from "./List"

export const Links = () => {
  const {t} = useTranslation("common")

  return (
  <div className="flex flex-wrap">
    <List
      title={t("title.company")}
      links={[
        { title: t("title.section"), link: "#" },
        { title: t("title.section"), link: "#" },
        { title: t("title.section"), link: "#" },
        { title: t("title.section"), link: "#" },
      ]}
    />{" "}
    <List
      title={t("title.catalog")}
      links={[
        { title: t("title.section"), link: "#" },
        { title: t("title.section"), link: "#" },
        { title: t("title.section"), link: "#" },
        { title: t("title.section"), link: "#" },
      ]}
    />{" "}
    <List
      title={t("title.social_networks")}
      links={[
        { title: "Instagram", link: "#" },
        { title: "Facebook", link: "#" },
      ]}
    />
  </div>
  );
};
