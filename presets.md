# Presets

A preset is an ordinary material asset with the asset label **FluidPreset**. Applying a preset
copies all its values and effects onto your material. The shipped ones live in
`Materials/Water/Presets`.

## Applying a preset

In the material inspector, open **Style Preset** and pick a style. Applying is undoable.

When the material you're editing is itself a preset (new water starts with the shared
*Water_Simple*), Unity asks first:

- **Create a Copy**: makes a new material with the chosen style next to your open scene (in
  `Assets` if the scene isn't saved), and switches the selected objects that used the preset to it.
- **Change the Preset**: overwrites the preset; everything that shares it changes.
- **Cancel**: nothing changes.

Your own **Noise Texture** is kept when the preset uses the pack's *FluidNoise*.

## Creating your own

1. Tune a water material until you like it.
2. Click **Save as Preset…** in its inspector and choose a name and folder.
3. Your preset now appears in **Style Preset** for every material using the same shader.

To turn an existing material into a preset by hand, add the asset label `FluidPreset` to it in the
Project window. Remove the label to hide a preset from the list.

## Switching presets at runtime

`FluidPresets.Apply` copies a preset onto a material in the Editor and in player builds:

```csharp
using SebastianEscobar.FluidShaders2D;
using UnityEngine;

public class StyleSwitcher : MonoBehaviour
{
    [SerializeField] MeshRenderer water;
    [SerializeField] Material[] styles;
    Material _copy;

    void Awake()
    {
        // Work on a copy: changing water.sharedMaterial would change the asset in the Editor.
        _copy = new Material(water.sharedMaterial);
        water.sharedMaterial = _copy;
    }

    public void Use(int index) => FluidPresets.Apply(_copy, styles[index]);

    void OnDestroy() => Destroy(_copy);
}
```

| Member | Description |
|---|---|
| `FluidPresets.Apply(Material target, Material preset)` | Copies every value and the effect keywords. Both must use the same shader. Keeps the target's own noise texture when the preset uses the default one. |
| `FluidPresets.Label` | The asset label that marks presets: `"FluidPreset"`. |
| `FluidPresets.DefaultNoiseName` | Name of the pack's noise texture: `"FluidNoise"`. |

**In builds,** a player only contains the effect combinations that some material in the build uses
(Unity strips the others). If you switch presets at runtime, make sure every preset you switch to is
referenced by the build (for example, in a serialized array like `styles` above).

Turning single effects on and off by code needs those combinations too. Two ways:

- **Simplest:** for each combination you need, keep a material with exactly those effects on, and
  reference it from the scene (an array on any component is enough). It is never drawn; it only keeps
  the combination in the build.
- **Shader Variant Collection:** *Assets > Create > Shader > Shader Variant Collection*, add the
  Water shader with pass type *ScriptableRenderPipeline* and each keyword combination (the effect
  keywords, such as `_FLUID_SURFACE _FLUID_BUBBLES`), then reference the collection from a component
  in your scene and call `WarmUp()` on it at start. The showcase demo does this
  ([Demo Scenes](demo-scenes.md#the-live-editor-in-builds)).
