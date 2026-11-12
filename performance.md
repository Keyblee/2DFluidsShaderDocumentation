# Performance

Each fluid is one transparent mesh per Fluid Body, drawn in a single pass. Every material is SRP
Batcher compatible. The cost is in the pixels it covers, so a fluid filling the screen costs more
than a puddle.

## Cost per effect

Texture samples per pixel are the main cost on mobile GPUs. Effects that are off are compiled out
and cost nothing.

| Effect | Texture samples | Notes |
|---|---|---|
| Base (colors, depth fade) | 0 | |
| 2D lights | 1–4 | one light texture per 2D light blend style in use; 0 with **Ignore 2D Lights** |
| Surface | 2 | waves and foam noise |
| Reflection | 0 | |
| Light Rays | 0 | a few sine waves |
| Bubbles | 0 | procedural cells |
| Glints | 0 | procedural cells |
| Wall Foam | 0 | reuses the surface noise; 1 with Surface off |
| Caustics | 2 | two noise layers |
| Pixel Art | 0 | |
| Bands | 0 | |
| Refraction | 2 | plus one full-screen copy per frame, shared by every fluid and paid whenever Camera Sorting Layer Texture is on |

Everything on except refraction: **4 samples** from the water itself, plus the 2D light textures. With refraction: **6**.

On the CPU, **Fluid Surface Waves** costs a little per column while ripples move and nothing once the
surface is calm (it sleeps). The mesh is uploaded at most once per frame.

## Lava and Toxic

The same rules apply. Their extra costs:

| Lava effect | Texture samples | Notes |
|---|---|---|
| Surface | 1 | wave noise |
| Detail (always) | 1 | shared by body heat, cell warp, seams and pulse |
| Crust | 0 | one 3×3 procedural cell search: the heaviest part on mobile |
| Molten | 2 | two turned lookups, so the pattern never repeats visibly |
| Emission, Heat Glow, Bubbles, Flow, Pixel Art, Bands | 0 | |

Lava with everything on: **4 samples** plus the 2D light textures, and the cell search.

| Toxic effect | Texture samples | Notes |
|---|---|---|
| Surface | 2 | waves, and foam and froth |
| Vapor | 1 | |
| Caustics | 2 | as water |
| Refraction | 2 | as water |
| Bubbles, Emission, Glints, Wall Foam, Pixel Art, Bands | 0 | |

Toxic with everything on except refraction: **5 samples**; with refraction **7**.

The lava's **Fluid Glow Lights** adds one 2D light: its cost is that of any Freeform light covering
the same area. The embers are a regular particle system whose rate grows with the pool's width.

## Recommendations for mobile

- Start from **Simple**, **Flat** or **Cartoon** and add only the effects you need.
- Caustics and Refraction are the expensive ones; turn them on for the hero water only.
- For lava, Crust is the heaviest effect: bigger cells don't make it cheaper, turning it off does.
  Molten costs two samples.
- **Ignore 2D Lights** skips the light textures, if your water doesn't need to react to lights.
- Leave Camera Sorting Layer Texture off if no water uses Refraction.
- Use a lower **Columns Per Unit** (4–6) on Fluid Surface Waves for wide bodies.
- Keep big water bodies from overdrawing each other.
- Bloom is a camera cost, not a water cost; turn it off on low-end devices if you need to.
