import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";

export default function Page() {
    if (!globalGETRateLimit()) {
		return "Too many requests"
	}
    const { user } = getCurrentSession();
	if (user !== null) {
		return redirect("/");
	}
	return (
		<>
			<h1>Sign in</h1>
			<a href="/login/google">Sign in with Google</a>
		</>
	);
}
