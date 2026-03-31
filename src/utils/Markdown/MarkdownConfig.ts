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
        ],
        ALLOWED_ATTR: [
            "href", "target", "rel", "download",
            "src", "alt", "width", "height", "style",
            "controls",
        ],
        ALLOW_UNKNOWN_PROTOCOLS: true,
        FORCE_BODY: true,
    });