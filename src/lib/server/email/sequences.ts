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
<p>Cu drag,<br/>Echipa Viață Mai Bună</p>
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
<p>Până data viitoare,<br/>Echipa Viață Mai Bună</p>
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
<p>Până data viitoare,<br/>Echipa Viață Mai Bună</p>
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
<p>Aproape am terminat planul tău — mai avem un email,<br/>Echipa Viață Mai Bună</p>
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
<p>Cu drag,<br/>Echipa Viață Mai Bună</p>
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
