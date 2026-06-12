import { browser } from '$app/environment';

export interface CartItem {
	productId: string;
	slug: string;
	name: string;
	priceCents: number;
	type: 'physical' | 'digital';
	quantity: number;
}

function createCart() {
	let items = $state<CartItem[]>([]);

	if (browser) {
		try {
			const stored = localStorage.getItem('bl-cart');
			if (stored) items = JSON.parse(stored);
		} catch {
			// ignore
		}
	}

	$effect(() => {
		if (browser) {
			localStorage.setItem('bl-cart', JSON.stringify(items));
		}
	});

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
	}

	function remove(productId: string) {
		items = items.filter((i) => i.productId !== productId);
	}

	function setQuantity(productId: string, quantity: number) {
		if (quantity < 1) {
			remove(productId);
			return;
		}
		items = items.map((i) =>
			i.productId === productId ? { ...i, quantity: Math.min(10, quantity) } : i
		);
	}

	function clear() {
		items = [];
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
