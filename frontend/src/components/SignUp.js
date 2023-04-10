import { useState } from "react";

function SignUp() {
	const [id, setId] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await fetch("http://localhost:3001/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify({ id, password, name }),
		});

		if (response.ok) {
			alert("Account created successfully");
		} else {
			alert("Error creating account");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Sign Up</h2>
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
			<input
				type="text"
				placeholder="Name (optional)"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<button type="submit">Sign Up</button>
		</form>
	);
}

export default SignUp;
