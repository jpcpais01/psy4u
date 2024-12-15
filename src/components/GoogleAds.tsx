import React, { useEffect } from 'react';

interface GoogleAdProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({
  adClient,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Google Ads script error:', error);
    }
  }, []);

  return (
    <div className="google-ad-container my-4 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};
