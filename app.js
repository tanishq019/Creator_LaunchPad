/* Creator Launchpad - vanilla JS SPA with hash routing + localStorage persistence */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const app = $('#app');
  const KEY = 'cl_state_v1';
  const ME = { id: 'me', name: 'Demo Creator', college: 'Your College' };

  // ---------- state ----------
  const defaults = { userProjects: [], edits: {}, deleted: [], likes: [], saved: [], follows: [], comments: {}, viewed: {} };
  let S;
  try { S = Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, defaults); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Storage is full or blocked; changes will not persist.', 0); } };

  const allProjects = () => [...window.PROJECTS, ...S.userProjects]
    .filter(p => !S.deleted.includes(p.id))
    .map(p => Object.assign({}, p, S.edits[p.id] || {}));
  const getProject = id => allProjects().find(p => p.id === id);
  const likeCount = p => p.likes + (S.likes.includes(p.id) && !p.userMade ? 1 : 0);
  const viewCount = p => p.views + (S.viewed[p.id] || 0);
  const commentsFor = id => [...(window.SEED_COMMENTS[id] || []), ...(S.comments[id] || [])];
  const creatorOf = p => window.CREATORS.find(c => c.id === p.creator) || { id: 'me', name: ME.name, college: ME.college, bio: 'Demo creator account on Creator Launchpad. Publish projects to build your profile.', skills: ['Your skills'], interests: ['Building'], badges: ['New Creator'], followers: 0 };
  const catName = id => (window.CATEGORIES.find(c => c.id === id) || {}).name || id;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const initials = n => n.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const fmt = n => n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'K' : String(n);
  const isUrl = u => { try { const x = new URL(u); return /^https?:$/.test(x.protocol); } catch (e) { return false; } };

  // ---------- icons ----------
  const I = {
    star: '<svg viewBox="0 0 24 24"><path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.7-8 11-8 11z"/></svg>',
    mark: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>'
  };

  // ---------- toast ----------
  function toast(msg, ok = 1) {
    const t = document.createElement('div');
    t.className = 'toast' + (ok ? ' ok' : '');
    t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  // ---------- components ----------
  function cover(p, lg) {
    const word = p.title.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ').slice(0, 2).join(' ');
    return `<div class="cover${lg ? ' lg' : ''}" style="--h:${p.hue || 340}">
      ${p.coverUrl ? `<img src="${esc(p.coverUrl)}" alt="" onerror="this.remove()" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1">` : ''}
      <span class="glyph">${esc(word)}</span>${p.featured ? `<span class="star">${I.star} Featured</span>` : ''}</div>`;
  }
  function card(p) {
    const c = creatorOf(p), liked = S.likes.includes(p.id), sv = S.saved.includes(p.id);
    const nc = commentsFor(p.id).length;
    const isNew = p.created && (Date.now() - new Date(p.created).getTime()) < 21 * 864e5;
    return `<article class="card fade" data-open="${p.id}" tabindex="0" aria-label="${esc(p.title)}">
      ${cover(p)}
      <div class="card-body">
        <div class="tagrow"><span class="tag">${esc(catName(p.category))}</span>${isNew ? '<span class="tag new">New</span>' : ''}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.short)}</p>
        <div class="chips">${(p.stack || []).slice(0, 4).map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        <div class="metrics"><span>${fmt(viewCount(p))} views</span><span>${nc} feedback</span><span>${(p.team || []).length || 1} makers</span></div>
        <div class="card-foot">
          <div class="who"><span class="avatar">${initials(c.name)}</span><span>${esc(c.name)}</span></div>
          <div class="stat-inline">
            <button class="iconbtn save ${sv ? 'on' : ''}" data-save="${p.id}" aria-label="Save project" aria-pressed="${sv}">${I.mark}</button>
            <button class="iconbtn ${liked ? 'on' : ''}" data-like="${p.id}" aria-label="Like project" aria-pressed="${liked}">${I.heart}${fmt(likeCount(p))}</button>
          </div>
        </div>
      </div></article>`;
  }
  function creatorCard(c) {
    const n = allProjects().filter(p => p.creator === c.id).length;
    return `<article class="creator-card fade" data-creator="${c.id}" tabindex="0">
      <span class="avatar lg">${initials(c.name)}</span>
      <div><h3>${esc(c.name)}</h3><p class="sub">${esc(c.college)}</p></div>
      <p>${esc(c.bio)}</p>
      <div class="badges">${c.badges.map(b => `<span class="badge">★ ${esc(b)}</span>`).join('')}</div>
      <p class="sub" style="color:var(--muted)">${n} projects · ${fmt(c.followers + (S.follows.includes(c.id) ? 1 : 0))} followers</p></article>`;
  }
  const footer = () => `<footer class="footer"><div class="wrap">
    <div class="fgrid"><div><a class="logo" href="#/"><span class="logo-mark">★</span>CREATOR <b>LAUNCHPAD</b></a><p>A stage for student innovation. Launch your project, tell its story and learn from your community.</p></div>
    <div><h5>Platform</h5><a href="#/explore">Explore Projects</a><a href="#/categories">Categories</a><a href="#/creators">Creators</a><a href="#/submit">Launch a Project</a></div>
    <div><h5>Account</h5><a href="#/dashboard">Dashboard</a><a href="#/about">About</a></div>
    <div><h5>Social</h5><a href="https://github.com" target="_blank" rel="noopener">GitHub</a><a href="https://x.com" target="_blank" rel="noopener">X / Twitter</a><a href="https://www.linkedin.com" target="_blank" rel="noopener">LinkedIn</a><a href="https://discord.com" target="_blank" rel="noopener">Discord</a></div></div>
    <div class="copy"><span>© 2026 Creator Launchpad. Built for student makers.</span><span>Team Alliance</span></div></div></footer>`;

  // ---------- pages ----------
  function home() {
    const ps = allProjects();
    const score = p => likeCount(p) * 3 + viewCount(p) / 10;
    const feat = ps.filter(p => p.featured).slice(0, 3);
    const trend = [...ps].sort((a, b) => score(b) - score(a)).slice(0, 5);
    const totalLikes = ps.reduce((s, p) => s + likeCount(p), 0);
    const totalViews = ps.reduce((s, p) => s + viewCount(p), 0);
    const nCom = ps.reduce((s, p) => s + commentsFor(p.id).length, 0);
    const board = window.CREATORS.map(c => { const mp = ps.filter(p => p.creator === c.id); return { c, n: mp.length, l: mp.reduce((s, p) => s + likeCount(p), 0) }; }).sort((a, b) => b.l - a.l).slice(0, 5);
    const feed = ps.flatMap(p => commentsFor(p.id).map(c => Object.assign({ p }, c))).sort((a, b) => b.t.localeCompare(a.t)).slice(0, 4);
    const first = (feat[0] || ps[0] || {}).id || '';
    return `
    <section class="stage"><canvas id="gl" aria-hidden="true"></canvas><div class="stage-shade"></div>
      <div class="wrap stage-in"><span class="label">Student creators / Season 01</span>
        <h1 class="h-display stage-h">Your ideas<br>deserve<br><em>a stage.</em></h1>
        <p class="lede">Discover bold student innovation, launch what you've built and turn feedback into your next big thing.</p>
        <div class="hero-cta"><a class="btn" href="#/explore">Explore Projects →</a><a class="btn btn-ghost" href="#/submit">Launch Your Project</a></div></div>
      <div class="wrap stage-foot"><div class="sf"><b>${ps.length}</b><span>Projects</span></div><div class="sf"><b>${fmt(totalViews)}</b><span>Views</span></div><div class="sf"><b>${fmt(totalLikes)}</b><span>Likes</span></div><span class="scrollhint">Scroll ↓</span></div></section>
    <div class="marquee" aria-hidden="true"><div class="mq">${[0, 1].map(() => [...window.CATEGORIES.map(c => c.name), ...ps.map(p => p.title)].map(x => `<span>${esc(x)}</span><i>★</i>`).join('')).join('')}</div></div>
    <section class="hero2"><div class="wrap"><div class="frame hero-frame fade">
      <div class="hf-top"><div><span class="label">Assignment decrypted / Team Alliance</span><h2 class="h-display h1">Creator Launchpad</h2></div>
        <div class="medal" aria-hidden="true"><div class="medal-disc">${I.star}</div><span class="label dim">Star</span></div></div>
      <hr class="rule">
      <div class="hf-cols">
        <div><span class="label">Your mission</span>
          <p class="mission">Discover bold student innovation, showcase what you've built, tell the story behind your work and gather feedback that helps you grow.</p>
          <div class="callout2">Launch your project in minutes. Get a shareable page, real feedback and a creator profile.</div>
          <div class="hero-cta"><a class="btn" href="#/explore">Explore Projects →</a><a class="btn btn-ghost" href="#/submit">Launch Your Project</a></div></div>
        <div><span class="label">Key features</span><div class="rows">
          <a class="rowx" href="#/explore"><i>01</i><span>Project showcase with visual cards and categories</span><span class="go">→</span></a>
          <a class="rowx" href="#/project/${first}"><i>02</i><span>Project detail view with story, team and demo links</span><span class="go">→</span></a>
          <a class="rowx" href="#/explore?sort=liked"><i>03</i><span>Voting, reactions and constructive feedback</span><span class="go">→</span></a>
          <a class="rowx" href="#/creators"><i>04</i><span>Creator profile with project and achievement history</span><span class="go">→</span></a></div></div>
      </div>
      <hr class="rule">
      <span class="label" style="color:var(--muted)">Live deployment URL</span>
      <form class="urlbar" id="urlbar" novalidate><input id="urlin" type="url" placeholder="https://your-project.vercel.app" aria-label="Live deployment URL"><button class="btn-dark" type="submit">Submit your project ↗</button></form>
      <p class="note">Paste your deployment link, then complete your project details.</p>
    </div></div></section>
    <section class="wrap" style="padding-bottom:clamp(40px,6vw,80px)"><div class="stats">
      <div class="stat"><b>${ps.length}</b><span>Projects launched</span></div>
      <div class="stat"><b>${fmt(totalViews)}</b><span>Project views</span></div>
      <div class="stat"><b>${fmt(totalLikes)}</b><span>Community likes</span></div>
      <div class="stat"><b>${nCom}</b><span>Feedback notes</span></div></div></section>
    <section class="section"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Star picks</span><h2 class="h-display h2">Featured projects</h2></div><a class="linkarrow" href="#/explore">View all →</a></div>
      <div class="grid">${feat.map(card).join('')}</div></div></section>
    <section class="section"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">How it works</span><h2 class="h-display h2">From idea to launch</h2></div></div>
      <div class="steps"><div class="stepc"><i>01</i><h3>Publish</h3><p>Add your title, story, stack, team and links. Your project page goes live instantly.</p></div><div class="stepc"><i>02</i><h3>Get discovered</h3><p>Appear in search, categories and the trending list. Featured projects earn the gold star.</p></div><div class="stepc"><i>03</i><h3>Collect feedback</h3><p>Receive likes and comments, track views on your dashboard and grow your creator profile.</p></div></div></div></section>
    <section class="section"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Leaderboard</span><h2 class="h-display h2">Trending this week</h2></div><a class="linkarrow" href="#/explore?sort=trending">See all →</a></div>
      <div class="ranks">${trend.map((p, i) => `<a class="rank" href="#/project/${p.id}"><b>0${i + 1}</b><div><h3>${esc(p.title)}</h3><small>${esc(creatorOf(p).name)} · ${esc(catName(p.category))}</small></div><span class="rm">${fmt(viewCount(p))}<small>views</small></span><span class="rm hot">${fmt(likeCount(p))}<small>likes</small></span></a>`).join('')}</div></div></section>
    <section class="section"><div class="wrap two">
      <div><span class="eyebrow">Top creators</span><h2 class="h-display h3" style="margin:10px 0 18px">By community likes</h2>
        ${board.map((r, i) => `<a class="rank slim" href="#/creator/${r.c.id}"><b>0${i + 1}</b><div class="who"><span class="avatar">${initials(r.c.name)}</span><div><h3>${esc(r.c.name)}</h3><small>${esc(r.c.college)}</small></div></div><span class="rm">${r.n}<small>projects</small></span><span class="rm hot">${fmt(r.l)}<small>likes</small></span></a>`).join('')}</div>
      <div><span class="eyebrow">Live feedback</span><h2 class="h-display h3" style="margin:10px 0 18px">What people are saying</h2>
        ${feed.length ? feed.map(c => `<a class="fb2" href="#/project/${c.p.id}"><small>${esc(c.name)} on <b>${esc(c.p.title)}</b> · ${esc(c.t)}</small><p>${esc(c.text)}</p></a>`).join('') : '<p style="color:var(--dim)">No feedback yet.</p>'}</div>
    </div></section>
    <section class="section"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Find your world</span><h2 class="h-display h2">Browse by category</h2></div></div>${catGrid()}</div></section>
    <section class="section"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">The makers</span><h2 class="h-display h2">Featured creators</h2></div><a class="linkarrow" href="#/creators">All creators →</a></div>
      <div class="grid">${window.CREATORS.slice(0, 3).map(creatorCard).join('')}</div></div></section>
    ${footer()}`;
  }

  function catGrid() {
    const ps = allProjects();
    return `<div class="cat-grid">${window.CATEGORIES.map((c, i) => `<a class="cat" style="--h:${c.hue}" href="#/explore?cat=${c.id}"><span class="n">0${i + 1}</span><h3>${c.name}</h3><p>${c.blurb}</p><small>${ps.filter(p => p.category === c.id).length} projects →</small></a>`).join('')}</div>`;
  }
  const categories = () => `<section class="page-head"><div class="wrap"><span class="eyebrow">Categories</span><h1 class="h-display h2">Browse by category</h1><p class="lede">Seven fields, hundreds of ideas. Pick a world and dive in.</p></div></section><section class="section" style="border:0"><div class="wrap">${catGrid()}</div></section>${footer()}`;

  let prefill = '';
  let ex = { q: '', cat: 'all', sort: 'trending' };
  function explore(params) {
    if (params.cat) ex.cat = params.cat;
    if (params.sort) ex.sort = params.sort;
    return `<section class="page-head"><div class="wrap"><span class="eyebrow">Project explorer</span><h1 class="h-display h2">Explore projects</h1>
      <div class="toolbar"><div class="search">${I.search}<input id="q" type="search" placeholder="Search by name, tech, creator or idea…" value="${esc(ex.q)}" aria-label="Search projects"></div>
      <select id="sort" aria-label="Sort projects"><option value="trending">Trending</option><option value="newest">Newest</option><option value="liked">Most Liked</option></select></div>
      <div class="filters" id="filters"></div></div></section>
      <section class="section" style="border:0;padding-top:20px"><div class="wrap"><div class="count" id="count"></div><div class="grid" id="results"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div></div></section>${footer()}`;
  }
  function paintExplore() {
    $('#sort').value = ex.sort;
    $('#filters').innerHTML = [{ id: 'all', name: 'All' }, ...window.CATEGORIES].map(c => `<button class="pill ${ex.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.name}</button>`).join('');
    const q = ex.q.trim().toLowerCase();
    let list = allProjects().filter(p => (ex.cat === 'all' || p.category === ex.cat) &&
      (!q || [p.title, p.short, creatorOf(p).name, catName(p.category), ...(p.stack || [])].join(' ').toLowerCase().includes(q)));
    const sorters = {
      trending: (a, b) => (likeCount(b) * 3 + viewCount(b) / 10) - (likeCount(a) * 3 + viewCount(a) / 10),
      newest: (a, b) => (b.created || '').localeCompare(a.created || ''),
      liked: (a, b) => likeCount(b) - likeCount(a)
    };
    list.sort(sorters[ex.sort]);
    $('#count').textContent = `${list.length} project${list.length === 1 ? '' : 's'}`;
    $('#results').innerHTML = list.length ? list.map(card).join('') :
      `<div class="empty" style="grid-column:1/-1"><h3>Nothing matches yet</h3><p>Try a different keyword or clear your filters.</p><button class="btn btn-ghost" data-reset>Clear filters</button></div>`;
  }

  function detail(id) {
    const p = getProject(id);
    if (!p) return notFound('Project not found');
    S.viewed[id] = (S.viewed[id] || 0) + 1; save();
    const c = creatorOf(p), liked = S.likes.includes(id), sv = S.saved.includes(id);
    const rel = allProjects().filter(x => x.id !== id && (x.category === p.category || x.creator === p.creator)).slice(0, 3);
    return `<div class="wrap detail-head fade"><a class="back" href="#/explore">← Back to projects</a>${cover(p, true)}
      <div class="detail-title"><div><span class="tag">${esc(catName(p.category))}</span><h1 class="h-display h2" style="margin-top:12px">${esc(p.title)}</h1><p class="lede" style="margin-top:10px">${esc(p.short)}</p></div>
        <div class="actions"><button class="iconbtn ${liked ? 'on' : ''}" data-like="${id}" style="padding:12px 18px">${I.heart}<span id="lc">${fmt(likeCount(p))}</span> Likes</button>
        <button class="iconbtn save ${sv ? 'on' : ''}" data-save="${id}" style="padding:12px 18px">${I.mark}${sv ? 'Saved' : 'Save'}</button></div></div>
      <div class="kpis k4" style="margin-top:28px"><div class="kpi"><b>${fmt(viewCount(p))}</b><span>Views</span></div><div class="kpi"><b>${fmt(likeCount(p))}</b><span>Likes</span></div><div class="kpi"><b>${commentsFor(id).length}</b><span>Feedback</span></div><div class="kpi"><b>${(p.team || []).length || 1}</b><span>Makers</span></div></div>
      <div class="detail-grid"><div>
        <div class="block"><h4 class="side-h">The problem</h4><p>${esc(p.problem)}</p></div>
        <div class="block"><h4 class="side-h">The story</h4><p>${esc(p.story)}</p></div>
        <div class="block"><h4 class="side-h">The solution</h4><p>${esc(p.solution)}</p>${(p.features || []).length ? `<ul class="feat" style="margin-top:18px">${p.features.map((f, i) => `<li><i>0${i + 1}</i>${esc(f)}</li>`).join('')}</ul>` : ''}</div>
        <div class="block"><h4 class="side-h">Challenges & lessons</h4><div class="callout"><b>Challenge</b><p>${esc(p.challenges)}</p></div><div class="callout"><b>Lesson learned</b><p>${esc(p.lessons)}</p></div></div>
        <div class="block"><h4 class="side-h">Community feedback</h4>
          <form class="cform" id="cform" data-id="${id}" novalidate><div class="field"><input name="name" placeholder="Your name (optional)" aria-label="Your name"></div><div class="field"><textarea name="text" placeholder="Share constructive feedback…" aria-label="Feedback"></textarea><span class="err" id="cerr"></span></div><div><button class="btn btn-sm" type="submit">Post feedback</button></div></form>
          <div id="clist">${commentList(id)}</div></div>
      </div>
      <aside class="side">
        <div class="panel"><h4 class="side-h">Creator</h4><a class="who" href="#/creator/${c.id}"><span class="avatar md">${initials(c.name)}</span><span><b>${esc(c.name)}</b><br><small style="color:var(--muted)">${esc(c.college)}</small></span></a></div>
        <div class="panel"><h4 class="side-h">Links</h4><div style="display:grid;gap:10px"><a class="btn btn-sm" href="${esc(p.demo || '#')}" target="_blank" rel="noopener">Live demo ↗</a><a class="btn btn-sm btn-ghost" href="${esc(p.source || '#')}" target="_blank" rel="noopener">Source code ↗</a></div></div>
        <div class="panel"><h4 class="side-h">Tech stack</h4><div class="chips">${(p.stack || []).map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div></div>
        <div class="panel team"><h4 class="side-h">Team</h4>${(p.team || []).map(m => `<li><span class="avatar">${initials(m)}</span>${esc(m)}</li>`).join('')}</div>
        <div class="panel stat-inline" style="justify-content:space-between"><span>${I.eye.replace('<svg', '<svg style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;display:inline;vertical-align:-2px"')} ${fmt(viewCount(p))} views</span><span>${new Date(p.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
      </aside></div></div>
      ${rel.length ? `<section class="section" style="margin-top:60px"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Keep exploring</span><h2 class="h-display h3">Related projects</h2></div></div><div class="grid">${rel.map(card).join('')}</div></div></section>` : ''}${footer()}`;
  }
  function commentList(id) {
    const cs = commentsFor(id);
    if (!cs.length) return '<p style="color:var(--dim);padding:16px 0">No feedback yet. Be the first to leave a thoughtful note.</p>';
    return [...cs].reverse().map(c => `<div class="comment"><span class="avatar">${initials(c.name)}</span><div><b>${esc(c.name)}</b><small>${esc(c.t)}</small><p>${esc(c.text)}</p></div></div>`).join('');
  }

  function creators() {
    return `<section class="page-head"><div class="wrap"><span class="eyebrow">Creators</span><h1 class="h-display h2">Meet the makers</h1><p class="lede">The students behind the projects. Follow the ones that inspire you.</p></div></section>
    <section class="section" style="border:0"><div class="wrap"><div class="grid">${window.CREATORS.map(creatorCard).join('')}</div></div></section>${footer()}`;
  }
  function creator(id) {
    const c = id === 'me' ? creatorOf({ creator: 'me' }) : window.CREATORS.find(x => x.id === id);
    if (!c) return notFound('Creator not found');
    const ps = allProjects().filter(p => p.creator === c.id);
    const likes = ps.reduce((s, p) => s + likeCount(p), 0), views = ps.reduce((s, p) => s + viewCount(p), 0);
    const f = S.follows.includes(c.id);
    return `<div class="wrap fade"><div class="profile-top"><span class="avatar lg">${initials(c.name)}</span>
      <div><span class="eyebrow">${esc(c.college)}</span><h1 class="h-display h2" style="margin-top:8px">${esc(c.name)}</h1><p>${esc(c.bio)}</p></div>
      ${c.id !== 'me' ? `<button class="btn ${f ? 'btn-ghost' : ''}" data-follow="${c.id}">${f ? 'Following ✓' : 'Follow +'}</button>` : ''}</div>
      <div class="kpis"><div class="kpi"><b>${ps.length}</b><span>Projects</span></div><div class="kpi"><b>${fmt(likes)}</b><span>Total likes</span></div><div class="kpi"><b>${fmt(views)}</b><span>Engagement (views)</span></div></div>
      <div class="two" style="margin-bottom:48px"><div class="box"><h4>Skills</h4><div class="chips">${c.skills.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div><h4 style="margin-top:24px">Interests</h4><div class="chips">${c.interests.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div></div>
      <div class="box"><h4>Achievements</h4><div class="badges">${c.badges.map(b => `<span class="badge">★ ${esc(b)}</span>`).join('')}</div><h4 style="margin-top:24px">Followers</h4><b class="h-display h3" style="color:var(--gold)">${fmt(c.followers + (f ? 1 : 0))}</b></div></div>
      <div class="sec-head"><div><span class="eyebrow">Portfolio</span><h2 class="h-display h3">Projects by ${esc(c.name.split(' ')[0])}</h2></div></div>
      ${ps.length ? `<div class="grid">${ps.map(card).join('')}</div>` : `<div class="empty"><h3>No projects yet</h3><p>Launch your first project to show it here.</p><a class="btn" href="#/submit">Launch a project</a></div>`}</div>${footer()}`;
  }

  function submit(editId) {
    const e = editId ? getProject(editId) : null;
    const v = k => esc(e ? (Array.isArray(e[k]) ? e[k].join(', ') : e[k] || '') : '');
    const f = (k, label, type, ph, full, req) => `<div class="field ${full ? 'full' : ''}"><label for="${k}">${label}${req ? ' <em>*</em>' : ''}</label>${type === 'ta' ? `<textarea id="${k}" name="${k}" placeholder="${ph}">${v(k)}</textarea>` : `<input id="${k}" name="${k}" type="${type}" placeholder="${ph}" value="${v(k)}">`}<span class="err"></span></div>`;
    return `<section class="page-head"><div class="wrap"><span class="eyebrow">${e ? 'Edit project' : 'Launch'}</span><h1 class="h-display h2">${e ? 'Edit your project' : 'Launch your project'}</h1><p class="lede">Tell the world what you built and why it matters. Fields marked * are required.</p></div></section>
    <section class="section" style="border:0"><div class="wrap"><form class="form" id="sform" data-edit="${e ? e.id : ''}" novalidate>
      <div class="banner" id="banner" hidden></div>
      ${f('title', 'Project title', 'text', 'e.g. KrishiSense', 0, 1)}
      <div class="field"><label for="category">Category <em>*</em></label><select id="category" name="category"><option value="">Select a category</option>${window.CATEGORIES.map(c => `<option value="${c.id}" ${e && e.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select><span class="err"></span></div>
      ${f('short', 'Short description', 'text', 'One sentence that sells it', 1, 1)}
      ${f('problem', 'Problem statement', 'ta', 'What problem are you solving, and for whom?', 1, 1)}
      ${f('story', 'Project story', 'ta', 'How did it start? What was the journey like?', 1, 1)}
      ${f('solution', 'Solution', 'ta', 'How does your project solve the problem?', 1, 1)}
      ${f('stack', 'Technology stack', 'text', 'React, Node.js, Firebase (comma separated)', 0, 1)}
      ${f('team', 'Team members', 'text', 'Your name, teammate (comma separated)', 0, 0)}
      ${f('coverUrl', 'Cover image URL', 'url', 'https://… (optional; a stylish cover is generated if empty)', 0, 0)}
      ${f('demo', 'Live demo URL', 'url', 'https://your-project.vercel.app', 0, 1)}
      ${f('source', 'GitHub URL', 'url', 'https://github.com/you/project', 0, 0)}
      <div class="field full" style="flex-direction:row;gap:12px;flex-wrap:wrap"><button class="btn" type="submit">${e ? 'Save changes' : 'Publish project'} →</button><a class="btn btn-ghost" href="#/dashboard">Cancel</a></div>
    </form></div></section>${footer()}`;
  }

  function dashboard() {
    const mine = allProjects().filter(p => p.userMade);
    const likes = mine.reduce((s, p) => s + likeCount(p), 0), views = mine.reduce((s, p) => s + viewCount(p), 0);
    const fb = mine.flatMap(p => commentsFor(p.id).map(c => Object.assign({ p }, c)));
    return `<section class="page-head"><div class="wrap"><div class="sec-head" style="margin:0"><div><span class="eyebrow">Creator dashboard</span><h1 class="h-display h2">Welcome, ${esc(ME.name)}</h1></div><a class="btn" href="#/submit">Publish new project +</a></div></div></section>
    <section class="section" style="border:0"><div class="wrap">
      <div class="kpis" style="grid-template-columns:repeat(4,1fr)"><div class="kpi"><b>${mine.length}</b><span>My projects</span></div><div class="kpi"><b>${fmt(views)}</b><span>Total views</span></div><div class="kpi"><b>${fmt(likes)}</b><span>Total likes</span></div><div class="kpi"><b>${fb.length}</b><span>Feedback</span></div></div>
      <h4 class="side-h">My projects</h4>
      ${mine.length ? `<div class="scroll"><table class="table"><thead><tr><th>Project</th><th>Category</th><th>Views</th><th>Likes</th><th>Actions</th></tr></thead><tbody>${mine.map(p => `<tr><td class="t"><a href="#/project/${p.id}">${esc(p.title)}</a></td><td>${esc(catName(p.category))}</td><td>${fmt(viewCount(p))}</td><td>${fmt(likeCount(p))}</td><td><div class="rowact"><a class="btn btn-sm btn-ghost" href="#/edit/${p.id}">Edit</a><button class="btn btn-sm btn-danger" data-del="${p.id}">Delete</button></div></td></tr>`).join('')}</tbody></table></div>`
        : `<div class="empty"><h3>No projects yet</h3><p>Publish your first project and it will show up here with live stats.</p><a class="btn" href="#/submit">Publish a project</a></div>`}
      <h4 class="side-h" style="margin-top:48px">Community feedback</h4>
      ${fb.length ? fb.reverse().map(c => `<div class="fb"><small>${esc(c.name)} on <a href="#/project/${c.p.id}" style="color:var(--gold)">${esc(c.p.title)}</a> · ${esc(c.t)}</small>${esc(c.text)}</div>`).join('') : '<p style="color:var(--dim)">Feedback on your projects will appear here.</p>'}
      ${S.saved.length ? `<h4 class="side-h" style="margin-top:48px">Saved projects</h4><div class="grid">${allProjects().filter(p => S.saved.includes(p.id)).map(card).join('')}</div>` : ''}
    </div></section>${footer()}`;
  }

  const about = () => `<section class="page-head"><div class="wrap"><span class="eyebrow">About</span><h1 class="h-display h1" style="font-size:clamp(48px,8vw,110px)">A launchpad for <span style="color:var(--accent)">student creators.</span></h1><p class="lede" style="margin-top:20px">Great student projects die in folders. Creator Launchpad gives them a stage, a story and an audience.</p></div></section>
    <section class="section"><div class="wrap"><div class="steps"><div class="stepc"><i>01</i><h3>Showcase</h3><p>Publish projects with visuals, tech stack, team and links to demos and code.</p></div><div class="stepc"><i>02</i><h3>Tell the story</h3><p>Share the problem, the journey, the challenges and what you learned along the way.</p></div><div class="stepc"><i>03</i><h3>Get feedback</h3><p>Collect likes and constructive comments, build a profile and earn badges.</p></div></div></div></section>${footer()}`;

  const notFound = m => `<div class="wrap"><div class="empty" style="margin:80px 0"><h3>${m || 'Page not found'}</h3><p>The page you are looking for does not exist.</p><a class="btn" href="#/">Back home</a></div></div>${footer()}`;


  // ---------- 3D hero (three.js) ----------
  let heroOff = null;
  function projTexture(p, T) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 320; const g = c.getContext('2d'); const h = p.hue || 340;
    const gr = g.createLinearGradient(0, 0, 512, 320); gr.addColorStop(0, `hsl(${h},75%,26%)`); gr.addColorStop(1, `hsl(${h + 24},60%,7%)`);
    g.fillStyle = gr; g.fillRect(0, 0, 512, 320);
    g.strokeStyle = 'rgba(255,255,255,.07)'; for (let x = -320; x < 512; x += 26) { g.beginPath(); g.moveTo(x, 320); g.lineTo(x + 320, 0); g.stroke(); }
    g.strokeStyle = 'rgba(228,32,83,.7)'; g.lineWidth = 3; g.strokeRect(2, 2, 508, 316);
    g.fillStyle = '#e42053'; g.font = '700 20px Inter, sans-serif'; g.fillText(catName(p.category).toUpperCase(), 28, 48);
    g.fillStyle = '#f4ece8'; g.font = '92px "Bebas Neue", Impact, sans-serif';
    const words = p.title.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase().split(' ');
    words.slice(0, 2).forEach((w, i) => g.fillText(w, 28, 150 + i * 84));
    if (p.featured) { g.fillStyle = '#d4a04a'; g.beginPath(); g.arc(456, 52, 22, 0, 7); g.fill(); g.fillStyle = '#1a0c04'; g.font = '24px sans-serif'; g.fillText('★', 444, 61); }
    const t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
  }
  function initHero() {
    const cv = $('#gl'); const T = window.THREE; if (!cv || !T) return null;
    let renderer;
    try { renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { cv.remove(); return null; }
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new T.Scene(); const cam = new T.PerspectiveCamera(42, 1, .1, 60); cam.position.set(0, 0, 10);
    const root = new T.Group(); scene.add(root);
    // extruded gold star
    const sh = new T.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? .72 : 1.7, a = Math.PI / 2 + i * Math.PI / 5; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? sh.lineTo(x, y) : sh.moveTo(x, y); } sh.closePath();
    const geo = new T.ExtrudeGeometry(sh, { depth: .5, bevelEnabled: true, bevelThickness: .1, bevelSize: .09, bevelSegments: 5 }); geo.center();
    const star = new T.Mesh(geo, new T.MeshStandardMaterial({ color: 0xdba550, metalness: .7, roughness: .3 })); root.add(star);
    const wire = new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(2.9, 1)), new T.LineBasicMaterial({ color: 0xe42053, transparent: true, opacity: .5 })); root.add(wire);
    const r1 = new T.Mesh(new T.TorusGeometry(3.6, .014, 8, 180), new T.MeshBasicMaterial({ color: 0xd4a04a, transparent: true, opacity: .7 })); r1.rotation.x = 1.25; root.add(r1);
    const r2 = new T.Mesh(new T.TorusGeometry(4.3, .012, 8, 180), new T.MeshBasicMaterial({ color: 0xe42053, transparent: true, opacity: .6 })); r2.rotation.set(.5, 1, 0); root.add(r2);
    // orbiting project cards
    const list = allProjects().slice(0, 6), cards = [], texes = [];
    list.forEach(p => { const tx = projTexture(p, T); texes.push(tx); const m = new T.Mesh(new T.PlaneGeometry(2.3, 1.44), new T.MeshBasicMaterial({ map: tx, side: T.DoubleSide, transparent: true })); root.add(m); cards.push(m); });
    // particles
    const N = 650, pos = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const r = 5 + Math.random() * 11, a = Math.random() * 6.283, b = Math.acos(2 * Math.random() - 1); pos[i * 3] = r * Math.sin(b) * Math.cos(a); pos[i * 3 + 1] = r * Math.sin(b) * Math.sin(a) * .7; pos[i * 3 + 2] = r * Math.cos(b); }
    const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pos, 3));
    const pts = new T.Points(pg, new T.PointsMaterial({ color: 0xff5580, size: .04, transparent: true, opacity: .85 })); scene.add(pts);
    scene.add(new T.AmbientLight(0xffffff, .55));
    const l1 = new T.PointLight(0xff2a5f, 2.4, 40); l1.position.set(-5, 3, 5); scene.add(l1);
    const l2 = new T.PointLight(0xffe0b0, 2.2, 40); l2.position.set(6, -2, 7); scene.add(l2);
    const l3 = new T.DirectionalLight(0xffffff, .7); l3.position.set(0, 6, 6); scene.add(l3);
    let tx = 0, ty = 0, vis = true, raf = 0; const t0 = performance.now();
    function size() { const w = cv.clientWidth || 800, h = cv.clientHeight || 600; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); const wide = w > 900; root.position.set(wide ? 3.4 : 0, wide ? 0 : 1.9, 0); root.scale.setScalar(wide ? 1 : .55); }
    const onMove = e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; };
    window.addEventListener('mousemove', onMove); window.addEventListener('resize', size); size();
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { vis = es[0].isIntersecting; }) : null; if (io) io.observe(cv);
    function loop(now) {
      raf = requestAnimationFrame(loop); if (!vis) return;
      const t = reduce ? 2 : (now - t0) / 1000;
      star.rotation.y = t * .7; star.rotation.x = Math.sin(t * .6) * .18;
      wire.rotation.y = -t * .22; wire.rotation.x = t * .12; r1.rotation.z = t * .3; r2.rotation.z = -t * .22;
      root.rotation.y += (tx * .7 - root.rotation.y) * .05; root.rotation.x += (ty * .4 - root.rotation.x) * .05;
      cards.forEach((m, i) => { const a = t * .28 + i * 6.283 / cards.length; m.position.set(Math.cos(a) * 5, Math.sin(a * 2 + i) * .7, Math.sin(a) * 3); m.lookAt(cam.position.x - root.position.x, cam.position.y, cam.position.z); });
      pts.rotation.y = t * .02;
      renderer.render(scene, cam);
    }
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); window.removeEventListener('resize', size); if (io) io.disconnect(); texes.forEach(x => x.dispose()); geo.dispose(); renderer.dispose(); };
  }

  // 3D tilt on cards
  document.addEventListener('mousemove', e => {
    const c = e.target.closest && e.target.closest('.card'); if (!c || !window.matchMedia('(hover:hover)').matches) return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(900px) rotateX(${(-y * 9).toFixed(2)}deg) rotateY(${(x * 11).toFixed(2)}deg) translateY(-6px)`;
  });
  document.addEventListener('mouseout', e => { const c = e.target.closest && e.target.closest('.card'); if (c && !c.contains(e.relatedTarget)) c.style.transform = ''; });

  // ---------- router ----------
  function route() {
    if (heroOff) { heroOff(); heroOff = null; }
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?');
    const params = Object.fromEntries(new URLSearchParams(qs || ''));
    const seg = path.split('/').filter(Boolean);
    let html, nav = seg[0] || 'home';
    try {
      if (!seg.length) html = home();
      else if (seg[0] === 'explore') html = explore(params);
      else if (seg[0] === 'categories') html = categories();
      else if (seg[0] === 'creators') html = creators();
      else if (seg[0] === 'creator') html = creator(seg[1]), nav = 'creators';
      else if (seg[0] === 'project') html = detail(seg[1]), nav = 'explore';
      else if (seg[0] === 'submit') html = submit(), nav = 'submit';
      else if (seg[0] === 'edit') html = submit(seg[1]), nav = 'dashboard';
      else if (seg[0] === 'dashboard') html = dashboard();
      else if (seg[0] === 'about') html = about();
      else html = notFound();
    } catch (err) { console.error(err); html = notFound('Something went wrong'); }
    app.innerHTML = html;
    if (seg[0] === 'submit' && prefill) { const d = $('#demo'); if (d) d.value = prefill; prefill = ''; }
    if (!seg.length) heroOff = initHero();
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === nav));
    $('#links').classList.remove('open');
    window.scrollTo(0, 0);
    if (seg[0] === 'explore') setTimeout(paintExplore, 250);
    document.title = (seg[0] === 'project' && getProject(seg[1]) ? getProject(seg[1]).title + ' · ' : '') + 'Creator Launchpad';
  }
  window.addEventListener('hashchange', route);

  // ---------- actions ----------
  function toggle(arr, id) { const i = arr.indexOf(id); if (i > -1) { arr.splice(i, 1); return false; } arr.push(id); return true; }
  function rerenderKeep() { const y = window.scrollY; route(); window.scrollTo(0, y); }

  document.addEventListener('click', e => {
    const t = e.target;
    const like = t.closest('[data-like]');
    if (like) { e.stopPropagation(); const id = like.dataset.like; const on = toggle(S.likes, id); save(); toast(on ? 'Added to your likes ♥' : 'Like removed'); const y = scrollY; if (location.hash.startsWith('#/explore')) paintExplore(); else route(); scrollTo(0, y); return; }
    const sv = t.closest('[data-save]');
    if (sv) { e.stopPropagation(); const on = toggle(S.saved, sv.dataset.save); save(); toast(on ? 'Saved to favorites' : 'Removed from favorites'); const y = scrollY; if (location.hash.startsWith('#/explore')) paintExplore(); else route(); scrollTo(0, y); return; }
    const fo = t.closest('[data-follow]');
    if (fo) { const on = toggle(S.follows, fo.dataset.follow); save(); toast(on ? 'You are now following this creator' : 'Unfollowed'); rerenderKeep(); return; }
    const cat = t.closest('[data-cat]');
    if (cat) { ex.cat = cat.dataset.cat; paintExplore(); return; }
    if (t.closest('[data-reset]')) { ex = { q: '', cat: 'all', sort: 'trending' }; $('#q').value = ''; paintExplore(); return; }
    const del = t.closest('[data-del]');
    if (del) {
      const id = del.dataset.del, p = getProject(id);
      if (confirm(`Delete "${p ? p.title : 'this project'}"? This cannot be undone.`)) {
        S.userProjects = S.userProjects.filter(x => x.id !== id); S.deleted.push(id); save(); toast('Project deleted'); route();
      } return;
    }
    if (t.closest('[data-act="menu"]')) { const l = $('#links'); const o = l.classList.toggle('open'); t.closest('button').setAttribute('aria-expanded', o); return; }
    const op = t.closest('[data-open]');
    if (op) { location.hash = '#/project/' + op.dataset.open; return; }
    const cr = t.closest('[data-creator]');
    if (cr) { location.hash = '#/creator/' + cr.dataset.creator; }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('[data-open],[data-creator]')) e.target.click();
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'q') { ex.q = e.target.value; paintExplore(); }
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'sort') { ex.sort = e.target.value; paintExplore(); }
  });

  document.addEventListener('submit', e => {
    const f = e.target;
    if (f.id === 'urlbar') { e.preventDefault(); prefill = $('#urlin').value.trim(); location.hash = '#/submit'; return; }
    if (f.id === 'cform') {
      e.preventDefault();
      const text = f.text.value.trim();
      if (text.length < 5) { $('#cerr').textContent = 'Please write at least 5 characters.'; return; }
      const id = f.dataset.id;
      (S.comments[id] = S.comments[id] || []).push({ name: f.name.value.trim() || ME.name, text, t: new Date().toISOString().slice(0, 10) });
      save(); $('#clist').innerHTML = commentList(id); f.reset(); $('#cerr').textContent = ''; toast('Feedback posted. Thank you!');
    }
    if (f.id === 'sform') {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      Object.keys(d).forEach(k => d[k] = String(d[k]).trim());
      const rules = { title: [1, 'Project title is required.'], category: [1, 'Choose a category.'], short: [10, 'Add a short description (10+ characters).'], problem: [20, 'Describe the problem (20+ characters).'], story: [20, 'Tell the story (20+ characters).'], solution: [20, 'Describe the solution (20+ characters).'], stack: [1, 'List at least one technology.'] };
      let bad = 0;
      f.querySelectorAll('.field').forEach(x => { x.classList.remove('bad'); x.querySelector('.err').textContent = ''; });
      const fail = (k, m) => { const fld = f.elements[k].closest('.field'); fld.classList.add('bad'); fld.querySelector('.err').textContent = m; bad++; };
      for (const k in rules) if (d[k].length < rules[k][0]) fail(k, rules[k][1]);
      if (!isUrl(d.demo)) fail('demo', 'Enter a valid demo URL starting with http(s)://');
      if (d.source && !isUrl(d.source)) fail('source', 'Enter a valid GitHub URL or leave empty.');
      if (d.coverUrl && !isUrl(d.coverUrl)) fail('coverUrl', 'Enter a valid image URL or leave empty.');
      const banner = $('#banner');
      if (bad) { banner.hidden = false; banner.textContent = `Please fix ${bad} field${bad > 1 ? 's' : ''} before publishing.`; toast('Please fix the highlighted fields', 0); banner.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      const list = s => s.split(',').map(x => x.trim()).filter(Boolean);
      const eid = f.dataset.edit;
      const data = { title: d.title, category: d.category, short: d.short, problem: d.problem, story: d.story, solution: d.solution, stack: list(d.stack), team: list(d.team).length ? list(d.team) : [ME.name], coverUrl: d.coverUrl, demo: d.demo, source: d.source };
      if (eid) {
        const up = S.userProjects.find(x => x.id === eid); if (up) Object.assign(up, data);
        save(); toast('Project updated', 1); location.hash = '#/project/' + eid;
      } else {
        const id = 'u-' + Date.now().toString(36);
        S.userProjects.push(Object.assign({ id, creator: 'me', userMade: true, featured: false, hue: Math.floor(Math.random() * 40) + 335, features: [], challenges: 'Shared soon.', lessons: 'Shared soon.', likes: 0, views: 0, created: new Date().toISOString().slice(0, 10) }, data));
        save(); toast('Project launched! It is live in the gallery.', 1); location.hash = '#/project/' + id;
      }
    }
  });

  route();
})();
