import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";

export function Home() {
	return (
		<div>
			<h1>Welcome to Wahhaj's chat website. Please sign in or sign up</h1>
			<SignUp />
			<SignIn />
		</div>
	);
}

export default Home;
