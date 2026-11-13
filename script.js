<script>
    // =========================================
    // NEU AB HIER: Prüfung auf ersten Besuch
    // =========================================
    if (!localStorage.getItem('schonBesucht')) {
        const welcomeEl = document.getElementById('welcome-text');
        welcomeEl.style.display = 'block';
        localStorage.setItem('schonBesucht', 'true');

        // Blendet "Welcome" nach 4 Sekunden sanft aus
        setTimeout(() => {
            welcomeEl.style.opacity = '0';
        }, 4000);
    }
    // =========================================
    // ENDE NEU (JavaScript)
    // =========================================

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
        "Das Wochenende ist schon in Sicht, bleib dran! 🚀",
        "Fast geschafft! Hab einen großartigen Start ins Wochenende! 🥂",
        "Genieße deinen Tag und mach das, was dich glücklich macht! ☀️"
    ];

    const wochentag = new Date().getDay();
    document.getElementById('quote').innerText = sprueche[wochentag];

    updateDateTime();
    setInterval(updateDateTime, 1000);
<!-- Mini games  -->
<script>
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
        const anzeige = Math.min(streak, 7);
        document.getElementById('streak-count').innerText = anzeige + " / 7 Tage";
        
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

    function tagGeschafft() {
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
 
      updateStreakUI();

    // 5. Spiel-Logik
    const wahlNamen = ["🪨 Stein", "📄 Papier", "✂️ Schere"];

    window.playSSP = function(spielerWahl) {
        const euleWahl = Math.floor(Math.random() * 3);
        const statusEl = document.getElementById('game-status');

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
</script>
