/* ============================================================
   WHEN YOU CALL ME, SINGE — interactive engine
   ============================================================ */
'use strict';

/* ----------------------------------------------------------------
   STATE  (persisted in localStorage)
----------------------------------------------------------------- */
const SAVE_KEY = 'singe.save.v1';
const state = loadState();

function loadState(){
  let s = {};
  try { s = JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch(e){ s = {}; }
  return {
    singe:        clamp(num(s.singe, 20)),
    comprehension:clamp(num(s.comprehension, 0)),
    notes:        Array.isArray(s.notes) ? s.notes : [],   // unlocked voice-note ids
    lang:         s.lang === 'fr' ? 'fr' : 'en',
    choices:      s.choices || {},                          // remembered branch choices
  };
}
function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }catch(e){} }
function num(v,d){ const n = parseInt(v,10); return isNaN(n) ? d : n; }
function clamp(n){ return Math.max(0, Math.min(100, n)); }

/* tiny bilingual helper */
const t = (en, fr) => state.lang === 'fr' ? fr : en;

/* ----------------------------------------------------------------
   METERS / HUD
----------------------------------------------------------------- */
function bump(stat, amount){
  if(stat === 'singe') state.singe = clamp(state.singe + amount);
  if(stat === 'comprehension') state.comprehension = clamp(state.comprehension + amount);
  save(); updateMeters();
}
function updateMeters(){
  byId('singeFill').style.width = state.singe + '%';
  byId('compFill').style.width  = state.comprehension + '%';
  byId('singeNum').textContent  = state.singe;
  byId('compNum').textContent   = state.comprehension;
  byId('voiceCount').textContent = state.notes.length;
}

/* ----------------------------------------------------------------
   BILINGUAL TOGGLE  (swaps [data-en]/[data-fr] content)
----------------------------------------------------------------- */
function applyLang(){
  document.querySelectorAll('[data-en]').forEach(el=>{
    const val = el.getAttribute(state.lang === 'fr' ? 'data-fr' : 'data-en');
    if(val != null) el.innerHTML = val;
  });
  const btn = byId('langBtn');
  if(btn) btn.textContent = state.lang === 'fr' ? '🇫🇷 FR · EN' : '🇬🇧 EN · FR';
  document.documentElement.lang = state.lang;
}
function toggleLang(){
  state.lang = state.lang === 'fr' ? 'en' : 'fr';
  save(); applyLang();
  // re-render any dynamic, language-aware panels that are open
  renderVoiceGallery();
  toast(state.lang === 'fr' ? 'Langue : Français 🇫🇷' : 'Language: English 🇬🇧');
}

/* ----------------------------------------------------------------
   VOICE NOTES (collectibles)
----------------------------------------------------------------- */
const VOICE_NOTES = [
  { id:'first-heart', time:'0:14', unlock:'chapter1',
    titleEn:"Lou — 'who is this'", titleFr:"Lou — 'c’est qui lui'",
    bodyEn:"“ok chat WHO is the swedish guy spamming little blue hearts and WHY is he STILL here after three hours. anyway. moving on. …he’s still here.”",
    bodyFr:"“ok chat C’EST QUI le suédois qui spamme des petits cœurs bleus et POURQUOI il est ENCORE là après trois heures. bref. on continue. …il est toujours là.”",
    hintEn:"Send Elias’ first message in Chapter 1.", hintFr:"Envoie le premier message d’Elias au Chapitre 1." },

  { id:'2am', time:'4:02', unlock:'chapter1',
    titleEn:"Lou — 2:08am, 4 minutes", titleFr:"Lou — 2h08, 4 minutes",
    bodyEn:"“…and I KNOW it’s late and I KNOW you’re asleep but the soundtrack hit different tonight and I just— I don’t need you to fix it I just need you to hear it, ok? ok. goodnight mon petit singe.”",
    bodyFr:"“…et je SAIS qu’il est tard et je SAIS que tu dors mais la BO m’a fait quelque chose ce soir et je— j’ai pas besoin que tu répares, j’ai juste besoin que tu écoutes, ok ? ok. bonne nuit mon petit singe.”",
    hintEn:"Unlocked with the first heart.", hintFr:"Débloqué avec le premier cœur." },

  { id:'mic-fix', time:'0:31', unlock:'quiz',
    titleEn:"Elias — voice memo to self", titleFr:"Elias — mémo vocal à lui-même",
    bodyEn:"“Note: her mic clips at -3dB when she laughs. Fixed the gain. Did not tell her. She will notice the silence is cleaner. That is the message.”",
    bodyFr:"“Note : son micro sature à -3dB quand elle rit. J’ai corrigé le gain. Je ne lui ai pas dit. Elle remarquera que le silence est plus propre. C’est ça, le message.”",
    hintEn:"Score 80%+ on the emotion quiz.", hintFr:"Obtiens 80%+ au quiz des émotions." },

  { id:'lake', time:'1:47', unlock:'lake',
    titleEn:"Lou — at the frozen lake", titleFr:"Lou — au lac gelé",
    bodyEn:"“it’s so quiet here it’s LOUD. he asked if I ever think too much and he said ‘constantly’ and chat I think that’s the most romantic thing anyone has ever said to me.”",
    bodyFr:"“c’est tellement silencieux ici que c’est ASSOURDISSANT. il m’a demandé si je pensais trop et il a dit ‘constamment’ et chat je crois que c’est la chose la plus romantique qu’on m’ait jamais dite.”",
    hintEn:"Visit the Frozen Lake in Chapter 3.", hintFr:"Visite le Lac Gelé au Chapitre 3." },

  { id:'cafe', time:'0:22', unlock:'cafe',
    titleEn:"Elias — overheard", titleFr:"Elias — entendu de loin",
    bodyEn:"“The café owner asked how long we’d been married. I said ‘not yet’ before I could think about it. She didn’t correct me. We didn’t talk about it. It’s fine. It’s good. It’s— okay it’s a lot.”",
    bodyFr:"“Le patron du café a demandé depuis combien de temps on était mariés. J’ai dit ‘pas encore’ avant même d’y penser. Elle ne m’a pas corrigé. On n’en a pas parlé. C’est bien. C’est— ok c’est beaucoup.”",
    hintEn:"Visit the Tiny Café in Chapter 3.", hintFr:"Visite le Petit Café au Chapitre 3." },

  { id:'stay', time:'0:38', unlock:'honest',
    titleEn:"Elias — the honest one", titleFr:"Elias — le sincère",
    bodyEn:"“I don’t always understand why you’re crying. I want to be honest about that. But I have never once wanted to leave the room. I stay even when I don’t understand. That’s the whole thing. That’s me.”",
    bodyFr:"“Je ne comprends pas toujours pourquoi tu pleures. Je veux être honnête là-dessus. Mais je n’ai jamais, pas une fois, voulu quitter la pièce. Je reste même quand je ne comprends pas. C’est tout. C’est moi.”",
    hintEn:"Choose the honest reply in the big fight.", hintFr:"Choisis la réponse sincère dans la grande dispute." },

  { id:'singe', time:'0:09', unlock:'personality',
    titleEn:"Lou — the meaning of singe", titleFr:"Lou — le sens de ‘singe’",
    bodyEn:"“he calls me ‘mon petit singe’ and he thinks it just sounds nice. it means ‘my little monkey.’ I never told him. I sing on stream. he hears ‘singer.’ I’m keeping the secret. it’s ours now.”",
    bodyFr:"“il m’appelle ‘mon petit singe’ et il croit que ça sonne juste joli. ça veut dire ‘my little monkey’. je lui ai jamais dit. je chante en live. lui il entend ‘singer’. je garde le secret. c’est à nous maintenant.”",
    hintEn:"Take the ‘Are you Lou or Elias?’ test.", hintFr:"Fais le test ‘Es-tu Lou ou Elias ?’." },
];

function unlockNote(id){
  if(state.notes.includes(id)) return false;
  const note = VOICE_NOTES.find(n=>n.id===id);
  if(!note) return false;
  state.notes.push(id);
  save(); updateMeters(); renderVoiceGallery();
  toast('🎧 ' + t('Voice note unlocked: ','Note vocale débloquée : ') + (state.lang==='fr'?note.titleFr:note.titleEn));
  return true;
}

function renderVoiceGallery(){
  const wrap = byId('vnGallery'); if(!wrap) return;
  wrap.innerHTML = '';
  VOICE_NOTES.forEach(n=>{
    const has = state.notes.includes(n.id);
    const div = document.createElement('div');
    div.className = 'vn' + (has ? '' : ' locked');
    const title = state.lang==='fr'?n.titleFr:n.titleEn;
    const body  = state.lang==='fr'?n.bodyFr:n.bodyEn;
    const hint  = state.lang==='fr'?n.hintFr:n.hintEn;
    div.innerHTML = `
      <div class="vn-head">
        <div class="play">${has?'▶':'🔒'}</div>
        <div style="flex:1">
          <div class="vn-title">${has ? title : t('Locked voice note','Note vocale verrouillée')}</div>
          <div class="vn-time">${n.time}</div>
        </div>
      </div>
      <div class="wave">${waveBars(has)}</div>
      <div class="vn-body" style="margin-top:.7rem">
        ${ has ? body : `<span class="vn-lock-hint">${hint}</span>` }
      </div>`;
    if(has){
      const pb = div.querySelector('.play');
      pb.style.cursor='pointer';
      pb.addEventListener('click',()=> playWave(div));
    }
    wrap.appendChild(div);
  });
  const counter = byId('vnCounter');
  if(counter) counter.textContent = `${state.notes.length}/${VOICE_NOTES.length}`;
}
function waveBars(active){
  let h=''; for(let i=0;i<22;i++){ const v=6+Math.round(Math.abs(Math.sin(i*0.7))*18);
    h += `<i style="height:${v}px;background:${active?'var(--rose)':'#bbb'}"></i>`; } return h;
}
function playWave(card){
  card.querySelectorAll('.wave i').forEach((bar,i)=>{
    bar.animate(
      [{transform:'scaleY(1)'},{transform:'scaleY(0.3)'},{transform:'scaleY(1.4)'},{transform:'scaleY(1)'}],
      {duration:600, delay:i*30, easing:'ease-in-out'}
    );
  });
  blip();
}

/* ----------------------------------------------------------------
   CHAPTER 1 — first stream
----------------------------------------------------------------- */
function heartChoice(){
  state.choices.ch1 = 'heart';
  bump('singe', 10);
  unlockNote('first-heart'); unlockNote('2am');
  byId('chapter1Result').innerHTML = `
    <div class="note warm">
      ${t(
        "Elias sends a single blue 💙. Lou notices immediately. She pretends not to. The chat does not pretend — frog emotes everywhere.",
        "Elias envoie un seul 💙 bleu. Lou le remarque aussitôt. Elle fait semblant de rien. Le chat, lui, ne fait pas semblant — des emotes grenouille partout."
      )}
    </div>`;
  startTwitchChat();
  byId('toCh2').style.display = 'inline-block';
}
function closeChoice(){
  state.choices.ch1 = 'close';
  save();
  byId('chapter1Result').innerHTML = `
    <div class="note cool">
      ${t(
        "He closes the tab. The pasta water boils over. Lou keeps singing to four hundred strangers. Some stories end before they begin.",
        "Il ferme l’onglet. L’eau des pâtes déborde. Lou continue de chanter pour quatre cents inconnus. Certaines histoires finissent avant de commencer."
      )}
      <br><br>
      <button onclick="restart()">${t('↺ Restart','↺ Recommencer')}</button>
    </div>`;
}

/* fake twitch chat overlay */
const CHAT_USERS = ['grenouille_42','small_bean','swedish_anon','baudelaire_stan','crylaughing','xX_indie_Xx','mod_margaux','lofi_ghost','petit_pain','northern_lyte'];
const CHAT_LINES_EN = ['frog frog frog 🐸','not me crying too','who hurt this game dev','LOU NO 😭','this soundtrack >>>','swedish guy spamming hearts lol','💙💙💙','mon petit singe??','chat she’s sobbing again','best stream ever','someone hug her','the BLUE HEARTS guy is back','3 hours and he’s still here','clip it clip it','ok this is romance now'];
const CHAT_LINES_FR = ['grenouille grenouille 🐸','moi aussi je pleure','qui a blessé ce dev','LOU NON 😭','cette BO de fou','le suédois spamme des cœurs mdr','💙💙💙','mon petit singe ??','chat elle re-pleure','meilleur live','quelqu’un la prend dans les bras','le mec aux CŒURS BLEUS est revenu','3h et il est encore là','clip ça clip ça','ok là c’est romantique'];
let chatTimer = null;
function startTwitchChat(){
  const feed = byId('twitchFeed'); if(!feed || chatTimer) return;
  byId('twitchBox').style.display = 'block';
  const push = ()=>{
    const u = CHAT_USERS[(Math.random()*CHAT_USERS.length)|0];
    const lines = state.lang==='fr'?CHAT_LINES_FR:CHAT_LINES_EN;
    const m = lines[(Math.random()*lines.length)|0];
    const hue = (u.length*37)%360;
    const line = document.createElement('div');
    line.className='line';
    line.innerHTML = `<span class="u" style="color:hsl(${hue},65%,72%)">${u}</span>: ${m}`;
    feed.appendChild(line);
    while(feed.children.length>40) feed.removeChild(feed.firstChild);
  };
  for(let i=0;i<6;i++) push();
  chatTimer = setInterval(push, 1400);
}

/* ----------------------------------------------------------------
   CHAPTER 2 — emotion decoder quiz
----------------------------------------------------------------- */
const quizData = [
  { qEn:"Lou says: “It’s fine.”", qFr:"Lou dit : « C’est bon, ça va. »",
    ansEn:["It’s fine","It is NOT fine","She wants a hug","Ask again, gently"],
    ansFr:["Tout va bien","Ça ne va PAS","Elle veut un câlin","Redemande, doucement"],
    correct:[1,3] },
  { qEn:"Lou sends you a sad playlist at 3am.", qFr:"Lou t’envoie une playlist triste à 3h.",
    ansEn:["Ignore it","Send a meme back","Listen carefully","Ask which song hurts most"],
    ansFr:["L’ignorer","Renvoyer un meme","Écouter attentivement","Demander quelle chanson fait le plus mal"],
    correct:[2,3] },
  { qEn:"Elias fixes Lou’s mic without saying anything.", qFr:"Elias répare le micro de Lou sans rien dire.",
    ansEn:["He doesn’t care","That IS affection","He’s bored","He’s avoiding feelings"],
    ansFr:["Il s’en fiche","ÇA, c’est de l’affection","Il s’ennuie","Il évite les émotions"],
    correct:[1] },
  { qEn:"Lou tweets “whatever lol 🙃”.", qFr:"Lou tweete « whatever lol 🙃 ».",
    ansEn:["Everything is okay","Everything is on fire","She needs space","She needs reassurance"],
    ansFr:["Tout va bien","Tout est en feu","Elle a besoin d’espace","Elle a besoin d’être rassurée"],
    correct:[1,3] },
  { qEn:"Elias makes a playlist titled “train rides”.", qFr:"Elias crée une playlist « train rides ».",
    ansEn:["It’s random","It’s emotional intimacy","He likes trains","He’s confessing, gently"],
    ansFr:["C’est au hasard","C’est de l’intimité émotionnelle","Il aime les trains","Il se confesse, doucement"],
    correct:[1,3] },
];
let quizAnswered = false;

function buildQuiz(){
  const wrap = byId('quiz'); if(!wrap) return;
  wrap.innerHTML='';
  quizData.forEach((item,qi)=>{
    const q = document.createElement('div');
    q.className='quiz-q';
    const ans = (state.lang==='fr'?item.ansFr:item.ansEn);
    q.innerHTML = `<h3>${qi+1}. ${state.lang==='fr'?item.qFr:item.qEn}</h3>` +
      ans.map((a,ai)=>`
        <label class="opt" data-q="${qi}" data-a="${ai}">
          <input type="checkbox" name="q${qi}" value="${ai}"> <span>${a}</span>
        </label>`).join('');
    wrap.appendChild(q);
  });
}
function submitQuiz(){
  if(quizAnswered) return;
  let correctCount = 0;
  quizData.forEach((item,qi)=>{
    const picked = [...document.querySelectorAll(`input[name=q${qi}]:checked`)].map(e=>+e.value);
    const correct = item.correct;
    const ok = JSON.stringify([...picked].sort()) === JSON.stringify([...correct].sort());
    if(ok) correctCount++;
    // colour every option
    document.querySelectorAll(`.opt[data-q="${qi}"]`).forEach(opt=>{
      const ai = +opt.dataset.a;
      opt.querySelector('input').disabled = true;
      if(correct.includes(ai) && picked.includes(ai)) opt.classList.add('correct');
      else if(correct.includes(ai)) opt.classList.add('miss');
      else if(picked.includes(ai)) opt.classList.add('wrong');
    });
  });
  const score = Math.round(correctCount / quizData.length * 100);
  quizAnswered = true;
  state.comprehension = clamp(score);
  state.choices.quiz = score;
  save(); updateMeters();
  if(score >= 80) unlockNote('mic-fix');

  let msg;
  if(score >= 80) msg = t(
    "Elias finally understands that “I’m okay” is never the end of a sentence — it’s the beginning of one.",
    "Elias comprend enfin que « ça va » n’est jamais la fin d’une phrase — c’est le début d’une autre.");
  else if(score >= 40) msg = t(
    "Progress. Emotional damage reduced by 32%. He’s reading between the lines now — slowly.",
    "Des progrès. Dégâts émotionnels réduits de 32%. Il lit entre les lignes — lentement.");
  else msg = t(
    "Lou has now sent fourteen follow-up voice notes. Elias has listened to each one twice.",
    "Lou a maintenant envoyé quatorze notes vocales de suivi. Elias a écouté chacune deux fois.");

  byId('quizResult').innerHTML = `
    <div class="note">
      <strong>${t('Score','Score')}: ${score}% — ${correctCount}/${quizData.length}</strong><br><br>${msg}
    </div>`;
  byId('toCh3').style.display = 'inline-block';
}

/* ----------------------------------------------------------------
   CHAPTER 3 — Sweden map
----------------------------------------------------------------- */
const LOCATIONS = {
  stockholm:{ en:"Lou calls Stockholm “a city designed by introverts with excellent taste.” Elias smiles for ten entire seconds — a personal record he does not mention.",
              fr:"Lou décrit Stockholm comme « une ville conçue par des introvertis au goût impeccable ». Elias sourit pendant dix secondes entières — un record personnel qu’il garde pour lui." },
  lake:{ en:"On the frozen lake, Lou talks without stopping because silence scares her. Elias listens until she finally asks, “Do you ever think too much?” He answers: “Constantly.” The ice holds them both.",
         fr:"Sur le lac gelé, Lou parle sans s’arrêter parce que le silence lui fait peur. Elias écoute jusqu’à ce qu’elle demande : « Tu penses trop, toi aussi ? » Il répond : « Constamment. » La glace les porte tous les deux." },
  cafe:{ en:"The café owner assumes they are married. Neither corrects him. Lou orders for both of them in broken Swedish; Elias lets her.",
         fr:"Le patron du café les croit mariés. Aucun des deux ne le détrompe. Lou commande pour eux deux dans un suédois bancal ; Elias la laisse faire." },
};
function showLocation(place){
  const data = LOCATIONS[place]; if(!data) return;
  byId('locationStory').innerHTML = `<div class="note ${place==='lake'?'cool':'warm'}">${data[state.lang]}</div>`;
  const tile = byId('loc-'+place); if(tile) tile.classList.add('visited');
  bump('singe', 5);
  if(place==='lake') unlockNote('lake');
  if(place==='cafe') unlockNote('cafe');
  (state.choices.visited = state.choices.visited || []);
  if(!state.choices.visited.includes(place)) state.choices.visited.push(place);
  save();
  byId('toCh4').style.display = 'inline-block';
}

/* ----------------------------------------------------------------
   CHAPTER 4 — the big fight (SMS)
----------------------------------------------------------------- */
function fightChoice(type){
  state.choices.fight = type;
  const out = byId('fightResult');
  // show Elias "typing" then the consequence
  out.innerHTML = `<div class="typing-bubble"><span></span><span></span><span></span></div>`;
  setTimeout(()=>{
    let html='', cls='warm';
    if(type==='repair'){
      cls='cool';
      html = t("Lou pauses. “…I do. I do need it.” It isn’t a perfect sentence, but it’s an honest one. The temperature in the room drops a degree, then warms.",
               "Lou s’arrête. « …oui. Oui, j’en ai besoin. » Ce n’est pas une phrase parfaite, mais elle est sincère. La pièce se refroidit d’un degré, puis se réchauffe.");
      bump('comprehension', 10);
    }
    if(type==='defensive'){
      cls='warm';
      html = t("Lou goes offline for three days. Elias rewrites and deletes the same message eleven times. The Singe Meter is dangerously high.",
               "Lou se déconnecte pendant trois jours. Elias réécrit et efface le même message onze fois. Le Singe Meter est dangereusement haut.");
      bump('singe', 20);
    }
    if(type==='honest'){
      cls='cool';
      html = t("Lou cries immediately — the good kind. “That’s literally all I ever wanted you to say.” Elias exhales for what feels like the first time in days.",
               "Lou pleure immédiatement — le bon genre de larmes. « C’est littéralement tout ce que je voulais que tu dises. » Elias expire pour la première fois depuis des jours.");
      bump('comprehension', 20);
      unlockNote('stay');
    }
    out.innerHTML = `<div class="note ${cls}">${html}</div>`;
    byId('toFinal').style.display = 'inline-block';
  }, 1400);
}

/* ----------------------------------------------------------------
   FINAL — the call & endings
----------------------------------------------------------------- */
let lastEnding = null;
function showEnding(){
  const c = state.comprehension, s = state.singe;
  let title, body, emoji, key;

  if(c >= 80 && s < 80){
    key='together';
    emoji='🔥'; title = t("Ensemble à Stockholm","Ensemble à Stockholm");
    body = t("Lou learns that silence is not abandonment. Elias learns that emotions are not problems to be solved — they are weather to be shared. They adopt a second cat. It gets a literary name too. (Rimbaud. Obviously.)",
             "Lou apprend que le silence n’est pas l’abandon. Elias apprend que les émotions ne sont pas des problèmes à résoudre — c’est une météo à partager. Ils adoptent un deuxième chat. Lui aussi a un nom littéraire. (Rimbaud. Évidemment.)");
  } else if(c >= 45){
    key='figuring';
    emoji='❄'; title = t("Still Figuring It Out","On Apprend Encore");
    body = t("They are messy. Tender. Exhausting. Worth it. He still doesn’t always know why she’s crying — but he picks up on the first ring now. That counts. That counts for a lot.",
             "Ils sont brouillons. Tendres. Épuisants. Ça en vaut la peine. Il ne sait toujours pas toujours pourquoi elle pleure — mais il décroche dès la première sonnerie maintenant. Ça compte. Ça compte énormément.");
  } else {
    key='burned';
    emoji='🥀'; title = t("We Burned Beautifully","On a Brûlé Magnifiquement");
    body = t("Some people arrive in your life like songs: briefly, violently, forever. He never quite learned the language of her silences. But on quiet nights he still plays the playlist called “train rides,” and lets it run to the end.",
             "Certaines personnes entrent dans ta vie comme des chansons : brièvement, violemment, pour toujours. Il n’a jamais vraiment appris la langue de ses silences. Mais les soirs calmes, il lance encore la playlist « train rides », et la laisse aller jusqu’au bout.");
  }
  lastEnding = (state.lang==='fr'?title:title) + ' ' + emoji;

  byId('ending').innerHTML = `
    <div class="result-card">
      <div class="stars">✦ ✦ ✦</div>
      <div class="spacer"></div>
      <div class="chapter-tag">${t('YOUR ENDING','TA FIN')}</div>
      <h3>${title} ${emoji}</h3>
      <div class="spacer"></div>
      <p>${body}</p>
      <div class="spacer"></div>
      <p class="muted" style="font-size:.9rem">
        🔥 ${t('Singe Meter','Singe Meter')}: ${s}% &nbsp;·&nbsp;
        🧠 ${t('Comprehension','Compréhension')}: ${c}% &nbsp;·&nbsp;
        🎧 ${t('Voice notes','Notes vocales')}: ${state.notes.length}/${VOICE_NOTES.length}
      </p>
      <div class="spacer"></div>
      <button onclick="shareEnding()">📤 ${t('Share your ending','Partager ta fin')}</button>
      <button class="alt" onclick="byId('gallery').scrollIntoView()">🎧 ${t('Voice note gallery','Galerie de notes vocales')}</button>
      <button class="ghost" onclick="restart()">↺ ${t('Play again','Rejouer')}</button>
    </div>`;
  byId('ending').scrollIntoView({behavior:'smooth', block:'center'});
  state.choices.ending = key; save();
}

async function shareEnding(){
  const line = lastEnding || t('an ending','une fin');
  const text = t(
    `My ending in “When You Call Me, Singe” was: ${line} — chaotic, tender, and a little bilingual. 💙🔥`,
    `Ma fin dans « When You Call Me, Singe » : ${line} — chaotique, tendre et un peu bilingue. 💙🔥`);
  try{
    if(navigator.share){ await navigator.share({title:'When You Call Me, Singe', text}); return; }
    await navigator.clipboard.writeText(text);
    toast(t('Ending copied to clipboard ✓','Fin copiée dans le presse-papier ✓'));
  }catch(e){
    toast(t('Could not share — but your ending is safe 💙','Partage impossible — mais ta fin est en sécurité 💙'));
  }
}

/* ----------------------------------------------------------------
   PERSONALITY TEST — "Are you Lou or Elias?"
----------------------------------------------------------------- */
const PTEST = [
  { qEn:"It’s 2am and you feel something big. You…", qFr:"Il est 2h et tu ressens un truc fort. Tu…",
    a:[{en:"Send a 4-minute voice note about it",fr:"Envoies une note vocale de 4 minutes dessus",s:'lou'},
       {en:"Make a playlist and say nothing",fr:"Fais une playlist et ne dis rien",s:'elias'}] },
  { qEn:"Your love language is closest to…", qFr:"Ton langage amoureux ressemble surtout à…",
    a:[{en:"Words, songs, grand declarations",fr:"Les mots, les chansons, les grandes déclarations",s:'lou'},
       {en:"Fixing your wifi without being asked",fr:"Réparer ton wifi sans qu’on demande",s:'elias'}] },
  { qEn:"Silence in a conversation feels…", qFr:"Le silence dans une conversation, c’est…",
    a:[{en:"Terrifying — fill it immediately",fr:"Terrifiant — il faut le combler tout de suite",s:'lou'},
       {en:"Comfortable, actually nice",fr:"Confortable, agréable même",s:'elias'}] },
  { qEn:"You’re upset. What do you actually want?", qFr:"Tu es contrarié·e. Qu’est-ce que tu veux vraiment ?",
    a:[{en:"To be asked, twice, gently",fr:"Qu’on me redemande, deux fois, doucement",s:'lou'},
       {en:"To be left to process alone",fr:"Qu’on me laisse digérer seul·e",s:'elias'}] },
  { qEn:"Pick a winter scene:", qFr:"Choisis une scène d’hiver :",
    a:[{en:"Crying happy tears in the snow",fr:"Pleurer de joie dans la neige",s:'lou'},
       {en:"Quietly handing someone warmer socks",fr:"Tendre discrètement des chaussettes plus chaudes",s:'elias'}] },
  { qEn:"Your phone rings (an actual call!). You…", qFr:"Ton téléphone sonne (un vrai appel !). Tu…",
    a:[{en:"Answer before the first ring ends",fr:"Décroches avant la fin de la première sonnerie",s:'lou'},
       {en:"Stare at it. Texting was working fine.",fr:"Le fixes. Les textos, ça marchait très bien.",s:'elias'}] },
];
let pIndex = 0, pScore = {lou:0, elias:0};

function startPTest(){
  pIndex = 0; pScore = {lou:0, elias:0};
  byId('ptestIntro').style.display='none';
  byId('ptestBox').style.display='block';
  byId('ptestResult').innerHTML='';
  renderPQuestion();
}
function renderPQuestion(){
  const q = PTEST[pIndex];
  const ans = q.a;
  byId('ptestBox').innerHTML = `
    <div class="ptest-progress">${pIndex+1} / ${PTEST.length}</div>
    <div class="spacer"></div>
    <h3 style="font-family:'Inter',sans-serif;letter-spacing:0;font-weight:700">${state.lang==='fr'?q.qFr:q.qEn}</h3>
    <div class="spacer"></div>
    ${ans.map((o,i)=>`<label class="opt" onclick="answerP('${o.s}')"><span>${state.lang==='fr'?o.fr:o.en}</span></label>`).join('')}
  `;
}
function answerP(side){
  pScore[side]++;
  pIndex++;
  if(pIndex < PTEST.length){ renderPQuestion(); }
  else { finishPTest(); }
}
function finishPTest(){
  const total = pScore.lou + pScore.elias;
  const louPct = Math.round(pScore.lou/total*100);
  const eliasPct = 100 - louPct;
  unlockNote('singe');
  let verdict, label;
  if(louPct >= 65){ label = t("You’re a Lou 🔥","Tu es une Lou 🔥");
    verdict = t("You burn bright and you love out loud. You don’t need to be fixed — you need to be heard. Find your Elias and let him hold the fire.",
                "Tu brûles fort et tu aimes à voix haute. Tu n’as pas besoin qu’on te répare — tu as besoin qu’on t’écoute. Trouve ton Elias et laisse-le tenir le feu."); }
  else if(eliasPct >= 65){ label = t("You’re an Elias 💙","Tu es un Elias 💙");
    verdict = t("You love in acts, not adjectives. You stay even when you don’t understand. Just remember: sometimes the fix she wants is simply being asked again.",
                "Tu aimes en gestes, pas en adjectifs. Tu restes même sans comprendre. Souviens-toi juste : parfois la réparation qu’elle veut, c’est qu’on lui redemande."); }
  else { label = t("Lou ⇄ Elias","Lou ⇄ Elias");
    verdict = t("You’re the rare middle — fire and ice in one person. You feel everything and you organise it. Exhausting and wonderful, simultaneously.",
                "Tu es ce rare milieu — feu et glace en une personne. Tu ressens tout et tu l’organises. Épuisant et merveilleux à la fois."); }

  byId('ptestBox').style.display='none';
  byId('ptestIntro').style.display='block';
  byId('ptestResult').innerHTML = `
    <div class="result-card">
      <div class="chapter-tag">${t('RESULT','RÉSULTAT')}</div>
      <h3>${label}</h3>
      <div class="spacer"></div>
      <div style="display:flex;align-items:center;gap:.6rem">
        <span class="pixel" style="color:var(--rose)">LOU ${louPct}%</span>
        <div class="meter" style="flex:1"><div class="fill" style="width:${louPct}%;background:linear-gradient(90deg,#ff5e3a ${louPct}%,#456b85 ${louPct}%)"></div></div>
        <span class="pixel" style="color:var(--blue-deep)">${eliasPct}% ELIAS</span>
      </div>
      <div class="spacer"></div>
      <p>${verdict}</p>
    </div>`;
  state.choices.persona = louPct>=65?'lou':(eliasPct>=65?'elias':'both'); save();
}

/* ----------------------------------------------------------------
   EASTER EGG — Baudelaire
----------------------------------------------------------------- */
function unlockCat(){
  const secret = byId('catSecret');
  secret.classList.toggle('hidden');
  if(!secret.classList.contains('hidden')){
    unlockNote('first-heart');
    blip();
  }
}

/* ----------------------------------------------------------------
   SNOWFALL  (canvas) — auto-on near Sweden chapter
----------------------------------------------------------------- */
let snowflakes = [], snowRAF = null, snowOn = false;
function initSnow(){
  const c = byId('snow'); if(!c) return;
  const ctx = c.getContext('2d');
  const resize = ()=>{ c.width = innerWidth; c.height = innerHeight; };
  resize(); addEventListener('resize', resize);
  const make = ()=>({ x:Math.random()*c.width, y:Math.random()*c.height,
    r:1+Math.random()*2.6, d:Math.random()*0.5+0.2, sway:Math.random()*Math.PI*2 });
  snowflakes = Array.from({length:90}, make);
  const draw = ()=>{
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle='rgba(255,255,255,.9)';
    snowflakes.forEach(f=>{
      ctx.globalAlpha = 0.5 + f.r/4;
      ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill();
      f.y += f.d*1.4; f.sway += 0.01; f.x += Math.sin(f.sway)*0.4;
      if(f.y > c.height){ f.y = -5; f.x = Math.random()*c.width; }
    });
    ctx.globalAlpha=1;
    snowRAF = requestAnimationFrame(draw);
  };
  draw();
}
function setSnow(on){
  const c = byId('snow'); if(!c) return;
  snowOn = on; c.classList.toggle('on', on);
}

/* ----------------------------------------------------------------
   LO-FI AUDIO  (WebAudio — generated, no external assets)
----------------------------------------------------------------- */
let audioCtx=null, audioOn=false, audioNodes=[];
function toggleAudio(){
  if(!audioOn) startAudio(); else stopAudio();
}
function startAudio(){
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended') audioCtx.resume();
    const master = audioCtx.createGain();
    master.gain.value = 0.0;
    master.gain.linearRampToValueAtTime(0.10, audioCtx.currentTime+1.5);
    master.connect(audioCtx.destination);

    // warm pad: a few detuned sines forming a soft minor 9 chord
    const freqs = [146.83, 220.0, 261.63, 329.63]; // D3 A3 C4 E4
    freqs.forEach((f,i)=>{
      const osc = audioCtx.createOscillator();
      osc.type = i%2 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      const g = audioCtx.createGain(); g.gain.value = 0.18/(i+1);
      const lfo = audioCtx.createOscillator(); lfo.frequency.value = 0.07 + i*0.013;
      const lfoG = audioCtx.createGain(); lfoG.gain.value = 0.06;
      lfo.connect(lfoG); lfoG.connect(g.gain);
      osc.connect(g); g.connect(master);
      osc.start(); lfo.start();
      audioNodes.push(osc, lfo);
    });
    // soft vinyl-ish noise
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate*2, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i] = (Math.random()*2-1)*0.04;
    const noise = audioCtx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const nf = audioCtx.createBiquadFilter(); nf.type='lowpass'; nf.frequency.value=900;
    const ng = audioCtx.createGain(); ng.gain.value = 0.5;
    noise.connect(nf); nf.connect(ng); ng.connect(master);
    noise.start(); audioNodes.push(noise);

    audioMaster = master; audioOn = true;
    byId('audioBtn').classList.add('active');
    byId('audioBtn').textContent = '🔊 lo-fi';
  }catch(e){ toast('Audio not supported'); }
}
let audioMaster=null;
function stopAudio(){
  if(audioMaster){ audioMaster.gain.linearRampToValueAtTime(0, audioCtx.currentTime+0.6); }
  setTimeout(()=>{ audioNodes.forEach(n=>{ try{n.stop();}catch(e){} }); audioNodes=[]; }, 700);
  audioOn=false;
  byId('audioBtn').classList.remove('active');
  byId('audioBtn').textContent = '🔈 lo-fi';
}
/* tiny UI blip */
function blip(){
  if(!audioCtx) return;
  try{
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type='sine'; o.frequency.value=660;
    g.gain.value=0.0001; g.gain.exponentialRampToValueAtTime(0.08,audioCtx.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+0.25);
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+0.26);
  }catch(e){}
}

/* ----------------------------------------------------------------
   UTIL — toast, scroll reveal, dots nav, restart
----------------------------------------------------------------- */
function byId(id){ return document.getElementById(id); }
let toastTimer=null;
function toast(msg){
  const el = byId('toast'); if(!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('show'), 2600);
}
function restart(){
  if(!confirm(t('Restart the whole story? Your meters and voice notes reset.',
                'Recommencer toute l’histoire ? Tes compteurs et notes vocales seront réinitialisés.'))) return;
  const lang = state.lang;
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

/* IntersectionObserver — reveal cards & active dot */
function setupObservers(){
  const reveals = document.querySelectorAll('.reveal');
  const ro = new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold:0.12});
  reveals.forEach(el=>ro.observe(el));

  const sections = [...document.querySelectorAll('section[id]')];
  const dots = [...document.querySelectorAll('.dots-nav a')];
  const so = new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        const id = e.target.id;
        dots.forEach(d=>d.classList.toggle('active', d.dataset.target===id));
        // snow on for sweden chapter
        if(id==='chapter3') setSnow(true); else if(id==='chapter2'||id==='chapter4') setSnow(false);
      }
    });
  }, {threshold:0.5});
  sections.forEach(s=>so.observe(s));
}

function toggleStats(){ byId('stats').classList.toggle('collapsed'); }

/* ----------------------------------------------------------------
   INIT
----------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  applyLang();
  updateMeters();
  buildQuiz();
  renderVoiceGallery();
  initSnow();
  setupObservers();
  byId('langBtn').addEventListener('click', toggleLang);
  byId('audioBtn').addEventListener('click', toggleAudio);
  // mark previously made ch1 choice so returning players can continue
  if(state.choices.ch1==='heart'){ byId('toCh2').style.display='inline-block'; }
});
