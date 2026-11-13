// ==========================================
// 1. CODE NUR FÜR DIE STARTSEITE (index.html)
// ==========================================
const datetimeEl = document.getElementById('datetime');
if (datetimeEl) {
    const welcomeEl = document.getElementById('welcome-text');
    
    if (welcomeEl) {
        // Prüfen, ob der Nutzer SCHON EINMAL da war
        if (localStorage.getItem('schonBesucht')) {
            // Wenn ja: Direkt "1912" dauerhaft anzeigen
            welcomeEl.innerText = "1912";
            welcomeEl.style.display = 'block';
            welcomeEl.style.opacity = '1';
        } else {
            // Wenn allererster Besuch: "Welcome" anzeigen
            welcomeEl.innerText = "Welcome";
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
        "Zeit zum Entspannen und Kraft tanken für die neue Woche! ☕",
        "Neuer Tag, neue Chancen. Lass uns durchstarten! 💪",
        "Der zweite Schritt ist getan. Du bist auf dem richtigen Weg! ✨",
        "Die Hälfte ist geschafft! Bergfest! 🎉",
        "Das Wochenende ist schon in Sicht, bleib dran! ☕",
        "Fast geschafft! Hab einen großartigen Start ins Wochenende! 🥂",
        "Genieße deinen Tag und mach das, was dich glücklich macht! ☀️"
    ];

    const wochentag = 6;
    const quoteEl = document.getElementById('quote');
    if (quoteEl) {
        quoteEl.innerText = sprueche[wochentag];
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
} // <--- HIER hat die schließende Klammer für "if (datetimeEl)" gefehlt!


// ==========================================
// 2. STREAK- & SPIEL-LOGIK (seite_2.html)
// ==========================================

// Datums-Helfer
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

// Wandelt die HTML-Kreise der Reihe nach in Flammen um
function updateStreakUI() {
    const countEl = document.getElementById('streak-count');
    if (!countEl) return; // Verhindert Fehler auf der index.html
    
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

// Stand beim Laden der Seite einmal anzeigen
updateStreakUI();

// Schere, Stein, Papier Spielsteuerung
const wahlNamen = ["🪨 Stein", "📄 Papier", "✂️ Schere"];

window.playSSP = function(spielerWahl) {
    const euleWahl = Math.floor(Math.random() * 3);
    const statusEl = document.getElementById('game-status');
    if (!statusEl) return;

    if (spielerWahl === euleWahl) {
        statusEl.innerHTML = `Unentschieden!<br>Ihr hattet beide <b>${wahlNamen[spielerWahl]}</b>.`;
    } 
    else if (
        (spielerWahl === 0 && euleWahl === 2) || 
        (spielerWahl === 1 && euleWahl === 0) || 
        (spielerWahl === 2 && euleWahl === 1)
    ) {
        statusEl.innerHTML = `🎉 Gewonnen!<br>Die Eule hatte <b>${wahlNamen[euleWahl]}</b>.<br><span style="color: #4dff88; font-weight: bold;">+1 Flamme erhalten!</span>`;
        registerDailyWin(); 
    } 
    else {
        statusEl.innerHTML = `Verloren!<br>Die Eule hatte <b>${wahlNamen[euleWahl]}</b>.<br>Versuch es noch einmal! 😉`;
    }
};
// ==========================================
// CODE FÜR DAS SAMSTAGS-SPIEL
// ==========================================
const emojiArea = document.getElementById('emoji-game-area');
if (emojiArea) {
    const emojis = ["🦉", "🌸", "⭐", "☕"];
    let sequenz = [];
    let eingabe = [];
    const statusEl = document.getElementById('emoji-game-status');
    const startBtn = document.getElementById('start-emoji-btn');

    if (startBtn) {
        startBtn.onclick = neueRunde;
    }

    function neueRunde() {
        eingabe = [];
        // Ein zufälliges Emoji zur Kette hinzufügen
        sequenz.push(emojis[Math.floor(Math.random() * emojis.length)]);
        
        // Zeige dem Spieler die Folge für 2 Sekunden
        statusEl.innerHTML = `Merke dir die Folge:<br><span style="font-size: 1.8rem; letter-spacing: 5px;">${sequenz.join(" ")}</span>`;
        emojiArea.innerHTML = ""; // Buttons verstecken während des Merkens

        setTimeout(() => {
            statusEl.innerText = "Jetzt genau in der richtigen Reihenfolge nachklicken!";
            
            // Buttons zum Klicken wieder aufbauen
            emojiArea.innerHTML = emojis.map(e => 
                `<button class="game-btn" style="font-size: 1.5rem; padding: 10px 15px;" onclick="checkEmoji('${e}')">${e}</button>`
            ).join("");
        }, 2000);
    }

    window.checkEmoji = function(gewaehltesEmoji) {
        eingabe.push(gewaehltesEmoji);
        const aktuellerIndex = eingabe.length - 1;

        // Prüfen, ob der Klick richtig war
        if (eingabe[aktuellerIndex] !== sequenz[aktuellerIndex]) {
            statusEl.innerHTML = `<span style="color: #ff4d4d; font-weight: bold;">Leider falsch! ❌</span><br>Du hast die Serie verloren. Spiel startet neu...`;
            sequenz = [];
            emojiArea.innerHTML = `<button class="game-btn" onclick="location.reload()">Nochmal versuchen</button>`;
        } 
        // Prüfen, ob die gesamte Kette richtig nachgeklickt wurde
        else if (eingabe.length === sequenz.length) {
            statusEl.innerHTML = `<span style="color: #4dff88; font-weight: bold;">Perfekt gemerkt! 🌟</span><br>Nächste Runde startet...`;
            registerDailyWin(); // Entzündet die Samstags-Flamme!
            setTimeout(neueRunde, 1200);
        }
    };
}
if (typeof neueRunde === "function") {
    neueRunde();
}
