# Lonar Trading Company Limited: website

This is the website for Lonar Trading Company Limited. It is plain HTML, CSS and a little JavaScript.
There is nothing to install and no "build step": every page is an ordinary file you can open and edit
in any text editor (Notepad works; the free **Visual Studio Code** is nicer).

## What's where

| File or folder | What it is |
|---|---|
| `index.html` | Home page |
| `about.html`, `products.html`, `services.html`, `industries.html`, `contact.html` | The main pages |
| `privacy.html`, `terms.html` | Privacy policy and terms of use |
| `404.html` | The "page not found" page |
| `assets/css/style.css` | All the styling. Colours, fonts and spacing are at the very top, under `:root` |
| `assets/js/main.js` | Animations, the mobile menu and the quote form |
| `assets/images/photos/` | Website photos (each in three sizes) |
| `assets/images/brand/` | Logo files |
| `assets/images/og-image.jpg` | The preview picture shown when the site is shared on WhatsApp, LinkedIn, etc. |
| `sitemap.xml`, `robots.txt` | Files that help Google find the pages |

## How to change text

1. Open the page's `.html` file in a text editor.
2. Use **Find** (Ctrl+F) to search for the words you want to change.
3. Change only the words between the tags. For example, in `<p>Old words</p>`, edit just "Old words".
4. Save, then open the file in your browser to check it.

**The header, menu and footer appear on every page.** If you change something there (for example a
phone number), use your editor's **Find in files** (Ctrl+Shift+F in VS Code) to change it everywhere.

## How to change the phone or WhatsApp number

1. Find and replace `+234 808 100 8667` (shown on screen) and `2348081008667` (used in links) in all files.
2. In `assets/js/main.js`, update the line `var WHATSAPP_NUMBER = '2348081008667';`.

## How to add the email address, office address or opening hours

Search all files for `[CHECK]`. Each one is a note hidden in the code showing exactly where a missing
detail goes and what to paste. Replace the note with the real line. `CHECKLIST.md` lists them all.

## How to make the quote form send emails

At the moment the form opens WhatsApp with the customer's enquiry already typed out.
To receive enquiries by email instead:

1. Go to **web3forms.com**, enter the email address that should receive enquiries, and they will email you a free "access key".
2. In `assets/js/main.js`, paste it between the quotes on the line `var WEB3FORMS_KEY = '';`.
3. Save and publish. Send yourself a test enquiry.

## How to swap a photo

Each photo is saved in three widths (640, 1080 and 1600 pixels wide) as `.webp` files, for example
`kraft-rolls-green-640.webp`, `-1080.webp` and `-1600.webp`.

- **Easiest:** make three versions of your new photo at those widths, save them as WebP with exactly the
  same names, and replace the old files. (Free tool: squoosh.app)
- Then update the image description (`alt="..."`) in the page so it describes the new photo.

The current photos are free stock photos from Pexels (see `assets/images/photos/CREDITS.md`).
Real photos of Lonar's stock, warehouse or team will make the site more convincing. Swap them in when you have them.

## Prices

The site does not show prices. Prices are given in each quotation.

## Colours and fonts

At the top of `assets/css/style.css`:

- `--green-900: #022D11` is the logo green.
- `--gold: #BC8E47` is the logo gold.
- Headings use the **Archivo** font and body text uses **Inter** (both from Google Fonts).

## Publishing changes

The site is hosted free on GitHub Pages. After you change files:

1. Commit your changes and push them to the `main` branch on GitHub (GitHub Desktop makes this point-and-click).
2. GitHub updates the live site automatically within a minute or two.

## For developers

The pages were first generated from templates kept outside this repository (`_dev/build.py`). The
HTML in this repository is now the source of truth: edit it directly.
