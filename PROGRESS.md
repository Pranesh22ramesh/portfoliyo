# Developer World progress

## Roadster and neighborhood detail pass

- [x] Compared the deployed and local river-town baseline in Chrome at matching viewpoints and visited all ten destinations.
- [x] Authored and loaded a 39 kB Roadster GLB with a curved body, roof, glazing, reflective paint and a generated normal texture. Reworked wheels, mirror mounts and vehicle lean. The built-in mesh remains available if the GLB cannot load. Regenerate with `node scripts/build-world-assets.mjs`.
- [x] Rebuilt the detailed character geometry into a single skinned mesh per character with weighted arms and legs. Nearby rigs are created on demand and culled against the camera bounds; distant characters use simpler geometry. Added twelve neighbors with roles, sidewalk activity and individual walk-up dialogue.
- [x] Added cafe furniture, parasols, planters, fences, balconies and bicycle frames. Expanded tree silhouettes, added animated pet tails and directional glints on the water, and retained the existing river, bridge, park and road layout.
- [x] Added a photo zoom control, a less obstructive title while playing, a compass indicator, and updated dialogue styling. Fixed the roof overlap and headlights identified in the close-ups.
- [x] Changed visible labels to Resume. Checked the public PDF and integrated the missing paper presentation award. The site retains 7.18/10 CGPA, the past JAC MediaLand and Twincord roles, credential previews, portfolio links, leadership and contact.
- [x] No new third-party asset licenses. The GLB, shaders, normal and reflection textures and other scene additions are original. Retained the user-provided certificate artwork as before.

Final production build, lint, type checks, seven Jest tests and seven Playwright scenarios passed. The browser captured all ten destinations and the roadster close-up on the final build. No page or console errors were captured in the tour.

| Chrome at spawn | FPS | p95 frame | Controls ready | JS heap |
| --- | ---: | ---: | ---: | ---: |
| Intel UHD desktop | 144 | 7 ms | 1.26 s | 16 MiB |
| Intel UHD touch emulation | 144 | 7 ms | 0.76 s | 16 MiB |
| SwiftShader, 4x CPU throttling | 27 | 42 ms | 3.05 s | 14 MiB |

Resource transfer was about 470 kB. Relative to the river-town baseline of 417 kB, the increase includes the new GLB and its lazy loader. The software simulation remained below 30 FPS even with adaptive rendering. Physical mobile performance, battery consumption and long-session memory remain unmeasured.

See `artifacts/visual-qa/film` for before and after captures. The quality is still stylized game art, with procedural architecture and animals. Neither film-level richness around the entire map nor physical device performance is established. LinkedIn restricted automated access. Initial QA ran against a local production build.

## River town visual upgrade

- [x] Captured the deployed baseline and latest local baseline in Chrome at matching viewpoints. Recruiter and mobile baseline captures matched visually. Desktop and park captures differed slightly due to animation timing. Walked the browser through all ten named destinations using fast travel and opened each corresponding host panel.
- [x] Created distinct facades with painted storefronts, trim, shutters, windows, porticoes and signs. Added curbs that stop at intersections, bridge balustrades, bay markings, planters, a shelter and landscaped riverbanks. Reworked the park fountain, added shoreline stones and extended the terrain beyond the road boundaries.
- [x] Reshaped and detailed the hero car and parked cars. Added a visible cabin, seats, dashboard, steering wheel, rear details and spoked wheels. Added layered character and pet models with jointed limbs, wardrobe and facial features.
- [x] Added a gradient sky, soft contact shadows, ground headlight beams, material grain and animated water with bank foam and dusk tint. Polished the HUD, typography, destination indicator, photo framing, mobile controls and recruiter panels.
- [x] Fixed a stale destination interaction immediately after fast travel, curb strips over intersections, an unsupported park sign and oversized nighttime headlight shapes.
- [x] Retained the existing driving simulation, map, GPS, passport, settings, audio, photo mode, persistence, fallback and professional routes. Checked the public resume for 7.18/10 and both internships. Corrected broken punctuation in some portfolio and world labels.
- [x] Scene assets are original geometry, shaders and a generated sign atlas. No new third-party art, textures or recordings. Character articulation uses a hierarchy of rigid model parts.
- [x] Production build, lint, type checks, 7 Jest and 6 Playwright checks passed. Browser captures reviewed at spawn, garage, university, park, on foot, at night and at a phone-sized viewport. No browser errors in the final capture tour. Screenshots are in `artifacts/visual-qa` and can be reproduced with `node scripts/capture-world.mjs`.

Final Chrome measurements at spawn, after adaptation:

| Setup | FPS | p95 frame | Controls ready | JS heap sample |
| --- | ---: | ---: | ---: | ---: |
| Intel UHD, 1280 x 720 | 144 | 7 ms | 943 ms | 14 MiB |
| Intel UHD, 390 x 844 touch emulation | 144 | 7 ms | 817 ms | 16 MiB |
| SwiftShader with 4x CPU throttling | 26 | 49 ms | 3.12 s | 15 MiB |

The browser reported about 417 kB of resource transfers. The final distance and quality changes improved the software result from 20 FPS in the previous art pass to 26 FPS. The earlier baseline measured 28 FPS under the software simulation. The final version remains short of the 30 FPS goal in that test. Software startup and frame times vary significantly while the scene compiles.

The river-town build was later deployed as e94c166. Unverified areas include physical phone performance, battery and GPU-memory use, sustained play sessions, and exhaustive animation and collision inspection. The art remains low-poly and uses procedural geometry and materials rather than imported GLB assets, normal maps, or skinned facial rigs.

## Scope delivered

- [x] Reconciled the public GitHub profile, repository sources, supplied résumé, certificates and internship updates. Used CGPA 7.18/10 and both past internship roles. Removed unsupported percentages and publication claims. Added verified public source links and distinguished source evidence from measured outcomes.
- [x] Built an original 3D town with ten destinations, roads, sidewalks, bridges, parked cars, bicycles, traffic signals, lights, parks, vegetation, a river, pond, animated fountain and moving clouds.
- [x] Implemented a drivable supercar with acceleration, braking, reverse, steering and collisions. Added parking, a walking avatar, vehicle entry and exit, camera, keyboard and mobile touch controls.
- [x] Added hosts at all ten destinations, ambient pedestrians, animated pets and wildlife, distance-based activity and scripted interactions. Included a hidden bench and park secrets.
- [x] Added minimap, speedometer, road GPS, fast travel, reset, skippable intro, tutorial and pause panels.
- [x] Added preferences, paint, day and night, local passport stamps, photo controls and PNG downloads. Engine and environmental audio start muted.
- [x] Added independent HTML Recruiter Mode, search, section links, four public project case studies, seven credential previews, available issuer links, profile, privacy-safe PDF résumé, leadership, email contact, SEO and social card.
- [x] Limited render scale and visible activity on slower systems. Paused drawing when backgrounded, offscreen or reading a panel. Added context loss recovery and a Recruiter Mode path for unsupported WebGL.
- [x] Kept Next.js and Vercel compatibility. Updated Next.js to a patched release, removed the external chat service dependency and retained its route with scripted responses. All 3D models and sounds are original procedural assets. Credential artwork is the issuers’ material, drawn from user-supplied sources.

## Verification

- Production build, lint, type checks and all seven Jest tests passed. Production dependency audit reported zero known vulnerabilities.
- All six Playwright scenarios passed against the final production build. Coverage includes HTML with JavaScript disabled, desktop driving, braking, vehicle entry and exit, GPS, fast travel, NPC interaction, passport, audio toggle, settings persistence, photos, touch input and overlap checks, recruiter search, credential fullscreen, résumé, invalid routes, intro skip and WebGL recovery.
- Firefox smoke checked 3D startup and Recruiter Mode search. Reviewed desktop, mobile, résumé and credential renders.
- Corrected invalid résumé MIME and missing social art, mobile HUD overlap, adaptive-resolution flicker, a missing favicon request, and unnecessary draw calls.

## Performance

Local production build, Chrome headless. First controls ready is measured from navigation. Frame times are for a settled 2.5 second sample at the spawn point.

| Setup | FPS | p95 frame | Controls ready | Draw calls | JS heap sample |
| --- | ---: | ---: | ---: | ---: | ---: |
| Intel UHD, 1280 x 720 | 144 | 7 ms | 577 ms | 71 | 12 MiB |
| Intel UHD, 390 x 844 touch emulation | 144 | 7 ms | 630 ms | 39 | 17 MiB |
| SwiftShader with 4x CPU throttling | 28 | 42 ms | 2.77 s | 56 | 13 MiB |

Resource transfer was approximately 402 kB, as reported by the browser. The software renderer adapted to 0.33x render scale and remained below the 30 FPS target. Short snapshots do not establish battery use or long-session memory stability.

## Remaining limits

- Mobile viewport tests ran on desktop hardware. iPhone Safari and physical budget Android performance, battery usage, long-session memory behavior and a live Vercel build remain unmeasured.
- GitHub sources were accessible. LinkedIn blocked automated access to its media. Local certificate files supplied the previews. Public Oracle and Simplilearn holder verification links were unavailable. The Infosys QR contains the student identifier and was removed from its public preview.
- The Certificate Generator has a public sign-in screenshot. Its authenticated pages require a Twincord account. Bouquet Shop’s hosted URL returned 404. The other projects lack supplied screenshots or verified public demos.
- Research content describes prototypes. Independent outcome measurements and publication evidence were unavailable. Some animation paths and scenery interactions were checked in screenshots or simulation. Audio verification exercised controls, not sound output through physical speakers.
