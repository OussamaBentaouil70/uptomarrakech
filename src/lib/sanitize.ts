/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows safe HTML tags for formatting
 */
export function sanitizeHTML(html: string): string {
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 's', 'mark',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'pre', 'code',
    'a', 'blockquote',
  ];

  const allowedAttributes: Record<string, string[]> = {
    'a': ['href', 'title', 'target', 'rel'],
  };

  // Create a temporary element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  /**
   * Recursively clean the DOM tree
   */
  const cleanTree = (node: Node): Node => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // Remove disallowed tags
      if (!allowedTags.includes(tagName)) {
        const fragment = document.createDocumentFragment();
        element.childNodes.forEach((child) => {
          fragment.appendChild(cleanTree(child));
        });
        return fragment;
      }

      // Create a new element
      const newElement = document.createElement(tagName);

      // Copy allowed attributes
      const allowedAttrs = allowedAttributes[tagName] || [];
      Array.from(element.attributes).forEach((attr) => {
        if (allowedAttrs.includes(attr.name)) {
          newElement.setAttribute(attr.name, attr.value);
        }
      });

      // Recursively clean children
      element.childNodes.forEach((child) => {
        newElement.appendChild(cleanTree(child));
      });

      return newElement;
    }

    return node;
  };

  const cleaned = cleanTree(temp);
  return (cleaned as HTMLElement).innerHTML;
}
