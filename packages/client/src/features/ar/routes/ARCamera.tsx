import { FunctionComponent } from 'react';

import { useScript } from '@/hooks';

const scripts = [
  'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js',
  'https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar.js',
];

export const ARCamera: FunctionComponent = () => {
  useScript(scripts);

  return typeof document !== 'undefined' ? (
    <a-scene embedded arjs>
      <a-marker preset="hiro">
        <a-entity
          position="0 0 0"
          scale="0.05 0.05 0.05"
          gltf-model="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf"
        ></a-entity>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  ) : (
    <>Loading</>
  );
};