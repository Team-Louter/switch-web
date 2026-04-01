import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

export const md = new MarkdownIt({
    breaks: true,
    linkify: true,
    html: false,
});

type RenderRule = NonNullable<InstanceType<typeof MarkdownIt>["renderer"]["rules"][string]>;

const defaultRender: RenderRule =
    md.renderer.rules.link_open ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet("href") ?? "";

    const isBlobFile = href.startsWith("blob:");
    const isMediaExt = /\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg)(\?.*)?$/i.test(href);
    const isPdf = /\.pdf(\?.*)?$/i.test(href);
    const isFileExt = /\.(zip|hwp|xlsx|xls|docx|pptx|txt|csv|apk)(\?.*)?$/i.test(href);
    const isFile = isBlobFile || isFileExt;

    if (isFile && !isMediaExt && !isPdf) {
        const filename = decodeURIComponent(href.split("/").pop()?.split("?")[0] ?? "file");
        tokens[idx].attrSet("download", filename);
    } else {
        tokens[idx].attrSet("target", "_blank");
        tokens[idx].attrSet("rel", "noopener noreferrer");
    }

    return defaultRender(tokens, idx, options, env, self);
};

export const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
export const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

export const codeStore = new Map<string, string>();

md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const lang = token.info.trim() || "";
    const rawCode = token.content;

    const id = `code-${idx}-${Date.now()}`;
    codeStore.set(id, rawCode);

    const escapedCode = rawCode
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    return `<div class="code-block-wrapper"><div class="code-block-header"><span class="code-block-lang">${lang}</span><button class="code-copy-btn" data-code-id="${id}" title="복사">${copyIcon}</button></div><pre><code class="language-${lang}">${escapedCode}</code></pre></div>`;
};

const postprocessRendered = (html: string) => {
    return html.replace(
        /<a[^>]*href="([^"]+)"[^>]*>video:([^<]+)<\/a>/g,
        `<video controls style="max-width:100%;max-height:300px;border-radius:8px;" src="$1"></video>`
    );
};

export const renderMarkdown = (content: string) =>
    DOMPurify.sanitize(postprocessRendered(md.render(content)), {
        ALLOWED_TAGS: [
            "p", "br", "strong", "em", "del", "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li", "blockquote", "pre", "code", "hr",
            "a", "img", "video",
            "div", "button", "span",
            "svg", "rect", "path", "polyline",
        ],
        ALLOWED_ATTR: [
            "href", "target", "rel", "download",
            "src", "alt", "width", "height", "style",
            "controls",
            "class", "title",
            "xmlns", "viewBox", "fill", "stroke", "stroke-width",
            "stroke-linecap", "stroke-linejoin", "x", "y", "rx", "d", "points",
        ],
        ADD_ATTR: ["data-code-id"],
        ALLOW_UNKNOWN_PROTOCOLS: true,
        FORCE_BODY: true,
    });