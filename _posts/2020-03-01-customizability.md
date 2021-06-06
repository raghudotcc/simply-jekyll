---
title: How to customize your _config.yml
tags: Jekyll Theme Customizability
comments: true
---

One of the most common complaints I recieved after opensourcing the theme was that the customizability of the site at the level of liquid and ruby code was extremely inaccessible to people who just wanted to get it up and running. To be honest, up until then I was under the impression that everyone using the theme were some kind of technically proficient people who just didn't have the time to whip up their own theme, and are resorting to themes such as mine just so that they could have a decent looking site to share their works. The reality only dawned upon me when I got like several emails from people involved in the digital garden subculture---most of them from outside of tech---told me how they liked the features but were unable to use it effectively because it was obscured by something-something-brackety-brackets-and-colons-and-equalsigns. So this is my attempt at trying to ease the customization process.

If you are someone with even a tiny bit of programming background, I would advice you to look into *'_includes'* folder and go to the corresponding file name and tinker with it.

For those of you who are not into programming, I have tried to extract as many features as I can to *_config.yml* file, so that you can at least take the advantage of some if not all the features that are customizable.

This table explains all the customizable variables in *_config.yml*. Most of the main variables have a property called `enabled`, which when set to true will enable the main variable. For eg. turn on subheading by setting the enabled property to true, if it is already true, set it to false and see what happens.

|Variables|Behavior|
|:--|:--|
|`baseurl`| Base Url is where do you want the site to be served from, the top level directory. You can set it to `/` if you want to be served from the root directory, or else you can set to something like `post` or `blog` or something similar|
|`url`| This variable takes in the url of your site. This is the url that you registered with you domain registrar. Sometimes it can also be something different, such as in the case of github pages it would something like `<username>.github.io` |
|`heading`| This is the name of the site, this can only be renamed. It cannot be turned on or off |
|`subheading`| This is the subheading of the site, you can enable or disable it. You can change the subheading by changing the `name` property in it. Note: This cannot be toggled if the site tagline is turned off|
|`tagline`| This is the tagline of the site, you can toggle it using the `enabled` property in it. You can change the tagline by change the `name` property in it. Note: Toggling this off will also toggle off the subheading. This is a design decision because it looks ugly to have heading and subheading without anything to distinguish between the two.|
|`copyright`| I believe this is sort of self-explanatory. The `year` property takes the year and `msg` property takes the message, which in most cases is just your name or your organization's name. Oh and `msg` is a mandatory property for the copyright to enabled as it doesn't have any `enabled` property|
|`user`| This is one of the most interesting variables there is. Turning it on or off will remove the profile dashboard on the home-screen.It can be turned on or off using the `display` property. **Setting `display` to true will look like this:**  <img src='/assets/img/profile_board.png'> and **With it turned off like this:** <img src='/assets/img/site_without_profile.png'>|
|`name`| Self-Explanatory. Note: Depends on `user` variable being turned on/off. If the `user` variable is turned off, none of its properties like name, bio, email, social will show up on the profile board.|
|`bio`| Self-Explanatory. Note: Depends on `user` variable being turned on/off. If the `user` variable is turned off, none of its properties like name, bio, email, social will show up on the profile board.|
|`email`| Self-Explanatory. Note: Depends on `user` variable being turned on/off. If the `user` variable is turned off, none of its properties like name, bio, email, social will show up on the profile board.|
|`photo`| This is the avatar that you see on the profile board when you turn the `user` variable on. Note: Depends on `user` variable being turned on/off. If the `user` variable is turned off, none of its properties like name, bio, email, social will show up on the profile board.|
|`social`| This is similar to the `user` property in that you can toggle the sub-properties by toggling it on/off. You can enable or disable the `social` variable by setting the `enabled` property to true/false. All the subproperties are fixed. You cannot add a new social media site, design constraint :( <br><br> All the social media properties take a username as input, if you don't want a particular social handle to be displayed, please leave the field blank or type in null.|
|`preferences`| This variable is a special type of variable. It is only for usage in the code. Don't worry, if you are not interested in the code, you won't have any use for it anyway.|
|`search`| This variable can toggled on or off by setting the `enabled` property. The `shortcut_hint` property is just a toggle for the markup that show `Shift + S` on the search bar|
|`wiki-style link`| This variable allows you to opt-in or out of the wiki-style double brackets for specifiying internal and external links.|
|`sidenotes`| This variable covers both sidenotes and margin notes. Toggling this on-or-off will allow you use the custom sidenote syntax you saw in the [[How to use Simply Jekyll features on your website]] post.|
|`transclusion`| Similar to sidenotes|
|`pagepreview`| This variable controls the on-hover behavior of internal links, that is, if you hover over an internal link it will show a small preview tooltip thingy if this variable turned on.|
|`wrapping`| This variable allows you to wrap text using a wrapped box. Eg. [[Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.::wrap]]|
|`highlight`| Any text inside the highlight syntax mentioned in the [[How to use Simply Jekyll features on your website]] will be highlighted based on the color you mention in the `color` property of the variable. Eg. This is how it will look when [[highlighted::highlight]]. |
|`backlinks`| This variable controls the references that you see at the bottom of a post. Note that toggling it off will also remove it from the contextmenu. SEE Below: <img src="/assets/img/backlinks.png">|
|`related`| This variable controls the references related by tags that you see at the bottom of a post. Note that toggling it off will also remove it from the contextmenu. Similar to backlinks. |
|`contextmenu`| This variable allows you to right click on the post list on the home page to do things like copy links, see backlinks and related posts without going in.|
