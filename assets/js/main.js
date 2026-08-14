var main = {

    init : function() {
        var navbar = document.querySelector(".navbar");
        var toggleButton = document.querySelector('.navbar-toggle[data-target="#main-navbar"]');
        var mainNavbar = document.getElementById("main-navbar");

        // Shorten the navbar after scrolling a little bit down
        window.addEventListener("scroll", function() {
            if (window.scrollY > 50) {
                navbar.classList.add("top-nav-short");
            } else {
                navbar.classList.remove("top-nav-short");
            }
        });

        // Toggle the mobile navbar menu (replaces Bootstrap's jQuery-based collapse plugin)
        if (toggleButton && mainNavbar) {
            toggleButton.addEventListener("click", function() {
                var expanding = !mainNavbar.classList.contains("in");

                if (expanding) {
                    // "in" must be added right away: it's what makes the panel
                    // visible (display:block) — without it the panel stays
                    // display:none for the whole animation and only appears
                    // once the timeout below fires, 350ms after the click.
                    mainNavbar.style.height = "0";
                    mainNavbar.classList.add("in");
                    mainNavbar.classList.add("collapsing");
                    // Force reflow so the transition from 0 actually animates
                    mainNavbar.offsetHeight;
                    mainNavbar.style.height = mainNavbar.scrollHeight + "px";
                    window.setTimeout(function() {
                        mainNavbar.classList.remove("collapsing");
                        mainNavbar.style.height = "";
                    }, 350);

                    navbar.classList.add("top-nav-expanded");
                } else {
                    // "in" stays until the animation ends, otherwise the panel
                    // snaps to display:none instantly instead of sliding shut.
                    mainNavbar.style.height = mainNavbar.scrollHeight + "px";
                    mainNavbar.classList.add("collapsing");
                    // Force reflow so the transition to 0 actually animates
                    mainNavbar.offsetHeight;
                    mainNavbar.style.height = "0";
                    window.setTimeout(function() {
                        mainNavbar.classList.remove("collapsing");
                        mainNavbar.classList.remove("in");
                        mainNavbar.style.height = "";
                    }, 350);

                    navbar.classList.remove("top-nav-expanded");
                }

                toggleButton.setAttribute("aria-expanded", expanding ? "true" : "false");
            });
        }

        // On mobile, when clicking on a multi-level navbar menu, show the child links
        if (mainNavbar) {
            mainNavbar.addEventListener("click", function(e) {
                var target = e.target.closest(".navlinks-parent");
                if (!target) {
                    return;
                }

                document.querySelectorAll(".navlinks-parent").forEach(function(el) {
                    if (el === target) {
                        el.parentElement.classList.toggle("show-children");
                    } else {
                        el.parentElement.classList.remove("show-children");
                    }
                });
            });
        }

        // Ensure nested navbar menus are not longer than the menu header
        var menus = document.querySelectorAll(".navlinks-container");
        if (menus.length > 0) {
            var navbarList = document.querySelector("#main-navbar ul");
            var fakeMenu = document.createElement("li");
            fakeMenu.className = "fake-menu";
            fakeMenu.style.display = "none";
            var fakeMenuLink = document.createElement("a");
            fakeMenu.appendChild(fakeMenuLink);
            navbarList.appendChild(fakeMenu);

            menus.forEach(function(menu) {
                var children = menu.querySelectorAll(".navlinks-children a");
                var words = [];
                children.forEach(function(el) {
                    words = words.concat(el.textContent.trim().split(/\s+/));
                });

                var maxwidth = 0;
                words.forEach(function(word) {
                    fakeMenuLink.textContent = word;
                    var width = fakeMenu.getBoundingClientRect().width;
                    if (width > maxwidth) {
                        maxwidth = width;
                    }
                });

                menu.style.minWidth = maxwidth + "px";
            });

            fakeMenu.remove();
        }
    },
};

document.addEventListener('DOMContentLoaded', main.init);
