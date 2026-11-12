# Demo Scenes

Both scenes are in `Demo/Scenes`. Open one and press Play. Your project's active renderer must be a
Renderer 2D ([Pipeline Setup](pipeline-setup.md)). The showcase panel's Refraction switch also needs
[refraction support](pipeline-setup.md#refraction); without it the panel shows a note with the steps.

## WaterInteraction

A pool with walls, a current and a few objects. **Click** (or tap) to drop the next object: light
crates float, balls bob, heavy boxes sink. Shows buoyancy, ripples and splash particles.

## FluidShowcase

A test room built to show every fluid and effect: a checkered wall, color bars, fine stripes and a
high-contrast checker crossing the surface, inside a tank whose floor and walls collide. The part of
each prop under the fluid shows tint, refraction, caustics and depth fade; the part above is the
reference. **Click** the fluid to drop objects: they float, sink slowly in lava, and splash.

The panel on the right is a **live material editor**:

- **Fluid**: Water, Lava, Acid or Poison. Each one is its prefab from `Prefabs/Fluids`, with its own
  physics and particles (the lava adds embers and a glow light).
- **Style**: switches between that fluid's presets (eight for water, five for each of the others).
- **Reset**: back to the chosen style.
- **Night**: dims the global 2D light; a point light follows the pointer in both modes.
- One switch per effect, with its settings below it, and every value of the material. Colors open
  sliders for hue, saturation, value and alpha (plus intensity for HDR colors) when you click them.
- **–** folds the panel.

The panel always edits an in-memory copy of the fluid's material. Your assets never change, in the
Editor or in a build, and the original material comes back when you leave Play mode.

The scene has its own **Global Volume** with Bloom and enables post-processing on its camera only.
It doesn't change your project settings.

## The live editor in builds

The showcase also works in a player build (for example WebGL). A build only contains the effect
combinations prepared for it, so in a build the panel allows **each preset plus or minus one
effect**. When you switch a second effect, the first one returns to the preset, and a line under
the buttons explains it. Switching the same effect back, Reset and choosing another style clear
the change.

The combinations come from `Demo/ShowcaseVariants.shadervariants`, a **Shader Variant Collection**
referenced by the panel and warmed up when the scene starts. Use the same approach in your game if
you switch effects at runtime ([Presets](presets.md#switching-presets-at-runtime)).

## Using the demo scripts

The scripts in `Demo/Scripts` (namespace `SebastianEscobar.FluidShaders2D.Demo`) are examples, not
part of the runtime: Fluid Demo Dropper, Fluid Demo Lighting and Fluid Material Panel. They're free
to copy into your project, but they may change between versions.
