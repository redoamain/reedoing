import crypto from "crypto";
import { getAdminSettings } from "./db/queries";

const DEFAULT_SECRET = (process.env.ADMIN_PASSWORD || "admin123") + "-secret-reedoing-admin";

export async function getAdminCredentials(): Promise<{ user: string; password: string }> {
	try {
		const settings = await getAdminSettings();
		return {
			user: settings.admin_user?.trim() || process.env.ADMIN_USER?.trim() || "admin",
			password: settings.admin_password?.trim() || process.env.ADMIN_PASSWORD?.trim() || "admin123"
		};
	} catch {
		return {
			user: process.env.ADMIN_USER?.trim() || "admin",
			password: process.env.ADMIN_PASSWORD?.trim() || "admin123"
		};
	}
}

export async function verifyAdminCredentials(password: string, username?: string): Promise<boolean> {
	if (!password) return false;
	const creds = await getAdminCredentials();
	if (username && username.trim().toLowerCase() !== creds.user.toLowerCase()) {
		return false;
	}
	return password.trim() === creds.password.trim();
}

// Backwards-compatible alias
export async function verifyAdminPassword(password: string, username?: string): Promise<boolean> {
	return verifyAdminCredentials(password, username);
}

export function createAdminToken(user: string = "admin"): string {
	const timestamp = Date.now().toString();
	const hash = crypto.createHmac("sha256", DEFAULT_SECRET).update(`${user}.${timestamp}`).digest("hex");
	return `${user}.${timestamp}.${hash}`;
}

export function isValidAdminToken(token?: string | null): boolean {
	if (!token) return false;
	const parts = token.split(".");

	// Handle 3-part token: user.timestamp.hash
	if (parts.length === 3) {
		const [user, timestampStr, providedHash] = parts;
		const timestamp = parseInt(timestampStr, 10);
		if (isNaN(timestamp)) return false;

		const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
		if (Date.now() - timestamp > maxAgeMs) return false;

		try {
			const expectedHash = crypto.createHmac("sha256", DEFAULT_SECRET).update(`${user}.${timestampStr}`).digest("hex");
			return crypto.timingSafeEqual(Buffer.from(providedHash), Buffer.from(expectedHash));
		} catch {
			return false;
		}
	}

	// Handle legacy 2-part token: timestamp.hash
	if (parts.length === 2) {
		const [timestampStr, providedHash] = parts;
		const timestamp = parseInt(timestampStr, 10);
		if (isNaN(timestamp)) return false;

		const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
		if (Date.now() - timestamp > maxAgeMs) return false;

		try {
			// check with both legacy secret and new secret
			for (const secret of [DEFAULT_SECRET, (process.env.ADMIN_PASSWORD || "admin123") + "-secret-rupaka-admin"]) {
				const expectedHash = crypto.createHmac("sha256", secret).update(timestampStr).digest("hex");
				if (providedHash.length === expectedHash.length && crypto.timingSafeEqual(Buffer.from(providedHash), Buffer.from(expectedHash))) {
					return true;
				}
			}
		} catch {
			return false;
		}
	}

	return false;
}
