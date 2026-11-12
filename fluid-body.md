# Fluid Body, Ripples and Splashes

Three components work together on a fluid object; the lava adds two more. The **GameObject > 2D Object >
Fluid** menu (and the prefabs in `Prefabs/Fluids`) set them all up.

| Component | Job |
|---|---|
| **Fluid Body** | Builds the fluid mesh, sets its draw order, and adds the physics (floating, sinking, currents, splash events). |
| **Fluid Surface Waves** | Simulates ripples on the surface when something falls in. Optional. |
| **Fluid Splash Particles** | Emits droplets from a particle system on every splash. Optional. |
| **Fluid Ambient Particles** | Spreads a particle system along the surface, such as the lava's embers. Optional. |
| **Fluid Glow Lights** | A 2D light as wide as the fluid, so a glowing fluid lights its surroundings. URP 2D only. Optional. |

The object also needs a **Mesh Filter** and a **Mesh Renderer** with a fluid material. Fluid Body
adds a trigger **Box Collider 2D** and a **Buoyancy Effector 2D** by itself and keeps them in sync.

## Fluid Body

The object's position is the **resting surface**: the top edge, at the middle. The fluid extends
down from there. Drag the edge handles in the Scene view to resize it; the opposite edge stays put.
Dragging the top handle moves the surface (and the object).

Rotation is not supported: bounds, handles and physics assume an unrotated body (the inspector warns
you). Scale works, including negative scale.

| Setting | What it does | Default |
|---|---|---|
| Size | Width and depth below the surface, in local units (multiplied by the scale). | 4 × 2 |
| Surface Margin | Room above the resting surface for waves and ripples. The mesh grows by itself when the material's waves are taller, so crests are never cut; raise it only for bigger splash ripples. | 0.5 |
| Sorting Layer | Sorting layer of the fluid. For refraction, use the *Fluids* layer ([Pipeline Setup](pipeline-setup.md#refraction)). | Default |
| Sorting Order | Order within the layer. Sprites with a lower order are drawn behind the fluid and get tinted by it. | 0 |
| Wall Foam Sides | Sides that touch a wall and show the material's Wall Foam: Left, Right, both or none. | both |
| Physics Enabled | Objects with a Rigidbody2D float, slow down and splash. | on |
| Density, Linear Drag, Angular Drag | How objects float and sink. See [Physics](physics.md). | 2, 8, 1 |
| Flow Angle, Flow Magnitude | A current that pushes objects. See [Physics](physics.md#currents). | 0, 0 |
| Splash Threshold | Minimum impact strength that raises On Splash and emits droplets. | 2 |
| Max Splash Strength | Impacts stronger than this are capped. | 12 |
| On Splash | UnityEvent called with the splash position (on the surface) and its strength. | |

**Impact strength** = vertical speed when crossing the surface × √mass, capped at Max Splash
Strength. A box of mass 1 falling at 5 units/s gives 5. Leaving the water lifts the surface with half
that strength, so it needs twice the threshold to raise On Splash. The reported strength is always
positive.

## Fluid Surface Waves

A 1D spring simulation along the surface. It sleeps while the surface is calm, so still water costs
nothing.

| Setting | What it does | Default |
|---|---|---|
| Columns Per Unit | Simulation columns per world unit. More gives finer ripples and costs more CPU. | 8 |
| Max Columns | Upper limit for very wide bodies. | 256 |
| Stiffness | How quickly the surface pulls back to flat. | 20 |
| Damping | How quickly ripples die out. 0 keeps them going (and simulating) forever. | 2 |
| Wave Speed | How fast ripples travel along the surface, in units per second. | 4 |
| Impulse Scale | How much an impact moves the surface. | 0.6 |

Ripples never leave the mesh: their height is limited to the room above the material's waves.

## Fluid Splash Particles

| Setting | What it does | Default |
|---|---|---|
| Particles | World-space particle system for the droplets. Use `Prefabs/WaterSplash` (round) or `Prefabs/WaterSplash_Pixel` (square, for pixel art). | |
| Min Particles | Droplets at strength 0; the count grows linearly up to Max Particles (a splash at the default threshold of 2 emits about 9). | 4 |
| Max Particles | Droplets for a splash at Strength For Max or stronger. | 24 |
| Strength For Max | Impact strength that emits Max Particles. | 8 |

The particle system's own emission isn't used; you can change its look (size, color, gravity,
material) freely.

**With refraction**, the water sits on the *Fluids* sorting layer while the splash prefabs draw on
*Default*, so droplets end up behind the water and get bent. Set the particle system's Renderer
**Sorting Layer** to *Fluids* with an **Order in Layer** above the water's.

## Fluid Ambient Particles

Keeps a particle system spread along the surface: its emitter becomes a thin box as wide as the fluid,
sitting on the surface, and the emission rate grows with the width, so a wide pool and a narrow one look
equally busy. The Lava prefab uses it for `Prefabs/Particles/LavaEmbers`.

| Setting | What it does | Default |
|---|---|---|
| Particles | Particle system spread along the surface; usually a child of the fluid. Its own shape rotation (which way particles leave) is kept. | |
| Rate Per Unit | Particles per second for each world unit of surface width. | 0.6 |
| Height Offset | Height of the emitter above (positive) or below (negative) the surface, world units. | 0.05 |

## Fluid Glow Lights

Adds light around a glowing fluid: one Freeform 2D light stretched to the fluid's width, full strength
from Depth below the surface to Height above it, then fading out over Falloff. It follows the fluid
when you move or resize it. The Lava prefab has one on its *Glow Light* child. URP 2D only: the
component isn't compiled without URP.

| Setting | What it does | Default |
|---|---|---|
| Glow Light | The Freeform Light 2D it shapes; usually a child of the fluid. | |
| Use Material Color | Takes the colour from the material (Surface Color for lava, Emission Color for toxic). | On |
| Color | Light colour when Use Material Color is off or the material has no glow colour. | (1, 0.55, 0.2) |
| Intensity | Brightness. | 1 |
| Height | Full-strength part above the surface, world units. | 0.4 |
| Depth | How far below the surface the light starts, world units. | 0.2 |
| Falloff | How far the glow reaches beyond its shape, world units. | 2 |

The light only shows on sprites that use a lit material (for example *Sprite-Lit-Default*) and on the
sorting layers it targets (all by default).

## Scripting API

Namespace `SebastianEscobar.FluidShaders2D`.

### FluidBody

| Member | Description |
|---|---|
| `Size` | Width and depth in local units. Setting it rebuilds the mesh and collider. |
| `SurfaceMargin` | Room above the surface for waves and ripples. |
| `SortingLayerID`, `SortingOrder` | Draw order of the fluid. |
| `WallFoamSides` | `FluidWallSides` flags: `None`, `Left`, `Right`, `Both`. |
| `PhysicsEnabled` | Turns the collider and effector on or off. `Splash` still works from code. |
| `Density`, `LinearDrag`, `AngularDrag`, `FlowAngle`, `FlowMagnitude` | Physics settings. |
| `SurfaceWorldY` | World Y of the resting surface. |
| `WorldBounds` | The fluid volume in world space (without the wave margin). |
| `HasUnsupportedRotation` | True when the object is rotated. |
| `Splash(float worldX, float strength, float radius = DefaultSplashRadius)` | Disturbs the surface at a world X. Positive strength pushes the surface down, negative lifts it. `radius` is the half-width of the disturbed area in world units, with a smooth falloff; `DefaultSplashRadius` is 0.25. Impacts at least Splash Threshold strong raise the splash events. |
| `ResizeEdge(FluidEdge edge, float worldCoordinate)` | Moves one edge (`Left`, `Right`, `Bottom` or `Surface`) to a world coordinate; the opposite edge stays. |
| `Splashed` | C# event: `Action<Vector2 position, float strength>`. |
| `OnSplash` | The same, as a UnityEvent you can wire in the inspector. |

### FluidSplashParticles

| Member | Description |
|---|---|
| `Particles` | The particle system that emits the droplets. Swap it at runtime, for example when you switch to pixel art. |

### FluidAmbientParticles

| Member | Description |
|---|---|
| `Particles` | The particle system spread along the surface. |
| `RatePerUnit` | Particles per second per world unit of width. |
| `Apply()` | Fits the emitter to the fluid now (it also follows the fluid every frame). |

### FluidGlowLights

| Member | Description |
|---|---|
| `GlowLight` | The Light 2D it shapes. |
| `Apply()` | Fits the light to the fluid now (it also follows the fluid every frame). |

### Example

```csharp
using SebastianEscobar.FluidShaders2D;
using UnityEngine;

public class SplashSound : MonoBehaviour
{
    [SerializeField] FluidBody water;
    [SerializeField] AudioSource source;
    [SerializeField] AudioClip clip;

    void OnEnable() => water.Splashed += OnSplashed;
    void OnDisable() => water.Splashed -= OnSplashed;

    void OnSplashed(Vector2 position, float strength)
    {
        // Louder for stronger impacts (strength is capped by Max Splash Strength).
        source.transform.position = position;
        source.PlayOneShot(clip, Mathf.Clamp01(strength / 8f));
    }

    // A wave from code: for example, a boat engine or a stone thrown by the player.
    public void Disturb(float worldX) => water.Splash(worldX, 4f);
}
```

## Tips

- **Two bodies side by side:** turn off Wall Foam Sides where they touch.
- **Water that leaves the screen:** turn off that side's wall foam too.
- **Many small puddles:** remove Fluid Surface Waves and Fluid Splash Particles from the ones the
  player never touches.
