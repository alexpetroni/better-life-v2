export type Cadence = 'weekly' | 'monthly' | 'none';

export interface QuizOption {
	id: string;
	label: string;
	weights: Record<string, number>;
}

export interface QuizQuestion {
	id: string;
	text: string;
	options: QuizOption[];
}

export interface QuizProfile {
	key: string;
	match: Partial<Record<string, { min?: number; max?: number }>>;
	name: string;
	teaser: string;
	fullAdvice: string[];
	recommendedProductSlugs: string[];
	sequenceKey: string;
	defaultCadence: Cadence;
}

export interface QuizDefinition {
	slug: string;
	version: number;
	topic: string;
	locale: 'ro';
	title: string;
	description: string;
	dimensions: string[];
	questions: QuizQuestion[];
	profiles: QuizProfile[];
}
