const handleClick = (click) => {
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
};

const addListeners = () => {
	let collapsing = document.querySelectorAll(".collapse, .dayCollapse");

	for (let el of collapsing) {
		el.addEventListener("click", handleClick);
	}
	let sideWrap = document.getElementById("sideMenuWrap");
	if (sideWrap) {
		sideWrap.addEventListener("mouseleave", (ev) => {
			if (!ev.target.classList.contains("open")) {
				return;
			}
			document.getElementById("sideMenuWrap").classList.toggle("open");
			document.getElementById("menuToggle").classList.toggle("open");
		});
	}
};

addListeners();

export { addListeners };
