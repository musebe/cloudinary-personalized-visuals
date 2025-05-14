// src/lib/transform.ts

/**
 * Create a Cloudinary transformation segment.
 *
 * ① Generative Replace – e_gen_replace:from_<from>;to_<to>/
 * ② Optional overlay – text with background & white text, or an image layer.
 */
export function buildTransform({
    from,
    to,
    overlay,
    overlayMode = 'text',
    x = 0,
    y = 0,
    textColor = '000000', // badge background hex
}: {
    from?: string;
    to?: string;
    overlay?: string;
    overlayMode?: 'text' | 'image';
    x?: number;
    y?: number;
    textColor?: string;
}) {
    const parts: string[] = [];

    // ① generative replace
    if (from && to) {
        parts.push(
            `e_gen_replace:from_${encodeURIComponent(from)};to_${encodeURIComponent(to)}`
        );
    }

    // ② overlay layer
    if (overlay) {
        if (overlayMode === 'text') {
            // ← use Arial_40_bold instead of 60 so it’s the same size as your UI span
            parts.push(
                `l_text:Arial_40_bold:${encodeURIComponent(
                    overlay
                )},b_rgb:${textColor},co_rgb:FFFFFF,g_north_west,x_${x},y_${y}`
            );
        } else {
            parts.push(`l_${overlay},g_north_west,x_${x},y_${y}`);
        }
    }

    // ③ join + trailing slash
    return parts.length ? parts.join('/') + '/' : '';
}
