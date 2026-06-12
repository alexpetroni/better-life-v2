import type { QuizDefinition } from '$lib/quiz/types.js';

export const somnQuiz = {
	slug: 'somn',
	version: 1,
	topic: 'somn',
	locale: 'ro',
	title: 'Testul de somn',
	description:
		'Descoperă-ți tipul de somn și primește un plan personalizat de 2 săptămâni pentru a dormi mai bine și a te trezi odihnit.',
	dimensions: ['cronotip', 'igiena'],
	questions: [
		{
			id: 'q1',
			text: 'La ce oră adormi de obicei în timpul săptămânii?',
			options: [
				{ id: 'q1a', label: 'Înainte de ora 22:00', weights: { cronotip: 0 } },
				{ id: 'q1b', label: 'Între 22:00 și 23:30', weights: { cronotip: 1 } },
				{ id: 'q1c', label: 'Între 23:30 și 01:00', weights: { cronotip: 2 } },
				{ id: 'q1d', label: 'După ora 01:00', weights: { cronotip: 3 } }
			]
		},
		{
			id: 'q2',
			text: 'La ce oră te trezești natural (fără alarmă) în weekend?',
			options: [
				{ id: 'q2a', label: 'Înainte de ora 7:00', weights: { cronotip: 0 } },
				{ id: 'q2b', label: 'Între 7:00 și 8:30', weights: { cronotip: 1 } },
				{ id: 'q2c', label: 'Între 8:30 și 10:00', weights: { cronotip: 2 } },
				{ id: 'q2d', label: 'După ora 10:00', weights: { cronotip: 3 } }
			]
		},
		{
			id: 'q3',
			text: 'Cum te simți imediat după ce te trezești dimineața?',
			options: [
				{ id: 'q3a', label: 'Alert și plin de energie', weights: { cronotip: 0 } },
				{ id: 'q3b', label: 'Puțin somnoros, dar mă trezesc rapid', weights: { cronotip: 1 } },
				{ id: 'q3c', label: 'Am nevoie de ceva timp și o cafea', weights: { cronotip: 2 } },
				{ id: 'q3d', label: 'Extrem de greu — dimineața e dușmanul meu', weights: { cronotip: 3 } }
			]
		},
		{
			id: 'q4',
			text: 'Când ești cel mai productiv și concentrat în cursul zilei?',
			options: [
				{ id: 'q4a', label: 'Dimineața devreme (6:00–10:00)', weights: { cronotip: 0 } },
				{ id: 'q4b', label: 'La prânz (10:00–14:00)', weights: { cronotip: 1 } },
				{ id: 'q4c', label: 'După-amiaza sau seara (14:00–20:00)', weights: { cronotip: 2 } },
				{ id: 'q4d', label: 'Noaptea târziu (după 20:00)', weights: { cronotip: 3 } }
			]
		},
		{
			id: 'q5',
			text: 'Cât timp petreci pe telefon sau în fața ecranelor în ultimele 60 de minute înainte de culcare?',
			options: [
				{ id: 'q5a', label: 'Deloc — am o rutină fără ecrane', weights: { igiena: 3 } },
				{ id: 'q5b', label: 'Mai puțin de 30 de minute', weights: { igiena: 2 } },
				{ id: 'q5c', label: 'Între 30 și 60 de minute', weights: { igiena: 1 } },
				{ id: 'q5d', label: 'Stau pe ecrane până adorm', weights: { igiena: 0 } }
			]
		},
		{
			id: 'q6',
			text: 'Față de săptămână, la ce oră te culci în weekend?',
			options: [
				{ id: 'q6a', label: 'Cam la aceeași oră', weights: { igiena: 3 } },
				{ id: 'q6b', label: 'Cu mai puțin de o oră mai târziu', weights: { igiena: 2 } },
				{ id: 'q6c', label: 'Cu 1–2 ore mai târziu', weights: { igiena: 1 } },
				{ id: 'q6d', label: 'Cu mai mult de 2 ore mai târziu', weights: { igiena: 0 } }
			]
		},
		{
			id: 'q7',
			text: 'Ce faci de obicei în ultimele 30 de minute înainte de culcare?',
			options: [
				{
					id: 'q7a',
					label: 'Am o rutină relaxantă (meditație, respirație, întinderi)',
					weights: { igiena: 3 }
				},
				{ id: 'q7b', label: 'Citesc sau ascult muzică liniștitoare', weights: { igiena: 2 } },
				{ id: 'q7c', label: 'Mă uit la TV sau scrollez pe rețele sociale', weights: { igiena: 1 } },
				{ id: 'q7d', label: 'Lucrez, mă îngrijorez sau gândesc intens', weights: { igiena: 0 } }
			]
		},
		{
			id: 'q8',
			text: 'Cum este dormitorul tău în momentul în care dormi?',
			options: [
				{ id: 'q8a', label: 'Răcoros, întunecat complet și silențios', weights: { igiena: 3 } },
				{ id: 'q8b', label: 'Are o problemă minoră (puțină lumină sau zgomot)', weights: { igiena: 2 } },
				{ id: 'q8c', label: 'Are două probleme (e cald și luminat, de exemplu)', weights: { igiena: 1 } },
				{ id: 'q8d', label: 'Nu este deloc optimizat pentru somn', weights: { igiena: 0 } }
			]
		}
	],
	profiles: [
		{
			key: 'bufnita-dezorganizata',
			match: { cronotip: { min: 7 }, igiena: { max: 5 } },
			name: 'Bufnița dezorganizată',
			teaser:
				'Ești o persoană de seară prin natură, dar obiceiurile tale de somn îți fac viața mai grea decât e necesar.',
			fullAdvice: [
				'Ca bufniță dezorganizată, corpul tău funcționează natural mai bine seara — dar lipsa unor rutine consistente amplifică oboseala și îți fură energie prețioasă. Vestea bună: nu trebuie să devii o pasăre de dimineață. Trebuie doar să îți organizezi seara.',
				'Cel mai important pas pe care îl poți face este să îți stabilești o oră fixă de culcare, chiar dacă e după miezul nopții. Consecvența bate ora. Corpul tău va începe să asocieze acea oră cu somnul, reducând timpul de adormire și îmbunătățind calitatea somnului.',
				'Ecranele sunt dușmanul numărul unu al bufnițelor dezorganizate. Lumina albastră suprimă melatonina — tocmai hormonul care te face să adormi. Încearcă să oprești ecranele cu cel puțin 30 de minute înainte de culcare și observă diferența în prima săptămână.',
				'Creează un "ritual de seară" simplu: 10–15 minute de activitate relaxantă înainte de culcare — citit, respirație profundă sau muzică liniștitoare. Creierul tău va recunoaște aceste semne și va începe să producă melatonină mai eficient.',
				'Dormitorul tău trebuie să fie un sanctuar al somnului. Verifică temperatura (ideal 18–20°C), blochează lumina cu perdele opace și folosește dopuri de urechi dacă zgomotul este o problemă. Micile ajustări fac diferențe mari.',
				'Nu încerca să schimbi totul deodată — alege UN singur obicei nou în prima săptămână. Planul tău personalizat de 2 săptămâni, pe care îl vei primi pe email, te va ghida pas cu pas prin fiecare schimbare.'
			],
			recommendedProductSlugs: ['masca-somn', 'ghid-seara-linistita'],
			sequenceKey: 'somn-v1',
			defaultCadence: 'weekly'
		},
		{
			key: 'bufnita-disciplinata',
			match: { cronotip: { min: 7 }, igiena: { min: 6 } },
			name: 'Bufnița disciplinată',
			teaser:
				'Ești o persoană de seară cu obiceiuri bune de somn — ești deja pe drumul cel bun, câteva ajustări fine te vor duce la nivelul următor.',
			fullAdvice: [
				'Felicitări! Ești o bufniță disciplinată — ai acceptat că programul tău natural este diferit de cel al majorității și ai construit rutine care funcționează în limitele lui. Aceasta este una dintre cele mai inteligente abordări ale somnului.',
				'Provocarea ta principală nu este calitatea somnului în sine, ci gestionarea "jetlag-ului social" — diferența dintre programul tău natural și cerințele societății (muncă, școală, activități matinale). Încearcă să reduci această diferență ori de câte ori poți, negociând un program mai flexibil.',
				'Deoarece ai deja rutine bune, poți să te concentrezi pe optimizări avansate: lumina naturală matinală (chiar și 10 minute de expunere la soare imediat după trezire ajută la resetarea ceasului biologic), exerciții moderate (evită efortul intens cu mai puțin de 3 ore înainte de culcare).',
				'Somnul REM și somnul profund sunt etapele critice pentru recuperare. Dacă te trezești obosit în ciuda unui număr suficient de ore, ia în considerare o consultație pentru apnee în somn — este mai frecventă decât se crede și complet tratabilă.',
				'Alimentația joacă un rol important: evită mesele copioase cu mai puțin de 2 ore înainte de culcare și limitează alcoolul — deși alcoolul poate părea că te ajută să adormi, fragmentează somnul și reduce somnul REM semnificativ.',
				'Ești deja expert în propriul tău somn. Planul tău de 2 săptămâni va lucra cu punctele tale forte și va adresa zona în care mai ai spațiu de creștere — menținând rutinele excelente pe care le-ai construit deja.'
			],
			recommendedProductSlugs: ['masca-somn', 'ghid-seara-linistita'],
			sequenceKey: 'somn-v1',
			defaultCadence: 'weekly'
		},
		{
			key: 'matinal-suprasolicitat',
			match: { cronotip: { max: 6 }, igiena: { max: 5 } },
			name: 'Matinalul suprasolicitat',
			teaser:
				'Ești o fire de dimineață, dar stilul de viață modern îți sabotează somnul — ești obosit nu pentru că nu dormi destul, ci pentru că nu dormi bine.',
			fullAdvice: [
				'Ca matinal suprasolicitat, ai un avantaj natural enorm: corpul tău este programat să funcționeze exact cum vrea societatea — dimineața devreme. Problema nu este ceasul tău biologic, ci obiceiurile care îți perturbă somnul profund și restaurator.',
				'Cel mai important factor pentru tine este consistența programului de somn. Ca persoană de dimineață, corpul tău se trezește natural devreme — dar dacă te culci târziu în weekend sau ai rutine nocturne haotice, acumulezi "datorie de somn" care îți afectează performanța și starea de bine.',
				'Ecranele înainte de culcare sunt deosebit de dăunătoare pentru matinalii suprasolicitați. Tu ai nevoie de mai multă melatonină seara decât bufnițele, pentru că vrei să adormi mai devreme. Lumina albastră îți întârzie producția de melatonină tocmai când ai cel mai mult nevoie de ea.',
				'Gestionarea stresului este crucială pentru tine. Matinalii tind să acumuleze tensiuni pe parcursul zilei; seara, creierul "procesează" problemele exact când ar trebui să se relaxeze. Încearcă să îți rezervi 15 minute seara pentru a scrie într-un jurnal sau a-ți lista sarcinile pentru a doua zi — eliberezi mintea de griji.',
				'Dormitorul tău merită o atenție specială: verifică dacă temperatura, lumina și zgomotul sunt optime. Ca persoană care se trezește natural devreme, ești vulnerabil la lumina de dimineață — perdelele opace pot face o diferență remarcabilă în calitatea ultimelor ore de somn.',
				'Planul tău personalizat va pune accent pe crearea unui ritual de seară potrivit pentru tine, pe gestionarea stresului pre-somn și pe optimizarea mediului de somn — toate lucruri pe care le poți implementa începând de diseară.'
			],
			recommendedProductSlugs: ['masca-somn', 'ghid-seara-linistita'],
			sequenceKey: 'somn-v1',
			defaultCadence: 'weekly'
		},
		{
			key: 'dormitor-echilibrat',
			match: {},
			name: 'Dormitorul echilibrat',
			teaser:
				'Ai un profil de somn echilibrat cu obiceiuri bune — ești mai aproape decât crezi de somnul ideal.',
			fullAdvice: [
				'Ești un dormitor echilibrat — adică ai atât un program de somn relativ consistent, cât și obiceiuri de igienă a somnului rezonabil de bune. Aceasta este o fundație excelentă pe care să construim.',
				'Chiar dacă somnul tău este mai bun decât media, există mereu spațiu pentru optimizare. Cercetările arată că chiar și o îmbunătățire de 20% în calitatea somnului se traduce în creșteri semnificative de energie, concentrare și rezistență la stres.',
				'Focusul tău principal ar trebui să fie pe adâncimea somnului, nu pe durata lui. Somnul profund (etapele 3-4 NREM) este cel care repară corpul, consolidează memoria și reîncarcă sistemul imunitar. Poți îmbunătăți somnul profund prin exerciții fizice regulate (dar nu seara târziu), temperatură optimă în dormitor și evitarea alcoolului.',
				'Somnul de prânz strategic poate fi un instrument puternic: 20 de minute între ora 13:00 și 15:00 îmbunătățesc performanța cognitivă fără a afecta somnul nocturn. Dacă simți că obosești după-amiaza, încearcă să valorifici această fereastră naturală.',
				'Nutriția și somnul sunt mai legate decât se crede. Magneziul (din semințe de dovleac, spanac, nuci) ajută relaxarea musculară și îmbunătățește calitatea somnului. Evită cafeina după ora 14:00 — are un timp de înjumătățire de 5-6 ore și poate perturba somnul chiar dacă nu simți efectele imediat.',
				'Planul tău de 2 săptămâni va construi pe baza excelentă pe care o ai deja, adăugând câteva tehnici avansate care să optimizeze calitatea somnului tău. Micile ajustări, aplicate consecvent, fac diferența mare pe termen lung.'
			],
			recommendedProductSlugs: ['masca-somn', 'ghid-seara-linistita'],
			sequenceKey: 'somn-v1',
			defaultCadence: 'weekly'
		}
	]
} satisfies QuizDefinition;
