import QRCode from 'qrcode';
import * as path from 'path';

const url = 'https://stardusttosovereignty.com';
const outputFile = 'stardust-to-sovereignty-qr.png';
const outputPath = path.join(process.cwd(), outputFile);

QRCode.toFile(
  outputPath,
  url,
  {
    width: 1200,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'H', // High error correction for print
  },
  (err) => {
    if (err) {
      console.error('Error generating QR code:', err);
      process.exit(1);
    }
    console.log(`QR code generated successfully: ${outputFile}`);
    console.log(`Location: ${outputPath}`);
    process.exit(0);
  }
);
