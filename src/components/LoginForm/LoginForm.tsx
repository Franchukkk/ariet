import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useState } from "react";

export default function LoginForm() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const { t } = useTranslation("common");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ login, password, rememberMe });
    }

    return (
        <StyledForm onSubmit={handleSubmit}>
            <div className="w-full flex flex-col relative">
                <StyledInput value={login} placeholder=" " required name="login" type="mail" onChange={(e) => { setLogin(e.target.value) }} />
                <StyledLabel>{t("LoginForm.login")}</StyledLabel>
            </div>
            <div className="w-full flex flex-col relative">
                <StyledInput value={password} placeholder=" " required name="password" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                <StyledLabel>{t("LoginForm.password")}</StyledLabel>
            </div>
            <div className="w-full flex flex-row justify-center">
                <input hidden checked={rememberMe} type="checkbox" id="remember_me" name="remember_me" className="mr-[16px]" onChange={() => setRememberMe(!rememberMe)} />
                <CustomCheckbox htmlFor="remember_me">{t("LoginForm.remember_me")}</CustomCheckbox>
            </div>

            <SubmitButton type="submit">{t("LoginForm.enter")}</SubmitButton>
            <a className="text-[#1dcf94]" href="/registration">{t("LoginForm.registration")}</a>
        </StyledForm>
    )
}

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 434px;
`;

const StyledInput = styled.input`
   width: 100%;
   height: 50px;
   border-bottom: 1px solid #ffffff8a;
   outline: none;
   background: none;
   padding: 5px 0;
   margin-bottom: 45px;

    &:not(:placeholder-shown) + label {
        top: -5px;
        font-size: 12px;
    };

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
    
    -webkit-text-fill-color: #ffffff; /* Устанавливает цвет текста (опционально) */
    transition: background-color 5000s ease-in-out 0s; /* Для плавного изменения цвета текста */
}
   
`;

const StyledLabel = styled.label`
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #7F7F7F;
    position: absolute;
    top: 10px;
    left: 0;
    transition: all 0.3s;
    z-index: -1;

    .relative:focus-within & {
    top: -5px;
    font-size: 12px;
  }
`;

const CustomCheckbox = styled.label`
    position: relative;
    margin-bottom: 60px;
    margin-left: 16px;
    cursor: pointer;

    &:before {
        position: absolute;
        top: 0;
        transform: translate(-100%, 0px);
        left: -14px;
        content: "";
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        border: 1px solid #c7c7c7;
    };

    [type="checkbox"]:checked + &:after {
        position: absolute;
        top: 4px;
        transform: translate(-100%, 0px);
        left: -18px;
        content: "";
        display: block;
        width: 16px;
        height: 16px;
        background: #4bc785;
        border-radius: 4px;
        border: none;
    };
`;

const SubmitButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 434px;
    min-width: 200px;
    height: 58px;
    border: 1px solid #1dcf94;
    border-radius: 61px;
    margin-bottom: 50px;
`;