declare module 'modern-react-qr-reader' {
  export default class QrReader extends React.Component<QrReaderProps & any, any> {}

  interface QrReaderProps {
    onScan: () => null | string;
    onError: () => Error;
    onLoad?: () => Record<string, any>;
    onImageLoad?: () => React.ReactEventHandler<HTMLImageElement> | undefined;
    delay?: number | false;
    facingMode?: 'user' | 'environment';
    resolution?: number;
    className?: string;
    showViewFinder?: boolean;
    constraints?: Record<string, any>;
    legacyMode?: boolean;
  }
}
