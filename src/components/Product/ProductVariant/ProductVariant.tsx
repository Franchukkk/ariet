import { useTranslation } from "react-i18next";

export const ProductVariant = () => {
    const { t } = useTranslation("common");
    return (
        <div className="main-wrapper flex items-center gap-[13px] mb-[25px]!">
            <img src="/image/choice.svg" alt="variant" />
            {t("ProductItem.choose_variant")}
        </div>
    )
}