/**
 * Simple in-memory rate limiter untuk form actions
 */

interface RateLimitRecord {
	count: number;
	resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Bersihkan data lama setiap 15 menit
setInterval(() => {
	const now = Date.now();
	for (const [key, record] of rateLimitMap.entries()) {
		if (record.resetAt <= now) {
			rateLimitMap.delete(key);
		}
	}
}, 15 * 60 * 1000);

/**
 * Memeriksa apakah session melebihi batas request
 * @param key identifier unik (mis. sessionId:action)
 * @param limit batas maksimal request dalam jendela waktu
 * @param windowMs durasi jendela waktu dalam milidetik (default 60 detik)
 */
export function checkRateLimit(
	key: string,
	limit = 20,
	windowMs = 60 * 1000
): { allowed: boolean; remaining: number } {
	const now = Date.now();
	const record = rateLimitMap.get(key);

	if (!record || record.resetAt <= now) {
		rateLimitMap.set(key, {
			count: 1,
			resetAt: now + windowMs
		});
		return { allowed: true, remaining: limit - 1 };
	}

	if (record.count >= limit) {
		return { allowed: false, remaining: 0 };
	}

	record.count += 1;
	return { allowed: true, remaining: limit - record.count };
}
