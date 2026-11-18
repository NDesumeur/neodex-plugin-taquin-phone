# Taquin

Le jeu de pièces à faire glisser : une grille mélangée avec une case vide, à remettre dans l'ordre. Grilles de 3 × 3 à 8 × 8, avec des chiffres, le fond d'écran de NeoDex ou ta propre image.

*English version: [README.en.md](README.en.md)*

## Le but

Faire glisser les pièces dans la case vide jusqu'à ce que la grille soit dans l'ordre (de 1 à la fin pour les chiffres, ou l'image reconstituée). Une pièce à sa place est marquée.

## Jouer

- **Clique une pièce** sur la même ligne ou la même colonne que le trou : elle glisse, et toutes celles entre elle et le trou glissent avec elle (chaque pièce déplacée compte pour un coup).
- **Flèches** : la flèche fait glisser dans le trou la pièce voisine dans cette direction.
- Le chrono démarre au premier coup.
- **Mélanger** : nouvelle grille. Le mélange part de la grille résolue et fait des centaines de coups au hasard, donc chaque grille peut toujours se résoudre.

## Les images

- **Chiffres** : des pièces numérotées.
- **Ton fond NeoDex** : ton fond d'écran de NeoDex découpé en pièces.
- **Ton image** : **Choisir une image** sur ton PC ; elle est recadrée en carré au centre et gardée dans ta sauvegarde.
- **Numéros sur l'image** ajoute les numéros sur les pièces pour t'aider.
- **Maintenir : voir le modèle** : garde le bouton appuyé pour voir l'image complète.

## Records

Pour chaque taille de grille, le plus petit nombre de coups et le meilleur temps sont gardés ; le haut du jeu indique les coups, le temps et ton record.

## Données et synchronisation

Records, nombre de grilles résolues et ton image sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée. Au premier lancement, le plugin reprend ce que tu avais déjà dans NeoDex.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Taquin → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).

## Nouveau style et images toutes prêtes

- **Le style des applis récentes** : cadres, boutons et police en pixel art, panneau des records (coups et temps pour chaque taille).
- **À la taille de l'écran** : le plateau suit la fenêtre, du petit portable au grand écran, et se redessine quand on la redimensionne.
- **Sept images en pixel art** : montagnes au couchant, phare la nuit, forêt d'automne, oasis, renard, poisson clown et tortue.
