/**
 * Create a Cloudinary transformation segment.
 *
 * Includes:
 *  • Generative Replace  – `e_gen_replace:prompt_<from>;replacement_<to>/`
 *  • Optional overlay    – text or image positioned at (x, y)
 *
 * Returns a string like:
 *   l_text:Arial_40_bold:SALE,g_north_west,x_30,y_40/
 *   e_gen_replace:prompt_chair;replacement_sofa/
 */
export function buildTransform({
    from,
    to,
    overlay,
    overlayMode = 'text', // 'text' | 'image'
    x = 0,
    y = 0,
}: {
    from?: string;
    to?: string;
    overlay?: string;
    overlayMode?: 'text' | 'image';
    x?: number;
    y?: number;
}) {
    const parts: string[] = [];

    if (overlay) {
        parts.push(
            overlayMode === 'text'
                ? `l_text:Arial_40_bold:${encodeURIComponent(
                    overlay,
                )},co_white,g_north_west,x_${x},y_${y}`
                : `l_${overlay},g_north_west,x_${x},y_${y}`,
        );
    }

    if (from && to) {
        parts.push(`e_gen_replace:prompt_${from};replacement_${to}`);
    }

    return parts.length ? parts.join('/') + '/' : '';
}
