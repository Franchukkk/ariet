import photo from "@/assets/img/solutions-autonomy.png"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Info = () => {
  const { t } = useTranslation("common");

  return (
    <StyledInfo>
      <h4>{t("solutions.autonomy.title")}</h4>
      <p>
        {t("solutions.autonomy.description")}
        <Image src={photo} alt={t("solutions.autonomy.alt")} />
      </p>
    </StyledInfo>
  );
};

const StyledInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 48px;

  h4 {
    font-weight: 400;
    font-size: 23px;
    line-height: 33px;
    letter-spacing: 0%;
    text-transform: uppercase;
    color: #4bc785;
  }

  p {
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0%;
    text-transform: uppercase;

    img {
      margin: 20px 0 -90%;
    }
  }

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;
