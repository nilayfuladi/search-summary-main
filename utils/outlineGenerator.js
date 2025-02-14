function generateId(text, index) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `section-${index}`;
}

export async function generateOutline($) {
  const outline = [];
  const headings = $('h1, h2, h3, h4, h5, h6').filter((_, el) => {
    const $el = $(el);
    return !$el.closest('nav, footer, header, .navigation, .menu').length;
  });

  headings.each((index, element) => {
    const $heading = $(element);
    const level = parseInt(element.tagName.substring(1));
    const text = $heading.text().trim();

    let id = $heading.attr('id');
    if (!id) {
      id = generateId(text, index);
      $heading.attr('id', id);
    }

    if (text) {
      outline.push({
        level,
        text,
        id
      });
    }
  });

  return outline;
}