const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const feed = document.getElementById("feed");
const filters = document.getElementById("filters");
const count = document.getElementById("count");

const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
let current = "全部";

function formatDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return { main: `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`, week: WEEKDAYS[day] };
}

function renderFilters() {
  const tags = ["全部", ...new Set(posts.map(p => p.tag).filter(Boolean))];
  filters.innerHTML = "";
  for (const tag of tags) {
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.className = "chip" + (tag === current ? " active" : "");
    btn.addEventListener("click", () => { current = tag; renderFilters(); renderFeed(); });
    filters.appendChild(btn);
  }
}

function renderFeed() {
  const list = current === "全部" ? posts : posts.filter(p => p.tag === current);
  feed.innerHTML = "";

  for (const post of list) {
    const { main, week } = formatDate(post.date);
    const article = document.createElement("article");
    article.className = "post";

    const meta = document.createElement("div");
    meta.className = "post-meta";
    meta.innerHTML = `<time datetime="${post.date}">${main}</time><span class="week">${week}</span>`;
    if (post.tag) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = post.tag;
      meta.appendChild(tag);
    }
    article.appendChild(meta);

    if (post.image) {
      const img = document.createElement("img");
      img.src = post.image;
      img.alt = post.title || post.text.slice(0, 20);
      img.loading = "lazy";
      img.className = "post-image";
      article.appendChild(img);
    }

    if (post.title) {
      const h = document.createElement("h2");
      h.className = "post-title";
      h.textContent = post.title;
      article.appendChild(h);
    }

    const body = document.createElement("div");
    body.className = "post-text";
    for (const para of post.text.split("\n")) {
      const p = document.createElement("p");
      p.textContent = para;
      body.appendChild(p);
    }
    article.appendChild(body);

    feed.appendChild(article);
  }

  count.textContent = `共 ${posts.length} 条记录`;
}

renderFilters();
renderFeed();
