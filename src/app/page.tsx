import { Support } from "../components/Support/Support";
import { Banner } from "../components/Home/Banner/Banner";
import { Info } from "../components/Home/Info/Info";
import { Products } from "../components/Home/Products/Products";
import { WhyUs } from "../components/Home/WhyUs/WhyUs";

export default function Page() {
  return (
  <div>
    <Banner />
    <Products />
    <WhyUs />
    <Info />
    <Support />
  </div>
  )
};
