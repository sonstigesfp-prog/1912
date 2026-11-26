// ==========================================
// 1. CODE NUR FÜR DIE STARTSEITE (index.html)
// ==========================================
const datetimeEl = document.getElementById('datetime');
if (datetimeEl) {
    const welcomeEl = document.getElementById('welcome-text');
    
    if (welcomeEl) {
            // Wenn ja: Direkt "1912" dauerhaft anzeigen
            welcomeEl.innerText = "welcome";
            welcomeEl.style.display = 'block';
            welcomeEl.style.opacity = '1';
       
            // Nach 4 Sekunden sanft ausblenden und dauerhaft gegen "1912" austauschen
            setTimeout(() => {
                welcomeEl.style.opacity = '0';
                setTimeout(() => {
                    welcomeEl.innerText = "1912";
                    welcomeEl.style.opacity = '1';
                    localStorage.setItem('schonBesucht', 'true');
                }, 1500); // Wartet, bis das Ausblenden fertig ist
            }, 4000);
        }
    

    // Live-Uhrzeit & Datum
    function updateDateTime() {
        const jetzt = new Date();
        const optionen = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const datumString = jetzt.toLocaleDateString('de-DE', optionen);
        const zeitString = jetzt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        
        document.getElementById('datetime').innerHTML = datumString + "<br><span style='font-size: 1.2rem; opacity: 0.7; font-weight: 300;'>" + zeitString + " Uhr</span>";
    }

    const sprueche = [
        "Montag = Arbeitszeitbetrug.  ",
        "Neuer Tag, neue Chancen. Lass uns durchstarten! 💪",
        "Der zweite Schritt ist getan. Du bist auf dem richtigen Weg! ✨",
        "Revolution Day! Time to take over the world🎉",
        "Das Wochenende ist schon in Sicht, bleib dran! ☕",
        "Fast geschafft! Hab einen großartigen Start ins Wochenende! 🥂",
        "Genieße deinen Tag und mach das, was dich glücklich macht! ☀️"
    ];

    const wochentag = new Date().getDay();
    const quoteEl = document.getElementById('quote');
    if (quoteEl) {
        quoteEl.innerText = sprueche[wochentag];
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
} 

// ==========================================
// 2. STREAK- & SPIEL-LOGIK (seite_2.html)
// ==========================================
function getDatumKey(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
}

const heuteKey = getDatumKey(0);
const gesternKey = getDatumKey(-1);

let streak = parseInt(localStorage.getItem('eulen_streak')) || 0;
let lastWinDate = localStorage.getItem('eulen_last_win') || "";

if (lastWinDate !== heuteKey && lastWinDate !== gesternKey) {
    streak = 0;
    localStorage.setItem('eulen_streak', 0);
}

function updateStreakUI() {
    const countEl = document.getElementById('streak-count');
    if (!countEl) return;
    
    const anzeige = Math.min(streak, 7);
    countEl.innerText = anzeige + " / 7 Tage";
    
    const alleKreise = document.querySelectorAll('.kreis');
    alleKreise.forEach((kreis, index) => {
        if (index < anzeige) {
            kreis.innerText = "🔥";
            kreis.classList.add('aktiv');
        } else {
            kreis.innerText = "";
            kreis.classList.remove('aktiv');
        }
    });

    const secretBtn = document.getElementById('secret-btn');
    if (secretBtn && streak >= 7) {
        secretBtn.disabled = false;
        secretBtn.classList.add('unlocked');
        secretBtn.innerText = "🔓 Geheim-Spiel starten! 🌟";
        secretBtn.onclick = startSecretGame;
    }
}

function registerDailyWin() {
    if (lastWinDate !== heuteKey) {
        streak += 1;
        lastWinDate = heuteKey;
        localStorage.setItem('eulen_streak', streak);
        localStorage.setItem('eulen_last_win', heuteKey);
        updateStreakUI();

        if (streak === 7) {
            alert("🔥 Wahnsinn! 7 Flammen gesammelt! Das Geheim-Spiel ist jetzt frei!");
        }
    }
}

updateStreakUI();

// Geheim-Spiel (Eulen-Schatzjagd)
function startSecretGame() {
    const area = document.getElementById('secret-game-area');
    let punkte = 0, zeit = 15;
    let gridHTML = '<p id="secret-status" style="margin: 10px 0 5px 0; font-weight: bold;">Fange die Eulen & Sterne! (15s)</p><div class="secret-grid">';
    for (let i = 0; i < 9; i++) {
        gridHTML += `<button class="secret-cell" id="scell-${i}"></button>`;
    }
    gridHTML += '</div>';
    area.innerHTML = gridHTML;

    const pop = setInterval(() => {
        for (let i = 0; i < 9; i++) {
            const c = document.getElementById('scell-' + i);
            if (c) { c.innerText = ""; c.onclick = null; }
        }
        const ziel = document.getElementById('scell-' + Math.floor(Math.random() * 9));
        if (ziel) {
            ziel.innerText = Math.random() > 0.3 ? "🦉" : "🌟";
            ziel.onclick = () => {
                punkte += (ziel.innerText === "🌟" ? 30 : 15);
                ziel.innerText = "✨";
                ziel.onclick = null;
            };
        }
    }, 650);

    const timer = setInterval(() => {
        zeit--;
        const st = document.getElementById('secret-status');
        if (zeit > 0) {
            if (st) st.innerText = `Zeit: ${zeit}s | Punkte: ${punkte}`;
        } else {
            clearInterval(pop);
            clearInterval(timer);
            if (st) st.innerText = `🏆 Geschafft! Endstand: ${punkte} Punkte!`;
        }
    }, 1000);
}

// ==========================================
// 3. ALLE 7 MINI-SPIELE (OHNE TAGESSPERRE)
// ==========================================

// --- 1. MONTAG: MATHE-SPRINT ---
const moArea = document.getElementById('mo-area');
if (moArea) {
    let richtigCount = 0;
    function neueMatheAufgabe() {
        const a = Math.floor(Math.random() * 15) + 1;
        const b = Math.floor(Math.random() * 15) + 1;
        const loesung = a + b;
        moArea.innerHTML = `<span style="font-size:1.2rem; margin-right:8px;">${a} + ${b} =</span>
            <input type="number" id="mo-in" class="game-input">
            <button class="game-btn" id="mo-ok">OK</button>`;
        document.getElementById('mo-ok').onclick = () => {
            const val = parseInt(document.getElementById('mo-in').value);
            const status = document.getElementById('mo-status');
            if (val === loesung) {
                richtigCount++;
                if (richtigCount >= 3) {
                    status.innerHTML = `<span style="color:#4dff88; font-weight:bold;">🎉 3/3 richtig! +1 Flamme!</span>`;
                    registerDailyWin();
                    richtigCount = 0;
                } else {
                    status.innerText = `Richtig! (${richtigCount} / 3 geschafft) ✨`;
                }
                neueMatheAufgabe();
            } else {
                status.innerText = "Leider falsch, probier die nächste! ❌";
                neueMatheAufgabe();
            }
        };
    }
    neueMatheAufgabe();
}

// --- 2. DIENSTAG: FARB-CHECK ---
const diArea = document.getElementById('di-area');
if (diArea) {
    const farben = [{name: "ROT", code: "#ff4d4d"}, {name: "BLAU", code: "#4da6ff"}, {name: "GRÜN", code: "#4dff88"}, {name: "GELB", code: "#ffff4d"}];
    let farbenStreak = 0;
    function neueFarbe() {
        const wort = farben[Math.floor(Math.random() * farben.length)];
        const schrift = farben[Math.floor(Math.random() * farben.length)];
        const stimmt = wort.name === schrift.name;
        diArea.innerHTML = `<div style="font-size:1.5rem; font-weight:bold; color:${schrift.code}; margin-bottom:8px;">${wort.name}</div>
            <button class="game-btn" id="di-ja">Passt</button>
            <button class="game-btn" id="di-nein">Passt nicht</button>`;
        document.getElementById('di-ja').onclick = () => pruefeFarbe(true === stimmt);
        document.getElementById('di-nein').onclick = () => pruefeFarbe(false === stimmt);
    }
    function pruefeFarbe(richtig) {
        const status = document.getElementById('di-status');
        if (richtig) {
            farbenStreak++;
            if (farbenStreak >= 3) {
                status.innerHTML = `<span style="color:#4dff88; font-weight:bold;">🎉 3 Treffer in Folge! +1 Flamme!</span>`;
                registerDailyWin();
                farbenStreak = 0;
            } else {
                status.innerText = `Super! (${farbenStreak} / 3 Treffer) ✨`;
            }
        } else {
            farbenStreak = 0;
            status.innerText = "Daneben! Serie startet bei 0. ❌";
        }
        neueFarbe();
    }
    neueFarbe();
}

// --- 3. MITTWOCH: ZAHLENRATEN ---
const miBtn = document.getElementById('mi-btn');
if (miBtn) {
    let zielZahl = Math.floor(Math.random() * 100) + 1;
    miBtn.onclick = () => {
        const tipp = parseInt(document.getElementById('mi-input').value);
        const status = document.getElementById('mi-status');
        if (tipp === zielZahl) {
            status.innerHTML = `<span style="color:#4dff88; font-weight:bold;">🎉 Treffer! Die Zahl war ${zielZahl}! +1 Flamme!</span>`;
            registerDailyWin();
            zielZahl = Math.floor(Math.random() * 100) + 1;
        } else if (tipp < zielZahl) {
            status.innerText = "Zu niedrig! Höher raten ⬆️";
        } else if (tipp > zielZahl) {
            status.innerText = "Zu hoch! Tiefer raten ⬇️";
        }
    };
}

// --- 4. DONNERSTAG: REAKTIONS-TEST ---
const doBtn = document.getElementById('do-btn');
if (doBtn) {
    let startZeit = 0, bereit = false, wartet = false;
    doBtn.onclick = () => {
        const status = document.getElementById('do-status');
        if (!bereit && !wartet) {
            wartet = true;
            doBtn.innerText = "Warte auf Grün...";
            doBtn.style.background = "#e63946";
            setTimeout(() => {
                doBtn.innerText = "JETZT KLICKEN!";
                doBtn.style.background = "#2a9d8f";
                startZeit = Date.now();
                bereit = true;
                wartet = false;
            }, Math.random() * 2000 + 1000);
        } else if (bereit) {
            const ms = Date.now() - startZeit;
            bereit = false;
            doBtn.innerText = "Nochmal";
            doBtn.style.background = "";
            if (ms <= 600) {
                status.innerHTML = `<span style="color:#4dff88; font-weight:bold;">⚡ Blitzschnell (${ms} ms)! +1 Flamme!</span>`;
                registerDailyWin();
            } else {
                status.innerText = `${ms} ms – versuch es unter 600 ms zu schaffen! 😉`;
            }
        }
    };
}

// --- 5. FREITAG: SCHERE, STEIN, PAPIER ---
const wahlNamen = ["🪨 Stein", "📄 Papier", "✂️ Schere"];
window.playSSP = function(spielerWahl) {
    const euleWahl = Math.floor(Math.random() * 3);
    const statusEl = document.getElementById('game-status');
    if (!statusEl) return;

    if (spielerWahl === euleWahl) {
        statusEl.innerHTML = `Unentschieden! Ihr hattet beide <b>${wahlNamen[spielerWahl]}</b>.`;
    } else if ((spielerWahl === 0 && euleWahl === 2) || (spielerWahl === 1 && euleWahl === 0) || (spielerWahl === 2 && euleWahl === 1)) {
        statusEl.innerHTML = `🎉 Gewonnen! Eule hatte <b>${wahlNamen[euleWahl]}</b>. <span style="color:#4dff88; font-weight:bold;">+1 Flamme!</span>`;
        registerDailyWin();
    } else {
        statusEl.innerHTML = `Verloren! Eule hatte <b>${wahlNamen[euleWahl]}</b>. Nochmal! 😉`;
    }
};

// -// --- 6. SAMSTAG: EULEN-WORDLE ---
const wordleBoard = document.getElementById('wordle-board');
if (wordleBoard) {
    // Wortliste (du kannst hier jederzeit eigene 5-Buchstaben-Wörter hinzufügen!)
    const woerter = ["EULEN", "PARTY", "Waage", "GLANZ", "TRAUM", "LIEBE", "STERN", "BLUME", "KERZE", "TORTE", "GLÜCK", "SONNE" ];
    const zielWort = woerter[Math.floor(Math.random() * woerter.length)];
    let versuch = 0;
    let spielVorbei = false;

    // 6x5 leere Kästchen aufbauen
    for (let r = 0; r < 6; r++) {
        const row = document.createElement('div');
        row.className = 'wordle-row';
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement('div');
            cell.className = 'wordle-cell';
            cell.id = `w-${r}-${c}`;
            row.appendChild(cell);
        }
        wordleBoard.appendChild(row);
    }

    const inputEl = document.getElementById('wordle-input');
    const btnEl = document.getElementById('wordle-btn');
    const statusEl = document.getElementById('wordle-status');

    function pruefeWort() {
        if (spielVorbei) return;
        const tipp = inputEl.value.trim().toUpperCase();

        if (tipp.length !== 5) {
            statusEl.innerText = "Bitte genau 5 Buchstaben eingeben! ✍️";
            return;
        }

        const zielArr = zielWort.split('');
        const tippArr = tipp.split('');
        const farben = Array(5).fill('falsch');

        // 1. Durchlauf: Exakte Treffer (Grün) prüfen
        for (let i = 0; i < 5; i++) {
            if (tippArr[i] === zielArr[i]) {
                farben[i] = 'richtig';
                zielArr[i] = null; // Verhindert doppelte Wertung
            }
        }

        // 2. Durchlauf: Vorhandene Buchstaben an falscher Stelle (Gelb) prüfen
        for (let i = 0; i < 5; i++) {
            if (farben[i] !== 'richtig' && zielArr.includes(tippArr[i])) {
                farben[i] = 'vorhanden';
                zielArr[zielArr.indexOf(tippArr[i])] = null;
            }
        }

        // Kästchen im Gitter einfärben
        for (let i = 0; i < 5; i++) {
            const cell = document.getElementById(`w-${versuch}-${i}`);
            cell.innerText = tippArr[i];
            cell.classList.add(farben[i]);
        }

        versuch++;
        inputEl.value = "";

        if (tipp === zielWort) {
            spielVorbei = true;
            statusEl.innerHTML = `<span style="color:#4dff88; font-weight:bold;">🎉 Erraten! Das Wort war ${zielWort}! +1 Flamme!</span>`;
            registerDailyWin();
        } else if (versuch >= 6) {
            spielVorbei = true;
            statusEl.innerHTML = `Leider vorbei! Das Wort war <b>${zielWort}</b>. <br><button class="game-btn" onclick="location.reload()" style="margin-top:8px;">Nochmal spielen</button>`;
        } else {
            statusEl.innerText = `Versuch ${versuch} von 6 – weiter so!`;
        }
    }

    btnEl.onclick = pruefeWort;
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') pruefeWort();
    });
}

// --- 7. SONNTAG: HERZ-KLICKER ---
const herzBtn = document.getElementById('herz-klick-btn');
if (herzBtn) {
    let klicks = 0, zeit = 10, aktiv = false, cooldown = false;
    const statusEl = document.getElementById('klick-game-status');

    herzBtn.onclick = function() {
        if (cooldown) return;
        if (!aktiv) {
            aktiv = true; klicks = 0; zeit = 10;
            const timer = setInterval(() => {
                zeit--;
                if (zeit > 0) {
                    statusEl.innerHTML = `Zeit: <b>${zeit}s</b> | Klicks: <b>${klicks}</b>`;
                } else {
                    clearInterval(timer);
                    aktiv = false; cooldown = true;
                    if (klicks >= 15) {
                        statusEl.innerHTML = `<span style="color:#4dff88; font-weight:bold;">🎉 ${klicks} Klicks! +1 Flamme!</span>`;
                        registerDailyWin();
                    } else {
                        statusEl.innerHTML = `Nur ${klicks} Klicks (15 nötig). Nochmal! 😉`;
                    }
                    setTimeout(() => { cooldown = false; herzBtn.innerText = "💖 Nochmal!"; }, 1500);
                }
            }, 1000);
        }
        if (aktiv) {
            klicks++;
            statusEl.innerHTML = `Zeit: <b>${zeit}s</b> | Klicks: <b>${klicks}</b>`;
        }
    };
}
