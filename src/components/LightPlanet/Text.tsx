import styled from "styled-components";

export const Text = () => (
  <StyledText>
    <h1>
      Вместе с <br /> лучшими
    </h1>
    <p>
      Мы — пионеры в своей области, постоянно в поиске новых решений и
      возможностей. <br /> Наша команда — это опытные профессионалы, с которыми
      вы скоро познакомитесь. <br />
      Заполните форму — и давайте начнём сотрудничество.
    </p>
  </StyledText>
);

const StyledText = styled.div`
  max-width: 457px;
  position: relative;
  z-index: 2;
  padding-top: 20px;
  h1 {
    font-weight: 600;
    font-size: 50px;
    line-height: 58px;
    letter-spacing: 0%;
    text-transform: uppercase;
    margin-bottom: 25px;
  }
  p {
    font-weight: 400;
    font-size: 23px;
    line-height: 33px;
    letter-spacing: 0%;
    text-transform: uppercase;
  }
`;
