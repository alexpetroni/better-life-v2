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
