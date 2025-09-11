import { useTranslation } from "react-i18next";
import ChoiceIcon from "@/assets/img/choice.svg";

export const ProductVariant = () => {
    const { t } = useTranslation("common");
    return (
        <div className="main-wrapper flex items-center gap-[13px] mb-[25px]!">
            <ChoiceIcon aria-label="variant" />
            {t("ProductItem.choose_variant")}
        </div>
    )
}