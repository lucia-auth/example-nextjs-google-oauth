import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "./components";
import { globalGETRateLimit } from "@/lib/server/request";

export default function Page() {
	if (!globalGETRateLimit()) {
		return "Too many requests";
	}
	const { user } = getCurrentSession();
	if (user === null) {
		return redirect("/login");
	}
	return (
		<>
			<h1>Hi, {user.name}!</h1>
			<img src={user.picture} height="100px" width="100px" alt="profile" />
			<p>Email: {user.email}</p>
			<LogoutButton />
		</>
	);
}
