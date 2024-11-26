import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { compile } from 'html-to-text';

const parser = new MarkdownIt();
const html2text = compile({
  wordwrap: false,
  preserveNewlines: false,
  decodeEntities: true,
});

export const getExcerptFromPostBody = (body: string) => {
  const rendered = parser.render(body);
  const parsed = html2text(rendered).split('\n').filter(Boolean).join(' ');
  const excerpt = `${parsed.substring(0, 400)}${parsed.length > 400 ? '...' : ''}`;
  return excerpt;
};
