import { CSSProperties, FunctionComponent } from 'react';

interface CenterProps {
  style?: CSSProperties;
}

export const Center: FunctionComponent<CenterProps> = ({ children, style }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...style }}>
    {children}
  </div>
);
