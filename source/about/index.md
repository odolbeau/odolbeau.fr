---
layout: page
title: About me
subtitle: A bit more about myself
---

{% include 'about.html.twig' %}

<h1>Contact</h1>

<p>Don't hesitate to send me a message, I'll try to respond quickly. :)</p>

<form action="https://formspree.io/contact@odolbeau.fr" method="POST" id="contact-form">
    <div class="row">
        <div class="col-xs-6">
                <input type="text" class="form-control input-lg" id="name" placeholder="Name" name="name" required="required" />
        </div>
        <div class="col-xs-6">
                <input type="email" class="form-control input-lg" id="email" placeholder="Email" name="_replyto" required="required" />
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
                <textarea class="form-control input-lg" id="message" placeholder="Message" name="message" rows="3" required="required"></textarea>
        </div>
    </div>

    <input type="hidden" name="_next" value="{{ site.url }}/about/thanks/" />
    <button type="submit" class="btn btn-lg btn-primary">Send</button>
</form>
