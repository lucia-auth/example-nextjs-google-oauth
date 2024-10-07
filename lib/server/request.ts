import { headers } from "next/headers";
import { TokenBucket } from "./rate-limit";

export const globalBucket = new TokenBucket<string>(100, 1);

export function globalGETRateLimit(): boolean {
	// Note: Assumes X-Forwarded-For will always be defined.
	const clientIP = headers().get("X-Forwarded-For");
	if (clientIP === null) {
		return true;
	}
	return globalBucket.consume(clientIP, 1);
}


export function globalPOSTRateLimit(): boolean {
	// Note: Assumes X-Forwarded-For will always be defined.
	const clientIP = headers().get("X-Forwarded-For");
	if (clientIP === null) {
		return true;
	}
	return globalBucket.consume(clientIP, 3);
}

