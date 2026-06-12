import type { QuizDefinition } from '$lib/quiz/types.js';

export const obiceiuriQuiz: QuizDefinition = {
	slug: 'obiceiuri',
	version: 1,
	topic: 'obiceiuri',
	locale: 'ro',
	title: 'Ce tip de constructor de obiceiuri ești?',
	description: 'Descoperă-ți profilul de formare a obiceiurilor și primește un plan personalizat de 2 săptămâni.',
	dimensions: ['consecventa', 'mediu'],
	questions: [
		{
			id: 'q1',
			text: 'Când începi un obicei nou, cât de des reușești să-l menții în prima săptămână?',
			options: [
				{ id: 'q1a', label: 'Aproape zilnic — sunt disciplinat la început', weights: { consecventa: 3 } },
				{ id: 'q1b', label: 'De 4-5 ori din 7 — destul de bine', weights: { consecventa: 2 } },
				{ id: 'q1c', label: 'De 2-3 ori — îmi este greu să fiu constant', weights: { consecventa: 1 } },
				{ id: 'q1d', label: 'Mai puțin de 2 ori — renunț rapid', weights: { consecventa: 0 } }
			]
		},
		{
			id: 'q2',
			text: 'Cum reacționezi când ratezi o zi din obiceiul tău?',
			options: [
				{ id: 'q2a', label: 'Reiau a doua zi fără stres — un pas înapoi nu contează', weights: { consecventa: 3 } },
				{ id: 'q2b', label: 'Mă recuperez, dar mă simt vinovat', weights: { consecventa: 2 } },
				{ id: 'q2c', label: 'Rar reiau — o zi lipsă mă demoralizează', weights: { consecventa: 1 } },
				{ id: 'q2d', label: 'De obicei abandonez după prima zi lipsă', weights: { consecventa: 0 } }
			]
		},
		{
			id: 'q3',
			text: 'Cât de des reușești să menții un obicei dincolo de prima lună?',
			options: [
				{ id: 'q3a', label: 'Aproape întotdeauna — obiceiurile mele devin parte din rutină', weights: { consecventa: 3 } },
				{ id: 'q3b', label: 'Uneori — depinde de obicei și de perioadă', weights: { consecventa: 2 } },
				{ id: 'q3c', label: 'Rar — trec prin cicluri de start și stop', weights: { consecventa: 1 } },
				{ id: 'q3d', label: 'Aproape niciodată — o lună este maximul meu', weights: { consecventa: 0 } }
			]
		},
		{
			id: 'q4',
			text: 'Câte obiceiuri noi încerci să introduci simultan, de obicei?',
			options: [
				{ id: 'q4a', label: 'Unul singur — știu că e mai ușor de menținut', weights: { consecventa: 3 } },
				{ id: 'q4b', label: 'Doi-trei — încerc să mă îmbunătățesc în mai multe zone', weights: { consecventa: 2 } },
				{ id: 'q4c', label: 'Patru sau mai multe — vrei totul dintr-odată', weights: { consecventa: 0 } },
				{ id: 'q4d', label: 'Depinde — uneori unul, uneori mai mulți', weights: { consecventa: 1 } }
			]
		},
		{
			id: 'q5',
			text: 'Cât de mult influențează mediul tău (spațiu, oameni, rutine) succesul obiceiurilor?',
			options: [
				{ id: 'q5a', label: 'Mult — mi-am adaptat mediul deliberat pentru obiceiuri', weights: { mediu: 3 } },
				{ id: 'q5b', label: 'Destul de mult — fac unele ajustări când este posibil', weights: { mediu: 2 } },
				{ id: 'q5c', label: 'Puțin — nu m-am gândit la asta până acum', weights: { mediu: 1 } },
				{ id: 'q5d', label: 'Deloc — vointra trebuie să fie suficientă', weights: { mediu: 0 } }
			]
		},
		{
			id: 'q6',
			text: 'Ai un spațiu dedicat pentru activitățile tale importante (sport, citit, meditație)?',
			options: [
				{ id: 'q6a', label: 'Da, am organizat spații specifice pentru fiecare activitate', weights: { mediu: 3 } },
				{ id: 'q6b', label: 'Parțial — am un loc pentru 1-2 activități', weights: { mediu: 2 } },
				{ id: 'q6c', label: 'Nu prea — fac totul unde nimeresc', weights: { mediu: 1 } },
				{ id: 'q6d', label: 'Nu — nu cred că spațiul contează', weights: { mediu: 0 } }
			]
		},
		{
			id: 'q7',
			text: 'Persoanele din jurul tău susțin obiceiurile tale sănătoase?',
			options: [
				{ id: 'q7a', label: 'Da, am persoane care mă încurajează activ', weights: { mediu: 3 } },
				{ id: 'q7b', label: 'Parțial — unele persoane ajută, altele nu', weights: { mediu: 2 } },
				{ id: 'q7c', label: 'Nu în mod special — fac asta singur', weights: { mediu: 1 } },
				{ id: 'q7d', label: 'Nu — uneori simt chiar rezistență', weights: { mediu: 0 } }
			]
		},
		{
			id: 'q8',
			text: 'Ai "declanșatoare" clare care semnalează momentul obiceiului (ex: după cafea, înainte de duș)?',
			options: [
				{ id: 'q8a', label: 'Da, fiecare obicei are un declanșator clar', weights: { mediu: 3 } },
				{ id: 'q8b', label: 'Pentru câteva obiceiuri — nu pentru toate', weights: { mediu: 2 } },
				{ id: 'q8c', label: 'Rar — încerc să-mi amintesc singur', weights: { mediu: 1 } },
				{ id: 'q8d', label: 'Nu — nu știam că asta e important', weights: { mediu: 0 } }
			]
		}
	],
	profiles: [
		{
			key: 'constructor-constant',
			match: {
				consecventa: { min: 7 },
				mediu: { min: 7 }
			},
			name: 'Constructorul constant',
			teaser: 'Ai atât consistența cât și mediul optimizat — ești pregătit pentru schimbări profunde și durabile.',
			fullAdvice: [
				'Focusul tău: scalare. Obiceiurile tale funcționează — acum este momentul să le faci mai profunde și mai interconectate.',
				'Construiește "stive de obiceiuri": leagă 3-4 obiceiuri succesive în aceeași sesiune de timp.',
				'Ajutor pentru alții: partajează metodele tale cu cineva din jurul tău. Predând, consolidezi.',
				'Risc principal: plafonarea. Introduceți ocazional provocări noi pentru a menține creșterea.'
			],
			recommendedProductSlugs: ['jurnal-obiceiuri', 'curs-obiceiuri-mici'],
			sequenceKey: 'obiceiuri-v1',
			defaultCadence: 'weekly'
		},
		{
			key: 'perfectionist-blocat',
			match: {
				consecventa: { max: 6 },
				mediu: { min: 7 }
			},
			name: 'Perfectionistul blocat',
			teaser: 'Mediul tău este bine pregătit, dar consistența este problema. Știi ce să faci — problema este să menții.',
			fullAdvice: [
				'Problema ta principală: așteptările prea mari. Înlocuiești "voi face 20 de minute" cu "voi face 2 minute" și crește gradual.',
				'Iartă-te rapid pentru ratări. O zi lipsă nu înseamnă eșec — înseamnă un eveniment izolat.',
				'Folosește jurnalul de obiceiuri ca oglindă, nu ca judecător. Urmărește seria, nu perfecțiunea.',
				'Risc principal: ciclul perfectionism-abandon. Recalibrează așteptările în jos.'
			],
			recommendedProductSlugs: ['jurnal-obiceiuri', 'curs-obiceiuri-mici'],
			sequenceKey: 'obiceiuri-v1',
			defaultCadence: 'weekly'
		},
		{
			key: 'incepator-entuziast',
			match: {
				consecventa: { min: 7 },
				mediu: { max: 6 }
			},
			name: 'Începătorul entuziast',
			teaser: 'Ești persistent, dar mediul tău lucrează împotriva ta. Câteva ajustări simple de mediu îți pot tripla succesul.',
			fullAdvice: [
				'Proiectează-ți mediul pentru obiceiuri: pune echipamentul de sport vizibil, cărțile pe noptieră.',
				'Creează declanșatoare clare: "după cafea de dimineață → citesc 10 minute".',
				'Găsește un partener de responsabilitate — chiar și un prieten virtual contează.',
				'Risc principal: voința ca strategie principală. Voința obosește; mediul nu.'
			],
			recommendedProductSlugs: ['jurnal-obiceiuri', 'curs-obiceiuri-mici'],
			sequenceKey: 'obiceiuri-v1',
			defaultCadence: 'weekly'
		},
		{
			key: 'explorator',
			match: {},
			name: 'Exploratorul',
			teaser: 'Ești la începutul călătoriei tale cu obiceiurile — și asta este perfect. Fundația se construiește acum.',
			fullAdvice: [
				'Începe cu un singur obicei mic — cel mai mic posibil. Regula de 2 minute.',
				'Alege un declanșator existent din ziua ta și ancorează obiceiul de el.',
				'Nu te compara cu alții. Ritmul tău este singurul ritm care contează.',
				'Urmărește progresul vizual: un calendar pe perete, o bulă colorată pentru fiecare zi reușită.'
			],
			recommendedProductSlugs: ['jurnal-obiceiuri', 'curs-obiceiuri-mici'],
			sequenceKey: 'obiceiuri-v1',
			defaultCadence: 'weekly'
		}
	]
} satisfies QuizDefinition;
