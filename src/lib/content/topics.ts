export interface Topic {
	slug: string;
	name: string;
	emoji: string;
	tagline: string;
	quizSlug?: string;
}

export const topics: Topic[] = [
	{
		slug: 'somn',
		name: 'Better Sleep',
		emoji: '😴',
		tagline: 'Descoperă obiceiurile care îți îmbunătățesc somnul și energia de zi cu zi.',
		quizSlug: 'somn'
	},
	{
		slug: 'obiceiuri',
		name: 'Better Habits',
		emoji: '✨',
		tagline: 'Construiește rutine sănătoase care durează și transformă-ți viața pas cu pas.',
		quizSlug: 'obiceiuri'
	}
];

export function getTopic(slug: string): Topic | undefined {
	return topics.find((t) => t.slug === slug);
}
