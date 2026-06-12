<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="Politica de confidențialitate" description="Cum colectăm, utilizăm și protejăm datele tale personale pe Viață Mai Bună." />

<div class="max-w-3xl mx-auto px-4 py-16">
	<div class="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
		⚠️ <strong>Draft</strong> — acest document necesită revizuire juridică înainte de lansare.
	</div>

	<h1 class="text-3xl font-bold text-gray-900 mb-8">Politica de confidențialitate</h1>

	<div class="prose prose-gray max-w-none space-y-8 text-gray-600">
		<p>
			Această politică descrie cum Viață Mai Bună (<em>viatamaibuna.ro</em>) colectează, utilizează
			și protejează datele tale personale. Ultima actualizare: iunie 2026.
		</p>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">1. Ce date colectăm</h2>
			<ul class="list-disc pl-6 space-y-2">
				<li>
					<strong>Adresa de email</strong> — furnizată de tine la completarea unui test sau la
					abonarea la newsletter. Folosită pentru trimiterea rezultatelor, a sfaturilor personalizate
					și a comunicărilor periodice.
				</li>
				<li>
					<strong>Răspunsurile la teste</strong> — răspunsurile pe care le alegi la testele de
					autoevaluare, utilizate exclusiv pentru calculul profilului tău și al recomandărilor.
				</li>
				<li>
					<strong>Datele comenzilor</strong> — adresa de livrare, produsele achiziționate, valoarea
					totală. Datele de card sunt procesate exclusiv de Stripe și nu sunt stocate de noi.
				</li>
				<li>
					<strong>Date tehnice</strong> — adresa IP (anonimizată), tipul de dispozitiv/browser,
					paginile vizitate (prin analize cookieless). Nu utilizăm cookies de tracking sau
					retargeting.
				</li>
			</ul>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">2. Temeiul juridic</h2>
			<p>
				Prelucrăm datele tale pe baza <strong>consimțământului explicit</strong> pe care îl exprimi
				la completarea formularului de email. Poți retrage consimțământul în orice moment prin
				dezabonare. Comenzile sunt procesate pe baza <strong>executării contractului</strong>.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">3. Cum utilizăm datele</h2>
			<ul class="list-disc pl-6 space-y-2">
				<li>Trimiterea rezultatelor testului și a planului personalizat pe email</li>
				<li>Emailuri de urmărire cu sfaturi practice (serie limitată, conform preferințelor tale)</li>
				<li>Campanii periodice de conținut (conform frecvenței pe care o alegi: săptămânal sau lunar)</li>
				<li>Procesarea și livrarea comenzilor</li>
				<li>Îmbunătățirea produselor și a conținutului site-ului (date agregate, fără identificare)</li>
			</ul>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">4. Parteneri și terți</h2>
			<p>Nu vindem datele tale. Le partajăm doar cu:</p>
			<ul class="list-disc pl-6 space-y-1 mt-2">
				<li><strong>Resend</strong> — serviciul de trimitere email (date: adresă email, conținut email)</li>
				<li><strong>Stripe</strong> — procesator de plăți (date: email, adresă livrare, detalii comandă)</li>
				<li><strong>Neon / Vercel</strong> — infrastructură cloud (stocare date și găzduire aplicație, UE)</li>
			</ul>
			<p class="mt-2">Toți partenerii sunt conformi GDPR.</p>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">5. Retenție date</h2>
			<ul class="list-disc pl-6 space-y-1">
				<li><strong>Abonați email</strong> — pe durata abonamentului activ; șterse la cerere sau după 2 ani de inactivitate</li>
				<li><strong>Rezultate teste</strong> — asociate abonamentului; șterse odată cu acesta</li>
				<li><strong>Date comenzi</strong> — 5 ani (obligație fiscală legală)</li>
			</ul>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">6. Drepturile tale</h2>
			<p>Conform GDPR, ai dreptul la:</p>
			<ul class="list-disc pl-6 space-y-1 mt-2">
				<li><strong>Acces</strong> — să știi ce date deținem despre tine</li>
				<li><strong>Rectificare</strong> — corectarea datelor inexacte</li>
				<li><strong>Ștergere</strong> — eliminarea datelor („dreptul de a fi uitat")</li>
				<li><strong>Portabilitate</strong> — exportul datelor tale</li>
				<li><strong>Opoziție</strong> — împotriva prelucrării în scop de marketing</li>
				<li><strong>Retragerea consimțământului</strong> — fără a afecta prelucrările anterioare</li>
			</ul>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">7. Dezabonare</h2>
			<p>
				Poți te dezabona în orice moment cu un singur click din linkul din orice email primit de la noi.
				Dezabonarea oprește imediat toate emailurile de marketing; datele comenzilor sunt păstrate
				conform obligațiilor legale.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">8. Contact și reclamații</h2>
			<p>
				Pentru exercitarea drepturilor sau orice întrebări legate de date personale:
				<a href="mailto:salut@viatamaibuna.example" class="text-brand-600 hover:underline">salut@viatamaibuna.example</a>
			</p>
			<p class="mt-2">
				Dacă nu ești mulțumit de răspunsul nostru, poți depune o plângere la
				<strong>ANSPDCP</strong> (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal),
				<a href="https://www.dataprotection.ro" class="text-brand-600 hover:underline" rel="noopener noreferrer" target="_blank">www.dataprotection.ro</a>.
			</p>
		</section>
	</div>
</div>
