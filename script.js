// boot sequence: type "whoami", reveal output, wire up commands
(() => {
  const typed = document.getElementById("typed");
  const whoami = document.getElementById("whoami-output");
  const buttons = document.querySelectorAll(".cmds button");
  const blocks = document.querySelectorAll(".block");

  const bootCmd = "whoami --verbose";
  let i = 0;
  const typeStep = () => {
    if (!typed) return;
    if (i < bootCmd.length) {
      typed.textContent += bootCmd.charAt(i++);
      setTimeout(typeStep, 55 + Math.random() * 50);
    } else {
      setTimeout(() => whoami && whoami.classList.remove("hidden"), 250);
    }
  };
  setTimeout(typeStep, 400);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.dataset.cmd;
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      blocks.forEach((b) => {
        b.classList.toggle("hidden", b.dataset.cmd !== cmd);
      });
      const target = [...blocks].find((b) => b.dataset.cmd === cmd);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (cmd === "git log --repos") loadRepos();
        if (cmd === "cat blog.rss") loadMedium();
      }
    });
  });

  // ---- github repos (live) ----
  let repoLoaded = false;
  async function loadRepos() {
    if (repoLoaded) return;
    repoLoaded = true;
    const el = document.getElementById("repos-list");
    try {
      const r = await fetch(
        "https://api.github.com/users/TUMAAA/repos?sort=updated&per_page=100"
      );
      const data = await r.json();
      const owned = data
        .filter((d) => !d.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 12);
      if (owned.length === 0) {
        el.innerHTML =
          '<span class="muted">// no public repos returned — try <a href="https://github.com/TUMAAA?tab=repositories" target="_blank" rel="noopener">github.com/TUMAAA</a></span>';
        return;
      }
      el.innerHTML = owned
        .map((r) => {
          const lang = r.language ? `<span class="lang">[${esc(r.language)}]</span>` : "";
          const stars = r.stargazers_count > 0 ? `★ ${r.stargazers_count}` : "·";
          const desc = r.description ? `<div class="desc">${esc(r.description)}</div>` : "";
          return `
<div class="repo">
  <span class="name"><a href="${esc(r.html_url)}" target="_blank" rel="noopener">${esc(r.name)}</a></span>
  <span>${lang}${desc}</span>
  <span class="stars">${stars}</span>
</div>`;
        })
        .join("");
    } catch (e) {
      el.textContent = "// fetch failed — open https://github.com/TUMAAA directly";
    }
  }

  // ---- medium posts (via rss2json) ----
  let mediumLoaded = false;
  async function loadMedium() {
    if (mediumLoaded) return;
    mediumLoaded = true;
    const el = document.getElementById("blog-list");
    try {
      const r = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=" +
          encodeURIComponent("https://medium.com/feed/@anas.alnuaimi")
      );
      const data = await r.json();
      if (!data.items || !data.items.length) {
        el.innerHTML =
          '<span class="muted">// no posts found — visit <a href="https://medium.com/@anas.alnuaimi" target="_blank" rel="noopener">medium.com/@anas.alnuaimi</a></span>';
        return;
      }
      el.innerHTML = data.items
        .slice(0, 6)
        .map((p) => {
          const date = new Date(p.pubDate).toISOString().slice(0, 10);
          const snip = stripHtml(p.description).slice(0, 220);
          return `
<div class="post">
  <div class="title"><a href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.title)}</a></div>
  <div class="meta">${date}</div>
  <div class="snip">${esc(snip)}${snip.length >= 220 ? "…" : ""}</div>
</div>`;
        })
        .join("");
    } catch (e) {
      el.innerHTML =
        '<span class="muted">// rss fetch blocked — visit <a href="https://medium.com/@anas.alnuaimi" target="_blank" rel="noopener">medium.com/@anas.alnuaimi</a></span>';
    }
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function stripHtml(s) {
    const d = document.createElement("div");
    d.innerHTML = s || "";
    return d.textContent || "";
  }

  // konami easter egg
  const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let k = 0;
  window.addEventListener("keydown", (e) => {
    if (e.key === seq[k]) {
      k++;
      if (k === seq.length) {
        document.body.style.filter = "hue-rotate(180deg)";
        k = 0;
        setTimeout(() => (document.body.style.filter = ""), 4000);
      }
    } else k = 0;
  });
})();
