# Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| The water is pink or magenta. | The project uses the Built-in pipeline. | Switch to URP with a Renderer 2D: [Pipeline Setup](pipeline-setup.md#urp-with-the-2d-renderer). URP 3D and Built-in support is coming soon. |
| The water is invisible. | The renderer is the URP 3D (Universal) renderer; or the water is behind other sprites; or Opacity and the colors' alpha are 0. | Use a Renderer 2D, then check the Fluid Body's Sorting Layer and Sorting Order, then the Colors section. |
| Refraction shows black or frozen pixels. | Camera Sorting Layer Texture is off, or the water isn't on a layer drawn after it. | **Tools > Fluid Shaders 2D > Enable Refraction Support**, then set the Sorting Layer to *Fluids*. [Refraction](pipeline-setup.md#refraction). |
| An object in front of the water gets bent too. | It's on the *Fluids* layer or later. | Move it to an earlier sorting layer, or turn Refraction off. |
| Sprites behind the water aren't tinted. | Their Sorting Order is higher than the water's. | Give them a lower order on the same layer, or an earlier layer. |
| The water is too dark at night or too bright in daylight. | It reacts to 2D lights like a sprite. | Raise **Light Effects Glow**, or turn on **Ignore 2D Lights**. |
| Glints and highlights don't glow. | No HDR or no Bloom on the camera. | [Pipeline Setup](pipeline-setup.md#urp-with-the-2d-renderer) (HDR and bloom). |
| Objects fall through the water. | They have no Rigidbody2D, their collider is a trigger, or Physics Enabled is off. | Add a Rigidbody2D and a non-trigger collider. |
| Everything floats (or everything sinks). | Density compares to mass ÷ area. | [Physics](physics.md#floating-and-sinking): raise the mass of objects that should sink, or change the fluid's Density. |
| A kinematic platform doesn't splash. | Kinematic bodies need full kinematic contacts. | Turn on **Use Full Kinematic Contacts** on its Rigidbody2D. |
| My ground check hits the water. | 2D queries hit triggers by default. | [Physics](physics.md#raycasts-and-triggers). |
| Wall foam shows on a side with no wall. | Wall Foam Sides includes that side. | Turn the side off on the Fluid Body. |
| Pixel Art water shimmers while the camera moves. | The camera isn't pixel perfect. | Add a Pixel Perfect Camera; [Water Styles](water-styles.md#pixel-art). |
| Effects switched at runtime show nothing in a build. | Unity stripped that effect combination. | [Presets](presets.md#switching-presets-at-runtime). |
| The handles or bounds look wrong. | The object is rotated. | Fluid bodies don't support rotation; keep it at 0 (the inspector warns you). |
| No droplets on splashes. | Fluid Splash Particles has no Particles, the impact is weaker than Splash Threshold, or the droplets draw behind the water. | Assign a splash particle system, lower Splash Threshold, or check the droplets' sorting ([Fluid Body](fluid-body.md#fluid-splash-particles)). |
| No ripples. | The object has no Fluid Surface Waves, or Damping is very high. | Add Fluid Surface Waves; lower Damping or raise Impulse Scale. |
| A seam where two bodies meet. | Each body draws its own wall foam and edge. | Turn off Wall Foam Sides where they touch, and give both the same material and surface height. |
| Lava or toxic glow looks flat, or the lava's hot parts look pale yellow. | No HDR or no Bloom on the camera: bright colors clip. | Turn on HDR and add Bloom ([Pipeline Setup](pipeline-setup.md#urp-with-the-2d-renderer)). |
| The lava is dark at night. | Emission is off, so the lava is lit like a sprite. | Turn **Emission** on. |
| The lava doesn't light the walls around it. | Glowing materials light nothing by themselves. | Use the Lava prefab or add **Fluid Glow Lights** ([Fluid Body](fluid-body.md#fluid-glow-lights)); the walls need a lit sprite material. |
| Vapor looks like dirt or smoke stains. | Its color is darker than the background behind it. | Use a lighter **Vapor Color**, or lower its alpha. |
| Crust plates cover the whole lava. | Crust Depth is large. | Lower **Crust Depth** and **Crust Fade** for a layer along the top ([Lava Effects](lava-effects.md#crust)). |
| Changing a preset changed other objects too. | You edited a shared preset. | Undo, then choose **Create a Copy** when applying a style ([Presets](presets.md)). |
