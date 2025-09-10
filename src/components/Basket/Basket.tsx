import { Support } from "../Support/Support"
import { BasketList } from "./BasketList"
import { TitleBasket } from "./TitleBasket"

export const Basket = () => {
    return (
        <div className="main-wrapper pt-[75px]">
            <TitleBasket />
            <BasketList />
            <div id="support_basket">
                <Support />
            </div>
        </div>
    )
}