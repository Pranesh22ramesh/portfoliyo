# Developer World progress

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

The upgraded build has not been pushed or deployed. Unverified areas include physical phone performance, battery and GPU-memory use, sustained play sessions, and exhaustive animation and collision inspection. The art remains low-poly and uses procedural geometry and materials rather than imported GLB assets, normal maps, or skinned facial rigs.

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
