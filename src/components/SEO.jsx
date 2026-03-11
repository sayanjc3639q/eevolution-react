import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords }) => {
  const location = useLocation();

  useEffect(() => {
    // Basic title update
    const baseTitle = "EEvolution";
    document.title = title ? `${title} | ${baseTitle}` : `${baseTitle} - Elevate Your Learning`;

    // Meta description update
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.setAttribute('content', description);
    }

    // Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title || baseTitle);
    }

    // Open Graph URL - dynamically update to current path
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://eevolution.in${location.pathname}`);
    }

    // Canonical link update
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://eevolution.in${location.pathname}`);
    }

  }, [title, description, keywords, location.pathname]);

  return null;
};

export default SEO;
