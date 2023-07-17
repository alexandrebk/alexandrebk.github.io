---
layout: cheat_sheet
title: Cheat Sheet Vim
permalink: /cheat_sheets/vim
---

Insert a text on multiple lines with the Blockwise Visual Mode (Ctrl-v).

1. Enter in visual mode with V (uppercase v)
2. On the lines that you want to insert the text, apply the blockwise visual mode (Ctrl-v)
3. Press I (uppercase i), type the text
4. Escape; Vim will insert the text on multiple lines

Jump to next method with `]m`

- `]m` jump to beginning of next method
- `]M` end of next
- `[m` beginning of previous
- `[M` end of previous

[Source](https://vimtricks.com/p/vimtrick-jump-to-next-method/)

Plugins

## SplitJoin

## Switch

## Easy-Align

## Commentary

- Comment out a line `gcc`
- to comment out a paragraph: `gcap`
- in visual mode to comment out the selection: `gc`
- Comment with a range like `:7,17Commentary`
- uncomments a set of adjacent commented lines: `gcgc`

[Homepage](https://github.com/tpope/vim-commentary)

## Surrounding

- Change Surrounding " by ':  `cs"'`
- Delete Surroundind " : `ds"`

[Homepage](https://github.com/tpope/vim-surround)

## Expand-Region


Source: https://medium.com/efficient-rails/6-vim-plugins-that-will-give-you-ruby-editing-super-powers-32bd94570def

