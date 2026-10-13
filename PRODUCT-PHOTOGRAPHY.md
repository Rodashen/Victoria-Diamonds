# Product photograph refresh — 14 October 2026

## Ring corrections

Splendor Stacking, Tranquility, Athena, Fae, Skylar and Celestia now use individually edited `-v2.webp` photographs and `-960-v2.webp` thumbnails in `images/products/`. Previous assets are retained. Splendor has a 4096 px square export; the other five have 2400 px square exports. These are upscaled exports of AI-retouched originals, not native optical 4K photographs.

The built-in image editing tool was used once per ring with its original photo as the edit target. Common prompt: preserve the exact silhouette, band geometry, stone positions, cuts, prongs and number of bands; restore bright polished 18K white gold with neutral silver reflections, crisp edges and diamond facets; remove beige casts and dullness without erasing pale metal; centre the complete ring on pure white with comfortable margins; no props, writing, added stones or artificial star flares. Each result was visually compared with its source. Only near-white background pixels were normalised during export; the previous aggressive background mask was not reused.

Local update; no deployment or calculator change is required until the website is approved for publication.

All 133 catalogue products now reference white-background WebP assets in `images/products/`. Each has a 960 × 960 thumbnail for collection cards and search results. All 31 Daily Sparkle primary images are 4096 × 4096 exports. Other collections have square 1600–2400 px exports. The source photos remain in their previous locations.

The 4K exports use high-quality upscaling where the source is smaller than 4096 px; this does not recover missing optical detail. JPEG masters for Daily Sparkle are retained outside the repository at `../design-review/daily-sparkle-4k/`.

## Necklace views

Luvia, Virelle, Serenity, Celeste, Aurora and Solstice had chains cropped by their source images. Their new complete-chain illustrations were made with the built-in image generation tool and inspected against the visible original front designs. The formerly unseen chain loop and clasp are reconstructed, not verified photographs of that hardware. Each product page labels this and provides an **Original detail** button with a crop of its actual source photograph. Review the reconstructed views before publishing.

## Prompt set

One built-in edit call per necklace, using its own original as the edit target, with this common prompt:

> Create one premium ecommerce catalogue photograph of this exact necklace, preserving the pendant/front ornament: stone count, cuts, arrangement, prongs, gold colour, link style and proportions. Reframe/extend the matching plain chain into a complete loop fully inside a square frame. Centre the necklace upright with its ornament below, with generous 10% white margins. Pure #FFFFFF background, no beige/cream tint, texture, gradient, writing, logo or watermark. Crisp realistic gold and diamond facets with restrained studio lighting. Maximum native resolution, target 4096 × 4096. One necklace, no collage.

Background cleanup and square composition for existing pieces used the batch image processing previously authorised by the user. Jewellery design was retained rather than regenerated for those images. Product card frames use `object-fit: contain` and do not enlarge on hover, so chains stay visible. The collection hero, brand colours, journal lifestyle photos, product prices and payment logic are unchanged.
