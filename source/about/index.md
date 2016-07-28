---
layout: page
title: About
subtitle: A bit more about myself
---

{% include 'about.html.twig' %}

<form action="https://formspree.io/contact@odolbeau.fr" method="POST">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" class="form-control" id="name" placeholder="Your name" name="name" />
  </div>
  <div class="form-group">
    <label for="email">Email address</label>
    <div class="input-group">
      <span class="input-group-addon">@</span>
      <input type="email" class="form-control" id="email" placeholder="Email" name="_replyto" />
    </div>
  </div>
  <div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" class="form-control" id="subject" placeholder="Subject of your message" name="_subject" />
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea class="form-control" id="message" placeholder="Your message" name="message" rows="3"></textarea>
  </div>

  <input type="hidden" name="_next" value="{{ site.url }}/about/thanks/" />
  <button type="submit" class="btn btn-default">Send</button>
</form>
