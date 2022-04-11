import React from 'react';

// HACK: extending types for Arjs
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': React.DetailedHTMLProps;
      'a-marker': React.DetailedHTMLProps;
      'a-entity': React.DetailedHTMLProps;
    }
  }
}
