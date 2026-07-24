# Academic Catalogue, Transit and Spell-card Study Notes

Date: 2026-07-24

This note records the institutional logic behind the 0.4.0 catalogue, route
planner and spell-card research record. It is internal editorial material; the
public site presents the resulting information directly and immersively.

## Seven-school catalogue model

All schools use the same comparable fields: degree, duration, graduation
credits, intake, tuition per term, five representative core courses, studios,
field learning, progression, additional costs and graduate paths. Programme
length and workload are deliberately different:

- most bachelor's programmes run four years and require 126–138 credits;
- medicine runs six years and requires 198 credits because it includes clinical
  rotations;
- fees rise with laboratory, clinical and consumable intensity;
- every extra charge has an in-world refund, waiver or service-credit rule so
  the catalogue reads like an administratively complete university document.

Each course list combines a recognisable Gensokyo subject with a teachable
method or responsibility. Examples include source criticism for missing pages,
reproducible magic, public prototype maintenance, corrections in journalism,
and safe exit design in spell-card systems.

## Campus route graph

The seven illustrated places form a weighted, undirected graph. Edge weights
represent travel minutes along named links. Walking roads are the common layer;
each selected vehicle adds its own actual links before shortest-path search.
This replaces the earlier model that chose one walking path and merely
multiplied its time:

- village walk can use every ordinary road;
- magic brooms connect only four berths: Misty Lake, Boundary Hall, the
  Seven-Day Laboratory and Youkai Mountain;
- the tengu express has fixed stops at Boundary Hall, Hieda History Hall and
  Youkai Mountain;
- the moon-rabbit shuttle has one direct link between Boundary Hall and
  Eientei Clinic;
- every motorised or magical itinerary may still use walking roads for its
  first and last segments.

For the standard Hakurei Gate–Kappa Workshop query, this produces four visibly
different paths: village walk via the library and history hall; broom via the
library berth; tengu express via Boundary Hall; and rabbit shuttle via Boundary
Hall and Eientei. Each edge stores its own editorial distance and travel time,
including ordinary boarding or berthing. Arrival time is calculated in the
visitor's browser. These numbers exist for consistent campus interaction, not
as geographic claims about a canonical map.

## Spell-card research construction

The spell-card study treats rule-bound danmaku as a design and accessibility
problem. Its experimental record separates:

1. successful evasion from understanding why a hit occurred;
2. declaration, sound, colour, speed, density and exit-window variables;
3. six movement or sensory conditions;
4. symmetry from substantive fairness;
5. weather as part of the readable system rather than external noise.

The numerical findings—96 patterns, 42 participants, a 0.8-second telegraph,
and the reported recognition rates—are project-original institutional data.
The closing three-question check gives the fictional research a practical
output: know the rule before impact, understand a mistake afterwards, and
retain a legible exit through every phase transition.
