# Pipeline Setup

## URP with the 2D Renderer

The water draws in the 2D Renderer's pass and reacts to **2D lights** like a lit sprite.

1. Your project uses the Universal Render Pipeline (*Project Settings > Graphics*). With the
   Built-in pipeline the water draws pink.
2. The URP asset's default renderer (or your camera's renderer) is a **Renderer 2D**. With the URP 3D
   (Universal) renderer the water draws nothing at all.
3. That's all for every effect except refraction.

Without any 2D light in the scene, URP draws the water at full brightness. With lights, the water
darkens and tints like your sprites; **Light Effects Glow** and **Ignore 2D Lights** in the
material's Lighting section control how much ([Water Effects](water-effects.md#lighting)).

**HDR and bloom:** highlight, glints, caustics and rays accept HDR colors. They only glow if your
camera renders HDR (URP asset *Quality > HDR*), has **Post Processing** turned on in its Camera
component, and a Volume has a **Bloom** override. The showcase scene has its own Volume as an
example.

## Refraction

Refraction bends what is drawn **behind** the water, so URP has to copy the screen before drawing
the water. Do it once per project:

1. Choose **Tools > Fluid Shaders 2D > Enable Refraction Support** and confirm. It changes the URP
   asset's **default** renderer (a camera that overrides its renderer needs the same change by hand):
   - turns on **Camera Sorting Layer Texture** in your Renderer 2D;
   - adds a **Fluids** sorting layer, drawn after the others, if you don't have one;
   - sets **Foremost Sorting Layer** so the copy holds every layer drawn before *Fluids* (unless you
     already chose a valid one).
2. Set each fluid's **Sorting Layer** (on the Fluid Body) to **Fluids**.
3. Turn on **Refraction** in the material.

You can do the same by hand in your Renderer 2D asset: *Camera Sorting Layer Texture > Foremost
Sorting Layer* set to the last layer that should show through the water.

Things to know:

- Anything on the *Fluids* layer or later isn't in the copy, so it doesn't bend. Put objects that
  should be seen through the water on earlier layers, and objects in front of it (such as splash
  droplets) on *Fluids* with a higher order ([Fluid Body](fluid-body.md#fluid-splash-particles)).
- Without the setup, refracted water shows black or old pixels. The material inspector warns you and
  offers the same button.
- The copy costs one full-screen blit per frame, shared by every fluid. It is paid as soon as
  Camera Sorting Layer Texture is on, even if no material uses Refraction.

## URP 3D Renderer and Built-in pipeline

Coming soon.
