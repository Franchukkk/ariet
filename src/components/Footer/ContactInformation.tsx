'use client'
import styled from 'styled-components'

export const CompanyInformation = () => {
    return (
        <StyledCompanyInformation>
            <p>Ariet Technology Limited</p>
            <p>
                OFFICE 3906, 39TH THE CTR 99 QUEEN'S RD CENTRAL CENTRAL HONG KONG
            </p>
            <p>
                +86 185 29 573 835
            </p>
        </StyledCompanyInformation>
    )
}

const StyledCompanyInformation = styled.div`
	font-weight: 400;
	font-size: 12px;
	line-height: 18px;
	letter-spacing: 0%;
	color: #7a7b7a;
	max-width: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    width: auto;
    margin-top: 2em;
    p {
        text-align: center;
    }
`
