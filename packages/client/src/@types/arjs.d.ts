import React from 'react';

// HACK: extending types for Arjs
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': React.DetailedHTMLProps;
      'a-marker': React.DetailedHTMLProps;
      'a-entity': React.DetailedHTMLProps;
      'a-assets': React.DetailedHTMLProps;
      'a-asset-item': React.DetailedHTMLProps;
      'a-camera': React.DetailedHTMLProps;
      'a-gltf-model': React.DetailedHTMLProps;
    }
  }
}
