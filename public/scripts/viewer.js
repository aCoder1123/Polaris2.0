document.getElementById("dateSelect").addEventListener("change", (e) => {
    let val = e.target.options[e.target.selectedIndex].value
    console.log(val)
})