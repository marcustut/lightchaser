import { FunctionComponent } from 'react';

import { useScript } from '@/hooks';

const scripts = [
  'https://aframe.io/releases/0.7.0/aframe.min.js',
  'https://rawgit.com/jeromeetienne/ar.js/master/aframe/build/aframe-ar.js',
];

export const ARCamera: FunctionComponent = () => {
  useScript(scripts);

  return <></>;
};
