import { useState, useRef, useEffect } from "react";

/* ─────────────────────────── GLOBAL STYLES ─────────────────────────── */
const STYLES = `
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#080808;--bg2:#111;--bg3:#1a1a1a;--bg4:#222;
  --text:#ffffff;--text2:#cccccc;--text3:#888888;
  --red:#E84040;--green:#40C080;--blue:#1DA1F2;
  --border:#2a2a2a;
  --font:Arial,'Helvetica Neue',Helvetica,sans-serif;
  --snav-collapsed:72px;
  --snav-expanded:240px;
  --feed-max:600px;
  --rpanel:320px;
  --hdr:56px;
}
html,body,#root{height:100%;background:var(--bg);}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}
input,textarea,button,select{font-family:var(--font);}

/* Animations */
.fade-in{animation:fadeIn 0.4s ease forwards;}
.slide-up{animation:slideUp 0.35s ease forwards;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes heartPop{0%{transform:scale(1)}40%{transform:scale(1.5)}70%{transform:scale(0.9)}100%{transform:scale(1)}}
@keyframes shimmerBg{0%,100%{opacity:1}50%{opacity:0.7}}

/* Logo */
.g-logo{font-weight:600;letter-spacing:0.04em;color:#fff;}
.g-logo-sm{font-size:24px;}
.g-logo-lg{font-size:48px;line-height:1;}

/* Buttons */
.btn{border:none;cursor:pointer;font-family:var(--font);font-weight:500;border-radius:10px;transition:all 0.2s;display:inline-flex;align-items:center;justify-content:center;gap:6px;}
.btn-gold{background:#fff;color:#0a0a0a;padding:12px 24px;font-size:14px;letter-spacing:0.04em;font-weight:700;}
.btn-gold:hover{filter:brightness(0.92);transform:translateY(-1px);box-shadow:0 4px 20px rgba(255,255,255,0.15);}
.btn-gold:active{transform:translateY(0);}
.btn-blue{background:#1DA1F2;color:#fff;padding:12px 24px;font-size:14px;font-weight:700;}
.btn-blue:hover{filter:brightness(1.1);transform:translateY(-1px);}
.btn-outline{background:transparent;border:1px solid var(--border);color:var(--text);padding:10px 20px;font-size:13px;}
.btn-outline:hover{border-color:#fff;color:#fff;}
.btn-ghost{background:transparent;border:none;color:var(--text2);cursor:pointer;padding:6px;border-radius:8px;transition:all 0.15s;display:inline-flex;align-items:center;justify-content:center;}
.btn-ghost:hover{color:var(--text);background:var(--bg3);}
.btn-icon{width:38px;height:38px;border-radius:50%;background:transparent;border:none;color:var(--text2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
.btn-icon:hover{color:var(--text);background:var(--bg3);}

/* Inputs */
.inp{background:var(--bg3);border:1px solid var(--border);border-radius:10px;color:var(--text);padding:12px 16px;font-size:14px;outline:none;width:100%;transition:border-color 0.2s;font-family:var(--font);}
.inp:focus{border-color:#fff;}
.inp::placeholder{color:var(--text3);}
select.inp{cursor:pointer;}

/* Cards, misc */
.card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;overflow:hidden;}
.story-ring{background:linear-gradient(135deg,#aaa,#fff,#ccc);padding:2px;border-radius:50%;display:inline-block;}
.story-ring-inner{background:var(--bg);border-radius:50%;padding:2px;}
.story-ring.seen{background:var(--bg4);}
.post-img{width:100%;display:block;max-height:600px;object-fit:cover;cursor:pointer;}
.heart-anim{animation:heartPop 0.4s ease;}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(10px);z-index:500;display:flex;align-items:center;justify-content:center;}
.chat-bubble-me{background:#fff;color:#0a0a0a;border-radius:18px 18px 4px 18px;padding:10px 14px;max-width:75%;font-size:14px;margin-left:auto;word-break:break-word;}
.chat-bubble-them{background:var(--bg3);color:var(--text);border-radius:18px 18px 18px 4px;padding:10px 14px;max-width:75%;font-size:14px;border:1px solid var(--border);word-break:break-word;}
.notif-dot{width:8px;height:8px;background:var(--red);border-radius:50%;position:absolute;top:6px;right:6px;}
.divider{border:none;border-top:1px solid var(--border);margin:0;}
video{max-width:100%;}
.emoji-picker{display:flex;flex-wrap:wrap;gap:4px;padding:10px;background:var(--bg3);border-radius:12px;border:1px solid var(--border);max-width:280px;}
.emoji-btn{font-size:20px;cursor:pointer;padding:4px;border-radius:6px;border:none;background:none;transition:background 0.1s;}
.emoji-btn:hover{background:var(--bg4);}
.notification-item{transition:background 0.15s;cursor:pointer;}
.notification-item:hover{background:var(--bg3);}
.badge-blue{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;background:#1DA1F2;border-radius:50%;flex-shrink:0;}
.badge-blue svg{display:block;}
.badge-gold-sub{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;background:linear-gradient(135deg,#f7d700,#ff9500);border-radius:50%;flex-shrink:0;}
.dash-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;flex:1;min-width:0;}
.dash-stat{font-size:26px;font-weight:700;color:#fff;line-height:1;}
.dash-label{font-size:11px;color:var(--text3);margin-top:4px;text-transform:uppercase;letter-spacing:0.08em;}
.sub-card{background:var(--bg2);border:2px solid var(--border);border-radius:16px;padding:20px;transition:all 0.2s;cursor:pointer;}
.sub-card:hover{border-color:#fff;transform:translateY(-2px);}
.sub-card.active{border-color:#1DA1F2;background:rgba(29,161,242,0.05);}
.sub-card.popular{border-color:#f7d700;}
.filter-chip{padding:6px 14px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text2);font-size:12px;cursor:pointer;font-family:var(--font);transition:all 0.2s;}
.filter-chip.active{border-color:#fff;background:rgba(255,255,255,0.08);color:#fff;}
.editor-tool{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:8px;border-radius:10px;transition:background 0.15s;border:none;background:none;color:var(--text2);}
.editor-tool:hover{background:var(--bg3);color:#fff;}
.editor-tool.active{background:var(--bg3);color:#fff;}
.acct-pill{padding:8px 16px;border-radius:24px;border:1px solid var(--border);font-size:13px;cursor:pointer;font-family:var(--font);font-weight:500;transition:all 0.2s;background:transparent;color:var(--text2);}
.acct-pill.selected{background:#fff;color:#000;border-color:#fff;}

/* Story Camera & Create Menu */
.create-menu-overlay{position:fixed;inset:0;z-index:700;display:flex;flex-direction:column;justify-content:flex-end;}
.create-menu-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);}
.create-menu-sheet{position:relative;background:var(--bg2);border-radius:24px 24px 0 0;border:1px solid var(--border);padding:20px 20px 40px;display:flex;flex-direction:column;gap:12px;z-index:1;max-width:480px;margin:0 auto;width:100%;}
.create-menu-btn{display:flex;align-items:center;gap:14px;padding:15px 16px;border-radius:14px;border:1px solid var(--border);background:var(--bg3);cursor:pointer;transition:all 0.15s;text-align:left;width:100%;}
.create-menu-btn:hover{border-color:#555;background:var(--bg4);}
.story-cam-overlay{position:fixed;inset:0;background:#000;z-index:800;display:flex;flex-direction:column;}
.cam-shutter{width:72px;height:72px;border-radius:50%;background:#fff;border:5px solid rgba(255,255,255,0.35);cursor:pointer;transition:transform 0.1s;flex-shrink:0;}
.cam-shutter:active{transform:scale(0.9);}
.cam-recording{background:var(--red);border-color:rgba(232,64,64,0.4);animation:recPulse 1s ease-in-out infinite;}
@keyframes recPulse{0%,100%{box-shadow:0 0 0 0 rgba(232,64,64,0.45)}60%{box-shadow:0 0 0 14px rgba(232,64,64,0)}}
.cam-mode-pill{padding:7px 18px;border-radius:24px;font-size:13px;font-weight:700;cursor:pointer;border:2px solid rgba(255,255,255,0.3);color:rgba(255,255,255,0.7);background:transparent;transition:all 0.2s;}
.cam-mode-pill.active{background:#fff;color:#000;border-color:#fff;}
.cam-top-btn{width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(8px);}
.story-preview-overlay{position:fixed;inset:0;background:#000;z-index:810;display:flex;flex-direction:column;}

/* Highlights */
.highlights-row{display:flex;gap:14px;overflow-x:auto;padding:4px 16px 14px;scrollbar-width:none;}
.highlights-row::-webkit-scrollbar{display:none;}
.hl-bubble{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;flex-shrink:0;}
.hl-ring{width:68px;height:68px;border-radius:50%;padding:2.5px;background:linear-gradient(135deg,#f7d700,#ff9500,#ff2d55);display:inline-block;flex-shrink:0;}
.hl-ring-inner{width:100%;height:100%;border-radius:50%;background:var(--bg);padding:2px;overflow:hidden;}
.hl-img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;}
.hl-add-btn{width:68px;height:68px;border-radius:50%;background:var(--bg3);border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:border-color 0.2s;}
.hl-add-btn:hover{border-color:#666;}
.hl-label{font-size:11px;color:var(--text3);max-width:68px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;}
.hl-viewer-overlay{position:fixed;inset:0;background:#000;z-index:750;display:flex;flex-direction:column;}

/* ============================================================
   RESPONSIVE LAYOUT SYSTEM
   Mobile   < 768px    → bottom nav, full-width feed
   Tablet   768-1099   → icon sidebar (72px), no bottom nav
   Desktop  1100-1399  → expanded sidebar (240px) + right panel
   Large    1400+      → wider sidebar + wider panels
   ============================================================ */

/* Shell wraps everything side by side */
.app-shell{display:flex;min-height:100vh;background:var(--bg);}

/* Left sidebar — hidden mobile, shown tablet+ */
.left-sidebar{
  display:none;flex-direction:column;
  position:fixed;top:0;left:0;bottom:0;
  background:var(--bg);border-right:1px solid var(--border);
  z-index:150;overflow:hidden;
}

/* Main content column */
.main-col{flex:1;min-width:0;display:flex;flex-direction:column;min-height:100vh;}

/* Scrollable area inside screens */
.content-area{flex:1;overflow-y:auto;scrollbar-width:thin;}

/* Feed centering wrapper */
.feed-center{width:100%;}

/* Right sidebar — hidden until desktop */
.right-sidebar{
  display:none;width:var(--rpanel);flex-shrink:0;
  position:fixed;top:0;right:0;bottom:0;overflow-y:auto;
  border-left:1px solid var(--border);background:var(--bg);
  padding:24px 18px;scrollbar-width:thin;
}

/* Mobile-only top header */
.mobile-header{
  display:flex;align-items:center;padding:8px 16px;
  height:var(--hdr);background:rgba(8,8,8,0.96);
  backdrop-filter:blur(20px);border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:100;
}

/* Mobile-only bottom nav */
.bottom-nav{
  position:fixed;bottom:0;left:0;right:0;
  background:rgba(8,8,8,0.97);backdrop-filter:blur(24px);
  border-top:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-around;
  padding:10px 0 max(14px,env(safe-area-inset-bottom));
  z-index:200;
}

/* Stories row */
.stories-row{display:flex;gap:14px;overflow-x:auto;padding:14px 16px;scrollbar-width:none;}
.stories-row::-webkit-scrollbar{display:none;}

/* Explore grid */
.explore-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;}
.explore-thumb{aspect-ratio:1;object-fit:cover;width:100%;cursor:pointer;transition:opacity 0.2s;}
.explore-thumb:hover{opacity:0.8;}

/* Reels */
.reel-container{height:calc(100vh - var(--hdr));overflow-y:scroll;scroll-snap-type:y mandatory;scrollbar-width:none;}
.reel-container::-webkit-scrollbar{display:none;}
.reel-item{scroll-snap-align:start;height:calc(100vh - var(--hdr));position:relative;background:#000;display:flex;align-items:center;justify-content:center;overflow:hidden;}

/* Sidebar nav item */
.snav-item{
  display:flex;align-items:center;gap:13px;padding:10px 12px;
  border-radius:12px;cursor:pointer;transition:all 0.15s;
  color:var(--text2);border:none;background:transparent;
  width:100%;font-family:var(--font);font-size:14px;font-weight:500;
  white-space:nowrap;text-align:left;
}
.snav-item:hover{background:var(--bg3);color:#fff;}
.snav-item.active{color:#fff;font-weight:700;}
.snav-item.active .snav-icon{background:var(--bg3);}
.snav-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.15s;}
.snav-label{font-size:14px;overflow:hidden;transition:opacity 0.2s,width 0.2s;}
.snav-badge{position:absolute;top:6px;left:36px;width:8px;height:8px;background:var(--red);border-radius:50%;}
.snav-create{
  display:flex;align-items:center;justify-content:center;gap:8px;
  background:#fff;color:#000;border:none;cursor:pointer;
  font-weight:700;font-family:var(--font);font-size:14px;
  transition:all 0.15s;margin:4px 8px;
}
.snav-create:hover{filter:brightness(0.9);}

/* Right panel */
.rp-title{font-size:13px;font-weight:700;color:#fff;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.07em;}
.rp-user{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);}
.rp-user:last-child{border-bottom:none;}

/* ═══════════ TABLET 768–1099px ═══════════ */
@media(min-width:768px){
  .bottom-nav{display:none;}
  .mobile-header{display:none;}
  .left-sidebar{display:flex;width:var(--snav-collapsed);}
  .main-col{margin-left:var(--snav-collapsed);}
  .content-area{height:100vh;}
  .reel-container{height:100vh;}
  .reel-item{height:100vh;}
  /* Collapse labels */
  .snav-label{display:none;}
  .snav-item{padding:8px;justify-content:center;gap:0;}
  .snav-icon{width:44px;height:44px;}
  .snav-create{width:44px;height:44px;border-radius:50%;margin:4px auto;font-size:0;}
  .snav-create svg{display:block;}
  .sidebar-wordmark{display:none!important;}
  .sidebar-dot-logo{display:flex!important;}
}

/* ═══════════ DESKTOP 1100–1399px ═══════════ */
@media(min-width:1100px){
  .left-sidebar{width:var(--snav-expanded);}
  .main-col{margin-left:var(--snav-expanded);margin-right:var(--rpanel);}
  .feed-center{max-width:var(--feed-max);margin:0 auto;border-left:1px solid var(--border);border-right:1px solid var(--border);}
  .right-sidebar{display:block;}
  .snav-label{display:block;}
  .snav-item{padding:10px 14px;justify-content:flex-start;gap:13px;}
  .snav-create{width:auto;height:auto;border-radius:12px;font-size:14px;padding:12px 20px;margin:4px 8px;}
  .snav-create svg{display:inline;}
  .sidebar-wordmark{display:block!important;}
  .sidebar-dot-logo{display:none!important;}
  .content-area{height:100vh;}
  .reel-container{height:100vh;}
  .reel-item{height:100vh;}
}

/* ═══════════ LARGE DESKTOP 1400px+ ═══════════ */
@media(min-width:1400px){
  :root{--snav-expanded:260px;--feed-max:650px;--rpanel:360px;}
}

/* Marketing System */
.mkt-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:12px;}
.mkt-section-title{font-size:13px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px;}
.mkt-badge{display:inline-flex;align-items:center;justify-content:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.05em;}
.mkt-tab{padding:7px 16px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text2);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font);white-space:nowrap;transition:all 0.2s;flex-shrink:0;}
.mkt-tab.active{background:#fff;color:#000;border-color:#fff;}
.mkt-tab:hover:not(.active){border-color:#555;color:#fff;}
.mkt-chip{padding:5px 12px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text2);font-size:12px;cursor:pointer;font-family:var(--font);transition:all 0.2s;}
.mkt-chip.sel{background:#fff;color:#000;border-color:#fff;}
.mkt-chip:hover:not(.sel){border-color:#555;color:#fff;}
.mkt-progress{height:6px;background:var(--bg3);border-radius:3px;overflow:hidden;width:100%;}
.mkt-progress-bar{height:100%;border-radius:3px;transition:width 0.6s ease;}
.mkt-action-btn{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 10px;border-radius:12px;border:1px solid var(--border);background:var(--bg3);cursor:pointer;font-family:var(--font);font-size:11px;color:var(--text2);transition:all 0.2s;text-align:center;flex:1;}
.mkt-action-btn:hover{border-color:#555;background:var(--bg4);color:#fff;}
.mkt-toggle{position:relative;width:46px;height:26px;border-radius:13px;border:none;cursor:pointer;transition:background 0.25s;flex-shrink:0;}
.mkt-toggle-knob{position:absolute;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.25s;}
.mkt-fade-up{animation:slideUp 0.35s ease forwards;}
.influencer-card{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;border:1px solid var(--border);background:var(--bg3);cursor:pointer;transition:all 0.2s;}
.influencer-card:hover{border-color:#555;background:var(--bg4);}
.loyalty-tier{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;border:1px solid var(--border);transition:all 0.2s;}
.ad-format-card{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px 10px;border-radius:12px;border:1px solid var(--border);background:var(--bg3);cursor:pointer;transition:all 0.2s;text-align:center;}
.ad-format-card:hover{border-color:#555;background:var(--bg4);}
.ad-format-card.selected{border-color:#1DA1F2;background:rgba(29,161,242,0.08);}
`;

/* ─────────────────────────── CONSTANTS ─────────────────────────── */
const TRENDING_HASHTAGS = ["#GupshupViral","#Trending","#IndiaFirst","#Bollywood","#Cricket","#FoodLovers","#Travel","#Photography","#Fashion","#Tech","#Motivation","#Reels","#Art","#Music","#Dance","#Comedy","#Fitness","#StudyWithMe","#StartupIndia","#MadeInIndia"];

const MUSIC_TRACKS = [
  { id:"t1", title:"Kesariya", artist:"Arijit Singh", duration:"3:42", genre:"Bollywood" },
  { id:"t2", title:"Saware", artist:"Arijit Singh", duration:"4:10", genre:"Romantic" },
  { id:"t3", title:"Raataan Lambiyan", artist:"Jubin Nautiyal", duration:"3:28", genre:"Romantic" },
  { id:"t4", title:"Levitating", artist:"Dua Lipa", duration:"3:23", genre:"Pop" },
  { id:"t5", title:"Blinding Lights", artist:"The Weeknd", duration:"3:20", genre:"Pop" },
  { id:"t6", title:"Tum Hi Ho", artist:"Arijit Singh", duration:"4:21", genre:"Bollywood" },
  { id:"t7", title:"Jai Ho", artist:"AR Rahman", duration:"5:11", genre:"Inspirational" },
  { id:"t8", title:"Unstoppable", artist:"Sia", duration:"3:37", genre:"Motivational" },
  { id:"t9", title:"Zingaat", artist:"Ajay-Atul", duration:"3:45", genre:"Party" },
  { id:"t10", title:"Shape of You", artist:"Ed Sheeran", duration:"3:53", genre:"Pop" },
];

const FILTERS = ["Normal","Vivid","Warm","Cool","Vintage","Mono","Fade","Bold","Drama","Bloom"];
const FILTER_CSS = {
  Normal:"none", Vivid:"saturate(1.5) contrast(1.1)", Warm:"sepia(0.3) saturate(1.3)",
  Cool:"hue-rotate(20deg) saturate(1.2)", Vintage:"sepia(0.5) contrast(0.9) brightness(1.1)",
  Mono:"grayscale(1)", Fade:"opacity(0.85) brightness(1.1)", Bold:"contrast(1.3) saturate(1.4)",
  Drama:"contrast(1.5) brightness(0.9)", Bloom:"brightness(1.2) saturate(0.9)"
};

const DEMO_USERS = [
  { id:"u1", username:"priya_vibes", name:"Priya Sharma", avatar:"https://i.pravatar.cc/150?img=47", bio:"📍 Mumbai | Wanderer & Dreamer ✨", followers:Array.from({length:124000},(_,i)=>"f"+i), following:["u2"], posts:0, verified:true, verifiedType:"organic", accountType:"creator", email:"priya@demo.com", password:"demo123", subscribed:false },
  { id:"u2", username:"foodie_arjun", name:"Arjun Mehta", avatar:"https://i.pravatar.cc/150?img=12", bio:"🍳 Chef & Food Blogger | DM for collabs", followers:["u1"], following:["u1","u3"], posts:0, verified:true, verifiedType:"subscribed", accountType:"business", email:"arjun@demo.com", password:"demo123", subscribed:true, subPlan:"monthly" },
  { id:"u3", username:"delhi_diaries", name:"Rahul Kapoor", avatar:"https://i.pravatar.cc/150?img=32", bio:"📸 Street Photographer | Delhi based", followers:["u2"], following:[], posts:0, verified:false, accountType:"personal", email:"rahul@demo.com", password:"demo123", subscribed:false },
  { id:"u4", username:"meera_creates", name:"Meera Nair", avatar:"https://i.pravatar.cc/150?img=25", bio:"🎨 Artist | Designer | Creator", followers:[], following:["u1","u2","u3"], posts:0, verified:false, accountType:"student", email:"meera@demo.com", password:"demo123", subscribed:false },
];

const DEMO_POSTS = [
  { id:"p1", userId:"u1", type:"image", src:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80", caption:"Mountains calling and I must go ✨ #wanderlust #blessed #travel", likes:["u2","u3"], comments:[{id:"c1",userId:"u2",text:"Gorgeous shot! 😍",time:"2h"},{id:"c2",userId:"u3",text:"Take me there! 🏔️",time:"1h"}], saved:["u2"], time:"2h ago", location:"Himachal Pradesh", hashtags:["wanderlust","blessed","travel"], music:null },
  { id:"p2", userId:"u2", type:"image", src:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&q=80", caption:"Sunday brunch goals 🍳☕ Recipe in bio! #food #foodie", likes:["u1","u4"], comments:[{id:"c3",userId:"u4",text:"This looks divine! 🤤",time:"4h"}], saved:["u1"], time:"5h ago", location:"Bandra, Mumbai", hashtags:["food","foodie"], music:{title:"Raataan Lambiyan",artist:"Jubin Nautiyal"} },
  { id:"p3", userId:"u3", type:"image", src:"https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80", caption:"Old Delhi magic never fades 🕌 #heritage #culture #delhi", likes:["u1","u2","u4"], comments:[], saved:["u2"], time:"1d ago", location:"Chandni Chowk, Delhi", hashtags:["heritage","culture","delhi"], music:null },
  { id:"p4", userId:"u4", type:"image", src:"https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700&q=80", caption:"Art is the language of the soul 🎨 #art #abstract #creative", likes:["u3"], comments:[{id:"c4",userId:"u1",text:"Stunning work! 🔥",time:"20h"}], saved:[], time:"2d ago", location:null, hashtags:["art","abstract","creative"], music:null },
];

const DEMO_STORIES = [
  { id:"s1", userId:"u1", src:"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80", type:"image", seen:false },
  { id:"s2", userId:"u2", src:"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80", type:"image", seen:false },
  { id:"s3", userId:"u3", src:"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=80", type:"image", seen:true },
];

const DEMO_CONVOS = [
  { id:"cv1", participants:["u1","u2"], messages:[{id:"m1",from:"u2",text:"Hey! Loved your mountain post 🏔️",time:"10:30 AM",type:"text"},{id:"m2",from:"u1",text:"Thank you so much!",time:"10:32 AM",type:"text"}]},
  { id:"cv2", participants:["u1","u3"], messages:[{id:"m4",from:"u3",text:"Can we collab?",time:"Yesterday",type:"text"}]},
];

const EMOJIS = ["😊","😂","❤️","🔥","👏","😍","🙏","😭","💯","🎉","✨","💪","😎","🤩","👀","😮","💀","🥰","😘","🤣","🙌","👍","💖","🌟","🎊","🍕","🏆","🎶","💫","🌈"];

/* ─────────────────────────── HELPERS ─────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 10);
const timeNow = () => new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
const fmtNum = n => n>=1000000?`${(n/1000000).toFixed(1)}M`:n>=1000?`${(n/1000).toFixed(1)}K`:String(n);

/* ─────────────────────────── VERIFIED BADGE ─────────────────────────── */
const VerifiedBadge = ({ type, size=16 }) => {
  if(!type) return null;
  if(type==="organic") return (
    <span className="badge-blue" style={{ width:size, height:size }}>
      <svg width={size*0.7} height={size*0.7} viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
  if(type==="subscribed") return (
    <span className="badge-gold-sub" style={{ width:size, height:size }}>
      <svg width={size*0.7} height={size*0.7} viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
  return null;
};

/* ─────────────────────────── ICONS ─────────────────────────── */
const Icon = ({ name, size=22, color="currentColor", fill="none", strokeWidth=1.5 }) => {
  const s = { width:size, height:size, display:"block" };
  const p = { fill, stroke:color, strokeWidth };
  const icons = {
    home:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    explore:<svg {...s} {...p} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    plus:<svg {...s} {...p} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    reel:<svg {...s} {...p} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="m10 9 5 3-5 3V9z"/></svg>,
    bell:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    user:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    chat:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    heart:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    comment:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    send:<svg {...s} {...p} viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    bookmark:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
    more:<svg {...s} fill="currentColor" stroke="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
    back:<svg {...s} {...p} viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
    close:<svg {...s} {...p} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    camera:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    video:<svg {...s} {...p} viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
    image:<svg {...s} {...p} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    settings:<svg {...s} {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    location:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    emoji:<svg {...s} {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
    play:<svg {...s} {...p} viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    pause:<svg {...s} {...p} viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    mute:<svg {...s} {...p} viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>,
    volume:<svg {...s} {...p} viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
    google:<svg {...s} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>,
    check:<svg {...s} {...p} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    grid:<svg {...s} {...p} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    eye:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeoff:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    edit:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    logout:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    trash:<svg {...s} {...p} viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    music:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    hash:<svg {...s} {...p} viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
    link:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    star:<svg {...s} {...p} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    chart:<svg {...s} {...p} viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    crown:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M2 20h20M4 20l2-8 6 4 4-10 4 6 2-10"/></svg>,
    diamond:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M12 2L2 9l10 13L22 9z"/><path d="M2 9h20"/></svg>,
    trending:<svg {...s} {...p} viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    filter:<svg {...s} {...p} viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    photo:<svg {...s} {...p} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    crop:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/></svg>,
    sun:<svg {...s} {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    contrast:<svg {...s} {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z"/></svg>,
    text:<svg {...s} {...p} viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
    dashboard:<svg {...s} {...p} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
    verified_o:<svg width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
    mic:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    megaphone:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M3 11l19-9v18L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
    store:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M2 7h20l-2 12H4L2 7z"/><path d="M5 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9" y1="14.5" x2="15" y2="14.5"/></svg>,
    rocket:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
    target:<svg {...s} {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    gift:<svg {...s} {...p} viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    bot:<svg {...s} {...p} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
    zap:<svg {...s} {...p} viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    briefcase:<svg {...s} {...p} viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    users:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    coins:<svg {...s} {...p} viewBox="0 0 24 24"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>,
    layers:<svg {...s} {...p} viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    flip:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>,
    bolt:<svg {...s} {...p} viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    boltOff:<svg {...s} {...p} viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M15 5L9 13h6l-1 8 5-7h-5"/></svg>,
    highlight:<svg {...s} {...p} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    plusCircle:<svg {...s} {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    download:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    sticker:<svg {...s} {...p} viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10c0 2.76-1.12 5.26-2.93 7.07A10 10 0 0 1 12 22a10 10 0 0 1-9.07-5.93 9.98 9.98 0 0 1 0-8.14A10 10 0 0 1 12 2z"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>,
  };
  return icons[name] || null;
};

/* ─────────────────────────── AUTH SCREEN ─────────────────────────── */
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", username:"", email:"", password:"", confirmPw:"", accountType:"personal" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(DEMO_USERS);

  const handleGmail = () => {
    setLoading(true);
    setTimeout(() => {
      const names = ["Aarav Singh","Kavya Patel","Rohan Desai","Ananya Rao","Vikram Nair"];
      const n = names[Math.floor(Math.random()*names.length)];
      const uname = n.toLowerCase().replace(" ","_") + Math.floor(Math.random()*999);
      const gmailUser = { id:uid(), username:uname, name:n, avatar:`https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)+1}`, bio:"Just joined Gupshup via Google! ✨", followers:[], following:[], posts:0, verified:false, accountType:form.accountType||"personal", email:uname+"@gmail.com", password:"", subscribed:false };
      setLoading(false);
      onAuth(gmailUser, [...users, gmailUser]);
    }, 1500);
  };

  const handleSubmit = () => {
    if(mode==="forgot"){ if(!form.email){setError("Enter your email");return;} setSuccess("Reset link sent!"); setTimeout(()=>{setSuccess("");setMode("login");},2500); return; }
    if(mode==="login"){
      const found = users.find(u=>(u.email===form.email||u.username===form.email));
      if(!found){setError("No account found");return;}
      if(found.password&&found.password!==form.password){setError("Incorrect password");return;}
      onAuth(found, users);
    } else {
      if(!form.name||!form.username||!form.email||!form.password){setError("All fields required");return;}
      if(form.password!==form.confirmPw){setError("Passwords don't match");return;}
      if(users.find(u=>u.username===form.username)){setError("Username taken");return;}
      if(users.find(u=>u.email===form.email)){setError("Email already registered");return;}
      if(form.password.length<6){setError("Password min 6 characters");return;}
      const newUser = { id:uid(), username:form.username.toLowerCase().replace(/\s/g,""), name:form.name, avatar:`https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)+1}`, bio:"", followers:[], following:[], posts:0, verified:false, accountType:form.accountType, email:form.email, password:form.password, subscribed:false };
      const updated = [...users, newUser]; setUsers(updated); onAuth(newUser, updated);
    }
  };

  const accountTypes = [
    { id:"personal", label:"Personal" },
    { id:"creator", label:"Creator" },
    { id:"business", label:"Business" },
    { id:"professional", label:"Professional" },
    { id:"student", label:"Student" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{STYLES}</style>
      <div style={{ position:"fixed", top:"-30%", right:"-20%", width:"60vw", height:"60vw", background:"radial-gradient(circle,rgba(255,255,255,0.03) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div className="slide-up" style={{ width:"100%", maxWidth:440, margin:"0 auto", padding:"0 16px" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div className="g-logo g-logo-lg" style={{ marginBottom:8 }}>Gupshup</div>
          <div style={{ color:"var(--text3)", fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase" }}>
            {mode==="login"?"Welcome back":mode==="signup"?"Join the conversation":"Reset password"}
          </div>
        </div>
        <div className="card" style={{ padding:26 }}>
          {mode!=="forgot" && (
            <>
              <button className="btn btn-outline" style={{ width:"100%", marginBottom:18, gap:10, padding:"12px" }} onClick={handleGmail} disabled={loading}>
                {loading?<div style={{ width:18,height:18,border:"2px solid #888",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>:<Icon name="google" size={18}/>}
                {loading?"Connecting...":"Continue with Google"}
              </button>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
                <hr className="divider" style={{ flex:1 }}/><span style={{ color:"var(--text3)", fontSize:12 }}>OR</span><hr className="divider" style={{ flex:1 }}/>
              </div>
            </>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {mode==="signup" && (
              <>
                <input className="inp" placeholder="Full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
                <input className="inp" placeholder="Username" value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value.toLowerCase().replace(/\s/g,"")}))}/>
                <div>
                  <div style={{ fontSize:12, color:"var(--text3)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Account Type</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {accountTypes.map(t=>(
                      <button key={t.id} className={`acct-pill ${form.accountType===t.id?"selected":""}`} onClick={()=>setForm(f=>({...f,accountType:t.id}))}>{t.label}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <input className="inp" placeholder={mode==="login"?"Email or username":"Email address"} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
            {mode!=="forgot" && (
              <div style={{ position:"relative" }}>
                <input className="inp" placeholder="Password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} type={showPw?"text":"password"} style={{ paddingRight:44 }} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
                <button className="btn-ghost" style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)" }} onClick={()=>setShowPw(v=>!v)}><Icon name={showPw?"eyeoff":"eye"} size={16}/></button>
              </div>
            )}
            {mode==="signup" && <input className="inp" placeholder="Confirm password" value={form.confirmPw} onChange={e=>setForm(f=>({...f,confirmPw:e.target.value}))} type="password" onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>}
          </div>
          {error && <div style={{ marginTop:10, color:"var(--red)", fontSize:13, textAlign:"center", padding:"8px", background:"rgba(232,64,64,0.08)", borderRadius:8 }}>{error}</div>}
          {success && <div style={{ marginTop:10, color:"var(--green)", fontSize:13, textAlign:"center", padding:"8px", background:"rgba(64,192,128,0.08)", borderRadius:8 }}>{success}</div>}
          {mode==="login" && <div style={{ textAlign:"right", marginTop:8 }}><button className="btn-ghost" style={{ fontSize:12, color:"#aaa" }} onClick={()=>setMode("forgot")}>Forgot password?</button></div>}
          <button className="btn btn-gold" style={{ width:"100%", marginTop:16, padding:"14px" }} onClick={handleSubmit}>
            {mode==="login"?"Sign In":mode==="signup"?"Create Account":"Send Reset Link"}
          </button>
          <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"var(--text2)" }}>
            {mode==="login"?(<>No account? <button className="btn-ghost" style={{ color:"#fff", fontSize:13, padding:"2px 4px" }} onClick={()=>{setMode("signup");setError("");}}>Sign up</button></>):
             mode==="signup"?(<>Have account? <button className="btn-ghost" style={{ color:"#fff", fontSize:13, padding:"2px 4px" }} onClick={()=>{setMode("login");setError("");}}>Sign in</button></>):
             (<button className="btn-ghost" style={{ color:"#fff", fontSize:13 }} onClick={()=>{setMode("login");setError("");}}>Back to Sign In</button>)}
          </div>
        </div>
        {mode==="login" && (
          <div style={{ marginTop:12, padding:"10px 14px", textAlign:"center", fontSize:12, color:"var(--text3)", background:"var(--bg2)", borderRadius:10, border:"1px solid var(--border)" }}>
            Demo: <span style={{color:"#ccc"}}>priya_vibes</span> / <span style={{color:"#ccc"}}>demo123</span> — or use Google sign-in
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── SUBSCRIPTION MODAL ─────────────────────────── */
function SubscriptionModal({ onClose, onSubscribe, currentUser }) {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState("creator");
  const [processing, setProcessing] = useState(false);

  const plans = {
    creator:{ name:"Creator", monthly:499, yearly:4000, color:"#1DA1F2", features:["Blue tick verification ✓","Priority in search","Creator analytics","Monetization tools","Longer reels (5 min)","Custom link in bio"] },
    professional:{ name:"Professional", monthly:999, yearly:8000, color:"#7c3aed", features:["All Creator features","Business dashboard","Advanced analytics","Team collaboration","Priority support","Verified business badge","Ads manager access"] },
    student:{ name:"Student", monthly:199, yearly:1500, color:"#40C080", features:["Blue tick verification ✓","Student analytics","Portfolio tools","Academic network","Study groups","Career opportunities"] },
  };

  const handleSubscribe = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onSubscribe(selectedPlan, billingCycle); }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--bg2)", borderRadius:20, width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", padding:"16px", borderBottom:"1px solid var(--border)", position:"sticky", top:0, background:"var(--bg2)", zIndex:10 }}>
          <button className="btn-ghost" onClick={onClose}><Icon name="close" size={22}/></button>
          <div style={{ flex:1, textAlign:"center", fontWeight:700, fontSize:16 }}>Get Verified</div>
          <div style={{ width:38 }}/>
        </div>

        <div style={{ padding:"20px 16px" }}>
          {/* Organic verification info */}
          <div style={{ background:"rgba(29,161,242,0.08)", border:"1px solid rgba(29,161,242,0.3)", borderRadius:14, padding:16, marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <VerifiedBadge type="organic" size={22}/>
              <div style={{ fontWeight:700, fontSize:15 }}>Organic Verification</div>
            </div>
            <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>
              Reach <strong style={{color:"#fff"}}>100,000 genuine followers</strong> and get automatically verified with a blue tick. This badge shows your content is authentically popular.
            </div>
            <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ flex:1, height:6, background:"var(--bg3)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.min((currentUser?.followers?.length||0)/1000,100)}%`, background:"#1DA1F2", borderRadius:3, transition:"width 1s" }}/>
              </div>
              <span style={{ fontSize:12, color:"#1DA1F2" }}>{fmtNum(currentUser?.followers?.length||0)} / 100K</span>
            </div>
          </div>

          {/* Billing toggle */}
          <div style={{ display:"flex", background:"var(--bg3)", borderRadius:10, padding:4, marginBottom:20, gap:4 }}>
            {["monthly","yearly"].map(c=>(
              <button key={c} onClick={()=>setBillingCycle(c)} style={{ flex:1, padding:"9px", border:"none", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer", background:billingCycle===c?"var(--bg2)":"transparent", color:billingCycle===c?"#fff":"var(--text2)", transition:"all 0.2s" }}>
                {c==="monthly"?"Monthly":"Yearly"}{c==="yearly"&&<span style={{ fontSize:11, color:"#40C080", marginLeft:4 }}>Save 33%</span>}
              </button>
            ))}
          </div>

          {/* Plan cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {Object.entries(plans).map(([key,plan])=>(
              <div key={key} onClick={()=>setSelectedPlan(key)} className={`sub-card ${selectedPlan===key?"active":""}`} style={{ borderColor:selectedPlan===key?plan.color:"var(--border)", background:selectedPlan===key?`${plan.color}08`:"var(--bg2)" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <VerifiedBadge type="subscribed" size={20}/>
                    <div style={{ fontWeight:700, fontSize:15, color:plan.color }}>{plan.name}</div>
                    {key==="professional" && <span style={{ fontSize:10, background:"#7c3aed", color:"#fff", padding:"2px 8px", borderRadius:10, fontWeight:700 }}>POPULAR</span>}
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontWeight:700, fontSize:18, color:"#fff" }}>₹{billingCycle==="monthly"?plan.monthly:Math.round(plan.yearly/12)}<span style={{ fontSize:12, color:"var(--text3)" }}>/mo</span></div>
                    {billingCycle==="yearly" && <div style={{ fontSize:11, color:"#40C080" }}>₹{plan.yearly}/year</div>}
                  </div>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {plan.features.map(f=>(
                    <div key={f} style={{ fontSize:12, color:"var(--text2)", display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{ color:plan.color }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                {selectedPlan===key && (
                  <div style={{ marginTop:10, width:18, height:18, background:plan.color, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", marginLeft:"auto" }}>
                    <Icon name="check" size={12} color="#fff"/>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="btn btn-gold" style={{ width:"100%", marginTop:20, padding:15, fontSize:15 }} onClick={handleSubscribe} disabled={processing}>
            {processing ? <div style={{ width:20,height:20,border:"2px solid #000",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/> :
              `Subscribe ₹${billingCycle==="monthly"?plans[selectedPlan].monthly:plans[selectedPlan].yearly}/${billingCycle==="monthly"?"mo":"yr"}`}
          </button>
          <div style={{ fontSize:11, color:"var(--text3)", textAlign:"center", marginTop:10 }}>Cancel anytime. Secure payment via Razorpay.</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── MEDIA EDITOR ─────────────────────────── */
function MediaEditor({ file, fileType, onDone, onBack, currentUser }) {
  const [activeFilter, setActiveFilter] = useState("Normal");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [musicSearch, setMusicSearch] = useState("");
  const [activeTool, setActiveTool] = useState("filters");
  const [suggestedTags, setSuggestedTags] = useState([]);

  const mediaStyle = {
    filter: `${FILTER_CSS[activeFilter]||"none"} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
  };

  const handleHashtagInput = (val) => {
    setHashtags(val);
    const lastWord = val.split(/\s+/).pop();
    if(lastWord.startsWith("#") && lastWord.length > 1) {
      const q = lastWord.slice(1).toLowerCase();
      setSuggestedTags(TRENDING_HASHTAGS.filter(t=>t.toLowerCase().includes(q)).slice(0,5));
    } else { setSuggestedTags([]); }
  };

  const addHashtag = (tag) => {
    const parts = hashtags.split(/\s+/);
    parts[parts.length-1] = tag;
    setHashtags(parts.join(" ") + " ");
    setSuggestedTags([]);
  };

  const filteredMusic = musicSearch ? MUSIC_TRACKS.filter(t=>t.title.toLowerCase().includes(musicSearch.toLowerCase())||t.artist.toLowerCase().includes(musicSearch.toLowerCase())) : MUSIC_TRACKS;

  const handleFinish = () => {
    const tags = hashtags.match(/#\w+/g) || [];
    onDone({ filter:activeFilter, brightness, contrast, saturation, caption, title, location, hashtags:tags, music:selectedMusic, mediaStyle });
  };

  const tools = [
    { id:"filters", icon:"filter", label:"Filters" },
    { id:"adjust", icon:"sun", label:"Adjust" },
    { id:"caption", icon:"text", label:"Caption" },
    { id:"music", icon:"music", label:"Music" },
    { id:"hashtags", icon:"hash", label:"Tags" },
    { id:"location", icon:"location", label:"Location" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"var(--bg)" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", padding:"12px 16px", borderBottom:"1px solid var(--border)", background:"var(--bg2)" }}>
        <button className="btn-ghost" onClick={onBack}><Icon name="back" size={22}/></button>
        <div style={{ flex:1, textAlign:"center", fontWeight:700, fontSize:15 }}>Edit & Create</div>
        <button className="btn-ghost" style={{ color:"#fff", fontWeight:700, fontSize:14 }} onClick={handleFinish}>Next →</button>
      </div>

      {/* Media preview */}
      <div style={{ position:"relative", background:"#000", maxHeight:300, overflow:"hidden", flexShrink:0 }}>
        {fileType==="video" ? (
          <video src={file} controls style={{ width:"100%", maxHeight:300, display:"block", ...mediaStyle }}/>
        ) : (
          <img src={file} alt="" style={{ width:"100%", maxHeight:300, objectFit:"cover", display:"block", ...mediaStyle }}/>
        )}
        {selectedMusic && (
          <div style={{ position:"absolute", bottom:8, left:8, background:"rgba(0,0,0,0.7)", borderRadius:20, padding:"5px 12px", display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#fff" }}>
            <Icon name="music" size={14}/> {selectedMusic.title} · {selectedMusic.artist}
          </div>
        )}
      </div>

      {/* Tool tabs */}
      <div style={{ display:"flex", overflowX:"auto", borderBottom:"1px solid var(--border)", background:"var(--bg2)", scrollbarWidth:"none", flexShrink:0 }}>
        {tools.map(t=>(
          <button key={t.id} className={`editor-tool ${activeTool===t.id?"active":""}`} onClick={()=>setActiveTool(t.id)} style={{ minWidth:64, flex:"0 0 auto" }}>
            <Icon name={t.icon} size={18}/>
            <span style={{ fontSize:10 }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tool panels */}
      <div style={{ flex:1, overflowY:"auto", padding:16 }}>

        {activeTool==="filters" && (
          <div>
            <div style={{ fontSize:12, color:"var(--text3)", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>Choose Filter</div>
            <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:8, scrollbarWidth:"none" }}>
              {FILTERS.map(f=>(
                <div key={f} onClick={()=>setActiveFilter(f)} style={{ flexShrink:0, cursor:"pointer", textAlign:"center" }}>
                  <div style={{ width:70, height:70, borderRadius:10, overflow:"hidden", border:activeFilter===f?"2px solid #fff":"2px solid transparent", transition:"border 0.2s" }}>
                    {fileType==="video" ? (
                      <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg,#333,#666)`, display:"flex", alignItems:"center", justifyContent:"center", filter:FILTER_CSS[f]||"none", fontSize:11, color:"#fff" }}>{f}</div>
                    ) : (
                      <img src={file} alt={f} style={{ width:"100%", height:"100%", objectFit:"cover", filter:FILTER_CSS[f]||"none" }}/>
                    )}
                  </div>
                  <div style={{ fontSize:11, marginTop:4, color:activeFilter===f?"#fff":"var(--text3)" }}>{f}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTool==="adjust" && (
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            {[["Brightness","sun",brightness,setBrightness,50,150],["Contrast","contrast",contrast,setContrast,50,150],["Saturation","filter",saturation,setSaturation,0,200]].map(([label,icon,val,setter,mn,mx])=>(
              <div key={label}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8 }}>
                  <span style={{ color:"var(--text2)", display:"flex", alignItems:"center", gap:6 }}><Icon name={icon} size={14}/>{label}</span>
                  <span style={{ color:"#fff", fontWeight:600 }}>{val}%</span>
                </div>
                <input type="range" min={mn} max={mx} value={val} onChange={e=>setter(Number(e.target.value))} style={{ width:"100%", accentColor:"#fff", height:4, cursor:"pointer" }}/>
              </div>
            ))}
          </div>
        )}

        {activeTool==="caption" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <div style={{ fontSize:12, color:"var(--text3)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Post Title</div>
              <input className="inp" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Give your post a title..." style={{ fontWeight:600 }}/>
            </div>
            <div>
              <div style={{ fontSize:12, color:"var(--text3)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Caption</div>
              <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                <img src={currentUser?.avatar} alt="" style={{ width:32, height:32, borderRadius:"50%", flexShrink:0 }}/>
                <textarea className="inp" value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Write your caption... mention @people" rows={4} style={{ resize:"none", lineHeight:1.6 }}/>
              </div>
            </div>
          </div>
        )}

        {activeTool==="music" && (
          <div>
            <div style={{ fontSize:12, color:"var(--text3)", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>Add Music</div>
            <input className="inp" value={musicSearch} onChange={e=>setMusicSearch(e.target.value)} placeholder="Search songs, artists..." style={{ marginBottom:12 }}/>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {filteredMusic.map(t=>(
                <div key={t.id} onClick={()=>setSelectedMusic(selectedMusic?.id===t.id?null:t)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", background:selectedMusic?.id===t.id?"rgba(255,255,255,0.08)":"var(--bg3)", borderRadius:12, cursor:"pointer", border:selectedMusic?.id===t.id?"1px solid #fff":"1px solid transparent", transition:"all 0.15s" }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:"var(--bg4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name="music" size={20} color={selectedMusic?.id===t.id?"#fff":"var(--text3)"}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:14, color:"#fff" }}>{t.title}</div>
                    <div style={{ fontSize:12, color:"var(--text3)" }}>{t.artist} · {t.duration} · {t.genre}</div>
                  </div>
                  {selectedMusic?.id===t.id && <Icon name="check" size={18} color="#fff"/>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTool==="hashtags" && (
          <div>
            <div style={{ fontSize:12, color:"var(--text3)", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>Add Hashtags to Go Viral 🔥</div>
            <div style={{ position:"relative" }}>
              <textarea className="inp" value={hashtags} onChange={e=>handleHashtagInput(e.target.value)} placeholder="Type #hashtags to reach more people..." rows={3} style={{ resize:"none" }}/>
              {suggestedTags.length>0 && (
                <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:10, zIndex:10, overflow:"hidden", marginTop:4 }}>
                  {suggestedTags.map(tag=>(
                    <button key={tag} onClick={()=>addHashtag(tag)} style={{ display:"block", width:"100%", padding:"10px 14px", background:"none", border:"none", color:"var(--text)", fontSize:13, cursor:"pointer", textAlign:"left", transition:"background 0.1s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="var(--bg4)"}
                      onMouseLeave={e=>e.currentTarget.style.background="none"}
                    >{tag}</button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:12, color:"var(--text3)", marginBottom:8 }}>Trending Hashtags</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {TRENDING_HASHTAGS.slice(0,12).map(tag=>(
                  <button key={tag} onClick={()=>setHashtags(h=>(h+" "+tag).trim()+" ")} style={{ padding:"4px 10px", borderRadius:16, border:"1px solid var(--border)", background:"var(--bg3)", color:"#1DA1F2", fontSize:12, cursor:"pointer" }}>{tag}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTool==="location" && (
          <div>
            <div style={{ fontSize:12, color:"var(--text3)", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>Add Location</div>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}><Icon name="location" size={16} color="var(--text3)"/></div>
              <input className="inp" value={location} onChange={e=>setLocation(e.target.value)} placeholder="Search location..." style={{ paddingLeft:36 }}/>
            </div>
            <div style={{ marginTop:12, display:"flex", flexWrap:"wrap", gap:8 }}>
              {["Mumbai, India","Delhi, India","Bangalore, India","Chennai, India","Kolkata, India","Hyderabad, India"].map(loc=>(
                <button key={loc} onClick={()=>setLocation(loc)} style={{ padding:"6px 12px", borderRadius:20, border:"1px solid var(--border)", background:location===loc?"rgba(255,255,255,0.1)":"var(--bg3)", color:location===loc?"#fff":"var(--text2)", fontSize:12, cursor:"pointer" }}>{loc}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── CREATE MENU ─────────────────────────── */
function CreateMenu({ onClose, onOpenStoryCamera, onOpenPostCreate }) {
  return (
    <div className="create-menu-overlay">
      <div className="create-menu-backdrop" onClick={onClose}/>
      <div className="create-menu-sheet slide-up">
        <div style={{ width:40,height:4,borderRadius:2,background:"var(--border)",margin:"0 auto 8px" }}/>
        <div style={{ fontWeight:700,fontSize:16,textAlign:"center",marginBottom:4 }}>Create</div>

        <button className="create-menu-btn" onClick={()=>{ onClose(); onOpenStoryCamera(); }}>
          <div style={{ width:46,height:46,borderRadius:14,background:"linear-gradient(135deg,#f7d700,#ff9500)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <Icon name="camera" size={22} color="#000"/>
          </div>
          <div>
            <div style={{ fontWeight:700,fontSize:14,color:"#fff" }}>Story</div>
            <div style={{ fontSize:12,color:"var(--text3)",marginTop:1 }}>Photo or video · disappears in 24h</div>
          </div>
        </button>

        <button className="create-menu-btn" onClick={()=>{ onClose(); onOpenPostCreate("post"); }}>
          <div style={{ width:46,height:46,borderRadius:14,background:"linear-gradient(135deg,#1DA1F2,#0d8fd8)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <Icon name="image" size={22} color="#fff"/>
          </div>
          <div>
            <div style={{ fontWeight:700,fontSize:14,color:"#fff" }}>Post</div>
            <div style={{ fontSize:12,color:"var(--text3)",marginTop:1 }}>Share a photo or video to your feed</div>
          </div>
        </button>

        <button className="create-menu-btn" onClick={()=>{ onClose(); onOpenPostCreate("reel"); }}>
          <div style={{ width:46,height:46,borderRadius:14,background:"linear-gradient(135deg,#E84040,#c0392b)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <Icon name="reel" size={22} color="#fff"/>
          </div>
          <div>
            <div style={{ fontWeight:700,fontSize:14,color:"#fff" }}>Reel</div>
            <div style={{ fontSize:12,color:"var(--text3)",marginTop:1 }}>Short video up to 2 minutes</div>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── STORY CAMERA MODAL ─────────────────────────── */
function StoryCameraModal({ currentUser, onClose, onAddStory }) {
  const [mode, setMode] = useState("photo"); // photo | video
  const [flash, setFlash] = useState(false);
  const [facingUser, setFacingUser] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const [captured, setCaptured] = useState(null); // { src, type }
  const [capturedType, setCapturedType] = useState("image");
  const [storyText, setStoryText] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef();
  const mediaRecRef = useRef();
  const chunksRef = useRef([]);
  const recTimerRef = useRef();
  const fileRef = useRef();

  // Start camera stream
  const startStream = async () => {
    try {
      if(streamRef.current) { streamRef.current.getTracks().forEach(t=>t.stop()); }
      const stream = await navigator.mediaDevices.getUserMedia({
        video:{ facingMode: facingUser ? "user" : "environment" },
        audio: true
      });
      streamRef.current = stream;
      if(videoRef.current) { videoRef.current.srcObject = stream; }
    } catch(e) { /* camera not available in browser sandbox */ }
  };

  useEffect(() => {
    startStream();
    return () => {
      streamRef.current?.getTracks().forEach(t=>t.stop());
      clearInterval(recTimerRef.current);
    };
  }, [facingUser]);

  const takePhoto = () => {
    if(!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 1136;
    const ctx = c.getContext("2d");
    if(facingUser) { ctx.translate(c.width,0); ctx.scale(-1,1); }
    ctx.drawImage(v,0,0,c.width,c.height);
    const src = c.toDataURL("image/jpeg",0.92);
    setCaptured({ src, type:"image" });
    setCapturedType("image");
  };

  const startRecording = () => {
    if(!streamRef.current) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(streamRef.current);
    mr.ondataavailable = e => { if(e.data.size>0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current,{type:"video/webm"});
      const src = URL.createObjectURL(blob);
      setCaptured({ src, type:"video" });
      setCapturedType("video");
    };
    mr.start();
    mediaRecRef.current = mr;
    setRecording(true);
    setRecTime(0);
    recTimerRef.current = setInterval(()=>setRecTime(t=>{ if(t>=30){stopRecording();return 30;} return t+1; }),1000);
  };

  const stopRecording = () => {
    mediaRecRef.current?.stop();
    clearInterval(recTimerRef.current);
    setRecording(false);
  };

  const handleShutter = () => {
    if(mode==="photo") { takePhoto(); }
    else { if(recording) stopRecording(); else startRecording(); }
  };

  const handleFileUpload = e => {
    const f = e.target.files[0]; if(!f) return;
    const isVid = f.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = ev => { setCaptured({ src:ev.target.result, type:isVid?"video":"image" }); setCapturedType(isVid?"video":"image"); };
    reader.readAsDataURL(f);
  };

  const handleShareStory = () => {
    if(!captured) return;
    onAddStory({
      id: uid(),
      userId: currentUser.id,
      src: captured.src,
      type: captured.type,
      text: storyText || null,
      textColor,
      seen: false,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24*60*60*1000,
    });
    onClose();
  };

  // Preview captured story
  if(captured) {
    return (
      <div className="story-preview-overlay">
        {captured.type==="video"
          ? <video src={captured.src} autoPlay loop playsInline style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
          : <img src={captured.src} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
        }
        {/* Overlay gradient */}
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.35) 0%,transparent 30%,transparent 70%,rgba(0,0,0,0.5) 100%)",pointerEvents:"none" }}/>

        {/* Top bar */}
        <div style={{ position:"absolute",top:0,left:0,right:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",zIndex:5 }}>
          <button className="cam-top-btn" onClick={()=>setCaptured(null)}>
            <Icon name="close" size={20} color="#fff"/>
          </button>
          <div style={{ display:"flex",gap:10 }}>
            <button className="cam-top-btn" onClick={()=>setShowTextInput(v=>!v)}>
              <Icon name="text" size={18} color="#fff"/>
            </button>
          </div>
        </div>

        {/* Text overlay on story */}
        {storyText ? (
          <div style={{ position:"absolute",top:"40%",left:0,right:0,textAlign:"center",padding:"0 24px",zIndex:4,pointerEvents:"none" }}>
            <div style={{ fontSize:26,fontWeight:800,color:textColor,textShadow:"0 2px 12px rgba(0,0,0,0.8)",lineHeight:1.3 }}>{storyText}</div>
          </div>
        ) : null}

        {/* Text input */}
        {showTextInput && (
          <div style={{ position:"absolute",bottom:160,left:16,right:16,zIndex:6 }}>
            <input
              className="inp"
              placeholder="Add text to your story..."
              value={storyText}
              onChange={e=>setStoryText(e.target.value)}
              autoFocus
              style={{ background:"rgba(0,0,0,0.55)",border:"1px solid rgba(255,255,255,0.25)",color:"#fff",borderRadius:14,fontSize:16,fontWeight:600,textAlign:"center" }}
              onKeyDown={e=>{ if(e.key==="Enter") setShowTextInput(false); }}
            />
            <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:8 }}>
              {["#ffffff","#f7d700","#ff6b6b","#40C080","#1DA1F2","#a78bfa"].map(c=>(
                <div key={c} onClick={()=>setTextColor(c)} style={{ width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:textColor===c?"3px solid rgba(255,255,255,0.9)":"3px solid transparent",transition:"border 0.15s" }}/>
              ))}
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"20px 20px 44px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:5 }}>
          <button className="cam-top-btn" style={{ width:44,height:44 }} onClick={()=>fileRef.current?.click()}>
            <Icon name="image" size={20} color="#fff"/>
          </button>
          <button
            onClick={handleShareStory}
            style={{ display:"flex",alignItems:"center",gap:8,background:"#fff",color:"#000",border:"none",borderRadius:28,padding:"13px 28px",fontWeight:800,fontSize:15,cursor:"pointer" }}
          >
            Your Story
            <Icon name="send" size={18} color="#000"/>
          </button>
          <div style={{ width:44 }}/>
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display:"none" }} onChange={handleFileUpload}/>
        <canvas ref={canvasRef} style={{ display:"none" }}/>
      </div>
    );
  }

  // Camera viewfinder
  return (
    <div className="story-cam-overlay">
      {/* Live preview */}
      <video ref={videoRef} autoPlay playsInline muted style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:facingUser?"scaleX(-1)":"none" }}/>
      <canvas ref={canvasRef} style={{ display:"none" }}/>

      {/* Gradient overlays */}
      <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.45) 0%,transparent 25%,transparent 65%,rgba(0,0,0,0.6) 100%)",pointerEvents:"none" }}/>

      {/* Fallback when no camera */}
      <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}>
        <div style={{ textAlign:"center",color:"rgba(255,255,255,0.25)" }}>
          <Icon name="camera" size={52} color="rgba(255,255,255,0.2)"/>
          <div style={{ fontSize:12,marginTop:8 }}>Camera preview</div>
        </div>
      </div>

      {/* Top controls */}
      <div style={{ position:"absolute",top:0,left:0,right:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",zIndex:5 }}>
        <button className="cam-top-btn" onClick={onClose}>
          <Icon name="close" size={20} color="#fff"/>
        </button>
        <div style={{ display:"flex",gap:10 }}>
          <button className="cam-top-btn" onClick={()=>setFlash(v=>!v)}>
            <Icon name={flash?"bolt":"boltOff"} size={18} color={flash?"#f7d700":"#fff"}/>
          </button>
          <button className="cam-top-btn" onClick={()=>setFacingUser(v=>!v)}>
            <Icon name="flip" size={18} color="#fff"/>
          </button>
        </div>
      </div>

      {/* Recording timer */}
      {recording && (
        <div style={{ position:"absolute",top:70,left:0,right:0,display:"flex",justifyContent:"center",zIndex:5 }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(232,64,64,0.85)",borderRadius:20,padding:"5px 14px" }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:"#fff" }}/>
            <span style={{ color:"#fff",fontWeight:800,fontSize:13 }}>{recTime}s / 30s</span>
          </div>
        </div>
      )}

      {/* Mode switcher */}
      <div style={{ position:"absolute",bottom:130,left:0,right:0,display:"flex",justifyContent:"center",gap:12,zIndex:5 }}>
        {["photo","video"].map(m=>(
          <button key={m} className={`cam-mode-pill ${mode===m?"active":""}`} onClick={()=>{ if(recording)return; setMode(m); }}>
            {m.charAt(0).toUpperCase()+m.slice(1)}
          </button>
        ))}
      </div>

      {/* Bottom controls */}
      <div style={{ position:"absolute",bottom:44,left:0,right:0,display:"flex",alignItems:"center",justifyContent:"space-around",paddingInline:32,zIndex:5 }}>
        <button style={{ width:44,height:44,borderRadius:12,overflow:"hidden",border:"2px solid rgba(255,255,255,0.5)",cursor:"pointer",background:"var(--bg3)" }} onClick={()=>fileRef.current?.click()}>
          <img src={currentUser?.avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
        </button>
        <button className={`cam-shutter ${recording?"cam-recording":""}`} onClick={handleShutter}/>
        <div style={{ width:44 }}/>
      </div>

      <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display:"none" }} onChange={handleFileUpload}/>
    </div>
  );
}

/* ─────────────────────────── HIGHLIGHT VIEWER ─────────────────────────── */
function HighlightViewer({ highlight, onClose }) {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const stories = highlight.stories || [];
  const story = stories[idx];
  const DURATION = 5000;
  const interval = useRef(null);

  useEffect(() => {
    if(!story) { onClose(); return; }
    setProgress(0);
    interval.current = setInterval(()=>{
      setProgress(p=>{
        if(p>=100){ if(idx<stories.length-1){setIdx(i=>i+1);return 0;} else{onClose();return 100;} }
        return p+(100/(DURATION/100));
      });
    },100);
    return ()=>clearInterval(interval.current);
  },[idx]);

  if(!story) return null;

  return (
    <div className="hl-viewer-overlay">
      {/* Progress bars */}
      <div style={{ position:"absolute",top:0,left:0,right:0,display:"flex",gap:4,padding:"14px 12px 6px",zIndex:5 }}>
        {stories.map((_,i)=>(
          <div key={i} style={{ flex:1,height:2.5,background:"rgba(255,255,255,0.3)",borderRadius:2,overflow:"hidden" }}>
            <div style={{ height:"100%",background:"#fff",width:`${i<idx?100:i===idx?progress:0}%`,transition:"width 0.1s linear" }}/>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ position:"absolute",top:28,left:0,right:0,display:"flex",alignItems:"center",gap:10,padding:"8px 14px",zIndex:5 }}>
        <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#f7d700,#ff9500)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Icon name="highlight" size={18} color="#000"/>
        </div>
        <div>
          <div style={{ fontWeight:700,fontSize:14,color:"#fff" }}>{highlight.name}</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,0.6)" }}>{stories.length} {stories.length===1?"item":"items"}</div>
        </div>
        <div style={{ flex:1 }}/>
        <button className="btn-ghost" style={{ color:"#fff" }} onClick={onClose}><Icon name="close" size={22}/></button>
      </div>

      {/* Media */}
      {story.type==="video"
        ? <video src={story.src} autoPlay loop playsInline style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
        : <img src={story.src} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
      }
      {story.text && (
        <div style={{ position:"absolute",top:"40%",left:0,right:0,textAlign:"center",padding:"0 24px",pointerEvents:"none",zIndex:4 }}>
          <div style={{ fontSize:24,fontWeight:800,color:story.textColor||"#fff",textShadow:"0 2px 12px rgba(0,0,0,0.7)" }}>{story.text}</div>
        </div>
      )}

      {/* Tap areas */}
      <div style={{ position:"absolute",inset:0,display:"flex",zIndex:3 }}>
        <div style={{ flex:1 }} onClick={()=>{ if(idx>0)setIdx(i=>i-1); else onClose(); }}/>
        <div style={{ flex:1 }} onClick={()=>{ if(idx<stories.length-1)setIdx(i=>i+1); else onClose(); }}/>
      </div>
    </div>
  );
}

/* ─────────────────────────── HIGHLIGHTS SECTION ─────────────────────────── */
function HighlightsSection({ highlights, setHighlights, isOwn, userStories, currentUser }) {
  const [viewingHL, setViewingHL] = useState(null);
  const [showCreateHL, setShowCreateHL] = useState(false);
  const [newHLName, setNewHLName] = useState("");
  const [selectedStories, setSelectedStories] = useState([]);
  const fileRef = useRef();
  const [uploadedImg, setUploadedImg] = useState(null);

  const createHighlight = () => {
    if(!newHLName.trim()) return;
    const coverStory = selectedStories.length > 0
      ? userStories.find(s=>s.id===selectedStories[0]) || null
      : null;
    const newHL = {
      id: uid(),
      name: newHLName.trim(),
      cover: coverStory?.src || uploadedImg || currentUser?.avatar,
      coverType: coverStory?.type || "image",
      stories: selectedStories.map(id=>userStories.find(s=>s.id===id)).filter(Boolean),
      createdAt: Date.now(),
    };
    setHighlights(prev=>[...prev, newHL]);
    setShowCreateHL(false);
    setNewHLName("");
    setSelectedStories([]);
    setUploadedImg(null);
  };

  if(showCreateHL) return (
    <div style={{ position:"fixed",inset:0,background:"var(--bg)",zIndex:600,overflowY:"auto",display:"flex",flexDirection:"column" }}>
      <div style={{ display:"flex",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid var(--border)",position:"sticky",top:0,background:"var(--bg)",zIndex:2 }}>
        <button className="btn-ghost" onClick={()=>setShowCreateHL(false)}><Icon name="close" size={22}/></button>
        <div style={{ flex:1,textAlign:"center",fontWeight:700,fontSize:15 }}>New Highlight</div>
        <button
          onClick={createHighlight}
          style={{ background:"none",border:"none",fontWeight:700,fontSize:14,color:newHLName.trim()?"#fff":"var(--text3)",cursor:"pointer" }}
        >Add</button>
      </div>
      <div style={{ padding:20,display:"flex",flexDirection:"column",gap:16 }}>
        {/* Cover picker */}
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:12 }}>
          <div
            style={{ width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#f7d700,#ff9500)",padding:3,cursor:"pointer" }}
            onClick={()=>fileRef.current?.click()}
          >
            <div style={{ width:"100%",height:"100%",borderRadius:"50%",background:"var(--bg3)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center" }}>
              {uploadedImg
                ? <img src={uploadedImg} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                : <Icon name="plusCircle" size={28} color="var(--text3)"/>
              }
            </div>
          </div>
          <div style={{ fontSize:12,color:"var(--text3)" }}>Tap to choose cover</div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{
            const f=e.target.files[0]; if(!f) return;
            const r=new FileReader(); r.onload=ev=>setUploadedImg(ev.target.result); r.readAsDataURL(f);
          }}/>
        </div>

        <input className="inp" placeholder="Highlight name e.g. Travel, Food, Work..." value={newHLName} onChange={e=>setNewHLName(e.target.value.slice(0,20))} autoFocus/>

        {/* Select from existing stories */}
        {userStories.length > 0 && (
          <div>
            <div style={{ fontSize:12,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10,fontWeight:700 }}>Add from your Stories</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4 }}>
              {userStories.map(s=>{
                const sel = selectedStories.includes(s.id);
                return (
                  <div
                    key={s.id}
                    style={{ position:"relative",aspectRatio:"1",borderRadius:10,overflow:"hidden",cursor:"pointer",border:sel?"2px solid #fff":"2px solid transparent",transition:"border 0.15s" }}
                    onClick={()=>setSelectedStories(prev=>sel?prev.filter(id=>id!==s.id):[...prev,s.id])}
                  >
                    {s.type==="video"
                      ? <video src={s.src} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                      : <img src={s.src} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                    }
                    {sel && (
                      <div style={{ position:"absolute",top:6,right:6,width:22,height:22,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <Icon name="check" size={13} color="#000"/>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {userStories.length === 0 && (
          <div style={{ padding:20,textAlign:"center",color:"var(--text3)",fontSize:13 }}>
            Add stories first to include them in highlights
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {viewingHL && <HighlightViewer highlight={viewingHL} onClose={()=>setViewingHL(null)}/>}
      <div className="highlights-row">
        {isOwn && (
          <div className="hl-bubble" onClick={()=>setShowCreateHL(true)}>
            <div className="hl-add-btn"><Icon name="plus" size={24} color="var(--text3)"/></div>
            <span className="hl-label">New</span>
          </div>
        )}
        {highlights.map(hl=>(
          <div key={hl.id} className="hl-bubble" onClick={()=>setViewingHL(hl)}>
            <div className="hl-ring">
              <div className="hl-ring-inner">
                <img src={hl.cover} alt="" className="hl-img"/>
              </div>
            </div>
            <span className="hl-label">{hl.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────── CREATE MODAL ─────────────────────────── */
function CreateModal({ currentUser, onClose, onPost, initialType="post" }) {
  const [step, setStep] = useState("choose");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("image");
  const [postType, setPostType] = useState(initialType);
  const [editorData, setEditorData] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if(!f) return;
    setError("");
    const isVideo = f.type.startsWith("video/");
    const isImage = f.type.startsWith("image/");
    if(!isVideo && !isImage) { setError("Please select an image or video"); return; }
    if(isVideo) {
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.onloadedmetadata = () => {
        URL.revokeObjectURL(vid.src);
        if(vid.duration>120) { setError(`Video too long (${Math.round(vid.duration)}s). Max 2 minutes.`); return; }
        const reader = new FileReader();
        reader.onload = ev => { setFile(ev.target.result); setFileType("video"); setStep("edit"); };
        reader.readAsDataURL(f);
      };
      vid.src = URL.createObjectURL(f);
    } else {
      const reader = new FileReader();
      reader.onload = ev => { setFile(ev.target.result); setFileType("image"); setStep("edit"); };
      reader.readAsDataURL(f);
    }
  };

  const handleEditorDone = (data) => {
    setEditorData(data);
    setStep("done");
  };

  const handleShare = () => {
    if(!file) return;
    const tags = editorData?.hashtags || [];
    const newPost = {
      id:uid(), userId:currentUser.id, type:fileType,
      src:file, caption:editorData?.caption||"", title:editorData?.title||"",
      location:editorData?.location||null, likes:[], comments:[], saved:[],
      time:"Just now", isReel:postType==="reel",
      hashtags:tags, music:editorData?.music||null,
      mediaFilter:editorData?.filter||"Normal",
    };
    onPost(newPost);
    onClose();
  };

  if(step==="edit") {
    return (
      <div className="modal-overlay">
        <div onClick={e=>e.stopPropagation()} style={{ background:"var(--bg)", borderRadius:20, width:"100%", maxWidth:480, maxHeight:"92vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <MediaEditor file={file} fileType={fileType} currentUser={currentUser} onDone={handleEditorDone} onBack={()=>setStep("choose")}/>
        </div>
      </div>
    );
  }

  if(step==="done" && editorData) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div onClick={e=>e.stopPropagation()} style={{ background:"var(--bg2)", borderRadius:20, width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto" }}>
          <div style={{ display:"flex", alignItems:"center", padding:"14px 16px", borderBottom:"1px solid var(--border)" }}>
            <button className="btn-ghost" onClick={()=>setStep("edit")}><Icon name="back" size={22}/></button>
            <div style={{ flex:1, textAlign:"center", fontWeight:700, fontSize:15 }}>Ready to Share</div>
            <button className="btn-ghost" style={{ color:"#fff", fontWeight:700, fontSize:14 }} onClick={handleShare}>Share</button>
          </div>
          <div style={{ padding:16, display:"flex", flexDirection:"column", gap:12 }}>
            {fileType==="video" ? (
              <video src={file} controls style={{ width:"100%", borderRadius:12, maxHeight:280, background:"#000" }}/>
            ) : (
              <img src={file} alt="" style={{ width:"100%", borderRadius:12, maxHeight:320, objectFit:"cover", filter:`${FILTER_CSS[editorData.filter]||"none"} brightness(${editorData.brightness}%) contrast(${editorData.contrast}%) saturate(${editorData.saturation}%)` }}/>
            )}
            {editorData.title && <div style={{ fontWeight:700, fontSize:16 }}>{editorData.title}</div>}
            {editorData.caption && <div style={{ fontSize:14, color:"var(--text2)", lineHeight:1.5 }}>{editorData.caption}</div>}
            {editorData.music && (
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg3)", padding:"8px 12px", borderRadius:10 }}>
                <Icon name="music" size={16}/><span style={{ fontSize:13 }}>{editorData.music.title} · {editorData.music.artist}</span>
              </div>
            )}
            {editorData.hashtags?.length>0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {editorData.hashtags.map(tag=><span key={tag} style={{ color:"#1DA1F2", fontSize:13 }}>{tag}</span>)}
              </div>
            )}
            {editorData.location && (
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"var(--text3)" }}>
                <Icon name="location" size={14}/>📍 {editorData.location}
              </div>
            )}
            <button className="btn btn-gold" style={{ padding:15, fontSize:15 }} onClick={handleShare}>
              <Icon name={postType==="reel"?"reel":"image"} size={18}/>
              Share {postType==="reel"?"Reel":"Post"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--bg2)", borderRadius:20, width:"100%", maxWidth:480 }}>
        <div style={{ display:"flex", alignItems:"center", padding:"14px 16px", borderBottom:"1px solid var(--border)" }}>
          <button className="btn-ghost" onClick={onClose}><Icon name="close" size={22}/></button>
          <div style={{ flex:1, textAlign:"center", fontWeight:700, fontSize:15 }}>Create</div>
          <div style={{ width:38 }}/>
        </div>
        <div style={{ padding:28, display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", background:"var(--bg3)", borderRadius:10, padding:4, gap:4 }}>
            {["post","reel"].map(t=>(
              <button key={t} onClick={()=>setPostType(t)} style={{ flex:1, padding:"9px", border:"none", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer", background:postType===t?"var(--bg2)":"transparent", color:postType===t?"#fff":"var(--text2)", transition:"all 0.2s" }}>
                {t==="post"?"Post":"Reel"}
              </button>
            ))}
          </div>
          {error && <div style={{ color:"var(--red)", fontSize:13, background:"rgba(232,64,64,0.08)", padding:"8px 12px", borderRadius:8 }}>{error}</div>}
          <input ref={fileRef} type="file" accept={postType==="reel"?"video/*":"image/*,video/*"} onChange={handleFile} style={{ display:"none" }}/>
          <button className="btn btn-gold" style={{ padding:16, fontSize:15 }} onClick={()=>{ setError(""); fileRef.current?.click(); }}>
            <Icon name={postType==="reel"?"video":"camera"} size={20}/>
            {postType==="reel"?"Select Video (max 2 min)":"Select Photo or Video"}
          </button>
          {postType==="reel" && <div style={{ color:"var(--text3)", fontSize:12, textAlign:"center" }}>Reels: up to 2 minutes · Add music, effects & hashtags</div>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── PROFILE DASHBOARD ─────────────────────────── */
function ProfileDashboard({ profile, posts, onClose }) {
  const userPosts = posts.filter(p=>p.userId===profile.id);
  const totalLikes = userPosts.reduce((a,p)=>a+p.likes.length,0);
  const totalComments = userPosts.reduce((a,p)=>a+p.comments.length,0);
  const totalSaves = userPosts.reduce((a,p)=>a+p.saved.length,0);
  const avgLikes = userPosts.length ? Math.round(totalLikes/userPosts.length) : 0;
  const engagementRate = profile.followers?.length ? ((totalLikes+totalComments)/(profile.followers.length||1)*100).toFixed(1) : 0;

  const weeklyData = [42,68,35,89,120,95,140];
  const maxVal = Math.max(...weeklyData);

  const accountBadge = { personal:"👤 Personal", creator:"🎨 Creator", business:"💼 Business", professional:"🏆 Professional", student:"🎓 Student" };

  return (
    <div style={{ height:"100%", minHeight:"100dvh", overflowY:"auto" }}>
      <div style={{ display:"flex", alignItems:"center", padding:"12px 16px", borderBottom:"1px solid var(--border)", position:"sticky", top:0, background:"rgba(8,8,8,0.95)", backdropFilter:"blur(20px)", zIndex:10 }}>
        <button className="btn-icon" onClick={onClose}><Icon name="back" size={22}/></button>
        <div style={{ flex:1, textAlign:"center", fontWeight:700, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <Icon name="dashboard" size={18}/>Dashboard
        </div>
        <div style={{ width:38 }}/>
      </div>

      <div style={{ padding:16 }}>
        {/* Profile summary */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, background:"var(--bg2)", borderRadius:14, padding:16, border:"1px solid var(--border)" }}>
          <img src={profile.avatar} alt="" style={{ width:54, height:54, borderRadius:"50%" }}/>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
              <span style={{ fontWeight:700, fontSize:15 }}>{profile.username}</span>
              {profile.verifiedType && <VerifiedBadge type={profile.verifiedType}/>}
            </div>
            <div style={{ fontSize:12, color:"#1DA1F2" }}>{accountBadge[profile.accountType]||"👤 Personal"}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:13, fontWeight:600, color:profile.subscribed?"#f7d700":"var(--text3)" }}>
              {profile.subscribed?`✓ ${profile.subPlan==="monthly"?"Monthly":"Annual"} Plan`:"Free Plan"}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { label:"Followers", val:fmtNum(profile.followers?.length||0), icon:"user", color:"#1DA1F2" },
            { label:"Total Posts", val:userPosts.length, icon:"image", color:"#40C080" },
            { label:"Total Likes", val:fmtNum(totalLikes), icon:"heart", color:"#E84040" },
            { label:"Engagement", val:`${engagementRate}%`, icon:"trending", color:"#f7d700" },
            { label:"Avg Likes/Post", val:avgLikes, icon:"star", color:"#ff9500" },
            { label:"Total Saves", val:fmtNum(totalSaves), icon:"bookmark", color:"#7c3aed" },
          ].map(item=>(
            <div key={item.label} className="dash-card">
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <Icon name={item.icon} size={16} color={item.color}/>
                <div className="dash-label">{item.label}</div>
              </div>
              <div className="dash-stat" style={{ color:item.color }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* Weekly reach chart */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:14, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:12, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Weekly Reach</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:80 }}>
            {weeklyData.map((val,i)=>(
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:"100%", background:"linear-gradient(to top,#1DA1F2,#1DA1F288)", borderRadius:"4px 4px 0 0", height:`${(val/maxVal)*70}px`, transition:"height 1s", minHeight:4 }}/>
                <div style={{ fontSize:9, color:"var(--text3)" }}>{"SMTWTFS"[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification progress */}
        {!profile.verified && (
          <div style={{ background:"rgba(29,161,242,0.08)", border:"1px solid rgba(29,161,242,0.2)", borderRadius:14, padding:16, marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <VerifiedBadge type="organic" size={20}/>
              <div style={{ fontWeight:700 }}>Verification Progress</div>
            </div>
            <div style={{ fontSize:13, color:"var(--text2)", marginBottom:10 }}>Reach 100K genuine followers for automatic blue tick verification</div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1, height:8, background:"var(--bg3)", borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", background:"#1DA1F2", borderRadius:4, width:`${Math.min((profile.followers?.length||0)/1000,100)}%`, transition:"width 1.5s" }}/>
              </div>
              <span style={{ fontSize:12, color:"#1DA1F2", fontWeight:600, flexShrink:0 }}>{fmtNum(profile.followers?.length||0)} / 100K</span>
            </div>
          </div>
        )}

        {/* Top posts */}
        {userPosts.length>0 && (
          <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:14, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:12, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Top Performing Posts</div>
            {userPosts.sort((a,b)=>b.likes.length-a.likes.length).slice(0,3).map((p,i)=>(
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:"var(--bg3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:["#f7d700","#aaa","#cd7f32"][i] }}>#{i+1}</div>
                <img src={p.src} alt="" style={{ width:44, height:44, borderRadius:8, objectFit:"cover" }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, color:"var(--text2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.caption||"No caption"}</div>
                  <div style={{ fontSize:12, color:"var(--text3)", display:"flex", gap:10, marginTop:2 }}>
                    <span>❤️ {p.likes.length}</span><span>💬 {p.comments.length}</span><span>🔖 {p.saved.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trending hashtags used */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:14, padding:16 }}>
          <div style={{ fontSize:12, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Trending Now · Use These to Go Viral 🔥</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {TRENDING_HASHTAGS.slice(0,10).map(tag=>(
              <span key={tag} style={{ padding:"4px 10px", borderRadius:16, background:"var(--bg3)", color:"#1DA1F2", fontSize:12 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── STORY VIEWER ─────────────────────────── */
function StoryViewer({ stories, startIdx, users, currentUser, onClose, onMarkSeen }) {
  // Only show active (non-expired) stories
  const activeStories = stories.filter(s => !s.expiresAt || Date.now() < s.expiresAt);
  const [idx, setIdx] = useState(Math.min(startIdx, activeStories.length-1));
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const story = activeStories[idx];
  const user = users.find(u=>u.id===story?.userId);
  const DURATION = 5000;
  const interval = useRef(null);

  const timeAgo = (ts) => {
    if(!ts) return "Just now";
    const diff = Math.floor((Date.now()-ts)/1000);
    if(diff<60) return `${diff}s ago`;
    if(diff<3600) return `${Math.floor(diff/60)}m ago`;
    return `${Math.floor(diff/3600)}h ago`;
  };

  useEffect(() => {
    if(!story){ onClose(); return; }
    setProgress(0);
    onMarkSeen?.(story.id);
    interval.current = setInterval(() => {
      if(paused) return;
      setProgress(p=>{
        if(p>=100){ if(idx<activeStories.length-1){setIdx(i=>i+1);return 0;} else{onClose();return 100;} }
        return p+(100/(DURATION/100));
      });
    },100);
    return ()=>clearInterval(interval.current);
  },[idx,paused]);

  if(!story) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"#000", zIndex:600, display:"flex", flexDirection:"column", userSelect:"none" }}>
      {/* Progress bars */}
      <div style={{ display:"flex", gap:4, padding:"12px 12px 6px", position:"absolute", top:0, left:0, right:0, zIndex:2 }}>
        {activeStories.map((_,i)=>(
          <div key={i} style={{ flex:1, height:2.5, background:"rgba(255,255,255,0.3)", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", background:"white", width:`${i<idx?100:i===idx?progress:0}%`, transition:paused?"none":"width 0.1s linear" }}/>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ position:"absolute", top:28, left:0, right:0, display:"flex", alignItems:"center", gap:10, padding:"8px 14px", zIndex:2 }}>
        <img src={user?.avatar} alt="" style={{ width:38, height:38, borderRadius:"50%", border:"2px solid white" }}/>
        <div>
          <div style={{ fontWeight:600, fontSize:14, color:"white", display:"flex", alignItems:"center", gap:6 }}>
            {user?.username}{user?.verifiedType && <VerifiedBadge type={user.verifiedType} size={14}/>}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>
            {timeAgo(story.createdAt)}
            {story.expiresAt && <span style={{ marginLeft:6,color:"rgba(255,255,255,0.45)" }}>· expires in {Math.max(0,Math.floor((story.expiresAt-Date.now())/3600000))}h</span>}
          </div>
        </div>
        <div style={{ flex:1 }}/>
        <button className="btn-ghost" style={{ color:"white" }} onClick={()=>setPaused(v=>!v)}><Icon name={paused?"play":"pause"} size={20}/></button>
        <button className="btn-ghost" style={{ color:"white" }} onClick={onClose}><Icon name="close" size={22}/></button>
      </div>

      {/* Media */}
      {story.type==="video"
        ?<video src={story.src} autoPlay loop style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
        :<img src={story.src} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
      }

      {/* Text overlay from story */}
      {story.text && (
        <div style={{ position:"absolute",top:"40%",left:0,right:0,textAlign:"center",padding:"0 24px",pointerEvents:"none",zIndex:3 }}>
          <div style={{ fontSize:24,fontWeight:800,color:story.textColor||"#fff",textShadow:"0 2px 12px rgba(0,0,0,0.8)" }}>{story.text}</div>
        </div>
      )}

      {/* Tap areas */}
      <div style={{ position:"absolute", inset:0, display:"flex" }}>
        <div style={{ flex:1 }} onClick={()=>{ if(idx>0)setIdx(i=>i-1); else onClose(); }}/>
        <div style={{ flex:1 }} onClick={()=>{ if(idx<activeStories.length-1)setIdx(i=>i+1); else onClose(); }}/>
      </div>

      {/* Reply box */}
      <div style={{ position:"absolute", bottom:30, left:16, right:16, zIndex:3, display:"flex", gap:10, alignItems:"center" }}>
        <input className="inp" placeholder={`Reply to ${user?.username}...`} style={{ flex:1, background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:24, color:"white" }}/>
        <button style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <Icon name="send" size={18} color="white"/>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── POST CARD ─────────────────────────── */
function PostCard({ post, users, currentUser, onLike, onComment, onSave, onFollow, onDelete, onOpenProfile }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(post.likes.includes(currentUser?.id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [saved, setSaved] = useState(post.saved.includes(currentUser?.id));
  const [showMore, setShowMore] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const lastTap = useRef(0);
  const author = users.find(u=>u.id===post.userId);

  const handleLike = () => {
    const nl = !liked; setLiked(nl); setLikeCount(c=>nl?c+1:c-1);
    if(nl){setHeartAnim(true);setTimeout(()=>setHeartAnim(false),400);}
    onLike(post.id,nl);
  };
  const handleDoubleTap = () => {
    const now=Date.now(); if(now-lastTap.current<300){if(!liked)handleLike();} lastTap.current=now;
  };
  const handleSave = () => { setSaved(s=>!s); onSave(post.id,!saved); };
  const sendComment = () => {
    if(!commentText.trim()) return;
    onComment(post.id,commentText.trim()); setCommentText(""); setShowEmojiPicker(false);
  };

  if(!author) return null;
  const isOwn = post.userId===currentUser?.id;
  const isFollowing = currentUser?.following?.includes(post.userId);

  return (
    <div style={{ marginBottom:4, borderBottom:"1px solid var(--border)" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px" }}>
        <div style={{ cursor:"pointer" }} onClick={()=>onOpenProfile?.(post.userId)}>
          <div className="story-ring"><div className="story-ring-inner">
            <img src={author.avatar} alt="" style={{ width:36,height:36,borderRadius:"50%",display:"block" }}/>
          </div></div>
        </div>
        <div style={{ flex:1, cursor:"pointer" }} onClick={()=>onOpenProfile?.(post.userId)}>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontWeight:700, fontSize:14 }}>{author.username}</span>
            {author.verifiedType && <VerifiedBadge type={author.verifiedType} size={15}/>}
          </div>
          {post.location && <div style={{ fontSize:11, color:"var(--text3)" }}>📍 {post.location}</div>}
        </div>
        {!isOwn && !isFollowing && <button className="btn btn-outline" style={{ padding:"5px 12px", fontSize:12 }} onClick={()=>onFollow(post.userId)}>Follow</button>}
        <div style={{ position:"relative" }}>
          <button className="btn-icon" onClick={()=>setShowMore(v=>!v)}><Icon name="more" size={18}/></button>
          {showMore && (
            <div style={{ position:"absolute", right:0, top:"100%", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", zIndex:50, width:160, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
              {isOwn && <button onClick={()=>{onDelete(post.id);setShowMore(false);}} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"12px 14px",background:"none",border:"none",color:"var(--red)",fontSize:13,cursor:"pointer" }}><Icon name="trash" size={14} color="var(--red)"/>Delete</button>}
              <button onClick={()=>{navigator.clipboard?.writeText("https://gupshup.app/p/"+post.id);setShowMore(false);}} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"12px 14px",background:"none",border:"none",color:"var(--text)",fontSize:13,cursor:"pointer" }}><Icon name="link" size={14}/>Copy Link</button>
              <button onClick={()=>setShowMore(false)} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 14px",background:"none",border:"none",color:"var(--text3)",fontSize:13,cursor:"pointer" }}>Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* Media */}
      <div style={{ position:"relative" }} onClick={handleDoubleTap}>
        {post.type==="video" ? (
          <video src={post.src} controls style={{ width:"100%", maxHeight:520, display:"block", background:"#000" }}/>
        ) : (
          <img src={post.src} alt="" className="post-img" style={{ filter:FILTER_CSS[post.mediaFilter]||"none" }}/>
        )}
        {heartAnim && <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none", zIndex:5 }} className="heart-anim"><Icon name="heart" size={90} color="rgba(255,255,255,0.95)" fill="rgba(255,255,255,0.95)"/></div>}
        {post.music && (
          <div style={{ position:"absolute", bottom:8, left:8, background:"rgba(0,0,0,0.65)", borderRadius:20, padding:"5px 12px", display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#fff" }}>
            <Icon name="music" size={13}/> {post.music.title} · {post.music.artist}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding:"8px 12px 6px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <button className="btn-icon" onClick={handleLike} style={{ color:liked?"var(--red)":"var(--text)" }}>
            <Icon name="heart" size={25} fill={liked?"var(--red)":"none"} color={liked?"var(--red)":"currentColor"}/>
          </button>
          <button className="btn-icon" onClick={()=>setShowComments(v=>!v)}><Icon name="comment" size={23}/></button>
          <button className="btn-icon"><Icon name="send" size={22}/></button>
          <div style={{ flex:1 }}/>
          <button className="btn-icon" onClick={handleSave} style={{ color:saved?"#fff":"var(--text)" }}>
            <Icon name="bookmark" size={23} fill={saved?"#fff":"none"} color={saved?"#fff":"currentColor"}/>
          </button>
        </div>
        {likeCount>0 && <div style={{ fontWeight:700, fontSize:14, marginTop:4 }}>{likeCount.toLocaleString()} likes</div>}
        {post.title && <div style={{ fontWeight:700, fontSize:15, marginTop:4 }}>{post.title}</div>}
        <div style={{ fontSize:14, marginTop:2, lineHeight:1.5 }}>
          <span style={{ fontWeight:700, marginRight:6, cursor:"pointer" }} onClick={()=>onOpenProfile?.(post.userId)}>{author.username}</span>
          <span style={{ color:"var(--text2)" }}>{post.caption}</span>
        </div>
        {post.hashtags?.length>0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:4 }}>
            {post.hashtags.map(tag=><span key={tag} style={{ color:"#1DA1F2", fontSize:13, cursor:"pointer" }}>{tag}</span>)}
          </div>
        )}
        <div style={{ fontSize:11, color:"var(--text3)", marginTop:3 }}>{post.time}</div>
        {post.comments.length>0 && (
          <div style={{ marginTop:6 }}>
            {!showComments && post.comments.length>2 && <button className="btn-ghost" style={{ fontSize:12,color:"var(--text3)",padding:"2px 0" }} onClick={()=>setShowComments(true)}>View all {post.comments.length} comments</button>}
            {(showComments?post.comments:post.comments.slice(-2)).map(c=>{
              const cu=users.find(u=>u.id===c.userId);
              return (
                <div key={c.id} style={{ fontSize:13,marginTop:4,color:"var(--text2)",display:"flex",gap:6 }}>
                  <span style={{ fontWeight:700,color:"var(--text)",cursor:"pointer",flexShrink:0 }} onClick={()=>onOpenProfile?.(c.userId)}>{cu?.username||"user"}</span>
                  <span style={{ flex:1 }}>{c.text}</span>
                  <span style={{ fontSize:10,color:"var(--text3)",flexShrink:0 }}>{c.time}</span>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ display:"flex",gap:8,marginTop:10,alignItems:"center",borderTop:"1px solid var(--border)",paddingTop:10,position:"relative" }}>
          <img src={currentUser?.avatar} alt="" style={{ width:28,height:28,borderRadius:"50%",flexShrink:0 }}/>
          <div style={{ flex:1,position:"relative" }}>
            <input value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendComment()} placeholder="Add a comment..." className="inp"
              style={{ padding:"8px 34px 8px 12px",fontSize:13,background:"transparent",border:"none",borderBottom:"1px solid var(--border)",borderRadius:0,width:"100%" }}/>
            <button className="btn-ghost" style={{ position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",padding:4 }} onClick={()=>setShowEmojiPicker(v=>!v)}><Icon name="emoji" size={16}/></button>
          </div>
          {commentText && <button className="btn-ghost" style={{ color:"#fff",fontSize:13,fontWeight:700,padding:"4px 8px" }} onClick={sendComment}>Post</button>}
          {showEmojiPicker && (
            <div style={{ position:"absolute",bottom:"100%",right:0,zIndex:30 }}>
              <div className="emoji-picker">
                {EMOJIS.map(e=><button key={e} className="emoji-btn" onClick={()=>{setCommentText(t=>t+e);setShowEmojiPicker(false);}}>{e}</button>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── REELS FEED ─────────────────────────── */
function ReelsFeed({ posts, users, currentUser, onLike }) {
  const reels = posts.filter(p=>p.isReel||p.type==="video");
  const [muted, setMuted] = useState(false);
  const [showSheet, setShowSheet] = useState(null);
  const [commentText, setCommentText] = useState("");

  if(reels.length===0) return (
    <div style={{ minHeight:"100dvh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, color:"var(--text3)" }}>
      <Icon name="reel" size={56}/><div style={{ fontSize:18,fontWeight:700,color:"var(--text)" }}>No Reels Yet</div>
      <div style={{ fontSize:13 }}>Create a reel to get started!</div>
    </div>
  );

  return (
    <div className="reel-container">
      {reels.map(post=>{
        const author = users.find(u=>u.id===post.userId);
        const isLiked = post.likes.includes(currentUser?.id);
        return (
          <div key={post.id} className="reel-item">
            <video src={post.src} loop muted={muted} autoPlay playsInline style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 50%)" }}/>
            <div style={{ position:"absolute",bottom:90,left:16,right:70,color:"white",zIndex:2 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                <img src={author?.avatar} alt="" style={{ width:38,height:38,borderRadius:"50%",border:"2px solid white" }}/>
                <span style={{ fontWeight:700,fontSize:14 }}>{author?.username}</span>
                {author?.verifiedType && <VerifiedBadge type={author.verifiedType} size={14}/>}
              </div>
              <div style={{ fontSize:14,textShadow:"0 1px 4px rgba(0,0,0,0.8)",lineHeight:1.4 }}>{post.caption}</div>
              {post.hashtags?.length>0 && <div style={{ marginTop:4, display:"flex", flexWrap:"wrap", gap:4 }}>{post.hashtags.slice(0,3).map(t=><span key={t} style={{ fontSize:12,color:"#1DA1F2" }}>{t}</span>)}</div>}
              {post.music && <div style={{ marginTop:6,fontSize:12,display:"flex",alignItems:"center",gap:5 }}><Icon name="music" size={12} color="white"/> {post.music.title} · {post.music.artist}</div>}
            </div>
            <div style={{ position:"absolute",bottom:120,right:12,display:"flex",flexDirection:"column",gap:20,alignItems:"center",zIndex:2 }}>
              <button style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3 }} onClick={()=>onLike(post.id,!isLiked)}>
                <Icon name="heart" size={30} fill={isLiked?"var(--red)":"none"} color={isLiked?"var(--red)":"white"}/>
                <span style={{ fontSize:12,color:"white",fontWeight:700 }}>{post.likes.length}</span>
              </button>
              <button style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3 }} onClick={()=>setShowSheet(post)}>
                <Icon name="comment" size={28} color="white"/>
                <span style={{ fontSize:12,color:"white",fontWeight:700 }}>{post.comments.length}</span>
              </button>
              <button style={{ background:"none",border:"none",cursor:"pointer" }} onClick={()=>setMuted(v=>!v)}>
                <Icon name={muted?"mute":"volume"} size={24} color="white"/>
              </button>
            </div>
          </div>
        );
      })}
      {showSheet && (
        <div style={{ position:"fixed",inset:0,zIndex:700 }} onClick={()=>setShowSheet(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ position:"absolute",bottom:0,left:0,right:0,background:"var(--bg2)",borderRadius:"20px 20px 0 0",border:"1px solid var(--border)",maxHeight:"60vh",display:"flex",flexDirection:"column" }}>
            <div style={{ padding:"14px",textAlign:"center",borderBottom:"1px solid var(--border)",fontWeight:700,position:"relative" }}>
              Comments
              <button style={{ position:"absolute",right:14,top:12,background:"none",border:"none",color:"var(--text2)",cursor:"pointer" }} onClick={()=>setShowSheet(null)}><Icon name="close" size={20}/></button>
            </div>
            <div style={{ flex:1,overflowY:"auto",padding:16 }}>
              {showSheet.comments.length===0?<div style={{ textAlign:"center",color:"var(--text3)",padding:24 }}>No comments yet</div>:showSheet.comments.map(c=>{
                const cu=users.find(u=>u.id===c.userId);
                return (<div key={c.id} style={{ display:"flex",gap:10,marginBottom:14 }}>
                  <img src={cu?.avatar} alt="" style={{ width:34,height:34,borderRadius:"50%",flexShrink:0 }}/>
                  <div><span style={{ fontWeight:700,fontSize:13 }}>{cu?.username} </span><span style={{ fontSize:13,color:"var(--text2)" }}>{c.text}</span><div style={{ fontSize:11,color:"var(--text3)",marginTop:2 }}>{c.time}</div></div>
                </div>);
              })}
            </div>
            <div style={{ display:"flex",gap:10,padding:"12px 16px",borderTop:"1px solid var(--border)" }}>
              <img src={currentUser?.avatar} alt="" style={{ width:34,height:34,borderRadius:"50%",flexShrink:0 }}/>
              <input className="inp" value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add a comment..." style={{ flex:1,borderRadius:20,padding:"8px 14px" }} onKeyDown={e=>{if(e.key==="Enter"&&commentText.trim())setCommentText("");}}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── DM SCREEN ─────────────────────────── */
function DMScreen({ conversations, setConversations, users, currentUser }) {
  const [activeConvo, setActiveConvo] = useState(null);
  const [msgText, setMsgText] = useState("");
  const [newDmQuery, setNewDmQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const bottomRef = useRef();
  const imgRef = useRef();
  const inputRef = useRef();

  useEffect(()=>{ setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50); },[activeConvo,conversations]);

  const myConvos = conversations.filter(c=>c.participants.includes(currentUser?.id));
  const getOther = c => { const id=c.participants.find(id=>id!==currentUser?.id); return users.find(u=>u.id===id); };

  const sendMessage = (text, type="text", imgSrc=null) => {
    const t=(text||"").trim();
    if(!t&&!imgSrc) return;
    if(!activeConvo) return;
    const newMsg={id:uid(),from:currentUser.id,text:t,time:timeNow(),type,img:imgSrc};
    setConversations(prev=>prev.map(c=>c.id===activeConvo.id?{...c,messages:[...c.messages,newMsg]}:c));
    setActiveConvo(prev=>({...prev,messages:[...prev.messages,newMsg]}));
    setMsgText(""); setShowEmojiPicker(false);
  };

  const handleImg = e => {
    const f=e.target.files[0]; if(!f) return;
    const reader=new FileReader();
    reader.onload=ev=>sendMessage("","image",ev.target.result);
    reader.readAsDataURL(f);
  };

  const startConvo = u => {
    const exists=conversations.find(c=>c.participants.includes(u.id)&&c.participants.includes(currentUser.id));
    if(exists){setActiveConvo(exists);setShowNew(false);return;}
    const newConvo={id:uid(),participants:[currentUser.id,u.id],messages:[]};
    setConversations(prev=>[...prev,newConvo]);
    setActiveConvo(newConvo); setShowNew(false); setNewDmQuery("");
  };

  const filteredUsers = newDmQuery ? users.filter(u=>u.id!==currentUser?.id&&(u.username.toLowerCase().includes(newDmQuery.toLowerCase())||u.name.toLowerCase().includes(newDmQuery.toLowerCase()))) : users.filter(u=>u.id!==currentUser?.id).slice(0,6);

  if(activeConvo) {
    const other = getOther(activeConvo);
    const convo = conversations.find(c=>c.id===activeConvo.id);
    return (
      <div style={{ display:"flex",flexDirection:"column",minHeight:"100dvh" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderBottom:"1px solid var(--border)",background:"rgba(8,8,8,0.95)",backdropFilter:"blur(20px)" }}>
          <button className="btn-icon" onClick={()=>setActiveConvo(null)}><Icon name="back" size={22}/></button>
          <div style={{ position:"relative" }}>
            <img src={other?.avatar} alt="" style={{ width:42,height:42,borderRadius:"50%" }}/>
            <div style={{ position:"absolute",bottom:1,right:1,width:10,height:10,background:"var(--green)",borderRadius:"50%",border:"2px solid var(--bg)" }}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:5 }}>{other?.username}{other?.verifiedType&&<VerifiedBadge type={other.verifiedType} size={14}/>}</div>
            <div style={{ fontSize:11,color:"var(--green)" }}>Active now</div>
          </div>
          <button className="btn-icon"><Icon name="video" size={20}/></button>
          <button className="btn-icon"><Icon name="more" size={18}/></button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"16px 14px",display:"flex",flexDirection:"column",gap:8 }}>
          {convo?.messages.length===0 && (
            <div style={{ textAlign:"center",padding:"40px 20px",color:"var(--text3)" }}>
              <img src={other?.avatar} alt="" style={{ width:64,height:64,borderRadius:"50%",marginBottom:12,border:"2px solid var(--border)" }}/>
              <div style={{ fontWeight:700,fontSize:15,color:"var(--text)",marginBottom:4 }}>{other?.name}</div>
              <div style={{ fontSize:13 }}>Say hello to {other?.username}</div>
            </div>
          )}
          {convo?.messages.map(msg=>{
            const isMe=msg.from===currentUser.id;
            return (
              <div key={msg.id} style={{ display:"flex",flexDirection:"column",alignItems:isMe?"flex-end":"flex-start",gap:2 }}>
                {msg.type==="image"&&msg.img ? <img src={msg.img} alt="" style={{ maxWidth:220,borderRadius:12,cursor:"pointer",marginLeft:isMe?"auto":"0" }}/> : <div className={isMe?"chat-bubble-me":"chat-bubble-them"}>{msg.text}</div>}
                <div style={{ fontSize:10,color:"var(--text3)",marginLeft:isMe?0:4,marginRight:isMe?4:0 }}>{msg.time}</div>
              </div>
            );
          })}
          <div ref={bottomRef}/>
        </div>
        {showEmojiPicker && (
          <div style={{ padding:"8px 14px",borderTop:"1px solid var(--border)" }}>
            <div className="emoji-picker" style={{ maxWidth:"100%" }}>
              {EMOJIS.map(e=><button key={e} className="emoji-btn" onClick={()=>{setMsgText(t=>t+e);inputRef.current?.focus();}}>{e}</button>)}
            </div>
          </div>
        )}
        <div style={{ display:"flex",gap:8,padding:"10px 12px",borderTop:"1px solid var(--border)",background:"rgba(8,8,8,0.95)",alignItems:"center" }}>
          <input ref={imgRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleImg}/>
          <button className="btn-icon" onClick={()=>setShowEmojiPicker(v=>!v)}><Icon name="emoji" size={22} color={showEmojiPicker?"#fff":"var(--text2)"}/></button>
          <button className="btn-icon" onClick={()=>imgRef.current?.click()}><Icon name="camera" size={22}/></button>
          <input ref={inputRef} className="inp" value={msgText} onChange={e=>setMsgText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(msgText);}}} placeholder="Message..." style={{ flex:1,borderRadius:24,padding:"10px 16px" }}/>
          {msgText ? <button onClick={()=>sendMessage(msgText)} style={{ background:"#fff",border:"none",borderRadius:"50%",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}><Icon name="send" size={17} color="#0a0a0a"/></button> : <button className="btn-icon" onClick={()=>imgRef.current?.click()}><Icon name="photo" size={22}/></button>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height:"100%",minHeight:"100dvh",overflowY:"auto" }}>
      <div style={{ display:"flex",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid var(--border)",position:"sticky",top:0,background:"rgba(8,8,8,0.95)",backdropFilter:"blur(20px)",zIndex:10 }}>
        <div style={{ fontWeight:700,flex:1,fontSize:18 }}>Messages</div>
        <button className="btn-icon" onClick={()=>setShowNew(v=>!v)} style={{ color:showNew?"#fff":"var(--text2)" }}><Icon name="edit" size={20}/></button>
      </div>
      {showNew && (
        <div style={{ padding:"12px 16px",borderBottom:"1px solid var(--border)",background:"var(--bg2)" }}>
          <input className="inp" value={newDmQuery} onChange={e=>setNewDmQuery(e.target.value)} placeholder="Search people..." style={{ marginBottom:8 }}/>
          <div style={{ display:"flex",flexDirection:"column",gap:2 }}>
            {filteredUsers.map(u=>(
              <div key={u.id} onClick={()=>startConvo(u)} className="notification-item" style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 4px",borderRadius:10 }}>
                <img src={u.avatar} alt="" style={{ width:42,height:42,borderRadius:"50%",border:"1px solid var(--border)" }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:5 }}>{u.username}{u.verifiedType&&<VerifiedBadge type={u.verifiedType} size={12}/>}</div>
                  <div style={{ fontSize:12,color:"var(--text3)" }}>{u.name} · {u.accountType}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding:"12px 16px",borderBottom:"1px solid var(--border)" }}>
        <div style={{ fontSize:12,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10 }}>Suggested</div>
        <div style={{ display:"flex",gap:14,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none" }}>
          {users.filter(u=>u.id!==currentUser?.id).slice(0,6).map(u=>(
            <div key={u.id} onClick={()=>startConvo(u)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",minWidth:58 }}>
              <div style={{ position:"relative" }}>
                <img src={u.avatar} alt="" style={{ width:52,height:52,borderRadius:"50%",border:"2px solid var(--border)" }}/>
                <div style={{ position:"absolute",bottom:1,right:1,width:10,height:10,background:"var(--green)",borderRadius:"50%",border:"2px solid var(--bg)" }}/>
              </div>
              <span style={{ fontSize:11,color:"var(--text2)",maxWidth:56,textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap" }}>{u.username}</span>
            </div>
          ))}
        </div>
      </div>
      {myConvos.length===0 ? (
        <div style={{ padding:48,textAlign:"center",color:"var(--text3)" }}>
          <Icon name="chat" size={56}/><div style={{ fontSize:18,fontWeight:700,color:"var(--text)",marginTop:12 }}>No Messages</div>
          <button className="btn btn-gold" style={{ marginTop:20,padding:"10px 24px" }} onClick={()=>setShowNew(true)}>Start a Conversation</button>
        </div>
      ) : myConvos.map(convo=>{
        const other=getOther(convo);
        const last=convo.messages[convo.messages.length-1];
        return (
          <div key={convo.id} onClick={()=>setActiveConvo(convo)} className="notification-item" style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:"1px solid var(--border)" }}>
            <div style={{ position:"relative" }}>
              <img src={other?.avatar} alt="" style={{ width:52,height:52,borderRadius:"50%" }}/>
              <div style={{ position:"absolute",bottom:2,right:2,width:11,height:11,background:"var(--green)",borderRadius:"50%",border:"2px solid var(--bg)" }}/>
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:5 }}>{other?.username}{other?.verifiedType&&<VerifiedBadge type={other.verifiedType} size={13}/>}</div>
              <div style={{ fontSize:13,color:"var(--text3)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>
                {last?(last.from===currentUser.id?"You: ":"")+(last.type==="image"?"📷 Photo":last.text||""):"Say hi!"}
              </div>
            </div>
            {last && <div style={{ fontSize:11,color:"var(--text3)",flexShrink:0 }}>{last.time}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── NOTIFICATIONS ─────────────────────────── */
function Notifications({ users, posts, currentUser, onFollow }) {
  const [notifications, setNotifications] = useState([
    { id:"n1",type:"like",userId:"u2",postId:"p1",time:"2m ago",read:false },
    { id:"n2",type:"comment",userId:"u3",postId:"p1",text:"Absolutely stunning! 😍",time:"15m ago",read:false },
    { id:"n3",type:"follow",userId:"u4",time:"1h ago",read:false },
    { id:"n4",type:"like",userId:"u1",postId:"p2",time:"3h ago",read:true },
    { id:"n5",type:"mention",userId:"u2",postId:"p2",text:"@priya_vibes great content!",time:"5h ago",read:true },
  ]);

  return (
    <div style={{ height:"100%",minHeight:"100dvh",overflowY:"auto" }}>
      <div style={{ display:"flex",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid var(--border)",position:"sticky",top:0,background:"rgba(8,8,8,0.95)",backdropFilter:"blur(20px)",zIndex:10 }}>
        <div style={{ fontWeight:700,flex:1,fontSize:18 }}>Notifications</div>
        <button className="btn-ghost" style={{ fontSize:12,color:"#aaa" }} onClick={()=>setNotifications(p=>p.map(n=>({...n,read:true})))}>Mark all read</button>
      </div>
      {notifications.map(n=>{
        const user=users.find(u=>u.id===n.userId);
        const post=posts.find(p=>p.id===n.postId);
        const isFollowing=currentUser?.following?.includes(n.userId);
        return (
          <div key={n.id} className="notification-item" style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:"1px solid var(--border)",background:n.read?"transparent":"rgba(255,255,255,0.02)" }}>
            {!n.read && <div style={{ width:6,height:6,borderRadius:"50%",background:"#fff",flexShrink:0 }}/>}
            <img src={user?.avatar} alt="" style={{ width:46,height:46,borderRadius:"50%",flexShrink:0,border:!n.read?"2px solid #fff":"2px solid transparent" }}/>
            <div style={{ flex:1,fontSize:13.5,color:"var(--text2)",lineHeight:1.4 }}>
              <span style={{ fontWeight:700,color:"var(--text)",display:"inline-flex",alignItems:"center",gap:4 }}>{user?.username}{user?.verifiedType&&<VerifiedBadge type={user.verifiedType} size={13}/>}</span>
              {n.type==="like"&&" liked your post"}
              {n.type==="comment"&&(<> commented: <span style={{ color:"var(--text)" }}>"{n.text}"</span></>)}
              {n.type==="follow"&&" started following you"}
              {n.type==="mention"&&(<> mentioned you: <span style={{ color:"var(--text)" }}>"{n.text}"</span></>)}
              <div style={{ fontSize:11,color:"var(--text3)",marginTop:2 }}>{n.time}</div>
            </div>
            {post&&n.type!=="follow"&&<img src={post.src} alt="" style={{ width:46,height:46,objectFit:"cover",borderRadius:8,flexShrink:0 }}/>}
            {n.type==="follow"&&<button className={`btn ${isFollowing?"btn-outline":"btn-gold"}`} style={{ padding:"6px 14px",fontSize:12,flexShrink:0 }} onClick={()=>onFollow?.(n.userId)}>{isFollowing?"Following":"Follow"}</button>}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── EXPLORE SCREEN ─────────────────────────── */
function ExploreScreen({ posts, users, currentUser, onFollow, onOpenProfile }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = query ? users.filter(u=>(u.username.toLowerCase().includes(query.toLowerCase())||u.name.toLowerCase().includes(query.toLowerCase()))&&u.id!==currentUser?.id) : [];
  const filteredPosts = activeFilter==="Photos"?posts.filter(p=>p.type==="image"):activeFilter==="Videos"||activeFilter==="Reels"?posts.filter(p=>p.type==="video"||p.isReel):posts;

  return (
    <div style={{ height:"100%",minHeight:"100dvh",overflowY:"auto" }}>
      <div style={{ padding:"12px 16px 10px",position:"sticky",top:0,background:"rgba(8,8,8,0.95)",backdropFilter:"blur(20px)",zIndex:10,borderBottom:"1px solid var(--border)" }}>
        <div style={{ position:"relative",marginBottom:10 }}>
          <div style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}><Icon name="explore" size={16} color="var(--text3)"/></div>
          <input className="inp" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search people, hashtags..." style={{ paddingLeft:36 }}/>
          {query && <button className="btn-ghost" style={{ position:"absolute",right:8,top:"50%",transform:"translateY(-50%)" }} onClick={()=>setQuery("")}><Icon name="close" size={14}/></button>}
        </div>
        {!query && (
          <div style={{ display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none" }}>
            {["All","Photos","Videos","Reels"].map(f=>(
              <button key={f} className={`filter-chip ${activeFilter===f?"active":""}`} onClick={()=>setActiveFilter(f)}>{f}</button>
            ))}
          </div>
        )}
      </div>
      {filtered.length>0 && (
        <div style={{ borderBottom:"1px solid var(--border)" }}>
          {filtered.map(u=>(
            <div key={u.id} className="notification-item" style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer" }} onClick={()=>onOpenProfile?.(u.id)}>
              <img src={u.avatar} alt="" style={{ width:46,height:46,borderRadius:"50%",border:"2px solid var(--border)" }}/>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                  <span style={{ fontWeight:700,fontSize:14 }}>{u.username}</span>
                  {u.verifiedType&&<VerifiedBadge type={u.verifiedType} size={14}/>}
                </div>
                <div style={{ fontSize:12,color:"var(--text3)" }}>{u.name} · {fmtNum(u.followers?.length||0)} followers · {u.accountType}</div>
              </div>
              <button className={`btn ${currentUser?.following?.includes(u.id)?"btn-outline":"btn-gold"}`} style={{ padding:"6px 14px",fontSize:12 }} onClick={e=>{e.stopPropagation();onFollow(u.id);}}>
                {currentUser?.following?.includes(u.id)?"Following":"Follow"}
              </button>
            </div>
          ))}
        </div>
      )}
      {!query && (
        <div className="explore-grid">
          {filteredPosts.map((p,i)=>(
            <div key={p.id} style={{ position:"relative",aspectRatio:i%7===0?"2/1":"1",overflow:"hidden",gridColumn:i%7===0?"span 2":"span 1",background:"var(--bg3)",cursor:"pointer" }}>
              {p.type==="video"?<video src={p.src} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:<img src={p.src} alt="" className="explore-thumb" style={{ height:"100%",objectFit:"cover",filter:FILTER_CSS[p.mediaFilter]||"none" }}/>}
              {(p.isReel||p.type==="video")&&<div style={{ position:"absolute",top:6,right:6 }}><Icon name="reel" size={14} color="white"/></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── HOME FEED ─────────────────────────── */
function HomeFeed({ posts, users, stories, currentUser, onLike, onComment, onSave, onFollow, onDelete, onStoryClick, onOpenStoryCamera, onOpenProfile }) {
  // Filter out expired stories (older than 24h)
  const activeStories = stories.filter(s => !s.expiresAt || Date.now() < s.expiresAt);

  return (
    <div style={{ height:"100%",minHeight:"100dvh",overflowY:"auto" }}>
      <div style={{ borderBottom:"1px solid var(--border)" }}>
        <div className="stories-row">
          {/* Your story button */}
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",minWidth:64 }} onClick={onOpenStoryCamera}>
            <div style={{ position:"relative" }}>
              <img src={currentUser?.avatar} alt="" style={{ width:60,height:60,borderRadius:"50%",border:"2px solid var(--border)" }}/>
              <div style={{ position:"absolute",bottom:-2,right:-2,width:22,height:22,background:"#fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid var(--bg)" }}>
                <Icon name="plus" size={12} color="#0a0a0a"/>
              </div>
            </div>
            <span style={{ fontSize:11,color:"var(--text3)",maxWidth:64,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>Your story</span>
          </div>
          {/* Others' stories */}
          {activeStories.map((s,i)=>{
            const user=users.find(u=>u.id===s.userId);
            return (
              <div key={s.id} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",minWidth:64 }} onClick={()=>onStoryClick(i)}>
                <div className={`story-ring ${s.seen?"seen":""}`}><div className="story-ring-inner">
                  <img src={user?.avatar} alt="" style={{ width:56,height:56,borderRadius:"50%",display:"block" }}/>
                </div></div>
                <span style={{ fontSize:11,color:"var(--text3)",maxWidth:64,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user?.username}</span>
              </div>
            );
          })}
        </div>
      </div>
      {posts.length===0 ? (
        <div style={{ padding:60,textAlign:"center",color:"var(--text3)" }}>
          <Icon name="camera" size={56}/>
          <div style={{ fontSize:18,fontWeight:700,color:"var(--text)",marginTop:16 }}>No Posts Yet</div>
        </div>
      ) : posts.map(post=>(
        <PostCard key={post.id} post={post} users={users} currentUser={currentUser} onLike={onLike} onComment={onComment} onSave={onSave} onFollow={onFollow} onDelete={onDelete} onOpenProfile={onOpenProfile}/>
      ))}
    </div>
  );
}

/* ─────────────────────────── PROFILE SCREEN ─────────────────────────── */
function ProfileScreen({ profileId, users, setUsers, posts, stories, currentUser, setCurrentUser, onLogout, onFollow, onOpenDM, onShowSubscription, onShowDashboard }) {
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeGrid, setActiveGrid] = useState("posts");
  const [showSettings, setShowSettings] = useState(false);
  const [highlights, setHighlights] = useState([
    { id:"hl1", name:"Travel", cover:"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&q=80", coverType:"image", stories:[], createdAt:Date.now() },
    { id:"hl2", name:"Food", cover:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80", coverType:"image", stories:[], createdAt:Date.now() },
  ]);
  const avatarRef = useRef();

  const profile = users.find(u=>u.id===profileId)||currentUser;
  const isOwn = profile?.id===currentUser?.id;
  const isFollowing = currentUser?.following?.includes(profile?.id);
  const userPosts = posts.filter(p=>p.userId===profile?.id);

  const saveEdit = () => {
    const updated={...profile,...editForm};
    setUsers(prev=>prev.map(u=>u.id===profile.id?updated:u));
    if(isOwn) setCurrentUser(updated);
    setEditMode(false);
  };

  const handleAvatarChange = e => {
    const f=e.target.files[0]; if(!f) return;
    const reader=new FileReader();
    reader.onload=ev=>{ const updated={...profile,avatar:ev.target.result}; setUsers(prev=>prev.map(u=>u.id===profile.id?updated:u)); if(isOwn)setCurrentUser(updated); };
    reader.readAsDataURL(f);
  };

  if(!profile) return null;

  const accountTypeLabels = { personal:"Personal", creator:"Creator", business:"Business", professional:"Professional", student:"Student" };

  if(showSettings) return (
    <div style={{ height:"100%",minHeight:"100dvh",overflowY:"auto" }}>
      <div style={{ display:"flex",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid var(--border)" }}>
        <button className="btn-icon" onClick={()=>setShowSettings(false)}><Icon name="back" size={22}/></button>
        <div style={{ flex:1,textAlign:"center",fontWeight:700 }}>Settings</div>
        <div style={{ width:38 }}/>
      </div>
      {[{ label:"Account", items:["Edit Profile","Change Password","Account Type","Linked Accounts"] },{ label:"Verification", items:["Verify my account","Subscription Plans","Organic Verification"] },{ label:"Privacy", items:["Private Account","Story Settings","Close Friends"] },{ label:"Support", items:["Help Center","About Gupshup","Terms of Service","Privacy Policy"] }].map(sec=>(
        <div key={sec.label}>
          <div style={{ padding:"14px 16px 6px",fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em" }}>{sec.label}</div>
          {sec.items.map(item=>(
            <div key={item} className="notification-item" style={{ display:"flex",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid var(--border)" }} onClick={item.includes("ubscription")||item.includes("erify")?()=>{ setShowSettings(false); onShowSubscription?.(); }:undefined}>
              <span style={{ flex:1,fontSize:15 }}>{item}</span>
              <Icon name="back" size={14} color="var(--text3)" style={{ transform:"rotate(180deg)" }}/>
            </div>
          ))}
        </div>
      ))}
      <div style={{ padding:16 }}>
        <button className="btn btn-outline" style={{ width:"100%",color:"var(--red)",borderColor:"var(--red)" }} onClick={onLogout}><Icon name="logout" size={16} color="var(--red)"/>Log Out</button>
      </div>
    </div>
  );

  if(editMode) return (
    <div style={{ height:"100%",minHeight:"100dvh",overflowY:"auto",padding:20 }}>
      <div style={{ display:"flex",alignItems:"center",marginBottom:20 }}>
        <button className="btn-icon" onClick={()=>setEditMode(false)}><Icon name="back" size={22}/></button>
        <div style={{ flex:1,textAlign:"center",fontWeight:700,fontSize:16 }}>Edit Profile</div>
        <button className="btn-gold" style={{ padding:"8px 16px",fontSize:13 }} onClick={saveEdit}>Save</button>
      </div>
      <div style={{ textAlign:"center",marginBottom:20 }}>
        <div style={{ position:"relative",display:"inline-block",cursor:"pointer" }} onClick={()=>avatarRef.current?.click()}>
          <img src={profile.avatar} alt="" style={{ width:90,height:90,borderRadius:"50%",border:"3px solid #fff" }}/>
          <div style={{ position:"absolute",bottom:0,right:0,background:"#fff",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name="camera" size={14} color="#0a0a0a"/></div>
          <input ref={avatarRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarChange}/>
        </div>
        <div style={{ marginTop:8,fontSize:13,color:"#ccc",cursor:"pointer" }} onClick={()=>avatarRef.current?.click()}>Change photo</div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <input className="inp" value={editForm.name||profile.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} placeholder="Full name"/>
        <input className="inp" value={editForm.username||profile.username} onChange={e=>setEditForm(f=>({...f,username:e.target.value.toLowerCase().replace(/\s/g,"")}))} placeholder="Username"/>
        <textarea className="inp" value={editForm.bio||profile.bio||""} onChange={e=>setEditForm(f=>({...f,bio:e.target.value}))} placeholder="Bio" rows={3} style={{ resize:"none",lineHeight:1.5 }}/>
        <input className="inp" value={editForm.website||profile.website||""} onChange={e=>setEditForm(f=>({...f,website:e.target.value}))} placeholder="Website or link"/>
        <div>
          <div style={{ fontSize:12,color:"var(--text3)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em" }}>Account Type</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
            {Object.entries(accountTypeLabels).map(([id,label])=>(
              <button key={id} className={`acct-pill ${(editForm.accountType||profile.accountType)===id?"selected":""}`} onClick={()=>setEditForm(f=>({...f,accountType:id}))}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ height:"100%",minHeight:"100dvh",overflowY:"auto" }}>
      <div style={{ display:"flex",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid var(--border)",position:"sticky",top:0,background:"rgba(8,8,8,0.95)",backdropFilter:"blur(20px)",zIndex:10 }}>
        <div style={{ flex:1,fontWeight:700,fontSize:16,display:"flex",alignItems:"center",gap:6 }}>
          {profile.username}{profile.verifiedType&&<VerifiedBadge type={profile.verifiedType}/>}
        </div>
        {isOwn && (
          <div style={{ display:"flex",gap:4 }}>
            <button className="btn-icon" title="Dashboard" onClick={()=>onShowDashboard?.()}><Icon name="dashboard" size={20}/></button>
            <button className="btn-icon" onClick={()=>setEditMode(true)}><Icon name="edit" size={20}/></button>
            <button className="btn-icon" onClick={()=>setShowSettings(true)}><Icon name="settings" size={20}/></button>
          </div>
        )}
      </div>

      <div style={{ padding:"18px 16px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:14 }}>
          <div style={{ position:"relative",cursor:isOwn?"pointer":"default" }} onClick={isOwn?()=>avatarRef.current?.click():undefined}>
            <div className="story-ring"><div className="story-ring-inner">
              <img src={profile.avatar} alt="" style={{ width:80,height:80,borderRadius:"50%",display:"block" }}/>
            </div></div>
            {isOwn && <input ref={avatarRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarChange}/>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",gap:18,textAlign:"center" }}>
              {[[userPosts.length,"Posts"],[profile.followers?.length||0,"Followers"],[profile.following?.length||0,"Following"]].map(([n,l])=>(
                <div key={l}><div style={{ fontWeight:700,fontSize:19 }}>{fmtNum(Number(n))}</div><div style={{ fontSize:12,color:"var(--text3)" }}>{l}</div></div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3 }}>
          <span style={{ fontWeight:700,fontSize:15 }}>{profile.name}</span>
          {profile.verifiedType&&<VerifiedBadge type={profile.verifiedType} size={15}/>}
          {profile.accountType && <span style={{ fontSize:11,color:"var(--text3)",marginLeft:4 }}>{accountTypeLabels[profile.accountType]}</span>}
        </div>
        {profile.bio && <div style={{ fontSize:14,color:"var(--text2)",marginBottom:6,lineHeight:1.5 }}>{profile.bio}</div>}
        {profile.website && <div style={{ fontSize:13,color:"#1DA1F2",marginBottom:8 }}>{profile.website}</div>}

        {/* Subscription badge */}
        {profile.subscribed && (
          <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(247,215,0,0.1)",border:"1px solid rgba(247,215,0,0.3)",borderRadius:20,padding:"4px 12px",marginBottom:10,fontSize:12,color:"#f7d700" }}>
            ⭐ {profile.subPlan==="monthly"?"Monthly Subscriber":"Annual Subscriber"} · Verified Creator
          </div>
        )}

        {isOwn ? (
          <div style={{ display:"flex",gap:8,marginTop:8 }}>
            <button className="btn btn-outline" style={{ flex:1 }} onClick={()=>setEditMode(true)}>Edit Profile</button>
            <button className="btn btn-gold" style={{ flex:1,fontSize:12 }} onClick={()=>onShowSubscription?.()}>
              {profile.subscribed?"Subscribed":"Get Verified"}
            </button>
          </div>
        ) : (
          <div style={{ display:"flex",gap:8,marginTop:8 }}>
            <button className={`btn ${isFollowing?"btn-outline":"btn-gold"}`} style={{ flex:1 }} onClick={()=>onFollow(profile.id)}>{isFollowing?"Following":"Follow"}</button>
            <button className="btn btn-outline" style={{ flex:1 }} onClick={()=>onOpenDM?.(profile.id)}>Message</button>
          </div>
        )}
      </div>

      {/* ── Highlights ── */}
      <div style={{ borderBottom:"1px solid var(--border)",paddingBottom:4 }}>
        <div style={{ padding:"10px 16px 2px",fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700 }}>Highlights</div>
        <HighlightsSection
          highlights={highlights}
          setHighlights={setHighlights}
          isOwn={isOwn}
          userStories={(stories||[]).filter(s=>s.userId===profile.id)}
          currentUser={currentUser}
        />
      </div>

      <div style={{ display:"flex",borderBottom:"1px solid var(--border)" }}>
        {[["posts",<Icon name="grid" size={20}/>],["reels",<Icon name="reel" size={20}/>],["saved",<Icon name="bookmark" size={20}/>]].map(([t,icon])=>(
          <button key={t} onClick={()=>setActiveGrid(t)} style={{ flex:1,padding:"12px",background:"none",border:"none",cursor:"pointer",color:activeGrid===t?"#fff":"var(--text3)",borderBottom:activeGrid===t?"2px solid #fff":"2px solid transparent",display:"flex",justifyContent:"center",transition:"all 0.2s" }}>{icon}</button>
        ))}
      </div>

      <div className="explore-grid">
        {(activeGrid==="saved"?posts.filter(p=>p.saved.includes(profile.id)):activeGrid==="reels"?userPosts.filter(p=>p.isReel||p.type==="video"):userPosts).map(p=>(
          <div key={p.id} style={{ position:"relative",aspectRatio:"1",overflow:"hidden",background:"var(--bg3)" }}>
            {p.type==="video"?<video src={p.src} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:<img src={p.src} alt="" className="explore-thumb" style={{ filter:FILTER_CSS[p.mediaFilter]||"none" }}/>}
            {(p.isReel||p.type==="video")&&<div style={{ position:"absolute",top:6,right:6 }}><Icon name="reel" size={14} color="white"/></div>}
          </div>
        ))}
        {(activeGrid==="posts"?userPosts:activeGrid==="reels"?userPosts.filter(p=>p.isReel||p.type==="video"):posts.filter(p=>p.saved.includes(profile.id))).length===0 && (
          <div style={{ gridColumn:"1/-1",padding:40,textAlign:"center",color:"var(--text3)" }}>
            <Icon name={activeGrid==="posts"?"camera":activeGrid==="reels"?"reel":"bookmark"} size={48}/>
            <div style={{ marginTop:12,fontSize:14 }}>No {activeGrid} yet</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── MARKETING SCREEN ─────────────────────────── */
function MarketingScreen({ currentUser, users, posts }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [adBudget, setAdBudget] = useState(1000);
  const [adFormat, setAdFormat] = useState("boosted");
  const [adTargetAge, setAdTargetAge] = useState(["18-24","25-34"]);
  const [adTargetCity, setAdTargetCity] = useState("Mumbai");
  const [campaignRunning, setCampaignRunning] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(2340);
  const [contentScore, setContentScore] = useState(null);
  const [scoringCaption, setScoringCaption] = useState("");
  const [shopItems, setShopItems] = useState([
    { id:"s1", name:"Premium Consultation", price:1499, sold:23, img:"https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&q=80" },
    { id:"s2", name:"Digital Course Bundle", price:2999, sold:11, img:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80" },
    { id:"s3", name:"Brand Kit Template", price:799, sold:48, img:"https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&q=80" },
  ]);
  const [flashSale, setFlashSale] = useState(false);
  const [flashTimer, setFlashTimer] = useState(3600);
  const [referralCode] = useState("GUPSHUP" + (currentUser?.username||"USER").toUpperCase().slice(0,5));

  const profile = currentUser;

  // Flash sale countdown
  useEffect(() => {
    if(!flashSale) return;
    const t = setInterval(() => setFlashTimer(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [flashSale]);

  const fmt = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const scoreCaption = () => {
    if(!scoringCaption.trim()) return;
    const words = scoringCaption.split(" ").length;
    const hasHash = (scoringCaption.match(/#/g)||[]).length;
    const hasEmoji = /[^\x00-\x7F]/.test(scoringCaption);
    const hasCTA = /buy|shop|link|dm|order|click|follow|save/i.test(scoringCaption);
    const score = Math.min(100, 20 + (words > 5 ? 15 : 0) + (hasHash >= 3 ? 20 : hasHash >= 1 ? 10 : 0) + (hasEmoji ? 15 : 0) + (hasCTA ? 20 : 0) + Math.floor(Math.random()*10));
    setContentScore(score);
  };

  const handleAiAssist = () => {
    if(!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    const responses = {
      caption: `Here's a high-converting caption for your post:\n\n"Transform your ${profile?.accountType||"business"} journey with our latest offering! Every detail crafted with you in mind. Swipe to explore, and hit the link in bio to grab yours today — limited slots available! ✨\n\n#${profile?.username||"gupshup"} #${(profile?.accountType||"creator")}life #GupshupViral #MadeInIndia"`,
      post: `This week's content plan for maximum reach:\n\n• Monday: Behind-the-scenes reel (process video)\n• Tuesday: Customer testimonial / review post\n• Wednesday: Educational carousel (3–7 slides)\n• Thursday: Poll/question story for engagement\n• Friday: Product/service showcase with offer\n• Weekend: Personal story or team spotlight\n\nBest posting times: 7–9 AM and 7–10 PM IST`,
      analyze: `Analysis of your last 5 posts:\n\n• Average engagement: 4.2% (industry avg: 2.8%) — Great!\n• Best performing: Image posts with faces get 38% more engagement\n• Underperformers: Posts without hashtags reached 60% fewer users\n• Recommendation: Add 5–10 niche hashtags + a question CTA to boost comments by 2x\n• Best day: Thursday posts get 22% higher reach for your audience`,
      calendar: `30-Day Content Calendar for ${profile?.accountType||"your business"}:\n\nWeek 1: Brand Awareness — Share your story, values, and team\nWeek 2: Education — Tips, how-to's, and industry insights\nWeek 3: Social Proof — Reviews, testimonials, case studies\nWeek 4: Conversion — Offers, CTAs, product demos\n\nPost frequency: 1 feed post/day + 2 stories/day for optimal growth`,
    };
    const key = /caption/i.test(aiPrompt) ? "caption" : /week|post|content/i.test(aiPrompt) ? "post" : /analyz|why|underperform/i.test(aiPrompt) ? "analyze" : "calendar";
    setTimeout(() => { setAiResponse(responses[key] || responses.calendar); setAiLoading(false); }, 1400);
  };

  const INFLUENCERS = [
    { id:"i1", name:"Priya Sharma", handle:"priya_vibes", avatar:"https://i.pravatar.cc/150?img=47", niche:"Lifestyle", followers:"124K", rate:"₹8,000/post", engagement:"4.8%", badge:"organic" },
    { id:"i2", name:"Arjun Mehta", handle:"foodie_arjun", niche:"Food & Travel", followers:"89K", rate:"₹6,500/post", engagement:"5.2%", badge:"subscribed", avatar:"https://i.pravatar.cc/150?img=12" },
    { id:"i3", name:"Meera Nair", handle:"meera_creates", niche:"Design & Art", followers:"42K", rate:"₹3,200/post", engagement:"7.1%", badge:null, avatar:"https://i.pravatar.cc/150?img=25" },
    { id:"i4", name:"Rahul Kapoor", handle:"delhi_diaries", niche:"Photography", followers:"67K", rate:"₹4,800/post", engagement:"6.3%", badge:null, avatar:"https://i.pravatar.cc/150?img=32" },
  ];

  const AD_FORMATS = [
    { id:"boosted", label:"Boosted Post", desc:"More reach on existing post", icon:"trending" },
    { id:"story", label:"Story Ad", desc:"Full-screen brand awareness", icon:"eye" },
    { id:"feed", label:"Feed Banner", desc:"Product launch exposure", icon:"image" },
    { id:"discovery", label:"Sponsored Discovery", desc:"Appear in Explore feed", icon:"explore" },
    { id:"preroll", label:"Video Pre-roll", desc:"Play before reels", icon:"play" },
    { id:"push", label:"Push Notification", desc:"Direct offer to users", icon:"bell" },
  ];

  const NICHE_HASHTAG_BUNDLES = {
    "Food": ["#FoodLovers","#FoodBlogger","#MumbaiFood","#IndianFood","#FoodPhotography","#Foodie","#HomeCooking","#RecipeOfTheDay"],
    "Fashion": ["#FashionIndia","#OOTD","#StyleBlogger","#IndianFashion","#Ethnic","#StreetStyle","#FashionBlogger","#Trending"],
    "Tech": ["#TechIndia","#StartupIndia","#IndianTech","#Coding","#AI","#Innovation","#TechTips","#MadeInIndia"],
    "Fitness": ["#FitIndia","#GymLife","#Fitness","#Workout","#HealthyLiving","#YogaIndia","#FitnessMotivation","#WellnessJourney"],
    "Travel": ["#IncredibleIndia","#TravelBlogger","#WanderlustIndia","#ExploreIndia","#TravelPhotography","#Backpacking","#HiddenGems","#Travel"],
  };
  const [selectedNiche, setSelectedNiche] = useState("Food");
  const [copiedBundle, setCopiedBundle] = useState(false);

  const copyHashtags = () => {
    const text = NICHE_HASHTAG_BUNDLES[selectedNiche].join(" ");
    navigator.clipboard?.writeText(text);
    setCopiedBundle(true);
    setTimeout(() => setCopiedBundle(false), 2000);
  };

  const TABS = [
    { id:"overview", label:"Overview", icon:"chart" },
    { id:"organic", label:"Organic", icon:"trending" },
    { id:"shop", label:"Shop", icon:"store" },
    { id:"ads", label:"Ads", icon:"megaphone" },
    { id:"influencers", label:"Creators", icon:"users" },
    { id:"loyalty", label:"Loyalty", icon:"gift" },
    { id:"ai", label:"AI Assistant", icon:"bot" },
  ];

  return (
    <div style={{ height:"100%", minHeight:"100dvh", overflowY:"auto" }}>
      {/* Header */}
      <div style={{ position:"sticky", top:0, zIndex:20, background:"rgba(8,8,8,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", padding:"12px 16px 10px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="rocket" size={20} color="#fff"/>
            <span style={{ fontWeight:800, fontSize:17, letterSpacing:"-0.01em" }}>Marketing Hub</span>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ fontSize:11, color:"var(--text3)", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:20, padding:"3px 10px" }}>
              {profile?.accountType ? profile.accountType.charAt(0).toUpperCase()+profile.accountType.slice(1) : "Personal"}
            </div>
            {profile?.subscribed && <div className="mkt-badge" style={{ background:"rgba(247,215,0,0.12)", color:"#f7d700", border:"1px solid rgba(247,215,0,0.25)" }}>PRO</div>}
          </div>
        </div>
        <div style={{ display:"flex", gap:6, overflowX:"auto", padding:"0 16px 10px", scrollbarWidth:"none" }}>
          {TABS.map(t => (
            <button key={t.id} className={`mkt-tab ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 16px 24px" }} className="mkt-fade-up">

        {/* ── OVERVIEW ── */}
        {activeTab==="overview" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* KPI grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { label:"Total Reach", val:"48.2K", sub:"+12% this week", color:"#1DA1F2", icon:"eye" },
                { label:"Engagement", val:"4.8%", sub:"Above average", color:"#40C080", icon:"heart" },
                { label:"Profile Visits", val:"2,341", sub:"+28 today", color:"#f7d700", icon:"user" },
                { label:"Orders via App", val:"₹38,400", sub:"This month", color:"#ff6b6b", icon:"coins" },
              ].map(stat => (
                <div key={stat.label} className="mkt-card" style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`${stat.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon name={stat.icon} size={18} color={stat.color}/>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>{stat.val}</div>
                    <div style={{ fontSize:11, color:"var(--text3)", marginTop:1 }}>{stat.label}</div>
                    <div style={{ fontSize:11, color:stat.color, marginTop:2 }}>{stat.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Funnel */}
            <div className="mkt-card">
              <div className="mkt-section-title">Conversion Funnel</div>
              {[
                { label:"Saw your content", val:48200, pct:100, color:"#1DA1F2" },
                { label:"Visited profile", val:2341, pct:4.8, color:"#40C080" },
                { label:"Clicked link/shop", val:892, pct:1.8, color:"#f7d700" },
                { label:"Purchased / enquired", val:156, pct:0.3, color:"#ff6b6b" },
              ].map((row, i) => (
                <div key={row.label} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                    <span style={{ color:"var(--text2)" }}>{row.label}</span>
                    <span style={{ color:"#fff", fontWeight:700 }}>{row.val.toLocaleString()}</span>
                  </div>
                  <div className="mkt-progress">
                    <div className="mkt-progress-bar" style={{ width:`${row.pct}%`, background:row.color }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Growth formula */}
            <div className="mkt-card" style={{ background:"linear-gradient(135deg,rgba(29,161,242,0.06),rgba(64,192,128,0.04))", borderColor:"rgba(29,161,242,0.2)" }}>
              <div className="mkt-section-title" style={{ color:"#1DA1F2" }}>Your 10x Growth Formula</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                {["Great Content","Wide Reach","Orders","Repeat Customers","Word of Mouth"].map((step, i, arr) => (
                  <div key={step} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:700, color:"#fff" }}>{step}</div>
                    {i < arr.length-1 && <span style={{ color:"var(--text3)", fontSize:14 }}>→</span>}
                  </div>
                ))}
                <div style={{ marginLeft:4 }}>
                  <span style={{ fontSize:13, fontWeight:800, color:"#40C080" }}>10x–100x</span>
                </div>
              </div>
            </div>

            {/* Weekly bar chart */}
            <div className="mkt-card">
              <div className="mkt-section-title">Weekly Reach</div>
              <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:80 }}>
                {[32,58,44,91,76,88,112].map((v,i) => (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:"100%", background:"linear-gradient(to top,#1DA1F2,#1DA1F288)", borderRadius:"4px 4px 0 0", height:`${(v/112)*70}px`, minHeight:4, transition:"height 1s" }}/>
                    <div style={{ fontSize:9, color:"var(--text3)" }}>{"SMTWTFS"[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <div className="mkt-section-title">Quick Actions</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { icon:"megaphone", label:"Launch Ad Campaign", desc:"Boost your best post", action:()=>setActiveTab("ads"), color:"#1DA1F2" },
                  { icon:"store", label:"Add Product to Shop", desc:"Start selling in-app", action:()=>setActiveTab("shop"), color:"#40C080" },
                  { icon:"users", label:"Find Influencers", desc:"Connect with creators", action:()=>setActiveTab("influencers"), color:"#f7d700" },
                  { icon:"bot", label:"AI Content Assistant", desc:"Get caption & calendar ideas", action:()=>setActiveTab("ai"), color:"#a78bfa" },
                ].map(a => (
                  <button key={a.label} className="mkt-action-btn" onClick={a.action}>
                    <div style={{ width:38, height:38, borderRadius:10, background:`${a.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon name={a.icon} size={18} color={a.color}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>{a.label}</div>
                      <div style={{ fontSize:11, color:"var(--text3)", marginTop:1 }}>{a.desc}</div>
                    </div>
                    <Icon name="back" size={14} color="var(--text3)" style={{ transform:"rotate(180deg)" }}/>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ORGANIC REACH ── */}
        {activeTab==="organic" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Content Score */}
            <div className="mkt-card">
              <div className="mkt-section-title">Content Virality Score</div>
              <div style={{ fontSize:12, color:"var(--text3)", marginBottom:10 }}>Enter your caption to get a virality score before posting</div>
              <textarea className="inp" rows={3} style={{ resize:"none", marginBottom:10 }} placeholder="Write your post caption here..." value={scoringCaption} onChange={e=>{setScoringCaption(e.target.value);setContentScore(null);}}/>
              <button className="btn btn-gold" style={{ width:"100%", padding:11, fontSize:13 }} onClick={scoreCaption}>Analyze Virality</button>
              {contentScore !== null && (
                <div style={{ marginTop:14, display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:`conic-gradient(${contentScore>=70?"#40C080":contentScore>=40?"#f7d700":"#E84040"} ${contentScore*3.6}deg,var(--bg3) 0deg)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <div style={{ width:50, height:50, borderRadius:"50%", background:"var(--bg2)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:contentScore>=70?"#40C080":contentScore>=40?"#f7d700":"#E84040" }}>{contentScore}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, color:"#fff" }}>{contentScore>=70?"High Viral Potential!":contentScore>=40?"Good — Can Improve":"Needs Work"}</div>
                    <div style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>
                      {contentScore>=70?"Your post is well-optimised. Good caption length, hashtags, and CTA present.":contentScore>=40?"Add more niche hashtags and a clear call-to-action to boost reach.":"Add emojis, 5+ hashtags, and a CTA like 'DM to order' for better reach."}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hashtag Intelligence */}
            <div className="mkt-card">
              <div className="mkt-section-title">Hashtag Intelligence</div>
              <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:12, scrollbarWidth:"none" }}>
                {Object.keys(NICHE_HASHTAG_BUNDLES).map(n => (
                  <button key={n} className={`mkt-chip ${selectedNiche===n?"sel":""}`} onClick={()=>setSelectedNiche(n)}>{n}</button>
                ))}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                {NICHE_HASHTAG_BUNDLES[selectedNiche].map(tag => (
                  <span key={tag} style={{ padding:"4px 10px", borderRadius:16, background:"rgba(29,161,242,0.1)", color:"#1DA1F2", fontSize:12, border:"1px solid rgba(29,161,242,0.2)" }}>{tag}</span>
                ))}
              </div>
              <button className="btn btn-outline" style={{ width:"100%", padding:10, fontSize:13 }} onClick={copyHashtags}>
                <Icon name={copiedBundle?"check":"link"} size={15}/>{copiedBundle?"Copied!":"Copy Bundle"}
              </button>
            </div>

            {/* Best time to post */}
            <div className="mkt-card">
              <div className="mkt-section-title">Best Time to Post</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[
                  { day:"Mon", time:"7–9 AM", score:82 },
                  { day:"Wed", time:"8–10 PM", score:91 },
                  { day:"Thu", time:"7–9 AM", score:88 },
                  { day:"Fri", time:"6–8 PM", score:95 },
                  { day:"Sat", time:"11 AM–1 PM", score:78 },
                  { day:"Sun", time:"7–9 PM", score:85 },
                ].map(t => (
                  <div key={t.day} style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 8px", textAlign:"center" }}>
                    <div style={{ fontSize:11, color:"var(--text3)", marginBottom:3 }}>{t.day}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#fff", marginBottom:4 }}>{t.time}</div>
                    <div style={{ fontSize:10, color:t.score>=90?"#40C080":t.score>=80?"#f7d700":"var(--text3)", fontWeight:700 }}>{t.score}/100</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Discovery & Referral Rings */}
            <div className="mkt-card">
              <div className="mkt-section-title">Referral Rings — Cross-Promote</div>
              <div style={{ fontSize:12, color:"var(--text3)", marginBottom:12 }}>Businesses in your niche cross-promote each other for free mutual growth</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { name:"Mumbai Bakers Co.", niche:"Food", members:12, reach:"840K combined" },
                  { name:"Delhi Creative Hub", niche:"Design", members:8, reach:"320K combined" },
                  { name:"Startup India Ring", niche:"Tech", members:21, reach:"2.1M combined" },
                ].map(ring => (
                  <div key={ring.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"var(--bg3)", borderRadius:12, border:"1px solid var(--border)" }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:"rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon name="users" size={18} color="var(--text2)"/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>{ring.name}</div>
                      <div style={{ fontSize:11, color:"var(--text3)" }}>{ring.members} members · {ring.reach}</div>
                    </div>
                    <button className="btn btn-outline" style={{ padding:"5px 12px", fontSize:11 }}>Join</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SHOP ── */}
        {activeTab==="shop" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Flash Sale */}
            <div className="mkt-card" style={{ borderColor:flashSale?"rgba(255,107,107,0.4)":"var(--border)", background:flashSale?"rgba(255,107,107,0.04)":"var(--bg2)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>Flash Sale Mode</div>
                  <div style={{ fontSize:11, color:"var(--text3)" }}>Creates urgency with countdown timer</div>
                </div>
                <button className="mkt-toggle" style={{ background:flashSale?"#ff6b6b":"var(--bg4)" }} onClick={()=>{setFlashSale(v=>!v);setFlashTimer(3600);}}>
                  <div className="mkt-toggle-knob" style={{ left:flashSale?23:3 }}/>
                </button>
              </div>
              {flashSale && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8, padding:"10px 14px", background:"rgba(255,107,107,0.1)", borderRadius:10, border:"1px solid rgba(255,107,107,0.2)" }}>
                  <Icon name="zap" size={16} color="#ff6b6b"/>
                  <span style={{ fontWeight:800, fontSize:18, color:"#ff6b6b", letterSpacing:"0.05em" }}>{fmt(flashTimer)}</span>
                  <span style={{ fontSize:12, color:"var(--text3)" }}>remaining · 20% off all products</span>
                </div>
              )}
            </div>

            {/* Product listings */}
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div className="mkt-section-title" style={{ margin:0 }}>Your Shop</div>
                <button className="btn btn-gold" style={{ padding:"6px 14px", fontSize:12 }}>+ Add Product</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {shopItems.map(item => (
                  <div key={item.id} className="mkt-card" style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <img src={item.img} alt="" style={{ width:60, height:60, borderRadius:10, objectFit:"cover", flexShrink:0 }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>{item.name}</div>
                      <div style={{ fontSize:12, color:"#40C080", fontWeight:700, marginTop:2 }}>₹{item.price.toLocaleString()}</div>
                      <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{item.sold} sold this month</div>
                    </div>
                    <button className="btn btn-outline" style={{ padding:"5px 10px", fontSize:11, flexShrink:0 }}>Edit</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead capture */}
            <div className="mkt-card">
              <div className="mkt-section-title">Lead Capture & DM Automation</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { label:"Request a Quote Button", desc:"Capture name, phone, requirement", enabled:true },
                  { label:"Auto-Reply DM Bot", desc:"Handles FAQs & price enquiries", enabled:true },
                  { label:"Lead Form on Profile", desc:"Collect email + phone from visitors", enabled:false },
                  { label:"DM-to-Order Flow", desc:"Auto-convert enquiries to orders", enabled:false },
                ].map(item => (
                  <div key={item.label} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"var(--bg3)", borderRadius:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:13, color:"#fff" }}>{item.label}</div>
                      <div style={{ fontSize:11, color:"var(--text3)", marginTop:1 }}>{item.desc}</div>
                    </div>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:item.enabled?"#40C080":"var(--bg4)", border:item.enabled?"none":"1px solid var(--border)", flexShrink:0 }}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Creator */}
            <div className="mkt-card">
              <div className="mkt-section-title">Coupon & Offer Creator</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ display:"flex", gap:10 }}>
                  <input className="inp" placeholder="Coupon code e.g. SAVE20" style={{ flex:1, fontSize:13 }}/>
                  <input className="inp" placeholder="% off" style={{ width:80, fontSize:13 }}/>
                </div>
                <button className="btn btn-gold" style={{ padding:11, fontSize:13 }}>
                  <Icon name="gift" size={16}/>Create Offer
                </button>
                <div style={{ fontSize:11, color:"var(--text3)", textAlign:"center" }}>Users who share your coupon earn ₹50 cashback — driving viral sharing</div>
              </div>
            </div>
          </div>
        )}

        {/* ── ADS ── */}
        {activeTab==="ads" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Budget tiers */}
            <div className="mkt-card">
              <div className="mkt-section-title">Ad Budget</div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                <span style={{ color:"var(--text2)" }}>Daily Budget</span>
                <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>₹{adBudget.toLocaleString()}</span>
              </div>
              <input type="range" min={500} max={15000} step={100} value={adBudget} onChange={e=>setAdBudget(Number(e.target.value))} style={{ width:"100%", accentColor:"#fff", height:4, cursor:"pointer", marginBottom:10 }}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text3)" }}>
                <span>Starter ₹500</span><span>Growth ₹2K–10K</span><span>Scale ₹10K+</span>
              </div>
              <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(29,161,242,0.06)", borderRadius:10, border:"1px solid rgba(29,161,242,0.15)" }}>
                <div style={{ fontSize:12, color:"var(--text2)" }}>Estimated daily reach at ₹{adBudget.toLocaleString()}/day:</div>
                <div style={{ fontWeight:800, fontSize:20, color:"#1DA1F2", marginTop:4 }}>{Math.floor(adBudget * 4.2).toLocaleString()} – {Math.floor(adBudget * 6.8).toLocaleString()} people</div>
              </div>
            </div>

            {/* Ad format */}
            <div>
              <div className="mkt-section-title">Ad Format</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {AD_FORMATS.map(f => (
                  <div key={f.id} className={`ad-format-card ${adFormat===f.id?"selected":""}`} onClick={()=>setAdFormat(f.id)}>
                    <Icon name={f.icon} size={20} color={adFormat===f.id?"#1DA1F2":"var(--text3)"}/>
                    <div style={{ fontWeight:700, fontSize:12, color:"#fff", marginTop:6 }}>{f.label}</div>
                    <div style={{ fontSize:10, color:"var(--text3)", marginTop:2 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeting */}
            <div className="mkt-card">
              <div className="mkt-section-title">Targeting Options</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div>
                  <div style={{ fontSize:12, color:"var(--text3)", marginBottom:6 }}>City / Location</div>
                  <select className="inp" style={{ fontSize:13 }} value={adTargetCity} onChange={e=>setAdTargetCity(e.target.value)}>
                    {["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:12, color:"var(--text3)", marginBottom:6 }}>Age Groups</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {["13-17","18-24","25-34","35-44","45+"].map(age => (
                      <button key={age} className={`mkt-chip ${adTargetAge.includes(age)?"sel":""}`}
                        onClick={()=>setAdTargetAge(prev=>prev.includes(age)?prev.filter(a=>a!==age):[...prev,age])}>
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:12, color:"var(--text3)", marginBottom:6 }}>Audience Type</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {["Lookalike Audience","Retargeting","Interest: Food","Interest: Fashion","Interest: Tech","Interest: Travel"].map(t => (
                      <button key={t} className="mkt-chip">{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Launch */}
            <button className={`btn ${campaignRunning?"btn-outline":"btn-gold"}`} style={{ width:"100%", padding:15, fontSize:15 }}
              onClick={()=>setCampaignRunning(v=>!v)}>
              <Icon name={campaignRunning?"pause":"megaphone"} size={18}/>
              {campaignRunning?"Pause Campaign":"Launch Campaign"}
            </button>
            {campaignRunning && (
              <div style={{ padding:"12px 16px", background:"rgba(64,192,128,0.08)", borderRadius:12, border:"1px solid rgba(64,192,128,0.2)", fontSize:13, color:"#40C080", textAlign:"center", fontWeight:600 }}>
                Campaign Live — reaching ~{Math.floor(adBudget*0.3).toLocaleString()} people/hour
              </div>
            )}
          </div>
        )}

        {/* ── INFLUENCERS ── */}
        {activeTab==="influencers" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div className="mkt-card" style={{ background:"linear-gradient(135deg,rgba(247,215,0,0.06),rgba(255,149,0,0.04))", borderColor:"rgba(247,215,0,0.2)" }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Creator Marketplace</div>
              <div style={{ fontSize:12, color:"var(--text3)" }}>Post a campaign brief and get matched with micro & macro influencers in your niche. Pay per post, per click, or per sale.</div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {INFLUENCERS.map(inf => (
                <div key={inf.id} className="influencer-card" onClick={()=>setSelectedInfluencer(inf===selectedInfluencer?null:inf)}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ position:"relative" }}>
                      <img src={inf.avatar} alt="" style={{ width:48, height:48, borderRadius:"50%", border:"2px solid var(--border)" }}/>
                      {inf.badge && <div style={{ position:"absolute", bottom:-2, right:-2 }}><VerifiedBadge type={inf.badge} size={16}/></div>}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>{inf.name}</div>
                      <div style={{ fontSize:11, color:"var(--text3)" }}>@{inf.handle} · {inf.niche}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>{inf.followers}</div>
                      <div style={{ fontSize:10, color:"var(--text3)" }}>followers</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <div style={{ flex:1, background:"var(--bg3)", borderRadius:8, padding:"6px 10px", textAlign:"center" }}>
                      <div style={{ fontSize:10, color:"var(--text3)" }}>Rate</div>
                      <div style={{ fontSize:12, fontWeight:700, color:"#f7d700" }}>{inf.rate}</div>
                    </div>
                    <div style={{ flex:1, background:"var(--bg3)", borderRadius:8, padding:"6px 10px", textAlign:"center" }}>
                      <div style={{ fontSize:10, color:"var(--text3)" }}>Engagement</div>
                      <div style={{ fontSize:12, fontWeight:700, color:"#40C080" }}>{inf.engagement}</div>
                    </div>
                    <button className="btn btn-gold" style={{ padding:"6px 12px", fontSize:11, flexShrink:0 }} onClick={e=>e.stopPropagation()}>
                      Collab
                    </button>
                  </div>
                  {selectedInfluencer?.id===inf.id && (
                    <div style={{ padding:"10px 12px", background:"var(--bg3)", borderRadius:10, fontSize:12, color:"var(--text2)", lineHeight:1.5 }}>
                      Send a collaboration request with your campaign brief, budget, and deliverables. {inf.name} will review and respond within 24h.
                      <button className="btn btn-gold" style={{ width:"100%", marginTop:10, padding:10, fontSize:12 }}>
                        <Icon name="send" size={14}/>Send Campaign Brief
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mkt-card">
              <div className="mkt-section-title">Post a Campaign Brief</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <input className="inp" placeholder="Campaign title e.g. 'Diwali Sale Promotion'" style={{ fontSize:13 }}/>
                <textarea className="inp" rows={2} style={{ resize:"none", fontSize:13 }} placeholder="Describe your brief — product, audience, deliverables..."/>
                <div style={{ display:"flex", gap:8 }}>
                  <input className="inp" placeholder="Budget (₹)" style={{ flex:1, fontSize:13 }}/>
                  <select className="inp" style={{ flex:1, fontSize:13 }}><option>Per post</option><option>Per click</option><option>Per sale</option></select>
                </div>
                <button className="btn btn-gold" style={{ padding:11, fontSize:13 }}>
                  <Icon name="briefcase" size={15}/>Post Brief
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── LOYALTY ── */}
        {activeTab==="loyalty" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Points balance */}
            <div className="mkt-card" style={{ background:"linear-gradient(135deg,rgba(247,215,0,0.08),rgba(255,149,0,0.05))", borderColor:"rgba(247,215,0,0.25)", textAlign:"center", padding:24 }}>
              <div style={{ fontSize:12, color:"#f7d700", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Your Loyalty Points</div>
              <div style={{ fontSize:52, fontWeight:900, color:"#f7d700", letterSpacing:"-0.03em", lineHeight:1 }}>{loyaltyPoints.toLocaleString()}</div>
              <div style={{ fontSize:12, color:"var(--text3)", marginTop:6 }}>pts ≈ ₹{(loyaltyPoints*0.1).toFixed(0)} cashback value</div>
              <button className="btn btn-gold" style={{ marginTop:16, padding:"10px 28px", fontSize:13 }}>Redeem Points</button>
            </div>

            {/* Earn points */}
            <div>
              <div className="mkt-section-title">Earn More Points</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { label:"Post content daily", pts:50, done:true },
                  { label:"Refer a friend", pts:500, done:false },
                  { label:"Make a purchase", pts:200, done:false },
                  { label:"Write a review", pts:100, done:false },
                  { label:"Share a business post", pts:25, done:true },
                  { label:"Complete your profile", pts:150, done:true },
                ].map(task => (
                  <div key={task.label} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:task.done?"rgba(64,192,128,0.05)":"var(--bg3)", borderRadius:10, border:`1px solid ${task.done?"rgba(64,192,128,0.2)":"var(--border)"}` }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:task.done?"rgba(64,192,128,0.15)":"var(--bg4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon name={task.done?"check":"coins"} size={14} color={task.done?"#40C080":"var(--text3)"}/>
                    </div>
                    <div style={{ flex:1, fontSize:13, color:task.done?"var(--text2)":"#fff" }}>{task.label}</div>
                    <div style={{ fontWeight:700, fontSize:12, color:task.done?"#40C080":"#f7d700" }}>+{task.pts} pts</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral */}
            <div className="mkt-card">
              <div className="mkt-section-title">Refer & Earn</div>
              <div style={{ fontSize:12, color:"var(--text3)", marginBottom:10 }}>Share your code. When someone joins and orders, you earn 500 points.</div>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ flex:1, padding:"11px 14px", background:"var(--bg3)", borderRadius:10, border:"1px solid var(--border)", fontWeight:800, fontSize:14, letterSpacing:"0.08em", color:"#fff" }}>{referralCode}</div>
                <button className="btn btn-gold" style={{ padding:"11px 16px", fontSize:13, flexShrink:0 }} onClick={()=>navigator.clipboard?.writeText(referralCode)}>
                  <Icon name="link" size={14}/>Copy
                </button>
              </div>
            </div>

            {/* Tiers */}
            <div>
              <div className="mkt-section-title">Loyalty Tiers</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { tier:"Bronze", range:"0–999 pts", color:"#cd7f32", perks:"5% off purchases", active:false },
                  { tier:"Silver", range:"1K–4.9K pts", color:"#aaa", perks:"10% off + early access", active:true },
                  { tier:"Gold", range:"5K–19.9K pts", color:"#f7d700", perks:"15% off + free shipping", active:false },
                  { tier:"Platinum", range:"20K+ pts", color:"#1DA1F2", perks:"20% off + dedicated manager", active:false },
                ].map(t => (
                  <div key={t.tier} className="loyalty-tier" style={{ background:t.active?`${t.color}08`:"transparent", borderColor:t.active?t.color:"var(--border)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:`${t.color}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name="star" size={16} color={t.color}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ fontWeight:700, fontSize:13, color:t.active?t.color:"#fff" }}>{t.tier}</span>
                          {t.active && <span style={{ fontSize:10, background:t.color, color:"#000", padding:"1px 7px", borderRadius:10, fontWeight:800 }}>YOU</span>}
                        </div>
                        <div style={{ fontSize:11, color:"var(--text3)" }}>{t.range} · {t.perks}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── AI ASSISTANT ── */}
        {activeTab==="ai" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div className="mkt-card" style={{ background:"linear-gradient(135deg,rgba(167,139,250,0.08),rgba(99,102,241,0.04))", borderColor:"rgba(167,139,250,0.25)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <Icon name="bot" size={20} color="#a78bfa"/>
                <span style={{ fontWeight:700, fontSize:14 }}>AI Growth Assistant</span>
              </div>
              <div style={{ fontSize:12, color:"var(--text3)" }}>Ask anything about growing your {profile?.accountType||"business"} on Gupshup</div>
            </div>

            {/* Quick prompts */}
            <div>
              <div className="mkt-section-title">Quick Prompts</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[
                  "Write me a caption for my product photo",
                  "What should I post this week to get more orders?",
                  "Analyze why my last 5 posts underperformed",
                  `Create a 30-day content calendar for my ${profile?.accountType||"business"}`,
                ].map(p => (
                  <button key={p} className="mkt-action-btn" onClick={()=>{ setAiPrompt(p); setAiResponse(""); }}>
                    <Icon name="zap" size={15} color="#a78bfa"/>
                    <span style={{ fontSize:12, color:"var(--text2)" }}>{p}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat input */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <textarea className="inp" rows={3} style={{ resize:"none", fontSize:13 }} placeholder="Ask your AI assistant anything..." value={aiPrompt} onChange={e=>{ setAiPrompt(e.target.value); setAiResponse(""); }}/>
              <button className="btn btn-gold" style={{ padding:12, fontSize:13 }} onClick={handleAiAssist} disabled={aiLoading||!aiPrompt.trim()}>
                {aiLoading ? (
                  <div style={{ width:18, height:18, border:"2px solid #000", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
                ) : (
                  <><Icon name="bot" size={16}/>Ask AI Assistant</>
                )}
              </button>
            </div>

            {/* AI Response */}
            {aiResponse && (
              <div style={{ background:"rgba(167,139,250,0.06)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:14, padding:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                  <Icon name="bot" size={16} color="#a78bfa"/>
                  <span style={{ fontSize:12, fontWeight:700, color:"#a78bfa" }}>AI Assistant</span>
                </div>
                <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.7, whiteSpace:"pre-line" }}>{aiResponse}</div>
                <button className="btn btn-outline" style={{ marginTop:12, padding:"7px 14px", fontSize:12 }} onClick={()=>navigator.clipboard?.writeText(aiResponse)}>
                  <Icon name="link" size={13}/>Copy Response
                </button>
              </div>
            )}

            {/* Auto-reply bot settings */}
            <div className="mkt-card">
              <div className="mkt-section-title">Auto-Reply DM Bot</div>
              <div style={{ fontSize:12, color:"var(--text3)", marginBottom:10 }}>Automatically handle FAQs, price enquiries, and order status in DMs</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {["Price enquiries","Order status","Working hours","Product availability"].map(faq => (
                  <div key={faq} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:"var(--bg3)", borderRadius:10 }}>
                    <Icon name="chat" size={14} color="var(--text3)"/>
                    <span style={{ flex:1, fontSize:12, color:"var(--text2)" }}>"{faq}"</span>
                    <span style={{ fontSize:10, color:"#40C080", fontWeight:700 }}>Active</span>
                  </div>
                ))}
                <button className="btn btn-outline" style={{ padding:10, fontSize:12 }}>
                  <Icon name="edit" size={14}/>Customize Replies
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN APP ─────────────────────────── */
function MainApp({ currentUser, setCurrentUser, allUsers, setAllUsers, onLogout }) {
  const [users, setUsers] = useState(allUsers);
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [stories, setStories] = useState(DEMO_STORIES);
  const [conversations, setConversations] = useState(DEMO_CONVOS);
  const [activeTab, setActiveTab] = useState("home");
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showStoryCamera, setShowStoryCamera] = useState(false);
  const [showPostCreate, setShowPostCreate] = useState(false);
  const [postCreateType, setPostCreateType] = useState("post");
  const [viewStory, setViewStory] = useState(null);
  const [profileId, setProfileId] = useState(currentUser?.id);
  const [hasNewNotif, setHasNewNotif] = useState(true);
  const [hasNewDm, setHasNewDm] = useState(true);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(()=>{ setAllUsers(users); },[users]);

  const handleLike = (postId, liked) => setPosts(prev=>prev.map(p=>{ if(p.id!==postId)return p; return {...p,likes:liked?[...new Set([...p.likes,currentUser.id])]:p.likes.filter(id=>id!==currentUser.id)}; }));
  const handleComment = (postId, text) => setPosts(prev=>prev.map(p=>p.id===postId?{...p,comments:[...p.comments,{id:uid(),userId:currentUser.id,text,time:"Just now"}]}:p));
  const handleSave = (postId, saved) => setPosts(prev=>prev.map(p=>{ if(p.id!==postId)return p; return {...p,saved:saved?[...new Set([...p.saved,currentUser.id])]:p.saved.filter(id=>id!==currentUser.id)}; }));
  const handleFollow = (userId) => {
    const isFollowing=currentUser.following?.includes(userId);
    const updatedUser={...currentUser,following:isFollowing?currentUser.following.filter(id=>id!==userId):[...(currentUser.following||[]),userId]};
    setCurrentUser(updatedUser);
    setUsers(prev=>prev.map(u=>{ if(u.id===updatedUser.id)return updatedUser; if(u.id===userId)return{...u,followers:isFollowing?(u.followers||[]).filter(id=>id!==currentUser.id):[...(u.followers||[]),currentUser.id]}; return u; }));
  };
  const handleDelete = postId => setPosts(prev=>prev.filter(p=>p.id!==postId));
  const handlePost = newPost => { setPosts(prev=>[newPost,...prev]); setUsers(prev=>prev.map(u=>u.id===currentUser.id?{...u,posts:(u.posts||0)+1}:u)); };

  // Add story — stores with 24h expiry timestamp
  const handleAddStory = (storyData) => {
    const story = {
      ...storyData,
      id: storyData.id || uid(),
      userId: currentUser.id,
      seen: false,
      createdAt: storyData.createdAt || Date.now(),
      expiresAt: storyData.expiresAt || Date.now() + 24*60*60*1000,
    };
    setStories(prev=>[story,...prev]);
  };

  const handleMarkStorySeen = storyId => setStories(prev=>prev.map(s=>s.id===storyId?{...s,seen:true}:s));
  const handleOpenProfile = userId => { setProfileId(userId); setActiveTab("profile"); };
  const handleOpenDM = userId => setActiveTab("dms");

  const handleSubscribe = (plan, cycle) => {
    const updated={...currentUser,subscribed:true,subPlan:cycle,verifiedType:"subscribed",verified:true};
    setCurrentUser(updated);
    setUsers(prev=>prev.map(u=>u.id===updated.id?updated:u));
    setShowSubscription(false);
  };

  const isBusiness = currentUser?.accountType === "business";

  const tabs = [
    { id:"home", icon:"home" },
    { id:"explore", icon:"explore" },
    { id:"reels", icon:"reel" },
    ...(isBusiness ? [{ id:"marketing", icon:"megaphone" }] : []),
    { id:"dms", icon:"chat", badge:hasNewDm },
    { id:"profile", icon:"user" },
  ];

  const displayProfile = users.find(u=>u.id===currentUser?.id)||currentUser;

  const tabLabels = { home:"Home", explore:"Explore", reels:"Reels", marketing:"Marketing", dms:"Messages", notifications:"Notifications", profile:"Profile" };

  const navTo = (id) => {
    if(id==="profile") setProfileId(currentUser?.id);
    if(id==="dms") setHasNewDm(false);
    if(id==="notifications") setHasNewNotif(false);
    setActiveTab(id);
  };

  // Suggest users the current user doesn't follow
  const suggestedUsers = users.filter(u => u.id !== currentUser?.id && !currentUser?.following?.includes(u.id)).slice(0, 4);

  return (
    <div style={{ fontFamily:"var(--font)", background:"var(--bg)", minHeight:"100vh", color:"var(--text)" }}>
      <style>{STYLES}</style>

      {/* ── RESPONSIVE APP SHELL ── */}
      <div className="app-shell">

        {/* ══ LEFT SIDEBAR (tablet + desktop) ══ */}
        <nav className="left-sidebar">
          {/* Logo */}
          <div style={{ padding:"20px 12px 16px", flexShrink:0 }}>
            {/* Desktop: full wordmark */}
            <div className="sidebar-wordmark g-logo g-logo-sm" style={{ padding:"0 4px" }}>Gupshup</div>
            {/* Tablet: icon dot */}
            <div className="sidebar-dot-logo" style={{ display:"none", width:44, height:44, borderRadius:12, background:"var(--bg3)", alignItems:"center", justifyContent:"center", margin:"0 auto" }}>
              <span style={{ fontWeight:900, fontSize:18, color:"#fff" }}>G</span>
            </div>
          </div>

          {/* Create button */}
          <div style={{ padding:"0 8px 12px", flexShrink:0 }}>
            <button className="snav-create" onClick={()=>setShowCreateMenu(true)}>
              <Icon name="plus" size={20} color="#000"/>
              <span className="snav-label">Create</span>
            </button>
          </div>

          {/* Nav items */}
          <div style={{ flex:1, overflowY:"auto", padding:"0 8px", display:"flex", flexDirection:"column", gap:2 }}>
            {[
              { id:"home", icon:"home", label:"Home" },
              { id:"explore", icon:"explore", label:"Explore" },
              { id:"reels", icon:"reel", label:"Reels" },
              ...(isBusiness ? [{ id:"marketing", icon:"megaphone", label:"Marketing" }] : []),
              { id:"dms", icon:"chat", label:"Messages", badge:hasNewDm },
              { id:"notifications", icon:"bell", label:"Notifications", badge:hasNewNotif },
              { id:"profile", icon:"user", label:"Profile" },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} className={`snav-item ${isActive ? "active" : ""}`} onClick={()=>navTo(tab.id)} style={{ position:"relative" }}>
                  <div className="snav-icon">
                    <Icon name={tab.icon} size={22} color={isActive?"#fff":"var(--text2)"} fill={isActive&&tab.id==="home"?"currentColor":"none"}/>
                  </div>
                  <span className="snav-label" style={{ color:isActive?"#fff":"var(--text2)" }}>{tab.label}</span>
                  {tab.badge && <div className="snav-badge"/>}
                </button>
              );
            })}
          </div>

          {/* Bottom profile mini */}
          <div style={{ padding:"12px 8px 20px", flexShrink:0, borderTop:"1px solid var(--border)" }}>
            <button className="snav-item" onClick={()=>navTo("profile")} style={{ gap:10 }}>
              <img src={displayProfile?.avatar} alt="" style={{ width:36, height:36, borderRadius:"50%", border:"2px solid var(--border)", flexShrink:0 }}/>
              <div className="snav-label" style={{ minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{displayProfile?.name}</div>
                <div style={{ fontSize:11, color:"var(--text3)" }}>@{displayProfile?.username}</div>
              </div>
            </button>
          </div>
        </nav>

        {/* ══ MAIN CONTENT COLUMN ══ */}
        <div className="main-col">

          {/* Mobile-only header */}
          <div className="mobile-header">
            <button onClick={()=>setShowCreateMenu(true)} style={{ background:"none",border:"none",cursor:"pointer",color:"#fff",padding:4,display:"flex" }}>
              <Icon name="plus" size={26} color="#fff"/>
            </button>
            <div className="g-logo g-logo-sm" style={{ position:"absolute",left:"50%",transform:"translateX(-50%)" }}>Gupshup</div>
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"flex-end", gap:4 }}>
              <button className="btn-icon" onClick={()=>navTo("notifications")} style={{ position:"relative" }}>
                <Icon name="bell" size={22}/>{hasNewNotif&&<div className="notif-dot"/>}
              </button>
              <button className="btn-icon" onClick={()=>navTo("dms")} style={{ position:"relative" }}>
                <Icon name="chat" size={22}/>{hasNewDm&&<div className="notif-dot"/>}
              </button>
            </div>
          </div>

          {/* Screen content */}
          <div className="content-area" style={{ paddingBottom:"env(safe-area-inset-bottom)" }}>
            <div className="feed-center">
              {activeTab==="home" && <HomeFeed posts={posts} users={users} stories={stories} currentUser={currentUser} onLike={handleLike} onComment={handleComment} onSave={handleSave} onFollow={handleFollow} onDelete={handleDelete} onStoryClick={setViewStory} onOpenStoryCamera={()=>setShowStoryCamera(true)} onOpenProfile={handleOpenProfile}/>}
              {activeTab==="explore" && <ExploreScreen posts={posts} users={users} currentUser={currentUser} onFollow={handleFollow} onOpenProfile={handleOpenProfile}/>}
              {activeTab==="reels" && <ReelsFeed posts={posts} users={users} currentUser={currentUser} onLike={handleLike}/>}
              {activeTab==="marketing" && isBusiness && <MarketingScreen currentUser={currentUser} users={users} posts={posts}/>}
              {activeTab==="dms" && <DMScreen conversations={conversations} setConversations={setConversations} users={users} currentUser={currentUser}/>}
              {activeTab==="notifications" && <Notifications users={users} posts={posts} currentUser={currentUser} onFollow={handleFollow}/>}
              {activeTab==="profile" && <ProfileScreen profileId={profileId} users={users} setUsers={setUsers} posts={posts} stories={stories} currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={onLogout} onFollow={handleFollow} onOpenDM={handleOpenDM} onShowSubscription={()=>setShowSubscription(true)} onShowDashboard={()=>setShowDashboard(true)}/>}
            </div>
          </div>

          {/* Mobile bottom nav */}
          <nav className="bottom-nav">
            {tabs.map(tab=>{
              const isActive=activeTab===tab.id;
              return (
                <button key={tab.id} onClick={()=>navTo(tab.id)} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 10px",position:"relative",transition:"all 0.15s" }}>
                  <div style={{ color:isActive?"#fff":"var(--text3)",transition:"color 0.2s",transform:isActive?"scale(1.1)":"scale(1)" }}>
                    <Icon name={tab.icon} size={24} fill={isActive&&tab.icon==="home"?"currentColor":"none"} color="currentColor"/>
                  </div>
                  {tab.badge&&<div className="notif-dot" style={{ top:0,right:4 }}/>}
                  {isActive&&<div style={{ width:4,height:4,borderRadius:"50%",background:"#fff" }}/>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ══ RIGHT SIDEBAR (desktop only) ══ */}
        <aside className="right-sidebar">
          {/* Current user mini */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24, cursor:"pointer" }} onClick={()=>navTo("profile")}>
            <img src={displayProfile?.avatar} alt="" style={{ width:46, height:46, borderRadius:"50%", border:"2px solid var(--border)", flexShrink:0 }}/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#fff", display:"flex", alignItems:"center", gap:5 }}>
                {displayProfile?.name}
                {displayProfile?.verifiedType && <VerifiedBadge type={displayProfile.verifiedType} size={14}/>}
              </div>
              <div style={{ fontSize:12, color:"var(--text3)" }}>@{displayProfile?.username}</div>
            </div>
          </div>

          {/* Suggested users */}
          <div style={{ marginBottom:24 }}>
            <div className="rp-title">Suggested for you</div>
            {suggestedUsers.map(u => (
              <div key={u.id} className="rp-user">
                <img src={u.avatar} alt="" style={{ width:38, height:38, borderRadius:"50%", border:"1px solid var(--border)", flexShrink:0, cursor:"pointer" }} onClick={()=>{ setProfileId(u.id); setActiveTab("profile"); }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#fff", display:"flex", alignItems:"center", gap:4 }}>
                    {u.username}{u.verifiedType&&<VerifiedBadge type={u.verifiedType} size={12}/>}
                  </div>
                  <div style={{ fontSize:11, color:"var(--text3)", textTransform:"capitalize" }}>{u.accountType||"Member"}</div>
                </div>
                <button className="btn btn-outline" style={{ padding:"5px 12px", fontSize:11, flexShrink:0 }} onClick={()=>handleFollow(u.id)}>
                  {currentUser?.following?.includes(u.id) ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>

          {/* Trending hashtags */}
          <div style={{ marginBottom:24 }}>
            <div className="rp-title">Trending</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {TRENDING_HASHTAGS.slice(0,10).map(tag=>(
                <span key={tag} style={{ fontSize:11, color:"#1DA1F2", background:"rgba(29,161,242,0.08)", border:"1px solid rgba(29,161,242,0.2)", borderRadius:20, padding:"3px 10px", cursor:"pointer" }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ fontSize:10, color:"var(--text3)", lineHeight:1.8 }}>
            About · Privacy · Terms · Advertise<br/>
            © 2025 Gupshup · All rights reserved
          </div>
        </aside>

      </div>{/* end app-shell */}

      {/* ── OVERLAYS (work at all breakpoints) ── */}
      {showDashboard && (
        <div style={{ position:"fixed",inset:0,background:"var(--bg)",zIndex:400,overflowY:"auto" }}>
          <style>{STYLES}</style>
          <ProfileDashboard profile={displayProfile} posts={posts} onClose={()=>setShowDashboard(false)}/>
        </div>
      )}
      {viewStory!==null && <StoryViewer stories={stories} startIdx={viewStory} users={users} currentUser={currentUser} onClose={()=>setViewStory(null)} onMarkSeen={handleMarkStorySeen}/>}
      {showCreateMenu && <CreateMenu onClose={()=>setShowCreateMenu(false)} onOpenStoryCamera={()=>setShowStoryCamera(true)} onOpenPostCreate={(type)=>{ setPostCreateType(type); setShowPostCreate(true); }}/>}
      {showStoryCamera && <StoryCameraModal currentUser={currentUser} onClose={()=>setShowStoryCamera(false)} onAddStory={handleAddStory}/>}
      {showPostCreate && <CreateModal currentUser={currentUser} onClose={()=>setShowPostCreate(false)} onPost={handlePost} initialType={postCreateType}/>}
      {showSubscription && <SubscriptionModal onClose={()=>setShowSubscription(false)} onSubscribe={handleSubscribe} currentUser={currentUser}/>}
    </div>
  );
}

/* ─────────────────────────── ROOT ─────────────────────────── */
export default function Gupshup() {
  const [screen, setScreen] = useState("auth");
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState(DEMO_USERS);

  const handleAuth = (user, updatedUsers) => { setCurrentUser(user); setAllUsers(updatedUsers); setScreen("app"); };
  const handleLogout = () => { setCurrentUser(null); setScreen("auth"); };

  if(screen==="auth") return <AuthScreen onAuth={handleAuth}/>;
  return <MainApp currentUser={currentUser} setCurrentUser={setCurrentUser} allUsers={allUsers} setAllUsers={setAllUsers} onLogout={handleLogout}/>;
}
