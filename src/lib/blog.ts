export interface PostMetadata {
	title: string;
	description: string;
	topic: string;
	date: string;
	updated?: string;
	relatedProducts?: string[];
	quizCta?: string;
	draft?: boolean;
}

export interface Post {
	slug: string;
	metadata: PostMetadata;
}

export interface PostWithComponent extends Post {
	component: unknown;
}

const REQUIRED_FIELDS: (keyof PostMetadata)[] = ['title', 'description', 'topic', 'date'];

function validateMetadata(slug: string, metadata: Record<string, unknown>): PostMetadata {
	for (const field of REQUIRED_FIELDS) {
		if (!metadata[field]) {
			throw new Error(`Blog post "${slug}" is missing required frontmatter field: ${field}`);
		}
	}
	return metadata as unknown as PostMetadata;
}

function slugFromPath(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

// Single eager glob — blog posts are small enough to load all upfront
const allModules = import.meta.glob<{ default: unknown; metadata: Record<string, unknown> }>(
	'/src/content/blog/ro/**/*.md',
	{ eager: true }
);

export function getAllPosts(): Post[] {
	const posts: Post[] = [];

	for (const [path, mod] of Object.entries(allModules)) {
		const slug = slugFromPath(path);
		const metadata = validateMetadata(slug, mod.metadata ?? {});
		if (metadata.draft) continue;
		posts.push({ slug, metadata });
	}

	return posts.sort((a, b) => b.metadata.date.localeCompare(a.metadata.date));
}

export async function getPost(slug: string): Promise<PostWithComponent | null> {
	const entry = Object.entries(allModules).find(([path]) => slugFromPath(path) === slug);
	if (!entry) return null;

	const mod = entry[1];
	const metadata = validateMetadata(slug, mod.metadata ?? {});
	if (metadata.draft) return null;

	return { slug, metadata, component: mod.default };
}
