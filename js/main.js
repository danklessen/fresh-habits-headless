"use strict";

// ---------- default SPA Web App setup ---------- //

// hide all pages
function hideAllPages() {
  let pages = document.querySelectorAll(".page");
  for (let page of pages) {
    page.style.display = "none";
  }
}

// show page or tab
function showPage(pageId) {
  hideAllPages();
  document.querySelector(`#${pageId}`).style.display = "block";
  setActiveTab(pageId);
}

// set default page
function setDefaultPage(defaultPageName) {
  if (location.hash) {
    defaultPageName = location.hash.slice(1);
  }
  showPage(defaultPageName);
}

// sets active tabbar/ menu item
function setActiveTab(pageId) {
  let pages = document.querySelectorAll(".tabbar a");
  for (let page of pages) {
    if (`#${pageId}` === page.getAttribute("href")) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }

  }
}


// ---------- Google spreadsheet diagram --------- //

let sheetId = "1ACxLeDeGTBV8iMWaHjK-sr1XAGk3ACMr7myHwyoDGoA";
let sheetNumber = 1;
let sheetUrl = "https://spreadsheets.google.com/feeds/list/" + sheetId + "/" + sheetNumber + "/public/full?alt=json";
console.log(sheetUrl);

fetch(sheetUrl)
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    console.log(json);
    appendChart(json.feed.entry);
  });

function appendChart(data) {
  console.log(data);

  // prepare data
  let kategori = [];
  let count = [];
  let color = [];

  for (let macro of data) {
    kategori.push(macro['gsx$kategori']['$t']);
    count.push(macro['gsx$count']['$t']);
    color.push(macro['gsx$color']['$t']);
  }

  // generate chart
  let chart = document.getElementById('chart');
  let myDoughnutChart = new Chart(chart, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: count,
        backgroundColor: color
      }],
      labels: kategori
    }
  });
}

/*------------ END ---------*/


// ---------- Fetch data from data sources -------- //

/*
Fetches pages json data from my headless cms */
fetch("http://brandingspace.dk/wp-json/wp/v2/pages?_embed")
  .then(function(response) {
    return response.json();
  })
  .then(function(pages) {
    appendPages(pages);
  });

/*
Appends and generate pages
*/
function appendPages(pages) {
  var menuTemplate = "";
  for (let page of pages) {
    addMenuItem(page);
    addPage(page);
  }
  setDefaultPage(pages[0].slug); // selecting the first page in the array of pages
  getPersons();
  getTeachers();
}

// appends menu item to the nav menu
function addMenuItem(page) {
  document.querySelector("#menu").innerHTML += `
  <a href="#${page.slug}" onclick="showPage('${page.slug}')">${page.title.rendered}</a>
  `;

}

// appends page section to the DOM
function addPage(page) {
  document.querySelector("#pages").innerHTML += `
  <section id="${page.slug}" class="page">
    <header class="topbar">
<a href="/index.html"><img class="logo" src="${page.acf.logo}"></a>

    </header>
    ${page.content.rendered}

<div id="headerbox">

<img src="${page.acf.header_image}">
</div>

<header>

<h1>${page.acf.header_text}</h1>
<h2>${page.acf.header_subtext}</h2>
</header>

<section id="front">
<h2>${page.acf.description_heading}</h2>
<p>${page.acf.description_text}</p>
</section>

<div id="bestil-box">
<div id="bestil">
${page.acf.link}
</div></div>


<div class="row2">
	<div class="column">
<h4>${page.acf.footer1}</h4>
<p>${page.acf.footer1_content}</p>
</div>
<div class="column">
<h4>${page.acf.footer2}</h4>
<p>${page.acf.footer2_content}</p>
</div>
<div class="column">
<h4>${page.acf.footer3}</h4>
<p>${page.acf.footer3_content}</p>
</div>
</div>

<div class="row">
<h4>${page.acf.menu_titel}</h4>
<pre>${page.acf.ingredienser}</pre>
<h5>${page.acf.pris}</h5>
</div></section>

  `;
}
