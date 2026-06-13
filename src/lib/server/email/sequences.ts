import type { QuizProfile } from '$lib/quiz/types.js';
import { emailLayout } from './templates/layout.js';

export interface SequenceCtx {
	profile: QuizProfile;
	prefsUrl: string;
	unsubUrl: string;
}

export interface SequenceStep {
	step: number;
	dayOffset: number;
	subject: string;
	bodyHtml: (ctx: SequenceCtx) => string;
}

export const sequences: Record<string, SequenceStep[]> = {
	'somn-v1': [
		{
			step: 1,
			dayOffset: 1,
			subject: 'Pasul 1: Ritualul de seară care îți transformă somnul',
			bodyHtml: ({ profile, prefsUrl, unsubUrl }) =>
				emailLayout({
					title: 'Pasul 1: Ritualul de seară',
					bodyHtml: `
<p>Bună ziua,</p>
<p>Ești <strong>${profile.name}</strong> — și acesta este primul email din planul tău de 2 săptămâni.</p>
<p>Astăzi vorbim despre <strong>ritualul de seară</strong>: cel mai simplu și mai eficient instrument pentru un somn mai bun.</p>
<p>Un ritual de seară nu trebuie să dureze mai mult de 10-15 minute. Secretul este <em>consistența</em>, nu complexitatea. Creierul tău asociază anumite activități cu somnul — și cu cât faci mai des același ritual, cu atât adormirea va veni mai rapid și mai natural.</p>
<p>Iată cum să îți construiești ritualul de seară în 3 pași simpli:
<ol>
<li><strong>Oprește stimulii stresanți cu 30 de minute înainte de culcare</strong> — emailuri, știri, conversații dificile. Creierul are nevoie de timp să treacă din modul „alertă" în modul „relaxare".</li>
<li><strong>Alege o activitate relaxantă</strong> — citit (cărți fizice sau e-reader cu lumină caldă), respirație profundă, muzică liniștitoare sau stretching ușor. Orice funcționează pentru tine.</li>
<li><strong>Stabilește o oră fixă de culcare</strong> — chiar și cu ±30 de minute. Regularitatea îți calibrează ceasul biologic mai eficient decât orice supliment.</li>
</ol></p>
<p><strong>Acțiunea ta pentru astăzi:</strong> Alege o activitate relaxantă și practică-o timp de 10 minute înainte de culcare. Mâine vorbim despre cel mai mare saboteur al somnului modern: lumina artificială.</p>
<p>Cu drag,<br/>Echipa Better Life</p>
					`,
					footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
				})
		},
		{
			step: 2,
			dayOffset: 3,
			subject: 'Pasul 2: Lumina și ecranele — inamicii somnului tău',
			bodyHtml: ({ profile, prefsUrl, unsubUrl }) =>
				emailLayout({
					title: 'Pasul 2: Lumina și ecranele',
					bodyHtml: `
<p>Bună ziua,</p>
<p>Cum a mers ritualul de seară? Astăzi explorăm un factor adesea ignorat: <strong>lumina</strong>.</p>
<p>Melatonina — hormonul somnului — este produsă de creier când se întunecă. Dar lumina albastră din telefoane, laptopuri și televizoare suprimă producția de melatonină cu până la 3 ore. Ca ${profile.name}, este crucial să înțelegi acest mecanism.</p>
<p><strong>Strategii concrete pentru gestionarea luminii:</strong></p>
<p><strong>1. Regula „no screens" — simplu și eficient</strong><br/>
Cel mai eficient este să eviți complet ecranele cu 1 oră înainte de culcare. Dacă asta pare imposibil, încearcă cu 30 de minute și crește gradual.</p>
<p><strong>2. Filtre de lumină albastră</strong><br/>
Dacă trebuie să folosești ecrane seara, activează modul „Night Shift" (iPhone) sau „Night Light" (Android/Windows). Aplicații ca f.lux reduc și mai mult lumina albastră. Nu sunt perfecte, dar ajută.</p>
<p><strong>3. Iluminatul din casă</strong><br/>
Seara, înlocuiește luminile albe/reci cu lămpi calde (galben-portocalii). Lumina de sare sau lumânările sunt excelente pentru cele 30-60 de minute înainte de culcare.</p>
<p><strong>4. Dimineața: mai multă lumină naturală</strong><br/>
Expunerea la lumina naturală imediat după trezire (10-15 minute în aer liber sau lângă o fereastră) resetează ceasul biologic și îmbunătățește somnul nocturn. Paradoxal, mai multă lumină dimineața înseamnă somn mai bun seara.</p>
<p><strong>Acțiunea ta pentru astăzi:</strong> Activează un filtru de lumină albastră pe toate dispozitivele și setează-l să se activeze automat la apusul soarelui.</p>
<p>Până data viitoare,<br/>Echipa Better Life</p>
					`,
					footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
				})
		},
		{
			step: 3,
			dayOffset: 6,
			subject: 'Pasul 3: Cafeaua și alimentația — ce mănânci contează',
			bodyHtml: ({ profile, prefsUrl, unsubUrl }) =>
				emailLayout({
					title: 'Pasul 3: Cafeaua și alimentația',
					bodyHtml: `
<p>Bună ziua,</p>
<p>Săptămâna asta explorăm conexiunea dintre alimentație și somn — un factor subestimat de majoritatea oamenilor.</p>
<p><strong>Cafeaua: aliată sau dușmancă?</strong></p>
<p>Cafeina blochează receptorii de adenozină din creier — cei responsabili cu senzația de somnolenţă. Problema: are un timp de înjumătățire de 5-6 ore. O cafea la ora 15:00 înseamnă că jumătate din cafeină este încă activă la ora 21:00.</p>
<p>Recomandarea noastră: <strong>ultima cafea sau ceai cu cafeină înainte de ora 14:00</strong>. Dacă ești sensibil la cofeină sau ești ${profile.name}, ia în considerare să cobori limita la ora 12:00.</p>
<p><strong>Alimentația de seară</strong></p>
<p>Mese copioase cu mai puțin de 2-3 ore înainte de culcare cresc temperatura corporală și perturbă somnul profund. Dacă ți-e foame seara, alege gustări ușoare: o banană (conține triptofan și magneziu), nuci (magneziu, melatonină), sau un iaurt mic.</p>
<p><strong>Alcoolul: mitul „mă ajută să dorm"</strong></p>
<p>Alcoolul poate accelera adormirea, dar fragmentează somnul în a doua parte a nopții și reduce semnificativ somnul REM — etapa critică pentru consolidarea memoriei și recuperarea emoțională. Dacă bei, limitează-te la 1-2 pahare și evită consumul cu mai puțin de 3 ore înainte de culcare.</p>
<p><strong>Hidratarea</strong></p>
<p>Deshidratarea ușoară poate perturba somnul. Asigură-te că bei suficientă apă pe parcursul zilei, dar limitează consumul de lichide cu 1-2 ore înainte de culcare pentru a evita trezirile nocturne.</p>
<p><strong>Acțiunea ta pentru astăzi:</strong> Verifică ora la care bei ultima cafea și încearcă să o muți cu 1 oră mai devreme dacă este după 14:00.</p>
<p>Până data viitoare,<br/>Echipa Better Life</p>
					`,
					footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
				})
		},
		{
			step: 4,
			dayOffset: 10,
			subject: 'Pasul 4: Dormitorul ideal — mediul care face magia',
			bodyHtml: ({ profile, prefsUrl, unsubUrl }) =>
				emailLayout({
					title: 'Pasul 4: Dormitorul ideal',
					bodyHtml: `
<p>Bună ziua,</p>
<p>Ai parcurs deja 3 pași importanți. Astăzi optimizăm mediul în care dormi — un factor pe care mulți îl ignoră, dar care poate transforma somnul imediat.</p>
<p><strong>Temperatura: 18-20°C este zona magică</strong></p>
<p>Corpul tău trebuie să își scadă temperatura internă cu 1-2 grade Celsius pentru a intra în somn profund. O cameră prea caldă (peste 22°C) face acest proces mai dificil și superficializează somnul. Deschide fereastra, folosește climatizare sau pur și simplu un ventilator mic.</p>
<p><strong>Întunericul total — sau aproape total</strong></p>
<p>Chiar și lumina slabă dintr-un ceas sau un indicator LED poate perturba ciclurile de somn. Perdele opace (blackout curtains) sau o mască de somn sunt investiții mici cu impact mare. Ca ${profile.name}, acest aspect este deosebit de important.</p>
<p><strong>Liniștea sau sunetul controlat</strong></p>
<p>Zgomotele intermitente (trafic, vecini) sunt mai perturbatoare decât zgomotele constante. „White noise" — un ventilator, un umidificator sau o aplicație de sunete albe — maschează zgomotele inconsistente și creează un mediu sonic uniform, propice somnului.</p>
<p><strong>Patul: doar pentru somn și intimitate</strong></p>
<p>Dacă lucrezi, mănânci sau te uiți la TV în pat, creierul tău asociază patul cu activitate, nu cu relaxare. Rezervă patul exclusiv pentru somn — este una dintre cele mai eficiente tehnici din terapia cognitiv-comportamentală pentru insomnie (CBT-I).</p>
<p><strong>Acțiunea ta pentru această săptămână:</strong> Identifică cea mai mare problemă din dormitorul tău (temperatură, lumină sau zgomot) și acționează în consecință. O singură schimbare, aplicată constant, face diferența.</p>
<p>Aproape am terminat planul tău — mai avem un email,<br/>Echipa Better Life</p>
					`,
					footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
				})
		},
		{
			step: 5,
			dayOffset: 14,
			subject: 'Pasul 5: Recapitulare și ce urmează în călătoria ta',
			bodyHtml: ({ profile, prefsUrl, unsubUrl }) =>
				emailLayout({
					title: 'Pasul 5: Recapitulare',
					bodyHtml: `
<p>Bună ziua,</p>
<p>Ai ajuns la ultimul email din planul tău de 2 săptămâni. Felicitări pentru că ai parcurs această călătorie!</p>
<p><strong>Ce ai învățat:</strong></p>
<ul>
<li>✅ <strong>Ritualul de seară</strong> — 10-15 minute de activitate relaxantă înainte de culcare</li>
<li>✅ <strong>Lumina și ecranele</strong> — filtre de lumină albastră și mai multă lumină naturală dimineața</li>
<li>✅ <strong>Cafeaua și alimentația</strong> — ultima cafea înainte de 14:00, mese ușoare seara</li>
<li>✅ <strong>Dormitorul ideal</strong> — temperatură 18-20°C, întuneric, liniște sau white noise</li>
</ul>
<p><strong>Ce urmează:</strong></p>
<p>Schimbarea de durată vine din consistență, nu din perfecționism. Nu trebuie să aplici toate cele 4 principii perfect de la prima zi. Alege cel mai ușor de implementat și construiește gradual.</p>
<p>Profilul tău — <strong>${profile.name}</strong> — îți dă un avantaj: înțelegi acum de ce dormi cum dormi și ce poți face concret în privința asta. Mulți oameni nu ajung niciodată la această claritate.</p>
<p><strong>Vei mai primi sfaturi?</strong></p>
<p>Dacă te-ai abonat la comunicările noastre periodice, vei primi sfaturi și articole noi în funcție de preferințele tale. Poți oricând să ajustezi frecvența sau să te dezabonezi — linkurile sunt mai jos.</p>
<p>Îți mulțumim că ai ales să investești în somnul și sănătatea ta.</p>
<p>Cu drag,<br/>Echipa Better Life</p>
					`,
					footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
				})
		}
	]
,
	'obiceiuri-v1': [
		{
			step: 1,
			dayOffset: 1,
			subject: 'Pasul 1: De ce voința singură nu funcționează',
			bodyHtml: ({ profile, prefsUrl, unsubUrl }) =>
				emailLayout({
					title: 'Pasul 1: Voința nu este suficientă',
					bodyHtml: `
<p>Bună ziua,</p>
<p>Ești <strong>${profile.name}</strong> — și acesta este primul email din planul tău de formare a obiceiurilor.</p>
<p>Cel mai mare mit despre obiceiuri: că ai nevoie de mai multă voință. Realitatea: voința este o resursă limitată care se epuizează zilnic.</p>
<p>Cercetătorii de la Stanford au demonstrat că oamenii cu cel mai bun autocontrol nu sunt cei care rezistă tentațiilor — sunt cei care <em>evită situațiile</em> care necesită autocontrol.</p>
<p><strong>Principiul nr. 1: Proiectează pentru succes, nu rezista pentru succes.</strong></p>
<p>Iată exercițiul tău pentru astăzi: identifică un obicei pe care vrei să-l construiești și răspunde la aceste întrebări:
<ul>
<li>Ce trebuie să fie <em>vizibil</em> pentru a-ți aminti de el?</li>
<li>Ce trebuie să fie <em>ușor de accesat</em>?</li>
<li>Ce trebuie să fie <em>eliminat din cale</em>?</li>
</ul></p>
<p>Mâine vorbim despre cel mai puternic instrument al tău: declanșatoarele.</p>
<p>Cu drag,<br/>Echipa Better Life</p>
					`,
					footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
				})
		},
		{
			step: 2,
			dayOffset: 3,
			subject: 'Pasul 2: Declanșatoarele — cheia automatizării',
			bodyHtml: ({ profile, prefsUrl, unsubUrl }) =>
				emailLayout({
					title: 'Pasul 2: Declanșatoarele',
					bodyHtml: `
<p>Bună ziua,</p>
<p>Obiceiurile nu se construiesc din voință — se construiesc din conexiuni. Creierul tău funcționează pe principiul <em>dacă X, atunci Y</em>.</p>
<p><strong>Formula obiceiului:</strong></p>
<p><strong>Declanșator → Rutină → Recompensă</strong></p>
<p>Ca ${profile.name}, cel mai eficient lucru pe care îl poți face acum este să <em>ancorezi</em> noul obicei de ceva ce faci deja.</p>
<p>Exemple concrete:
<ul>
<li>"După ce fac cafeaua dimineață → citesc 5 minute"</li>
<li>"Înainte de duș → fac 5 minute de stretching"</li>
<li>"Când mă așez la birou → deschid jurnalul și scriu un task"</li>
</ul></p>
<p>Aceasta se numește <em>habit stacking</em> — stivuirea obiceiurilor. Avantajul: nu trebuie să-ți amintești separat de obicei, rutina existentă devine declanșatorul.</p>
<p><strong>Exercițiu pentru astăzi:</strong> Scrie formula completă pentru obiceiul tău: "Imediat după ce [DECLANȘATOR EXISTENT], voi [OBICEI NOU]."</p>
<p>Cu drag,<br/>Echipa Better Life</p>
					`,
					footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
				})
		},
		{
			step: 3,
			dayOffset: 6,
			subject: 'Pasul 3: Cum să nu mai renunți după ziua 5',
			bodyHtml: ({ profile, prefsUrl, unsubUrl }) =>
				emailLayout({
					title: 'Pasul 3: Ziua 5 — punctul critic',
					bodyHtml: `
<p>Bună ziua,</p>
<p>Felicitări — ai depășit prima săptămână! Dar acum urmează cel mai periculos moment: zilele 5-10, când entuziasmul scade și automatismul nu s-a format încă.</p>
<p>Studiile arată că obiceiurile se formează în medie în 66 de zile — nu 21 cum se spune. Primele 3 săptămâni sunt critice.</p>
<p><strong>Regula de aur pentru ${profile.name}:</strong></p>
<p>Niciodată două zile consecutive fără obicei. O zi lipsă este un accident. Două zile consecutive devin un nou obicei — cel de a nu face nimic.</p>
<p>Când simți că nu vrei să faci obiceiul astăzi:</p>
<ol>
<li>Fă varianta minimă (2 minute)</li>
<li>Reamintește-ți că ești <em>tipul de persoană care face asta</em></li>
<li>Marchează ziua în jurnal chiar și pentru varianta minimă</li>
</ol>
<p>Seria vizuală — o bifă pentru fiecare zi — este unul dintre cei mai puternici motivatori psihologici. Nu vrei să rupi lanțul.</p>
<p>Cu drag,<br/>Echipa Better Life</p>
					`,
					footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
				})
		},
		{
			step: 4,
			dayOffset: 10,
			subject: 'Pasul 4: Recompensele care funcționează (și cele care sabotează)',
			bodyHtml: ({ profile, prefsUrl, unsubUrl }) =>
				emailLayout({
					title: 'Pasul 4: Recompensele',
					bodyHtml: `
<p>Bună ziua,</p>
<p>Creierul tău învață prin recompense. Problema: recompensele prea mari sau prea distante nu funcționează pentru formarea obiceiurilor. Ai nevoie de satisfacție <em>imediată</em>.</p>
<p><strong>Recompense eficiente după obicei:</strong>
<ul>
<li>O bifă vizibilă pe calendar (satisfacție imediată)</li>
<li>Un moment de reflecție: "Am făcut asta azi" (auto-recunoaștere)</li>
<li>O activitate plăcută scurtă: muzica preferată în timp ce faci obiceiul</li>
</ul></p>
<p><strong>Recompense care sabotează:</strong>
<ul>
<li>"Am alergat azi, merit ceva dulce" — contracarează obiceiul</li>
<li>Recompense mari și rare (o vacanță după 30 de zile) — prea distante pentru creier</li>
</ul></p>
<p>Ca ${profile.name}, principala ta recompensă ar trebui să fie <em>identitară</em>: confirmarea că ești tipul de persoană care construiește obiceiuri bune.</p>
<p>Mai avem un email — recapitularea și planul tău următor.</p>
<p>Cu drag,<br/>Echipa Better Life</p>
					`,
					footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
				})
		},
		{
			step: 5,
			dayOffset: 14,
			subject: 'Pasul 5: Ce urmează — un sistem pentru toată viața',
			bodyHtml: ({ profile, prefsUrl, unsubUrl }) =>
				emailLayout({
					title: 'Pasul 5: Un sistem pentru viață',
					bodyHtml: `
<p>Bună ziua,</p>
<p>Ai parcurs 2 săptămâni din planul tău de obiceiuri. Ești la jumătatea drumului spre automatizare — felicitări!</p>
<p><strong>Ce ai învățat:</strong></p>
<ul>
<li>✅ Voința singură nu e suficientă — mediul și sistemele sunt cheia</li>
<li>✅ Declanșatoarele ancorează obiceiurile de rutinele existente</li>
<li>✅ Niciodată două zile consecutive fără obicei</li>
<li>✅ Recompensele imediate (bife, recunoaștere) sunt mai eficiente decât cele mari și rare</li>
</ul>
<p><strong>Ce urmează:</strong></p>
<p>Profilul tău — <strong>${profile.name}</strong> — îți arată că ai puncte forte specifice. Continuă să construiești pe ele.</p>
<p>Cel mai important pas acum: după ce obiceiul curent este stabilit (aprox. 60 de zile), adaugă al doilea obicei. Nu înainte.</p>
<p>Ești la 2 săptămâni dintr-o călătorie de 60. Dar deja ești diferit față de cel care a început.</p>
<p>Cu drag,<br/>Echipa Better Life</p>
					`,
					footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
				})
		}
	]
};

export function maxOffsetDays(sequenceKey: string): number {
	const seq = sequences[sequenceKey];
	if (!seq || seq.length === 0) return 0;
	return Math.max(...seq.map((s) => s.dayOffset));
}
