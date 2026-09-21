# Primitive style adapter

Shared variants and motion consume Hina runtime CSS properties. Only this directory may reference `--reka-*`; `test/constraints.test.ts` enforces the boundary. These properties carry live measurements or interaction state, not theme tokens.

`styles.ts` maps primitive properties on the element where the primitive writes them. Do not hoist aliases to a provider or document root: CSS resolves variable references on the element defining the alias, before inheritance. Attach aliases to each overlay separately so nested overlays keep their own dimensions.

The [shared runtime property contract](../../../../shared/runtime.md) owns the variable names, meanings and binding elements. This directory owns only their Reka mapping and Vue lifecycle integration.

The slider mapping runs in the opposite direction: Hina owns the thumb geometry and supplies its transform to the primitive.

`useRekaNavigationViewport` exposes `data-hn-ready` only after all four navigation measurements exist. It observes the viewport's inline style and resets readiness when the primitive clears its measurements or the element unmounts. Keep the measured state throughout the exit animation; setting readiness from the open model would hide the exit. Shared motion uses only `data-hn-ready`.

A different framework adapter can supply the same Hina properties and readiness attribute directly. It must still implement the component interaction, accessibility and lifecycle contracts; this boundary isolates CSS integration, not the entire primitive API.
