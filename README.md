# 幻想鄉立東方大學

An editorial, responsive website for a fictional university in Gensokyo.

> 本站為東方Project非官方二次創作，與上海愛麗絲幻樂團及 ZUN 無關。  
> Touhou Project 原作：ZUN（上海愛麗絲幻樂團）。

## What is included

- school introduction and AU principles;
- seven fictional schools grounded in Touhou world structures;
- filterable faculty profiles with canon/AU separation;
- admissions timeline and applicant routes;
- fictional research projects and campus life;
- responsive mobile navigation, accessible dialogs and reduced-motion support;
- original campus illustrations with no official game assets.

## Run locally

No build step or dependencies are required.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Research and provenance

The research pack is kept one level above this repository in the working
directory:

```text
../research/
```

It records the source hierarchy, canon/AU boundaries, faculty mapping, fan-work
guideline review and generated-image provenance. A release-friendly copy is
included in this repository under `docs/research/`.

## Rights

- Website code: MIT License.
- Original generated campus illustrations: created specifically for this
  project; see `docs/research/content-and-provenance.md`.
- Touhou Project and its characters/settings belong to their respective rights
  holders. No official game assets are included.

This repository is non-commercial and does not collect personal data.
