import React from 'react';
import { Helmet } from 'react-helmet';

const SEOComponent = ({
  title = "Bharat Petals | Fresh Flower Delivery & Subscription Plans",
  description = "Bharat Petals delivers fresh flowers daily across Hyderabad, India with flexible subscription plans and same-day delivery for bouquets and pooja flowers. We deliver within 24 hours in Hyderabad!"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Bharat Petals, flower delivery Hyderabad, fresh flowers India, pooja flowers, flower subscriptions, same-day delivery, bouquet delivery, daily flowers, 24-hour flower delivery Hyderabad" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Bharat Petals Team" />
      <link rel="canonical" href="https://bharatpetals.netlify.app/" />

      {/* Open Graph Tags for Social Media Sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://bharatpetals.netlify.app/" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://bharatpetals.netlify.app/og-image.jpg" /> {/* Replace with your actual image URL */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://bharatpetals.netlify.app/og-image.jpg" /> {/* Replace with your actual image URL */}
    </Helmet>
  );
};

export default SEOComponent;
