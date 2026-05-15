import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function QRScanner() {
    useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("QR Code:", decodedText);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  return <div id="reader" />;
}