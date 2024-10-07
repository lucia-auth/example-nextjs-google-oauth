import { generateSessionToken, createSession, setSessionTokenCookie } from "@/lib/server/session";
import { google } from "@/lib/server/oauth";
import { cookies } from "next/headers";
import { createUser, getUserFromGoogleId } from "@/lib/server/user";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { globalGETRateLimit } from "@/lib/server/request";

import { decodeIdToken, type OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
	if (!globalGETRateLimit()) {
		return new Response("Too many requests", {
			status: 429
		});
	}
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies().get("google_oauth_state")?.value ?? null;
	const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response("Please restart the process.", {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response("Please restart the process.", {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch {
		return new Response("Please restart the process.", {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken());
	const claimsParser = new ObjectParser(claims);

	const googleId = claimsParser.getString("sub");
	const name = claimsParser.getString("name");
	const picture = claimsParser.getString("picture");
	const email = claimsParser.getString("email");

	const existingUser = getUserFromGoogleId(googleId);
	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	const user = createUser(googleId, email, name, picture);
	const sessionToken = generateSessionToken();
	const session = createSession(sessionToken, user.id);
	setSessionTokenCookie(sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}
