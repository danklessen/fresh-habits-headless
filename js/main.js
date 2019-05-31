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
fetch("https://danklessen.github.io/fresh-habits/wp-json/wp/v2/pages?_embed")
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

<h2>${page.acf.description_heading}</h2>
<p>${page.acf.description_text}</p>

<div id="bestil">
<a href="">${page.acf.link}</a>
</div>


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

/*
fetch("http://localhost:8888/wordpress/wp-json/wp/v2/posts?_embed&categories=1")
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    appendPosts(json);
  });

function appendPosts(posts) {
  for (let post of posts) {
    console.log(post);
    document.querySelector("#grid-posts").innerHTML += `
    <article class = "grid-item">
      <h3>${post.title.rendered}</h3>
<p>Adresse: ${post.acf.adress}</p>
      <p>Email: <a href="mailto:${post.acf.email}">${post.acf.email}</a></p>
      <p>Telefon: ${post.acf.phone}</p>
<p>Åbningstider: ${post.acf.abningstider}</p>

    </article>
    `;
  }
}


Fetches post data from my headless cms

function getPersons() {
  fetch('http://localhost:8888/wordpress/wp-json/wp/v2/posts?_embed&categories=1')
    .then(function(response) {
      return response.json();
    })
    .then(function(persons) {
      appendPersons(persons);
    });
}
/*
Appends json data to the DOM 
function appendPersons(persons) {
  let htmlTemplate = "";
  for (let person of persons) {
    console.log();
    htmlTemplate += `
      <article>
        <img src="${getFeaturedImageUrl(person)}">
        <h4>${person.title.rendered}</h4>
        <p>${person.acf.age} years old</p>
        <p>Hair color: ${person.acf.hairColor}</p>
        <p>Relation: ${person.acf.relation}</p>
      </article>
    `;
  }
  document.querySelector("#family-members").innerHTML += htmlTemplate;
}

/*
Fetches post data from my headless cms

function getTeachers() {
  fetch("http://localhost:8888/wordpress/wp-json/wp/v2/posts?_embed&categories=2")
    .then(function(response) {
      return response.json();
    })
    .then(function(teachers) {
      appendTeachers(teachers);
    });
}

// appends teachers
function appendTeachers(teachers) {
  let htmlTemplate = "";
  for (let teacher of teachers) {
    htmlTemplate += `
    <article>
      <img src="${getFeaturedImageUrl(teacher)}">
      <h3>${teacher.title.rendered}</h3>
      ${teacher.content.rendered}
      <p><a href="mailto:${teacher.acf.email}">${teacher.acf.email}</a></p>
      <p><a href="tel:${teacher.acf.phone}">${teacher.acf.phone}</a></p>
    </article>
     `;
  }
  document.querySelector("#teachers").innerHTML += htmlTemplate;
}

// returns the source url of the featured image of given post or page
function getFeaturedImageUrl(post) {
  let imageUrl = "";
  if (post._embedded['wp:featuredmedia']) {
    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
  }
  return imageUrl;
}
*/