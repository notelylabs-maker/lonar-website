# Moving the website to a real domain

Right now the site is a free **preview** at `https://notelylabs-maker.github.io/lonar-website/`.
This guide explains how to put it on a proper address such as `www.lonartrading.com` (example only).

## 1. Buy the domain in the company's own name

Lonar should buy the domain itself (for example from Namecheap, GoDaddy, Cloudflare, or a Nigerian
registrar for `.ng` / `.com.ng`), using a company email address and company payment details.
**The company must own the domain.** If a web designer registers it in their own name, the company
can lose control of its address later.

## 2. Tell GitHub about the domain

1. In the repository on GitHub, go to **Settings → Pages**.
2. Under **Custom domain**, type the domain with `www` (e.g. `www.lonartrading.com`) and click **Save**.
   GitHub will add a file called `CNAME` to the repository. Leave it there.

## 3. Add DNS records at the domain seller

Log in where the domain was bought, open **DNS settings**, and add:

| Type | Name / Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `notelylabs-maker.github.io` |

(If the repository moves to the company's own GitHub account, the CNAME value becomes
`<their-account-name>.github.io`.)

Delete any old A or CNAME records for `@` or `www` that point somewhere else.
DNS changes can take from a few minutes to 24 hours.

## 4. Turn on HTTPS

Back in **Settings → Pages**, once GitHub shows the domain is working, tick **Enforce HTTPS**.
(It can take up to an hour after the DNS is ready before this box can be ticked.)

## 5. Launch checklist

- [ ] **Remove the "don't list on Google" tags.** Delete the line
      `<meta name="robots" content="noindex">` from every `.html` file **except** `404.html`.
- [ ] **Update the address in the code** from `https://notelylabs-maker.github.io/lonar-website/` to the real
      domain (e.g. `https://www.lonartrading.com/`). Use Find in files. It appears in:
      every page's `canonical` and `og:` lines, the structured data, `sitemap.xml` and `robots.txt`.
- [ ] Update `<lastmod>` dates in `sitemap.xml`.
- [ ] Fill in everything in `CHECKLIST.md` (email, address, hours…).
- [ ] **Test the contact form** end to end (WhatsApp, and email if Web3Forms is set up).
- [ ] **Test on a real phone** (Android and iPhone if possible): menu, links, call and WhatsApp buttons.
- [ ] Submit the sitemap in **Google Search Console** (free) and create a **Google Business Profile**.

## Moving the repository to the company's own GitHub account

If Lonar wants to own the code as well as the domain:

1. Lonar creates a free GitHub account (ideally an organisation account in the company's name).
2. In this repository: **Settings → General → Danger zone → Transfer ownership**, and enter Lonar's account name.
3. Turn GitHub Pages back on in the new location (**Settings → Pages → Deploy from branch → main / root**)
   and update the `www` CNAME record (see step 3).

## Free alternatives to GitHub Pages

Because the site is plain HTML, it runs anywhere:

- **Cloudflare Pages:** free, very fast, connect the GitHub repository and deploy (no build command; output folder is the root).
- **Netlify:** free plan, drag-and-drop the folder or connect the repository.

Both let you add a custom domain and HTTPS for free.
