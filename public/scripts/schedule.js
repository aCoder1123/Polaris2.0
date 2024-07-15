let collapsing = document.getElementsByClassName("collapse");

for (let el of collapsing) {
	el.addEventListener("click", (click) => {
        console.log(click.target.tagName)
		if (click.target.tagName === "SPAN") {
			click.target.classList.toggle("open");
			click.target.parentElement.parentElement.classList.toggle("open");
		} else if (click.target.tagName === "path") {
			click.target.parentElement.classList.toggle("open");
            if (click.target.parentElement.classList.contains("dayCollapse")) {
                click.target.parentElement.parentElement.parentElement.classList.toggle("open");
            } else {
			click.target.parentElement.parentElement.classList.toggle("open");

            }
		} else {
			click.target.classList.toggle("open");
            if (click.target.classList.contains("dayCollapse")) {
                click.target.parentElement.parentElement.classList.toggle("open");
            } else {
			click.target.parentElement.classList.toggle("open");

            }
		}
	});
}

document.getElementById("sideMenuWrap").addEventListener("mouseleave", (ev) => {
	if (!ev.target.classList.contains("open")) {return}
	document.getElementById("sideMenuWrap").classList.toggle("open");
	document.getElementById("menuToggle").classList.toggle("open");
});
