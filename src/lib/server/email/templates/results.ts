import type { QuizDefinition, QuizProfile } from '$lib/quiz/types.js';
import { emailLayout } from './layout.js';

interface ResultsEmailParams {
	quiz: QuizDefinition;
	profile: QuizProfile;
	confirmUrl: string;
	prefsUrl: string;
	unsubUrl: string;
}

export function resultsEmail(params: ResultsEmailParams): { subject: string; html: string } {
	const { quiz, profile, confirmUrl, prefsUrl, unsubUrl } = params;

	const subject = `Rezultatul tău: ${profile.name}`;

	const adviceParagraphs = profile.fullAdvice
		.map((p) => `<p style="margin:0 0 16px;">${p}</p>`)
		.join('');

	const bodyHtml = `
    <p style="margin:0 0 16px;">Bună ziua,</p>
    <p style="margin:0 0 16px;">Ai completat testul <strong>${quiz.title}</strong> și iată profilul tău:</p>

    <div style="background-color:#f0fdf4;border-left:4px solid #2d7a4f;padding:16px 20px;margin:0 0 24px;border-radius:0 4px 4px 0;">
      <h2 style="margin:0 0 8px;color:#166534;font-size:20px;">${profile.name}</h2>
      <p style="margin:0;color:#166534;font-size:15px;">${profile.teaser}</p>
    </div>

    <h3 style="margin:0 0 16px;color:#1f2937;font-size:17px;">Analiza completă a profilului tău:</h3>

    ${adviceParagraphs}

    <!-- CTA box -->
    <div style="background-color:#f0fdf4;border:2px solid #2d7a4f;border-radius:8px;padding:24px;margin:24px 0;text-align:center;">
      <h3 style="margin:0 0 8px;color:#166534;font-size:18px;">Vrei planul tău gratuit de 2 săptămâni?</h3>
      <p style="margin:0 0 16px;color:#374151;font-size:15px;">
        Confirmă adresa de email și primești un plan pas cu pas, adaptat profilului tău <strong>${profile.name}</strong>.
      </p>
      <a href="${confirmUrl}"
         style="display:inline-block;background-color:#2d7a4f;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:16px;font-weight:600;">
        Confirmă adresa mea de email
      </a>
      <p style="margin:12px 0 0;color:#9ca3af;font-size:12px;">
        Linkul este valabil 30 de zile. Nu îți trimitem spam.
      </p>
    </div>

    <p style="margin:0;color:#6b7280;font-size:14px;">
      Cu drag,<br />
      <strong>Echipa Better Life</strong>
    </p>
  `;

	return {
		subject,
		html: emailLayout({ title: subject, bodyHtml, footerLinks: { prefs: prefsUrl, unsub: unsubUrl } })
	};
}
