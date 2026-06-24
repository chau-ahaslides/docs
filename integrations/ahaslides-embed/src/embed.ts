/**
 * URL helpers for the AhaSlides embed integration.
 *
 * The integration accepts two kinds of links pasted into the GitBook editor:
 *
 *   1. A presenter share/template link, e.g.
 *        https://presenter.ahaslides.com/shared-template/1778236046368-2ahar6uns7
 *        https://presenter.ahaslides.com/share/1778236046368-2ahar6uns7
 *      These point straight at the live, interactive AhaSlides player and are
 *      what we want inside the <webframe>.
 *
 *   2. An ahaslides.com share link, e.g.
 *        https://ahaslides.com/share/1778236046368-2ahar6uns7
 *      ahaslides.com is the marketing/redirect host; the share path mirrors the
 *      presenter path, so we rewrite it onto presenter.ahaslides.com.
 *
 * The blog "Try it" embed uses the query string `?hideAccessCode=true&hideText=true`
 * to hide the join UI and present a clean interactive frame. We default to the
 * same params so the docs embed matches the blog.
 */

/** Query params that hide the join code + helper text, matching the blog embed. */
export const EMBED_QUERY = 'hideAccessCode=true&hideText=true';

/** Hosts we recognise as AhaSlides links. */
const PRESENTER_HOST = 'presenter.ahaslides.com';
const AHASLIDES_HOSTS = ['ahaslides.com', 'www.ahaslides.com'];

/** Path segments that carry a share/template id on either host. */
const SHARE_SEGMENTS = ['shared-template', 'share'];

export interface AhaSlidesEmbed {
    /** The share/template id, when one could be extracted. */
    templateId?: string;
    /** The canonical presenter URL to load in the webframe. */
    embedUrl?: string;
}

/**
 * Parse a pasted AhaSlides link into a canonical presenter embed URL.
 *
 * Returns an empty object when the URL is not a recognisable AhaSlides link, so
 * the caller can fall back to a prompt card.
 */
export function extractAhaSlidesEmbed(rawUrl: string): AhaSlidesEmbed {
    let url: URL;
    try {
        url = new URL(rawUrl);
    } catch {
        return {};
    }

    const host = url.hostname.toLowerCase();
    const isPresenter = host === PRESENTER_HOST;
    const isAhaSlides = AHASLIDES_HOSTS.includes(host);
    if (!isPresenter && !isAhaSlides) {
        return {};
    }

    // Find a `/shared-template/:id` or `/share/:id` segment.
    const parts = url.pathname.split('/').filter(Boolean);
    let segment: string | undefined;
    let templateId: string | undefined;
    for (let i = 0; i < parts.length - 1; i++) {
        if (SHARE_SEGMENTS.includes(parts[i])) {
            segment = parts[i];
            templateId = parts[i + 1];
            break;
        }
    }

    if (!segment || !templateId) {
        return {};
    }

    const embedUrl = buildEmbedUrl(segment, templateId, url.searchParams);
    return { templateId, embedUrl };
}

/**
 * Build the canonical presenter embed URL, preserving any caller-supplied query
 * params and ensuring the hide-access-code / hide-text defaults are present.
 */
export function buildEmbedUrl(
    segment: string,
    templateId: string,
    incoming?: URLSearchParams,
): string {
    const params = new URLSearchParams(incoming ? incoming.toString() : '');
    if (!params.has('hideAccessCode')) {
        params.set('hideAccessCode', 'true');
    }
    if (!params.has('hideText')) {
        params.set('hideText', 'true');
    }
    return `https://${PRESENTER_HOST}/${segment}/${encodeURIComponent(templateId)}?${params.toString()}`;
}
