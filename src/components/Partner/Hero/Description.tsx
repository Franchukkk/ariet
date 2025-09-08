import styled from "styled-components";

export const Description = () => (
  <StyledDescription>
    Мы не просто ищем дистрибьюторов — мы создаём партнёрские отношения. <br />В
    Ariet Power вы становитесь частью команды, получая полную поддержку,
    инструменты и знания, необходимые для успешного ведения бизнеса. <br />
    Наши партнёры — это, в первую очередь, экспертные консультанты, которые
    знают продукт в деталях и могут с уверенностью представлять его клиентам.
  </StyledDescription>
);

const StyledDescription = styled.p`
  max-width: 631px;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0%;
  text-transform: uppercase;
`;
