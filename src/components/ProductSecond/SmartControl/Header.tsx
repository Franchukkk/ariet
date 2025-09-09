import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const Header = () => {
  const { t } = useTranslation("common");

  return (
    <StyledHeader className="flex items-center justify-between gap-3">
      <div>
        <div className="title" dangerouslySetInnerHTML={{ __html: t("header.title") }} />
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: t("header.subtitle") }} />
      </div>
      <p className="info" dangerouslySetInnerHTML={{ __html: t("header.info") }} />
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  margin-bottom: 59px;
  .title {
    font-weight: 600;
    font-size: 50px;
    line-height: 58px;
    letter-spacing: 0%;
    text-transform: uppercase;
    margin-bottom: 32px;
  }
  .subtitle {
    font-family: TT Firs Neue;
    font-weight: 200;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1%;
    color: #ffffffa8;
  }
  .info {
    font-weight: 400;
    font-size: 23px;
    line-height: 33px;
    letter-spacing: 0%;
    text-transform: uppercase;
    span {
      color: #4bc785;
    }
  }
  @media (max-width: 1200px) {
    flex-direction: column;
  }
  @media (max-width: 800px) {
    .title {
      font-size: 30px;
      line-height: 1.2;
      margin-bottom: 22px;
    }
    .info {
      font-size: 18px;
      line-height: 1.2;
    }
  }
`;
