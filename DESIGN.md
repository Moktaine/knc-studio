---
name: KNC Studio
description: A software studio's site drawn as a wireframe that finishes itself; near-black, cream and one muted gold.
colors:
  ink: "#0f0f0d"
  warm: "#1a1713"
  cream: "#efe9dc"
  gold: "#c9ab70"
  cream-70: "rgb(239 233 220 / 0.7)"
  cream-55: "rgb(239 233 220 / 0.55)"
  cream-30: "rgb(239 233 220 / 0.3)"
  cream-12: "rgb(239 233 220 / 0.12)"
  gold-45: "rgb(201 171 112 / 0.45)"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 12.6vw, 6rem)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  display-italic:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "1.1em"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "clamp(2.5rem, 9vw, 5.5rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "clamp(1.375rem, 2.6vw, 2rem)"
    fontWeight: 300
    lineHeight: 1.2
  accent:
    fontFamily: "Cormorant Garamond, Times New Roman, serif"
    fontSize: "clamp(1.25rem, 2.4vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.6
  body-long:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 300
    lineHeight: 1.75
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.26em"
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.28em"
rounded:
  none: "0"
  dot: "50%"
spacing:
  gutter: "clamp(20px, 4vw, 56px)"
  section-top: "clamp(112px, 20vh, 220px)"
  title-gap: "clamp(48px, 9vh, 112px)"
  row: "12px"
  field-gap: "28px"
  dock: "56px"
  dock-desktop: "64px"
  container: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.gold}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "19px 40px"
  button-primary-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
  button-text:
    textColor: "{colors.cream-70}"
    typography: "{typography.label}"
    padding: "10px 0"
  button-text-hover:
    textColor: "{colors.gold}"
  input-field:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "14px 0"
  dock:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    height: "{spacing.dock}"
    padding: "0 {spacing.gutter}"
  plan-bar:
    backgroundColor: "{colors.warm}"
    textColor: "{colors.cream}"
    padding: "14px 22px"
    width: "560px"
  chip:
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "8px 14px"
  card:
    backgroundColor: "{colors.warm}"
    rounded: "{rounded.none}"
---

# Design System: KNC Studio

## Overview

**Creative North Star: "The Drawing That Finishes Itself"**

The site opens as a wireframe: dashed boxes for a nav, a dashed frame crossed by dashed diagonals, an outlined sans headline. Scrolling turns the drawing into the built thing, line by line: dashed strokes are wiped away as solid gold strokes sweep in behind them, the gold serif half of the headline fills left to right, and the frame fills with warm brown. That sentence, "not yet" becoming "built", is the grammar of the whole system, and it is reused everywhere after the hero: the planner's unchosen services preview as dashed ghost bars and chosen ones draw as solid gold bars; an idea row has a dashed box; an invalid field gets a dashed underline; a chip for a free-text idea is dashed.

The ground is near-black and quiet. Density is low: one message per screen, very large type set light, hairline rules instead of boxes, generous vertical air between sections. Gold is never decoration for its own sake; it means chosen, built, current or actionable. Motion is slow and heavy, scrubbed to scroll in the pinned opening and eased on a heavy in-out curve elsewhere.

There are no gradients, no shadows, no rounded corners and no filled card grids. Depth comes from the 3D project ring and from the single warm surface tone.

**Key Characteristics:**
- Near-black ground, cream text, one muted gold for state, one warm brown for filled surfaces.
- Dashed hairline = not yet; solid gold = chosen or built.
- Outlined sans phrase answered by a filled gold italic serif phrase.
- Square corners everywhere; the only circle is the timeline dot.
- Hairline rules (1px) organise content; containers are rare.
- Slow, heavy easing; scroll-scrubbed choreography in the pinned opening.

## Colors

A near-monochrome warm dark palette with a single muted metallic accent.

### Primary
- **Muted Gilt** (gold): the only accent. Chosen state (ticked checkbox, schedule bar, finish line and finish label), the built half of every outlined/filled pair, the primary button's stroke and hover fill, active and hover nav links, focus outlines, text selection, the caret, the scrollbar thumb. Its 45% tint (gold-45) draws softer gold lines: the solid hero frame, chip outlines, the send bar's border, the idea field's dashed underline.

### Neutral
- **Lamp-Black Ink** (ink): page ground, the docked header, the sticky ruler head, the full-screen mobile menu, and the hover text on a filled gold button.
- **Umber Board** (warm): the one filled surface tone. The finished hero frame, project cards, the floating send bar.
- **Vellum Cream** (cream): primary text and the outline stroke of the sans headline phrase.
- **Cream tints** (cream-70, cream-55, cream-30, cream-12): a strict ladder. 70% for secondary body text and descriptions; 55% for labels, ticks, placeholders and idle icons; 30% for every dashed "not yet" stroke and for field underlines and the ruler baseline; 12% for solid hairline dividers between rows, ledger lines, FAQ items, the dock and footer.

### Named Rules
**The One Accent Rule.** Gold is the only hue. A new state, highlight or call to action is expressed in gold or in a cream tint, never in a new colour.

**The Gold Means Chosen Rule.** Gold marks something selected, built, current or actionable. If an element is none of those, it is cream.

**The Flat Fill Rule.** No gradients anywhere. Surfaces are a single flat tone: ink or warm.

## Typography

**Display Font:** Cormorant Garamond 300, 400 and 400 italic (with Times New Roman, serif)
**Body Font:** Inter 300 and 400 (with system-ui, sans-serif)

Both are self-hosted through @fontsource; no font is fetched from a third-party host.

**Character:** A high-contrast, bookish serif carries every name, number and promise that matters; a light geometric sans carries explanation and the small tracked labels. The italic serif is the voice of the finished thing.

### Hierarchy
- **Display** (Inter 300, clamp(2.6rem, 12.6vw, 6rem), 1.02, -0.035em, outlined in cream): the first half of a headline pair, drawn as a 1px stroke with transparent fill.
- **Display italic** (Cormorant Garamond italic 400, 1.1em of the display size, -0.01em): the second half of the pair, filled gold.
- **Headline** (Cormorant Garamond 300, clamp(2.5rem, 9vw, 5.5rem), 1, -0.015em): section titles. The brief title runs smaller (clamp(2.375rem, 6.6vw, 5rem), 1.06) and is capped at 18ch.
- **Title** (Cormorant Garamond 300, about 1.375rem to 2.5rem, 1.1 to 1.2): service row names, ledger terms, FAQ questions, step names (400), mobile menu links (2.25rem).
- **Accent** (Cormorant Garamond italic 400, 1.25rem to 3.25rem): finish label, estimated total, planner instruction, group headings, closing notes, the idea input, the project counter title.
- **Lead** (Cormorant Garamond 300, clamp(1.375rem, 2.4vw, 1.875rem) to clamp(1.5rem, 3.4vw, 2.5rem), 1.3 to 1.35): the opening paragraph of a section, capped at 34 to 56ch.
- **Body** (Inter 300, 1rem, 1.6): default text. Long-form answers and descriptions use 1.0625rem at 1.75, capped at 60 to 62ch, in cream-70. Row descriptions drop to 0.8125rem at 1.45 in cream-55.
- **Label** (Inter 400, 0.6875rem, 0.26em tracking, uppercase, cream-55): nav links, ruler ticks and day counts (0.2em, tabular figures), field labels, meta lines, captions, footer.
- **Button** (Inter 400, 0.75rem, 0.28em tracking, uppercase).

### Named Rules
**The Outline Then Fill Rule.** A headline pair is an outlined Inter phrase followed by a filled gold Cormorant italic phrase. The outline is the plan; the gold italic is what was made. Use it for the opening statement of a scene, not for every title.

**The Serif Holds The Number Rule.** Durations, totals and names that a visitor will remember are set in the serif; the sans only labels and explains.

## Layout

A single column inside a 1440px container with fluid side gutters (clamp(20px, 4vw, 56px)). Sections open with a tall top pad (clamp(112px, 20vh, 220px)) and a large gap under the title (clamp(48px, 9vh, 112px)); vertical spacing is expressed in clamp() against viewport height so the rhythm breathes with the screen. Text measures are always capped in ch.

The opening is one pinned 100svh stage holding the hero and the project ring. After it, content scrolls normally under a fixed docked header (56px, 64px from 860px up). Section anchors use scroll-margin equal to the dock height.

One breakpoint carries the responsive change, at 860px. Below it: nav collapses to a menu toggle, the process timeline is vertical on the left, the planner stacks name, description and track. Above it: inline nav links, a horizontal four-column timeline, the planner splits into a 42% name column, a 48px gap and the ruler, the ledger splits 32% / rest, and form fields sit two-up.

## Elevation & Depth

The system is flat. There are no box shadows and no text shadows. Depth is carried three ways: tonal layering (warm surfaces on ink), 1px hairlines at cream-12, and real 3D perspective in the project ring, where cards stand on a cylinder and curve toward the viewer. Stacking for the sticky ruler and the dock is done with an opaque ink background, not a shadow.

### Named Rules
**The No Shadow Rule.** Nothing casts a shadow. Separation is a hairline or a change from ink to warm.

## Shapes

Every corner is square (0), including buttons, fields, chips, the scrollbar thumb, cards and the send bar. The single exception is the 9px circle that marks each process step. Lines are 1px throughout; the schedule bar is the one solid mass (6px tall). Dashed strokes use the CSS dashed border or an SVG dash of 4 on, 5 off (3 and 3 in the hero arch). Recurring geometry in the illustrations is the arch, the circle and the horizon line, drawn in hairlines inside a 5:7 card.

### Named Rules
**The Dashed Means Not Yet Rule.** A dashed stroke marks something unbuilt, unchosen, unsized or unconfirmed. When it becomes real it turns solid, and usually gold. Never dash a finished element for texture.

## Components

### Buttons
Quiet until touched, then the gold floods in.
- **Shape:** square (0).
- **Primary:** transparent with a 1px gold border and gold uppercase tracked text, 19px 40px padding.
- **Hover / Focus:** a gold fill wipes in from the left (scaleX, 0.9s heavy ease) and the text turns ink. Focus-visible gets the same wipe plus the global 1px gold outline at 6px offset.
- **Text button:** uppercase tracked label in cream-70 with a cream-30 underline at 6px offset; turns gold on hover.

### Chips
- **Style:** 1px gold-45 outline, square, 8px 14px padding, 0.875rem text. They list the chosen plan in the brief.
- **State:** a chip for a visitor's own idea is dashed with gold text, following the Dashed Means Not Yet rule.

### Cards / Containers
- **Corner Style:** square.
- **Background:** warm, or the card's own art ground (ink, cream, warm or gold).
- **Shadow Strategy:** none.
- **Border:** 1px cream-12 inner hairline on every project card except card 01, which must match the hero frame pixel for pixel.
- **Proportion:** 5:7 (150 by 210 design units), scaled by a single factor so the hero frame hands off exactly to card 01.

### Inputs / Fields
- **Style:** underline only. Transparent ground, 1px cream-30 bottom border, 14px 0 padding, 1.1875rem text, gold caret, label above in the label style. The textarea grows with content and never shows a resize handle.
- **Focus:** the underline turns gold over 0.8s; no outline box.
- **Error:** the underline becomes a dashed gold line.
- **Idea input:** a variant set in italic serif with a dashed gold-45 underline that turns solid gold on focus.

### Navigation
- **Hero nav:** starts as dashed wire boxes and is replaced by the real nav during the opening: a widely tracked Inter wordmark (0.36em) and label-style links that turn gold on hover.
- **Docked header:** fixed, ink, 1px cream-12 bottom rule; fades in once the hero nav leaves. The link for the section in view is gold.
- **Mobile:** a text "Menü" toggle opens a full-screen ink sheet of large serif links divided by hairlines, each rising 12px and fading in on a 0.05s stagger.

### Pinned Hero
A 100svh stage that scrubs with scroll: the dashed nav, rule and frame are wiped away right to left as solid lines sweep in; the gold italic phrase fills by clip-path; the frame fills with warm and the arch art turns from dashed cream to gold; then the frame crops to exactly one card and hands off to the ring.

### Project Ring
Ten 5:7 cards on a cylinder under CSS perspective, each facing inward. The camera pulls back so neighbours curve toward the viewer, then the ring rotates through every card with scroll. A centred counter shows the index in gold tabular figures, the total and a label, with the project title in italic serif below.

### Schedule Planner
The signature component.
- **Ruler:** week ticks in the label style along a cream-30 baseline, sticky under the dock on an opaque ink head.
- **Rows:** a 14px square checkbox, a serif name in cream-70 (cream when on), day range in the label style (gold when on), a small description, and a track. Rows are divided by cream-12 hairlines and grouped under italic serif group headings on a cream-30 rule. Base rows that are always included show a dimmed, filled box and cannot be unticked.
- **Bars:** a 6px solid gold bar per chosen row, drawn with scaleX from the left on a 1.1s heavy ease.
- **Ghost bars:** unchosen rows show a dashed cream-30 line at the current finish, cut to length with clip-path so dashes never stretch; hovering the row turns the ghost gold.
- **Finish flag:** a 1px gold vertical line with an italic gold "~ X–Y hafta" label, sliding by transform; the label flips to the left side when the finish runs late. On phones the line lives only on the sticky ruler so it never strikes through names.
- **Total:** the estimated delivery sentence in large italic serif, outlined gold until a choice fills it.
- **Send bar:** a fixed warm bar with a gold-45 border, max 560px, that slides up while the rows are on screen, showing the plan count in italic serif and an underlined gold link to the brief.

### Ledger
A definition list of what was built: serif terms and cream-70 descriptions separated by cream-12 hairlines top and bottom, two columns from 860px.

### Process Timeline
A hairline track that draws in gold with scroll; each 9px ring dot fills gold and its step rises from 30% to full opacity when the line reaches it. Vertical on phones, horizontal on desktop.

### FAQ
Native disclosure rows between cream-12 hairlines. The question is a serif title with a thin plus drawn in SVG; hover or open turns the row gold and turns the plus 45 degrees into a cross. The answer fades down 6px into place.

## Do's and Don'ts

### Do:
- **Do** express every "not yet / now chosen" change as dashed cream-30 becoming solid gold.
- **Do** pair an outlined Inter 300 phrase with a filled gold Cormorant italic phrase for the opening statement of a scene.
- **Do** keep corners square and lines at 1px; use the warm tone for the few filled surfaces.
- **Do** set names, durations and totals in Cormorant Garamond; keep labels at 0.6875rem, uppercase, tracked 0.2em to 0.28em.
- **Do** choreograph with transform, opacity and clip-path, on the heavy ease (cubic-bezier(0.65, 0, 0.35, 1)) for movement and the soft out-ease (cubic-bezier(0.16, 1, 0.3, 1)) for hover colour, at 0.6s to 1.1s.
- **Do** give every scroll-driven scene a finished, static reduced-motion state: no pin, no 3D, every wireframe layer hidden and every gold layer shown.
- **Do** draw icons as thin SVG strokes (1.2) in currentColor or cream-55.

### Don't:
- **Don't** use gradients, shadows or rounded corners.
- **Don't** introduce a second accent hue or a brighter gold.
- **Don't** dash a finished element, or draw a chosen element dashed.
- **Don't** use bounce, spring or elastic easing, or short snappy durations.
- **Don't** fill containers with boxed cards; separate content with hairlines.
