import { useState } from "react";
import './css/Home.css';

function Home() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to the Book Club!</p>
            <p>Click the button to start counting</p>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
            </div>
        </div>
    );
}

export default Home;
