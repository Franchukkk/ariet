import styled from "styled-components"


export const Title = () => <StyledTitle>
    Преимущества <br /> партнёрской <br /> программы
</StyledTitle>

const StyledTitle = styled.h2`
font-weight: 600;
font-size: 50px;
line-height: 58px;
letter-spacing: 0%;
text-transform: uppercase;
margin-bottom: 80px;
@media (max-width: 800px) {
    font-size: 30px;
    line-height: 1.2;
    text-align: center;
    margin-bottom: 30px;
  }
`