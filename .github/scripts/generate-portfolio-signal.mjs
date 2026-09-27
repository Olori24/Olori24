const fs = require("fs");

const owner = "Olori24";
const repos = [
  ["AgentStation","Autonomous engineering workspace"],
  ["AgentStation-Factory","AI workforce platform"],
  ["oae-core","Governed engineering control plane"],
  ["nsos-nigerian-school-operating-system-nigerian-school-operating-system","School operating system"],
  ["NSMS","Neighbourhood safety coordination"],
  ["Business-Operating-System-","Business operating layer"],
  ["opportunity-radar-africa","Africa opportunity intelligence"],
  ["Ol-r--oko-Sales-Automation","Sales automation"]
];

const esc = (v) => String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const api = async (name) => {
  const r = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: { "Accept": "application/vnd.github+json", "User-Agent": "Olori24-portfolio-refresh" }
  });
  if (!r.ok) throw new Error(`GitHub API ${r.status} for ${name}`);
  return r.json();
};
const fmt = (iso) => new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(iso));

(async () => {
  const data = await Promise.all(repos.map(async ([name,label]) => {
    const r = await api(name);
    return { name, label, stars:r.stargazers_count, issues:r.open_issues_count, language:r.language || "—", updated:r.updated_at };
  }));
  data.sort((a,b)=>new Date(b.updated)-new Date(a.updated));
  const latest = data[0];
  const totalStars = data.reduce((n,r)=>n+r.stars,0);
  const cards = data.slice(0,6).map((r,i) => {
    const x = 60 + (i%2)*550, y = 165 + Math.floor(i/2)*95;
    return `<rect x="${x}" y="${y}" width="520" height="76" rx="14" fill="#0b1220" stroke="#1e293b"/>
<text x="${x+18}" y="${y+24}" fill="#f8fafc" font-size="15" font-weight="700">${esc(r.name.length>31?r.name.slice(0,28)+"…":r.name)}</text>
<text x="${x+18}" y="${y+46}" fill="#94a3b8" font-size="12">${esc(r.label)} • ${esc(r.language)}</text>
<text x="${x+18}" y="${y+64}" fill="#64748b" font-size="11">★ ${r.stars} • issues ${r.issues} • updated ${fmt(r.updated)}</text>`;
  }).join("\n");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="590" viewBox="0 0 1200 590">
<rect width="1200" height="590" rx="28" fill="#0f172a"/>
<rect x="1" y="1" width="1198" height="588" rx="27" fill="none" stroke="#334155"/>
<text x="60" y="62" fill="#f8fafc" font-family="Arial,Helvetica,sans-serif" font-size="27" font-weight="700">ENGINEERING PORTFOLIO • LIVE SIGNAL</text>
<text x="60" y="91" fill="#94a3b8" font-family="Arial,Helvetica,sans-serif" font-size="14">Generated from GitHub repository metadata • refreshed every 6 hours</text>
<rect x="60" y="112" width="1080" height="1" fill="#334155"/>
<text x="60" y="145" fill="#7dd3fc" font-family="Arial,Helvetica,sans-serif" font-size="12" font-weight="700">PUBLIC SYSTEMS</text>
<text x="60" y="166" fill="#f8fafc" font-family="Arial,Helvetica,sans-serif" font-size="25" font-weight="800">${data.length}</text>
<text x="170" y="166" fill="#64748b" font-family="Arial,Helvetica,sans-serif" font-size="12">tracked</text>
<text x="280" y="145" fill="#c4b5fd" font-family="Arial,Helvetica,sans-serif" font-size="12" font-weight="700">TOTAL STARS</text>
<text x="280" y="166" fill="#f8fafc" font-family="Arial,Helvetica,sans-serif" font-size="25" font-weight="800">${totalStars}</text>
<text x="390" y="145" fill="#86efac" font-family="Arial,Helvetica,sans-serif" font-size="12" font-weight="700">LATEST ACTIVITY</text>
<text x="390" y="166" fill="#f8fafc" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700">${esc(latest.name)}</text>
${cards}
<rect x="60" y="460" width="1080" height="1" fill="#334155"/>
<text x="60" y="488" fill="#cbd5e1" font-family="Arial,Helvetica,sans-serif" font-size="13">SYSTEM DIRECTION</text>
<text x="60" y="516" fill="#f8fafc" font-family="Arial,Helvetica,sans-serif" font-size="15">Autonomous Engineering  •  Governed AI  •  Vertical Operating Systems  •  Durable Automation</text>
<text x="60" y="548" fill="#64748b" font-family="Arial,Helvetica,sans-serif" font-size="11">Last observed repository update: ${fmt(latest.updated)} UTC</text>
</svg>`;
  fs.writeFileSync("assets/live-portfolio.svg", svg);
})();