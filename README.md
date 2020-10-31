# Notenote.link
[![Netlify Status](https://api.netlify.com/api/v1/badges/7b37d412-1240-44dd-8539-a7001465b57a/deploy-status)](https://app.netlify.com/sites/notenotelink/deploys)
## What is this ?
A digital garden using a custom version of ``simply-jekyll``, optimised for integration with [Obsidian](https://obsidian.md). It is more oriented on note-taking and aims to help you build a nice knowledge base that can scale with time. 

![screenshot](/assets/img/screenshot.png)

## What is different ?

- Markdown is fully-compatible with Obsidian (including Latex delimiters !)

- There are now only notes (no blog posts).

- There are cosmetic changes (ADHD-friendly code highlighting, larger font, larger page)

- Code is now correctly indented

- Wikilinks, but also alt-text wikilinks (with transclusion !) are usable.

## How do I use this ?

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Maxence-L/notenote.link)

Go to [notenotelink.netlify.com](https://notenotelink.netlify.com) and follow the very nice guide ('How to setup this site') written by [raghuveerdotnet](https://github.com/raghuveerdotnet) which I adapted for this fork.
 
## How do I customize this for my needs ?

Things to modify to make it yours (you can search it in github/'this repository`) :

- Meta content in `_layouts/post.html`:
````html
    <meta content="My linked notebook" property="og:site_name"/>
````

- The favicon and profile are here:
`assets/img/`

- The main stuff is in ``\_config.yml`` :
````yaml
title: notenotelink.netlify.com
name: notenote.link
user_description: My linked notebook
notes_url: "https://notenotelink.netlify.com/"
profile_pic: /assets/img/profile.png
favicon: /assets/img/favicon.png
copyright_name: MIT
baseurl: "/" # the subpath of your site, e.g. /blog
url: "https://notenotelink.netlify.com/" # the base hostname & protocol for your site, e.g. http://example.com
encoding: utf-8
````

- You may want to change the copyright in `_includes/footer.html`:
```html
<p id="copyright-notice">Licence MIT</p>
```
## What's coming ?

Open-transclude integration in the template, if possible.
