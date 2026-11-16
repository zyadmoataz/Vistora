import DOMPurify from "isomorphic-dompurify";

const SAFE_TAGS = ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "span"];

export const sanitizeHtml = (dirty?: string | null): string => {
  if (!dirty || typeof dirty !== "string") return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: SAFE_TAGS,
    ALLOWED_ATTR: [],
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input", "svg", "math"],
    FORBID_ATTR: ["style", "onerror", "onload", "onclick", "onmouseover", "href", "src"],
  });
};
