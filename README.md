# Joystick Draw

A tiny drawing app. Drag the on-screen joystick to move a pointer that draws in black on a whiteboard.

## How to use

- **Joystick** – drag it to move the pointer (arrow keys also work on a keyboard).
- **Pen: down / up** – toggle whether the pointer draws while it moves.
- **Clear** – wipe the whiteboard.
- **Save** – add the current drawing to the gallery.
- **Gallery** – view saved drawings; tap one to see it full size or download it.

Drawings are kept in memory only. Reloading or closing the page empties the gallery.

## Files

```
index.html   page markup
style.css    styles
script.js    joystick, drawing and gallery logic
```

No build step, no dependencies.

## Run locally

Open `index.html` in a browser.

## Publish with GitHub Pages

1. Create a new **public** repository on GitHub.
2. On the repository page choose **Add file → Upload files**, drag in `index.html`, `style.css`, `script.js` and `README.md`, then **Commit changes**. The files must sit at the top level of the repository, not inside a folder.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, pick the **main** branch and the **/ (root)** folder, then **Save**.
5. After a minute or so the site is live at `https://<your-username>.github.io/<repository-name>/`.

Or with git:

```
git init
git add .
git commit -m "Joystick Draw"
git branch -M main
git remote add origin https://github.com/<your-username>/<repository-name>.git
git push -u origin main
```

Then do steps 3–5 above.
