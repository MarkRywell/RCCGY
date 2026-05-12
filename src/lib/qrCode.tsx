import { forwardRef } from "react";
import { QRCode as QRCodeComponent } from "react-qrcode-logo";
import type { QRCode as QRCodeHandle } from "react-qrcode-logo";
import type { CSSProperties } from "react";
import Logo from "../assets/logos/logo.jpg";

export type GenerateQRCodeProps = {
  text: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  logoImage?: string;
  id?: string;
  style?: CSSProperties;
};

export type GenerateQRCodeRef = QRCodeHandle;

export const GenerateQRCode = forwardRef<GenerateQRCodeRef, GenerateQRCodeProps>(
  (
    {
      text,
      size = 200,
      fgColor = "#fe7a0d",
      bgColor = "#0e0d0d",
      logoImage = Logo,
      id,
      style,
    },
    ref
  ) => (
    <QRCodeComponent
      ref={ref}
      value={text}
      size={size}
      fgColor={fgColor}
      bgColor={bgColor}
      logoImage={logoImage}
      id={id}
      style={style}
    />
  )
);
