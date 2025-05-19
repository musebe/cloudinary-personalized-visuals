/**
 * Build the Cloudinary transformation segment.
 *
 * ▸ Generative Replace (e_gen_replace)  
 * ▸ Optional text or image overlay, with colour, bg, gravity & offsets
 */
export function buildTransform({
    /* generative replace */
    from,
    to,

    /* overlay */
    overlay,
    overlayMode = 'text',

    /* placement */
    gravity = 'north_west',
    x = 0,
    y = 0,

    /* style */
    textColor = '000000',
    bgColor,
    fontFamily = 'Arial',
    fontSize = 40,
    fontWeight = 'bold',
}: {
    from?: string;
    to?: string;
    overlay?: string;
    overlayMode?: 'text' | 'image';
    gravity?: string;
    x?: number;
    y?: number;
    textColor?: string;
    bgColor?: string;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
}) {
    const chain: string[] = [];

    /* ① generative replace ------------------------------------------------ */
    if (from && to) {
        chain.push(
            `e_gen_replace:from_${encodeURIComponent(from)};to_${encodeURIComponent(to)}`
        );
    }

    /* ② overlay ----------------------------------------------------------- */
    if (overlay) {
        if (overlayMode === 'text') {
            chain.push(
                [
                    `l_text:${encodeURIComponent(
                        `${fontFamily}_${fontSize}_${fontWeight}`
                    )}:${encodeURIComponent(overlay)}`,
                    `co_rgb:${textColor}`,
                    bgColor ? `b_rgb:${bgColor}` : '',
                    `g_${gravity}`,
                    `x_${x}`,
                    `y_${y}`,
                ]
                    .filter(Boolean)
                    .join(',')
            );
        } else {
            chain.push(
                [
                    `l_${overlay}`,
                    `g_${gravity}`,
                    `x_${x}`,
                    `y_${y}`,
                ].join(',')
            );
        }
    }

    return chain.length ? `${chain.join('/')}/` : '';
}
