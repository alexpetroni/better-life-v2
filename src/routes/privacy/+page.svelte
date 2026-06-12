<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="Politica de confidențialitate" description="Cum colectăm, utilizăm și protejăm datele tale personale pe Viață Mai Bună." />

<div class="max-w-3xl mx-auto px-4 py-16">
	<div class="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
		⚠️ <strong>Draft</strong> — acest document necesită revizuire juridică înainte de lansare.
	</div>

	<h1 class="text-3xl font-bold text-gray-900 mb-8">Politica de confidențialitate</h1>

	<div class="prose prose-gray max-w-none space-y-6">
		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">Ce date colectăm</h2>
			<p class="text-gray-600">
				Colectăm următoarele date personale atunci când utilizezi serviciile noastre:
			</p>
			<ul class="list-disc pl-6 text-gray-600 space-y-1 mt-2">
				<li><strong>Adresa de email</strong> — folosită pentru trimiterea rezultatelor testelor și a sfaturilor personalizate</li>
				<li><strong>Răspunsurile la teste</strong> — folosite pentru calcularea profilului tău personalizat</li>
				<li><strong>Datele comenzilor</strong> — adresa de livrare și detaliile de plată (procesate de Stripe, nu stocăm date de card)</li>
			</ul>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">De ce colectăm aceste date</h2>
			<ul class="list-disc pl-6 text-gray-600 space-y-1">
				<li>Pentru a-ți trimite rezultatele testelor și planul personalizat pe email</li>
				<li>Pentru a personaliza conținutul și recomandările în funcție de profilul tău</li>
				<li>Pentru procesarea comenzilor din magazin</li>
				<li>Pentru comunicări periodice (numai cu acordul tău explicit)</li>
			</ul>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">Cum îți protejăm datele</h2>
			<p class="text-gray-600">
				Datele tale sunt stocate în sisteme securizate. Nu vindem și nu partajăm datele tale cu terți,
				cu excepția furnizorilor de servicii necesari (serviciu email, procesator de plăți).
			</p>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">Dezabonare și ștergerea datelor</h2>
			<p class="text-gray-600">
				Poți dezabona oricând cu un singur click din orice email primit de la noi. Pentru ștergerea
				completă a datelor, contactează-ne la <a href="mailto:salut@viatamaibuna.example" class="text-brand-600 hover:underline">salut@viatamaibuna.example</a>.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-3">Contact</h2>
			<p class="text-gray-600">
				Pentru orice întrebări legate de datele tale, ne poți contacta la:
				<a href="mailto:salut@viatamaibuna.example" class="text-brand-600 hover:underline">salut@viatamaibuna.example</a>
			</p>
		</section>
	</div>
</div>
