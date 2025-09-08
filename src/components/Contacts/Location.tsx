"use client";

import bg from "@/assets/img/contact-location.png"
import IconSvg from "@/assets/img/pin-map.svg"
import GoogleMapReact from "google-map-react"
import type { StaticImageData } from "next/image"
import styled from "styled-components"

const defaultProps = {
  center: { lat: 41.74950892876384, lng: 1.8623954656185593 },
  zoom: 15,
};

const mapOptions = {
  styles: [
    { featureType: "all", elementType: "all", stylers: [{ saturation: -100 }, { gamma: 0.5 }] },
  ],
  zoomControl: false,
  scrollwheel: false,
  disableDoubleClickZoom: true,
};

interface MarkerProps { lat: number; lng: number; }
const Marker = ({lat, lng}: MarkerProps) => <IconSvg aria-label="icon" />;

type ImgLike = string | StaticImageData;

export const Location = () => (
  <StyledLocation $bg={bg}>
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! }}
      defaultCenter={defaultProps.center}
      defaultZoom={defaultProps.zoom}
      options={mapOptions}
    >

      <Marker lat={41.7495089287638} lng={1.8623954656185593} />
    </GoogleMapReact>
  </StyledLocation>
);


const StyledLocation = styled.div<{ $bg: ImgLike }>`
  border-radius: 6px;
  height: 627px;
  width: 100%;
  background: ${({ $bg }) =>
    `url(${typeof $bg === "string" ? $bg : $bg.src}) center/cover no-repeat`};
  margin-bottom: 135px;
  overflow: hidden;

  @media (max-width: 1000px) {
    height: 400px;
    margin-bottom: 40px;
  }
  @media (max-width: 800px) {
    height: 300px;
  }

  img { width: 200px; }
`;

