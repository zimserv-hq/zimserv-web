// src/components/SEO.tsx
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string | string[];
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  url?: string;
  type?: "website" | "article" | "profile" | string;
  noIndex?: boolean;
  structuredData?: Record<string, any> | Record<string, any>[];
}

const SEO = ({
  title,
  description,
  keywords = "",
  image = "/og-image.jpg",
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt,
  url = "",
  type = "website",
  noIndex = false,
  structuredData,
}: SEOProps) => {
  const siteUrl = "https://www.zimserv.co.zw";

  const fullUrl = url
    ? `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`
    : siteUrl;
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`;
  const baseTitle = "ZimServ - Zimbabwe's Trusted Service Directory";
  const fullTitle = title ? `${title} | ZimServ` : baseTitle;
  const keywordsString = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <meta name="author" content="ZimServ" />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:site_name" content="ZimServ" />
      <meta property="og:locale" content="en_ZW" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(structuredData) ? structuredData : structuredData,
          )}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
