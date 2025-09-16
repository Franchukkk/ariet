import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegistrationForm() {
    const [selected, setSelected] = useState("client");
    const [name, setName] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [secondName, setSecondName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    const { t } = useTranslation("common");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
        } else {
            localStorage.removeItem("rememberMe");
        }

        if (password !== confirmPassword) {
            alert(t("RegistrationForm.passwords_do_not_match"));
            ;
        }

        fetch("/api/auth/register/", {
            method: "POST",
            body: JSON.stringify({ name, secondName, phone, email, password, confirmPassword }),
        })
            .then(res => res.json())
            .then(data => router.push("/my-account"))
            .catch(err => alert("Виникла помилка при реєстрації"));
    }

    return (
        <StyledForm onSubmit={handleSubmit}>
            <LabelWrapper className="flex flex-row justify-between mb-[70px] w-[100%]">
                <MediaLabel
                    style={selected === "client" ? { boxShadow: "0px 9px 20.9px 0px #1DCF9440", } : { color: "#7F7F7F" }}
                    className={`uppercase text-600 w-[245px] h-[84px] pl-[20px] flex items-center gap-2 cursor-pointer ${selected === "client" ? "border border-[#1DCF94] rounded-[8px]" : "border border-transparent "}`}
                >
                    <input
                        type="radio"
                        name="myOptions"
                        value="client"
                        checked={selected === "client"}
                        onChange={(e) => setSelected(e.target.value)}
                        className="accent-[#E1E1E1] appearance-none w-[16px] h-[16px] rounded-full border border-[8px] border-[##FFFFFFC4]  
         checked:bg-[#4BC785] checked:border-[#ffffff] checked:border-[3px]"
                    />
                    <span>{t("RegistrationForm.statuses.client")}</span>
                </MediaLabel>

                <MediaLabel
                    style={selected === "ambassador" ? { boxShadow: "0px 9px 20.9px 0px #1DCF9440" } : { color: "#7F7F7F" }}
                    className={`uppercase text-600 w-[245px] h-[84px] pl-[20px] flex items-center gap-2 cursor-pointer ${selected === "ambassador" ? "border border-[#1DCF94] rounded-[8px]" : "border border-transparent "}`}
                >
                    <input
                        type="radio"
                        name="myOptions"
                        value="ambassador"
                        checked={selected === "ambassador"}
                        onChange={(e) => setSelected(e.target.value)}
                        className="accent-[#E1E1E1] appearance-none w-[16px] h-[16px] rounded-full border border-[8px] border-[##FFFFFFC4]  
         checked:bg-[#4BC785] checked:border-[#ffffff] checked:border-[3px]"
                    />
                    <span>{t("RegistrationForm.statuses.ambassador")}</span>
                </MediaLabel>

                <MediaLabel
                    style={selected === "diller" ? { boxShadow: "0px 9px 20.9px 0px #1DCF9440" } : { color: "#7F7F7F" }}
                    className={`uppercase text-600 w-[245px] h-[84px] pl-[20px] flex items-center gap-2 cursor-pointer ${selected === "diller" ? "border border-[#1DCF94] rounded-[8px]" : "border border-transparent "}`}
                >    <input
                        type="radio"
                        name="myOptions"
                        value="diller"
                        checked={selected === "diller"}
                        onChange={(e) => setSelected(e.target.value)}
                        className="accent-[##FFFFFFC4] appearance-none w-[16px] h-[16px] rounded-full border border-[8px] border-[##FFFFFFC4]  
         checked:bg-[#4BC785] checked:border-[#ffffff] checked:border-[3px]"
                    />
                    <span>{t("RegistrationForm.statuses.diller")}</span>
                </MediaLabel>
            </LabelWrapper>

            <InputWrapper className="w-full grid grid-cols-2 gap-4">
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

            </InputWrapper>

            <div className="w-full flex flex-row justify-center">
                <input hidden checked={rememberMe} type="checkbox" id="remember_password" name="remember_password" className="mr-[16px]" onChange={() => setRememberMe(!rememberMe)} />
                <CustomCheckbox htmlFor="remember_password">{t("RegistrationForm.to_remember_password")}</CustomCheckbox>
            </div>

            <SubmitButton type="submit">{t("title.registration")}</SubmitButton>
            <Link className="cursor-pointer" href="/login">{t("RegistrationForm.i_have_account")} <span className="text-[#1dcf94] ">{t("LoginForm.enter")}</span></Link>
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

const LabelWrapper = styled.div`
   @media (max-width: 780px) {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 1000px) {
       gap: 10px;
       margin-bottom: 20px;
    }
   }
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
    
    -webkit-text-fill-color: #ffffff; 
    transition: background-color 5000s ease-in-out 0s;
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
    cursor: pointer;
    border: 1px solid #1dcf94;
    border-radius: 61px;
    margin-bottom: 50px;
`;

const InputWrapper = styled.div`
    @media (max-width: 500px) {
        grid-template-columns: 1fr;
        gap: 20px;
    }
`;

const MediaLabel = styled.label`
    background: #0d0c0c7d;
    overflow: hidden;
    @media (max-width: 1000px) {
        width: 100%;
        max-width: 200px;
        line-height: 14px;
        height: 54px;
        padding: 5px 20px;
        font-size: 14px;
    }
`;