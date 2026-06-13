import { browser } from '$app/environment';

export interface CartItem {
	productId: string;
	slug: string;
	name: string;
	priceCents: number;
	type: 'physical' | 'digital';
	quantity: number;
}

function load(): CartItem[] {
	if (!browser) return [];
	try {
		const stored = localStorage.getItem('bl-cart');
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

function createCart() {
	let items = $state<CartItem[]>(load());

	// Persist explicitly after each mutation. We cannot use $effect here: this
	// module-level store is created outside any component, where effects are
	// orphaned (https://svelte.dev/e/effect_orphan).
	function persist() {
		if (!browser) return;
		try {
			localStorage.setItem('bl-cart', JSON.stringify(items));
		} catch {
			// ignore (private mode / quota)
		}
	}

	const totalCents = $derived(
		items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
	);

	function add(item: Omit<CartItem, 'quantity'>) {
		const idx = items.findIndex((i) => i.productId === item.productId);
		if (idx >= 0) {
			items[idx].quantity = Math.min(10, items[idx].quantity + 1);
		} else {
			items = [...items, { ...item, quantity: 1 }];
		}
		persist();
	}

	function remove(productId: string) {
		items = items.filter((i) => i.productId !== productId);
		persist();
	}

	function setQuantity(productId: string, quantity: number) {
		if (quantity < 1) {
			remove(productId);
			return;
		}
		items = items.map((i) =>
			i.productId === productId ? { ...i, quantity: Math.min(10, quantity) } : i
		);
		persist();
	}

	function clear() {
		items = [];
		persist();
	}

	return {
		get items() {
			return items;
		},
		get totalCents() {
			return totalCents;
		},
		add,
		remove,
		setQuantity,
		clear
	};
}

export const cart = createCart();
