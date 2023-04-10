//SignIn.js
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";

function SignIn() {
	const [id, setId] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await fetch("http://localhost:3001/signin", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, password }),
		});

		if (response.ok) {
			const data = await response.json();
			const { token } = data;
			console.log(token)
			sessionStorage.setItem("sessionToken", token);
			const decodedToken = jwtDecode(token);
			const userID = decodedToken.id;
			sessionStorage.setItem("userID", userID);			alert("Signed in successfully");
			navigate("/main"); // Navigate to the main page
		} else {
			alert("Error signing in");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Sign In</h2>
			<input
				type="text"
				placeholder="Username"
				value={id}
				onChange={(e) => setId(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<button type="submit">Sign In</button>
		</form>
	);
}

export default SignIn;
