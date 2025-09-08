import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useState } from "react";

export default function RegistrationForm() {
    const [selected, setSelected] = useState("option1");
    const [name, setName] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [secondName, setSecondName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { t } = useTranslation("common");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ email, password, rememberMe });
    }

    return (
        <StyledForm onSubmit={handleSubmit}>
            <div className="flex flex-row justify-between mb-[70px] w-[100%]">
                <label
                    style={selected === "client" ? { boxShadow: "0px 9px 20.9px 0px #1DCF9440" } : {}}
                    className={`w-[245px] h-[84px] pl-[20px] flex items-center gap-2 cursor-pointer ${selected === "client" ? "border border-[#1DCF94] rounded-[8px]" : "border border-transparent "}`}
                >
                    <input
                        type="radio"
                        name="myOptions"
                        value="client"
                        checked={selected === "client"}
                        onChange={(e) => setSelected(e.target.value)}
                        className="accent-[#1DCF94]"
                    />
                    <span>{t("RegistrationForm.statuses.client")}</span>
                </label>

                <label
                    style={selected === "ambassador" ? { boxShadow: "0px 9px 20.9px 0px #1DCF9440" } : {}}
                    className={`w-[245px] h-[84px] pl-[20px] flex items-center gap-2 cursor-pointer ${selected === "ambassador" ? "border border-[#1DCF94] rounded-[8px]" : "border border-transparent "}`}
                >    <input
                        type="radio"
                        name="myOptions"
                        value="ambassador"
                        checked={selected === "ambassador"}
                        onChange={(e) => setSelected(e.target.value)}
                        className="accent-[#1DCF94]"
                    />
                    <span>{t("RegistrationForm.statuses.ambassador")}</span>
                </label>

                <label
                    style={selected === "diller" ? { boxShadow: "0px 9px 20.9px 0px #1DCF9440" } : {}}
                    className={`w-[245px] h-[84px] pl-[20px] flex items-center gap-2 cursor-pointer ${selected === "diller" ? "border border-[#1DCF94] rounded-[8px]" : "border border-transparent "}`}
                >    <input
                        type="radio"
                        name="myOptions"
                        value="diller"
                        checked={selected === "diller"}
                        onChange={(e) => setSelected(e.target.value)}
                        className="accent-[#1DCF94]"
                    />
                    <span>{t("RegistrationForm.statuses.diller")}</span>
                </label>
            </div>

            <div className="w-full flex flex-col relative">
                <StyledInput value={name} placeholder=" " required name="name" type="text" onChange={(e) => { setName(e.target.value) }} />
                <StyledLabel>{t("RegistrationForm.name")}</StyledLabel>
            </div>

            <div className="w-full flex flex-col relative">
                <StyledInput value={secondName} placeholder=" " required name="secondName" type="text" onChange={(e) => { setSecondName(e.target.value) }} />
                <StyledLabel>{t("RegistrationForm.second_name")}</StyledLabel>
            </div>

            <div className="w-full flex flex-col relative">
                <StyledInput value={phone} placeholder=" " required name="phone" type="tel" onChange={(e) => { setPhone(e.target.value) }} />
                <StyledLabel>{t("RegistrationForm.phone")}</StyledLabel>
            </div>

            <div className="w-full flex flex-col relative">
                <StyledInput value={email} placeholder=" " required name="email" type="email" onChange={(e) => { setEmail(e.target.value) }} />
                <StyledLabel>{t("RegistrationForm.email")}</StyledLabel>
            </div>

            <div className="w-full flex flex-col relative">
                <StyledInput value={password} placeholder=" " required name="password" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                <StyledLabel>{t("RegistrationForm.password")}</StyledLabel>
            </div>

            <div className="w-full flex flex-col relative">
                <StyledInput value={confirmPassword} placeholder=" " required name="confirmPassword" type="password" onChange={(e) => { setConfirmPassword(e.target.value) }} />
                <StyledLabel>{t("RegistrationForm.confirm_password")}</StyledLabel>
            </div>

            <div className="w-full flex flex-row justify-center">
                <input hidden checked={rememberMe} type="checkbox" id="remember_password" name="remember_password" className="mr-[16px]" onChange={() => setRememberMe(!rememberMe)} />
                <CustomCheckbox htmlFor="remember_password">{t("RegistrationForm.to_remember_password")}</CustomCheckbox>
            </div>

            <SubmitButton type="submit">{t("title.registration")}</SubmitButton>
            <a href="/login">{t("RegistrationForm.i_have_account")} <span className="text-[#1dcf94]">{t("LoginForm.enter")}</span></a>
        </StyledForm>
    )
}

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    width: 100%;
    max-width: 780px;
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
        top: 2px;
        transform: translate(-100%, 0px);
        left: -16px;
        content: "";
        display: block;
        width: 20px;
        height: 20px;
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