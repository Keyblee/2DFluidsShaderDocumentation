# Physics

With **Physics Enabled** on, the Fluid Body keeps a trigger **Box Collider 2D** and a **Buoyancy
Effector 2D** matching the fluid's size. Any object with a **Rigidbody2D** and a non-trigger collider
floats, slows down and splashes. Change these settings on the Fluid Body, not on the effector: the
body writes them to the effector.

## Floating and sinking

An object's **density** here is its mass divided by its collider's area (in world units²). A 1 × 1
box with a mass of 1.5 has a density of 1.5.

- Density lower than the fluid's **Density**: it floats, sitting deeper the closer the two are.
- Density higher: it sinks.

Once fully under water, the sinking speed settles at about:

```
sinking speed ≈ 9.8 × (object density − Density) / Linear Drag
```

This assumes the default gravity (9.81), Gravity Scale 1 and no Linear Damping on the Rigidbody2D.
With the defaults (Density 2, Linear Drag 8), a box of density 4 sinks at about 2.5 units/s. Raise
Linear Drag for honey-like fluids, lower it for something thin.

| Setting | Effect | Default |
|---|---|---|
| Density | How strongly objects float. | 2 |
| Linear Drag | How much the fluid slows moving objects. | 8 |
| Angular Drag | How much it slows spinning objects. | 1 |

Each fluid prefab comes tuned for its fluid:

| Prefab | Density | Linear Drag | Angular Drag | Feels like |
|---|---|---|---|---|
| Water | 2 | 8 | 1 | water |
| Acid | 2 | 10 | 1.5 | a little thicker than water |
| Poison | 2.4 | 16 | 3 | thick: objects sink slowly |
| Lava | 3 | 24 | 4 | very thick: light objects float high, heavy ones sink very slowly |

Unity's buoyancy works with areas, not with real mass: two objects with the same density behave the
same whatever their size. To make one object sink, raise its Rigidbody2D mass (or shrink its
collider).

## Currents

**Flow Angle** (degrees, 0 = to the right) and **Flow Magnitude** push submerged objects, like a
river. 0 magnitude is still water; a negative magnitude pushes the opposite way. The current moves objects only; the surface waves keep their own
**Wave Speed** in the material (set it negative to make waves travel left).

## Splashes

An object splashes when it crosses the surface: entering from above pushes the surface down,
leaving lifts it a little. The impact strength is its vertical speed × √mass, capped at **Max
Splash Strength**. Strengths of at least **Splash Threshold** raise the splash events and emit
droplets; weaker ones only ripple. An object with several colliders splashes once.

These never splash:

- trigger colliders (sensors);
- colliders without a Rigidbody2D;
- crossings far below the surface (an object moving inside the fluid).

## Kinematic bodies

A **Kinematic** Rigidbody2D (moved with `MovePosition`, such as a moving platform or a scripted
boat) only reports trigger contacts when **Use Full Kinematic Contacts** is on in its Rigidbody2D.
Turn it on, and kinematic bodies splash like dynamic ones. They don't float: buoyancy only moves
dynamic bodies.

## Raycasts and triggers

The fluid's collider is a trigger. By default Unity's 2D queries hit triggers, so a ground check
or a raycast can hit the water. Pick one:

- Put the water on its own **Layer** and leave that layer out of your query masks.
- Or turn off **Queries Hit Triggers** in *Project Settings > Physics 2D*. This changes every query
  in your project.

To stop some objects from floating, turn on **Use Collider Mask** on the Buoyancy Effector 2D and
pick the layers it affects (the Fluid Body leaves that setting alone). It only removes buoyancy and
drag: those objects still splash. To keep objects out of the water entirely, put them on a layer
that doesn't collide with the water's layer in *Project Settings > Physics 2D > Layer Collision
Matrix*.

You can add your own trigger colliders to the water object (for example, a damage zone that reaches
above the surface). The Fluid Body only uses its own collider for splashes.
