# Second Retreat — session recordings

Sits under Dhamma Talks and is reachable **only** from that page's header
menu ("Second retreat"). It is deliberately not in the Explore menu, the
dashboard, or anywhere else.

## Adding a session

Media lives on the monastery Drive:
<https://drive.google.com/drive/folders/1tzHFCXp2I33MTGKUyhCQq1odhxGJhJ70>

1. Put the session's files in a folder there and make sure each file is shared
   as **Anyone with the link · Viewer** — the page embeds them by file id, and
   an unshared file shows an error box to visitors.
2. Copy each file's id out of its Drive URL
   (`drive.google.com/file/d/<THIS PART>/view`).
3. Add a block to `sessions-data.js`. `audio` and `pdf` may be left empty —
   the Listen and Summary buttons only appear when an id is present.
4. Bump `sessions-data.js?v=` in `index.html` so returning visitors get the
   new list rather than a cached one.

The page shares `../retreat.js` and `../styles.css` with the first retreat,
so it stays in step with it. The only local override is the summary line in
`index.html`, which counts the media actually present instead of always
claiming "video, audio & summary".
