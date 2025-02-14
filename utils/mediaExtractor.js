function getAbsoluteUrl(relativeUrl, baseUrl) {
  if (!relativeUrl) return null;
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return null;
  }
}

function isValidImage(url) {
  return url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

function isValidLink(url) {
  return url && url.startsWith('http');
}

export async function extractMedia($, baseUrl) {
  const media = {
    images: [],
    videos: [],
    links: []
  };

  // Extract images
  $('img').each((_, element) => {
    const img = $(element);
    const src = img.attr('src');
    
    if (src && !src.startsWith('data:')) {
      try {
        const absoluteSrc = getAbsoluteUrl(src, baseUrl);
        if (absoluteSrc && isValidImage(absoluteSrc)) {
          media.images.push({
            src: absoluteSrc,
            alt: img.attr('alt') || ''
          });
        }
      } catch (e) {
        console.error('Error processing image URL:', e);
      }
    }
  });

  // Extract videos
  $('iframe[src*="youtube"], iframe[src*="vimeo"], video').each((_, element) => {
    const video = $(element);
    const src = video.attr('src');
    
    if (src) {
      try {
        const absoluteSrc = getAbsoluteUrl(src, baseUrl);
        if (absoluteSrc) {
          media.videos.push({
            src: absoluteSrc,
            type: video.prop('tagName').toLowerCase()
          });
        }
      } catch (e) {
        console.error('Error processing video URL:', e);
      }
    }
  });

  // Extract important links
  $('a').each((_, element) => {
    const link = $(element);
    const href = link.attr('href');
    
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      try {
        const absoluteHref = getAbsoluteUrl(href, baseUrl);
        if (absoluteHref && isValidLink(absoluteHref)) {
          media.links.push({
            href: absoluteHref,
            text: link.text().trim()
          });
        }
      } catch (e) {
        console.error('Error processing link URL:', e);
      }
    }
  });

  return media;
}