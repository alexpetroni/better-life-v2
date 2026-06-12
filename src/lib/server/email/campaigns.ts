import { env } from '$env/dynamic/private';
import { emailLayout } from './templates/layout.js';

export interface Campaign {
	id: string;
	audience: { profileKeys: string[] } | 'all';
	subject: string;
	bodyHtml: (ctx: { prefsUrl: string; unsubUrl: string }) => string;
	activeFrom: string; // 'YYYY-MM-DD', compared lexicographically
}

function siteUrl(): string {
	return (env.PUBLIC_SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');
}

export const campaigns: Campaign[] = [
	{
		id: 'somn-2026-06',
		audience: {
			profileKeys: [
				'bufnita-dezorganizata',
				'bufnita-disciplinata',
				'matinal-suprasolicitat',
				'dormitor-echilibrat'
			]
		},
		activeFrom: '2026-06-01',
		subject: '3 sfaturi pentru vara asta: dormit mai bine în căldură',
		bodyHtml: ({ prefsUrl, unsubUrl }) => {
			const site = siteUrl();
			return emailLayout({
				title: '3 sfaturi pentru un somn mai bun vara',
				bodyHtml: `
<p>Bună ziua,</p>
<p>Vara este una dintre cele mai provocatoare perioade pentru somn: căldura, lumina prelungită și programul schimbat ne dereglează ritmul circadian. Iată 3 sfaturi testate pentru această perioadă:</p>
<p><strong>1. Temperatura optimă vara: 18–20°C</strong><br/>
Dacă nu ai aer condiționat, un ventilator direcționat spre fereastră (suflând aerul afară, nu înăuntru) scade temperatura din cameră mai eficient decât unul care recirculă aerul interior.</p>
<p><strong>2. Lumina de seară — vara este mai agresivă</strong><br/>
Apusul tardiv înseamnă mai multă lumină albastră seara. Ajustează filtrele de lumină cu 30 de minute mai devreme față de rutina de iarnă. Perdelele opace sunt investiția cu cel mai mare impact vara.</p>
<p><strong>3. Hidratarea nocturnă</strong><br/>
Transpirația din somn te deshidratează. Un pahar mic de apă (nu rece) cu 30 minute înainte de culcare și unul lângă pat te ajută să eviți trezirile cauzate de senzația de sete.</p>
<p><strong>Produse recomandate pentru vara aceasta:</strong></p>
<p>
  <a href="${site}/shop/masca-somn" style="color:#2d7a4f;">Mască de somn premium →</a><br/>
  <a href="${site}/shop/ghid-seara-linistita" style="color:#2d7a4f;">Ghid: Seara liniștită (PDF) →</a>
</p>
<p>O vară cu somn bun,<br/>Echipa Viață Mai Bună</p>
				`,
				footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
			});
		}
	},
	{
		id: 'general-2026-06',
		audience: 'all',
		activeFrom: '2026-06-01',
		subject: 'Cele mai citite articole ale lunii — digest Viață Mai Bună',
		bodyHtml: ({ prefsUrl, unsubUrl }) => {
			const site = siteUrl();
			return emailLayout({
				title: 'Digest lunar — articolele lunii',
				bodyHtml: `
<p>Bună ziua,</p>
<p>Luna aceasta, cititorii noștri au descoperit aceste articole:</p>
<p><strong>🌙 1. De ce te trezești la 3 dimineața — și cum oprești ciclul</strong><br/>
Trezirile nocturne nu sunt întâmplătoare. Înțelege cauza ta principală.<br/>
<a href="${site}/blog/de-ce-te-trezesti-la-3-dimineata" style="color:#2d7a4f;">Citește articolul →</a></p>
<p><strong>☕ 2. Cofeina și somnul: ghidul practic</strong><br/>
Ce, când și cât: regula de 6 ore și variațiile genetice care schimbă totul.<br/>
<a href="${site}/blog/cofeina-si-somnul-ghid-practic" style="color:#2d7a4f;">Citește articolul →</a></p>
<p><strong>⏱️ 3. Regula celor 2 minute</strong><br/>
Cel mai simplu instrument pentru a porni orice obicei nou.<br/>
<a href="${site}/blog/regula-celor-2-minute" style="color:#2d7a4f;">Citește articolul →</a></p>
<p>Vrem să știm ce subiecte te interesează cel mai mult. Răspunde la acest email cu un subiect și îl vom acoperi în curând.</p>
<p>Cu drag,<br/>Echipa Viață Mai Bună</p>
				`,
				footerLinks: { prefs: prefsUrl, unsub: unsubUrl }
			});
		}
	}
];
