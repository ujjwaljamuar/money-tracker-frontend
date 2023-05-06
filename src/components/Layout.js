import React, { useState, useEffect } from "react";

import "./Layout.css";

const Layout = () => {
    const [name, setName] = useState("");
    const [datetime, setDatetime] = useState("");
    const [description, setDescription] = useState("");
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getTransaction().then(setTransactions);
    }, []);

    async function getTransaction() {
        const url = process.env.REACT_APP_API_URL + "/transactions";
        const response = await fetch(url);
        return await response.json();
    }

    function submitHandler(ev) {
        ev.preventDefault();
        const url = process.env.REACT_APP_API_URL + "/transaction";
        const price = name.split(" ")[0];
        fetch(url, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                name: name.substring(price.length + 1),
                price,
                description,
                datetime,
            }),
        }).then((response) => {
            response.json().then((json) => {
                setName("");
                setDatetime("");
                setDescription("");
                //console.log("result", json);

                // update the transactions state
                getTransaction().then(setTransactions);
            });
        });
    }

    let balance = 0;
    for (const transaction of transactions) {
        balance = balance + transaction.price;
    }

    balance = balance.toFixed(2);
    const fraction = balance.split(".")[1];
    balance = balance.split(".")[0];

    return (
        <main>
            <h1>
                ₹{balance}
                <span>.{fraction}</span>
            </h1>

            <form onSubmit={submitHandler}>
                <div className="basicInfo">
                    <input
                        type={"text"}
                        value={name}
                        onChange={(ev) => setName(ev.target.value)}
                        placeholder={"PRICE-NAME"}
                    />
                    <input
                        type={"datetime-local"}
                        value={datetime}
                        onChange={(ev) => setDatetime(ev.target.value)}
                    />
                </div>

                <div className="description">
                    <input
                        type={"text"}
                        value={description}
                        onChange={(ev) => setDescription(ev.target.value)}
                        placeholder={"description"}
                    />
                </div>

                <button type="submit">Add Transaction</button>
            </form>

            <div className="transactions">
                {transactions.length > 0 &&
                    transactions.map((transaction) => (
                        <div className="transaction" key={transaction._id}>
                            <div className="left">
                                <div className="name">{transaction.name}</div>
                                <div className="description">
                                    {transaction.description}
                                </div>
                            </div>
                            <div className="right">
                                <div
                                    className={
                                        "price " +
                                        (transaction.price > 0
                                            ? "green"
                                            : "red")
                                    }
                                >
                                    ₹{transaction.price}
                                </div>
                                <div className="datetime">
                                    {transaction.datetime}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </main>
    );
};

export default Layout;
