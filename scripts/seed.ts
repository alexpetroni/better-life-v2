process.loadEnvFile();
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products } from '../src/lib/server/db/schema.js';
import { sql } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const db = drizzle(client, { schema: { products } });

const seedProducts = [
	{
		slug: 'masca-somn',
		name: 'Mască de somn premium',
		description:
			'Mască de somn din mătase naturală cu fixare reglabilă și inserție de memorie. Blochează 99% din lumina ambientală, ideal pentru cei care dorm în schimburi sau în camere luminoase. Confortabilă toată noaptea, fără presiune pe ochi.',
		price_cents: 8900,
		type: 'physical',
		topic: 'somn',
		digital_file_key: null,
		image_url: '/images/products/masca-somn.svg',
		active: true
	},
	{
		slug: 'ghid-seara-linistita',
		name: 'Ghid: Seara liniștită — rutina de somn în 14 zile',
		description:
			'Ghid PDF de 42 de pagini cu un program pas-cu-pas de 14 zile pentru a-ți construi o rutină de seară eficientă. Include liste de verificare zilnice, tehnici de relaxare și sfaturi personalizate pe profil de somn. Descărcare instantă după comandă.',
		price_cents: 4900,
		type: 'digital',
		topic: 'somn',
		digital_file_key: 'ghid-seara-linistita.pdf',
		image_url: '/images/products/ghid-seara-linistita.svg',
		active: true
	},
	{
		slug: 'jurnal-obiceiuri',
		name: 'Jurnalul obiceiurilor — 90 de zile',
		description:
			'Jurnal fizic cu copertă rigidă și hârtie de calitate superioară pentru 90 de zile de construire a obiceiurilor. Include secțiuni de reflecție săptămânală, pagini de vizualizare a progresului și ghid introductiv bazat pe știința comportamentului.',
		price_cents: 7500,
		type: 'physical',
		topic: 'obiceiuri',
		digital_file_key: null,
		image_url: '/images/products/jurnal-obiceiuri.svg',
		active: true
	},
	{
		slug: 'curs-obiceiuri-mici',
		name: 'Curs: Obiceiuri mici, schimbări mari',
		description:
			'Curs video online de 6 module cu manual PDF inclus, bazat pe metoda habit stacking și principiile neuroștiinței comportamentale. Vei învăța cum să construiești obiceiuri care durează, chiar și cu un program aglomerat. Acces digital pe viață.',
		price_cents: 9900,
		type: 'digital',
		topic: 'obiceiuri',
		digital_file_key: 'curs-obiceiuri-mici.pdf',
		image_url: '/images/products/curs-obiceiuri-mici.svg',
		active: true
	},
	{
		slug: 'dopuri-urechi-somn',
		name: 'Dopuri de urechi pentru somn',
		description:
			'Set de dopuri din spumă cu memorie moale, atenuare de 32 dB, special concepute pentru somn lateral. Blochează sforăitul partenerului, traficul și zgomotele de apartament fără disconfort în ureche. Include cutie de transport și 3 perechi de schimb.',
		price_cents: 3900,
		type: 'physical',
		topic: 'somn',
		digital_file_key: null,
		image_url: '/images/products/dopuri-urechi-somn.svg',
		active: true
	},
	{
		slug: 'lampa-rasarit',
		name: 'Lampă cu simulare de răsărit',
		description:
			'Ceas deșteptător cu lumină care crește gradual timp de 30 de minute, imitând răsăritul, pentru o trezire naturală fără alarmă agresivă. 20 de niveluri de luminozitate, sunete naturale și mod de apus pentru seara. Te ajută să te trezești odihnit.',
		price_cents: 16900,
		type: 'physical',
		topic: 'somn',
		digital_file_key: null,
		image_url: '/images/products/lampa-rasarit.svg',
		active: true
	},
	{
		slug: 'ceai-seara',
		name: 'Ceai de seară pentru somn liniștit',
		description:
			'Amestec de plante fără cofeină — valeriană, mușețel, lavandă și roiniță — atent dozat pentru a susține relaxarea de seară. 30 de plicuri biodegradabile, ingrediente 100% naturale, fără arome artificiale. Ritualul perfect cu o oră înainte de culcare.',
		price_cents: 4500,
		type: 'physical',
		topic: 'somn',
		digital_file_key: null,
		image_url: '/images/products/ceai-seara.svg',
		active: true
	},
	{
		slug: 'audio-somn-profund',
		name: 'Program audio: Somn profund',
		description:
			'Colecție digitală de 12 peisaje sonore și meditații ghidate (zgomot roz, ploaie, frecvențe delta, body scan) pentru adormire rapidă și somn neîntrerupt. Peste 8 ore de audio de înaltă calitate, descărcabile pentru ascultare offline. Acces pe viață.',
		price_cents: 5900,
		type: 'digital',
		topic: 'somn',
		digital_file_key: 'audio-somn-profund.zip',
		image_url: '/images/products/audio-somn-profund.svg',
		active: true
	},
	{
		slug: 'planner-perete-obiceiuri',
		name: 'Planner de perete pentru obiceiuri',
		description:
			'Poster reutilizabil pentru urmărirea a până la 8 obiceiuri pe parcursul a 12 săptămâni. Suprafață lavabilă pentru marker, design minimalist care arată bine pe orice perete și marker inclus. Vizualizarea progresului direct pe perete crește consecvența.',
		price_cents: 5500,
		type: 'physical',
		topic: 'obiceiuri',
		digital_file_key: null,
		image_url: '/images/products/planner-perete-obiceiuri.svg',
		active: true
	},
	{
		slug: 'carduri-obiceiuri',
		name: 'Carduri de obiceiuri — 60 de idei',
		description:
			'Set de 60 de carduri cu micro-obiceiuri gata de aplicat, organizate pe categorii: sănătate, productivitate, relații, minte. Fiecare card include obiceiul de 2 minute și ancora sugerată. Trage un card, lipește-l pe frigider, aplică-l azi.',
		price_cents: 4200,
		type: 'physical',
		topic: 'obiceiuri',
		digital_file_key: null,
		image_url: '/images/products/carduri-obiceiuri.svg',
		active: true
	},
	{
		slug: 'ghid-dimineata',
		name: 'Ghid: Dimineața perfectă',
		description:
			'Ghid PDF de 28 de pagini pentru a-ți construi o rutină de dimineață care îți dă energie și claritate. Include 5 șabloane de rutină pentru programe diferite, lista celor mai eficiente obiceiuri matinale și un plan de implementare pe 21 de zile. Descărcare instantă.',
		price_cents: 4900,
		type: 'digital',
		topic: 'obiceiuri',
		digital_file_key: 'ghid-dimineata.pdf',
		image_url: '/images/products/ghid-dimineata.svg',
		active: true
	}
];

for (const product of seedProducts) {
	await db
		.insert(products)
		.values(product)
		.onConflictDoUpdate({
			target: products.slug,
			set: {
				name: sql`excluded.name`,
				description: sql`excluded.description`,
				price_cents: sql`excluded.price_cents`,
				type: sql`excluded.type`,
				topic: sql`excluded.topic`,
				digital_file_key: sql`excluded.digital_file_key`,
				image_url: sql`excluded.image_url`,
				active: sql`excluded.active`
			}
		});
	console.log(`Upserted: ${product.slug}`);
}

console.log('Seed complete.');
await client.end();
process.exit(0);
