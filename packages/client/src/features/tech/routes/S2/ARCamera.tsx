import { FunctionComponent } from 'react';

import { useScript } from '@/hooks';

export const ARCamera: FunctionComponent = () => {
  useScript(
    [
      'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/dist/mindar-image.prod.js',
      'https://aframe.io/releases/1.2.0/aframe.min.js',
      'https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js',
      'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/dist/mindar-image-aframe.prod.js',
    ],
    'application/javascript'
  );
  return typeof document !== 'undefined' ? (
    <a-scene
      mindar-image="imageTargetSrc: https://firebasestorage.googleapis.com/v0/b/light-chaser.appspot.com/o/ak.mind?alt=media&token=59b2afa6-b785-4472-9a4d-e0398bd5165d"
      color-space="sRGB"
      renderer="colorManagement: true, physicallyCorrectLights"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
    >
      <a-assets>
        <a-asset-item
          id="akModel"
          src="https://firebasestorage.googleapis.com/v0/b/light-chaser.appspot.com/o/ak.gltf?alt=media&token=4335863b-2710-49a8-8ed0-4e361dc241ef"
        ></a-asset-item>
      </a-assets>
      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      <a-entity mindar-image-target="targetIndex: 0">
        <a-gltf-model
          rotation="0 0 0"
          position="0 -0.25 0"
          scale="0.05 0.05 0.05"
          src="#akModel"
          animation-mixer
        />
      </a-entity>
    </a-scene>
  ) : (
    <>Loading</>
  );
};
