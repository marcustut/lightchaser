import React from 'react';

import useScript from '@/hooks/useScript';

const scripts = [
  'https://aframe.io/releases/0.7.0/aframe.min.js',
  'https://rawgit.com/jeromeetienne/ar.js/master/aframe/build/aframe-ar.js',
];

export const ARCamera: React.FC = () => {
  useScript(scripts);

  return <></>;
};
