---
layout: post
title: By Tags
permalink: /tags/
content-type: eg
---

<style>
.category-content a {
    text-decoration: none;
    color: #4183c4;
}

.category-content a:hover {
    text-decoration: underline;
    color: #4183c4;
}
</style>

<main>
    {% for tag in site.tags %}
        <h3 id="{{ tag | first }}">{{ tag | first | capitalize }}</h3>
        {% for post in tag.last %} 
            <li id="category-content" style="padding-bottom: 0.6em; list-style: none;"><a href="{{post.url}}">{{ post.title }}</a></li>
        {% endfor %}
    {% endfor %}
    <br/>
    <br/>
</main>
