import React from "react";
function App() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetch("/hello")
            .then((res) => res.json())
            .then((data) => setData(data.message));
    }, []);

    return (
      <h1>
          <p>{!data ? "Loading..." : data}</p>
      </h1>
  );
}

export default App;
