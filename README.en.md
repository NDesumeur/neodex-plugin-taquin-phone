# Taquin (Sliding puzzle)

The sliding tile game: a shuffled grid with one empty space, to put back in order. Grids from 3 × 3 to 8 × 8, with numbers, the NeoDex wallpaper or your own picture.

*Version française : [README.md](README.md)*

## The goal

Slide tiles into the empty space until the grid is in order (1 to the end for numbers, or the picture put back together). A tile in its place is marked.

## Playing

- **Click a tile** in the same row or column as the hole: it slides, along with every tile between it and the hole (each tile moved counts as one move).
- **Arrow keys**: the arrow slides the neighbouring tile in that direction into the hole.
- The timer starts on the first move.
- **Shuffle**: new grid. Shuffling starts from the solved grid and makes hundreds of random moves, so every grid can always be solved.

## Pictures

- **Numbers**: numbered tiles.
- **Your NeoDex wallpaper**: your NeoDex wallpaper cut into tiles.
- **Your picture**: **Choose a picture** from your PC; it is cropped to a centred square and kept in your backup.
- **Numbers on the picture** adds the numbers on the tiles to help you.
- **Hold: see the model**: keep the button pressed to see the full picture.

## Records

For each grid size, the fewest moves and the best time are kept; the top of the game shows moves, time and your record.

## Data and sync

Records, the number of solved grids and your picture are stored by NeoDex, backed up and synced between your PCs when sync is on. On first launch, the plugin picks up what you already had in NeoDex.

## Install

In NeoDex: **NeoStore → Discover → Taquin → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).

## New style and ready-made pictures

- **The style of the recent apps**: pixel art frames, buttons and font, a records panel (moves and time for each size).
- **Fits the screen**: the board follows the window, from a small laptop to a big screen, and redraws when you resize it.
- **Seven pixel art pictures**: mountains at sunset, lighthouse at night, autumn forest, oasis, fox, clownfish and turtle.
