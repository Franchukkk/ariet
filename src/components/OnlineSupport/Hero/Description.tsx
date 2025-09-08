import styled from "styled-components";

export const Description = () => (
  <StyledDescription>
    Управляйте своими продуктами Ariet Power в несколько кликов:
    зарегистрируйтесь или войдите в личный кабинет, чтобы получить доступ к
    технической поддержке, проверить статус гарантии или напрямую связаться с
    нашей командой. <br />
    <br />
    Регистрация займёт не больше 30 секунд! Мы подготовили простой гайд по
    активации аккаунта и использованию системы — скачайте его ниже и начните
    прямо сейчас.
  </StyledDescription>
);

const StyledDescription = styled.p`
  max-width: 671px;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-transform: uppercase;
`;
