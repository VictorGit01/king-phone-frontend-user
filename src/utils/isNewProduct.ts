export type TimestampLike =
	| string
	| number
	| Date
	| {
			_seconds?: number;
			seconds?: number;
			toMillis?: () => number;
			toDate?: () => Date;
		}
	| null
	| undefined;

export function parseDate(value: TimestampLike): Date | null {
	if (!value) return null;

	if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

	if (typeof value === 'string') {
		const d = new Date(value);
		return isNaN(d.getTime()) ? null : d;
	}

	if (typeof value === 'number') {
		// heurística: timestamps em segundos são pequenos
		const ms = value < 10_000_000_000 ? value * 1000 : value;
		const d = new Date(ms);
		return isNaN(d.getTime()) ? null : d;
	}

	if (typeof value === 'object') {
		if (typeof value.toMillis === 'function') {
			const d = new Date(value.toMillis());
			return isNaN(d.getTime()) ? null : d;
		}

		if (typeof value.toDate === 'function') {
			const d = value.toDate();
			return d instanceof Date && !isNaN(d.getTime()) ? d : null;
		}

		const seconds =
			typeof value._seconds === 'number'
				? value._seconds
				: typeof value.seconds === 'number'
					? value.seconds
					: null;

		if (seconds !== null) {
			const d = new Date(seconds * 1000);
			return isNaN(d.getTime()) ? null : d;
		}
	}

	return null;
}

/**
 * Considera um produto "novo" se foi criado nos últimos `days` dias.
 * - Se não houver createdAt, retorna false (não marca como novo por engano).
 */
export function isNewProduct(createdAt: TimestampLike, days = 5): boolean {
	const created = parseDate(createdAt);
	if (!created) return false;

	const now = Date.now();
	const diffMs = now - created.getTime();

	// se a data estiver no futuro (clock errado), não marcar como novo
	if (diffMs < 0) return false;

	const daysMs = days * 24 * 60 * 60 * 1000;
	return diffMs <= daysMs;
}

