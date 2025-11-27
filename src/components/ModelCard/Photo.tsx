import styled from "styled-components";
import type { StaticImageData } from "next/image";
import { useTranslation } from "react-i18next";

type ImgLike = string | StaticImageData;

interface Props {
  photo: ImgLike;
}

export const Photo = ({ photo }: Props) => {
  const { t } = useTranslation("common"); 
  if (!photo) {
    return <NoPhoto>{t("Photo.no_photo")}</NoPhoto>; 
  }

  const src =
    typeof photo === "string"
      ? photo
      : photo?.src ?? "/placeholder.png";

  return <StyledPhoto src={src} alt="Фото модели" />;
};

const NoPhoto = styled.div`
  width: 315px;
  height: 315px;
  margin: 0 auto 57px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-size: 18px;
  color: #555;
`;

const StyledPhoto = styled.img`
  width: 315px;
  margin: 0 auto 57px;
`;
