import React from 'react';
import { Helmet } from 'react-helmet';

const SEOComponent = ({
  title = "Hazel - Premium Men's Clothing | Hoodies, Jackets & T-Shirts",
  description = "Hazel offers top-tier men's clothing including hoodies, jackets, and t-shirts at unbeatable prices. Premium quality fabrics, stylish designs, and comfort guaranteed."
}) => {
  const siteURL = "https://hazel.netlify.app";
  const ogImage = `${siteURL}/images/og-image.jpg`; // replace with your actual OG image path

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Hazel, men's clothing, hoodies, jackets, t-shirts, premium clothing, winter wear, stylish menswear" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hazel Team" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={siteURL} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEOComponent;
