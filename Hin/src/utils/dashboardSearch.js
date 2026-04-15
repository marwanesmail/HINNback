// Utility functions for dashboard search functionality

/**
 * Search for text within a DOM element and its children
 * @param {HTMLElement} element - The element to search within
 * @param {string} query - The search query
 * @returns {Array} - Array of search results
 */
export const searchInElement = (element, query) => {
  if (!element || !query) return [];
  
  const results = [];
  const queryLower = query.toLowerCase();
  
  // Function to check if text content matches query
  const checkElement = (el) => {
    // Skip script and style elements
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
    
    // Check text content
    const textContent = el.textContent || el.innerText || '';
    if (textContent.toLowerCase().includes(queryLower)) {
      // Get the parent element that has meaningful content
      let parentElement = el;
      while (parentElement && parentElement !== element) {
        // Check if this element has meaningful content
        if (parentElement.textContent && parentElement.textContent.trim().length > 10) {
          break;
        }
        parentElement = parentElement.parentElement;
      }
      
      // Get a meaningful title/content snippet
      const title = el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || 
                   el.tagName === 'H4' || el.tagName === 'H5' || el.tagName === 'H6' 
                   ? textContent.trim() 
                   : getParentTitle(el) || 'محتوى';
      
      // Get content snippet
      const content = textContent.trim().substring(0, 100) + (textContent.length > 100 ? '...' : '');
      
      results.push({
        element: parentElement || el,
        title: title,
        content: content,
        tagName: el.tagName
      });
    }
    
    // Recursively check child elements
    if (el.children) {
      for (let i = 0; i < el.children.length; i++) {
        checkElement(el.children[i]);
      }
    }
  };
  
  // Get parent title for context
  const getParentTitle = (el) => {
    let parent = el.parentElement;
    let title = '';
    
    // Look for nearby headings
    while (parent && parent !== element) {
      // Check for headings
      const headings = parent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length > 0) {
        title = headings[headings.length - 1].textContent.trim();
        break;
      }
      parent = parent.parentElement;
    }
    
    return title;
  };
  
  // Start searching from the element's children
  for (let i = 0; i < element.children.length; i++) {
    checkElement(element.children[i]);
  }
  
  // Remove duplicates based on element reference
  const uniqueResults = [];
  const seenElements = new Set();
  
  results.forEach(result => {
    if (!seenElements.has(result.element)) {
      seenElements.add(result.element);
      uniqueResults.push(result);
    }
  });
  
  return uniqueResults;
};

/**
 * Highlight search terms in an element
 * @param {HTMLElement} element - The element to highlight in
 * @param {string} query - The search query
 */
export const highlightSearchTerms = (element, query) => {
  if (!element || !query) return;
  
  const queryLower = query.toLowerCase();
  
  // Remove existing highlights
  const highlights = element.querySelectorAll('.search-highlight');
  highlights.forEach(highlight => {
    const parent = highlight.parentNode;
    parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    parent.normalize();
  });
  
  if (!query) return;
  
  // Function to highlight text nodes
  const highlightTextNodes = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const index = text.toLowerCase().indexOf(queryLower);
      
      if (index !== -1) {
        const highlighted = document.createElement('span');
        highlighted.className = 'search-highlight bg-yellow-200 font-bold';
        highlighted.textContent = text.substring(index, index + query.length);
        
        const before = document.createTextNode(text.substring(0, index));
        const after = document.createTextNode(text.substring(index + query.length));
        
        const parent = node.parentNode;
        parent.insertBefore(before, node);
        parent.insertBefore(highlighted, node);
        parent.insertBefore(after, node);
        parent.removeChild(node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && 
               node.tagName !== 'SCRIPT' && 
               node.tagName !== 'STYLE' && 
               !node.classList.contains('search-highlight')) {
      // Recursively process child nodes
      for (let i = 0; i < node.childNodes.length; i++) {
        highlightTextNodes(node.childNodes[i]);
      }
    }
  };
  
  // Start highlighting
  for (let i = 0; i < element.childNodes.length; i++) {
    highlightTextNodes(element.childNodes[i]);
  }
};

/**
 * Remove all search highlights
 * @param {HTMLElement} element - The element to remove highlights from
 */
export const removeHighlights = (element) => {
  if (!element) return;
  
  const highlights = element.querySelectorAll('.search-highlight');
  highlights.forEach(highlight => {
    const parent = highlight.parentNode;
    parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    parent.normalize();
  });
};

/**
 * Scroll to and highlight an element
 * @param {HTMLElement} element - The element to scroll to
 */
export const scrollToElement = (element) => {
  if (!element) return;
  
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Add temporary highlight
  const originalBg = element.style.backgroundColor;
  element.style.backgroundColor = '#fef08a'; // yellow-200 equivalent
  
  setTimeout(() => {
    element.style.backgroundColor = originalBg;
  }, 2000);
};

export default {
  searchInElement,
  highlightSearchTerms,
  removeHighlights,
  scrollToElement
};