import React, { useState } from 'react';

export const LogoImage: React.FC<{ src: string; alt: string; brandName: string }> = ({ src, alt, brandName }) => {
  const [error, setError] = useState(false);
  const proxiedSrc = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&url=${encodeURIComponent(src)}`;

  if (error) {
    const googleImagesSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${brandName} logo`)}`;

    return (
      <div className="asset-link-card">
        <p>Logo files are opened on an external source page.</p>
        <a href={googleImagesSearchUrl} target="_blank" rel="noopener noreferrer">
          Open logo search
        </a>
      </div>
    );
  }

  return <img src={proxiedSrc} alt={alt} className="logo-image" onError={() => setError(true)} referrerPolicy="no-referrer" />;
};

export const PlayableAudio: React.FC<{ src: string }> = ({ src }) => {
  const [error, setError] = useState(false);

  if (error) {
    return <div className="asset-error-inline">Audio source not playable</div>;
  }

  return <audio controls src={src} onError={() => setError(true)} />;
};
