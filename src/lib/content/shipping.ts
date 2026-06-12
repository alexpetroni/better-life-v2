export interface ShippingTier {
	label: string;
	priceCents: number;
}

export const standardShipping: ShippingTier = {
	label: 'Curier standard (24–48h)',
	priceCents: 1500
};

export const FREE_SHIPPING_THRESHOLD_CENTS = 20000;
