const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (const select of dropdowns) {
    for (const currCode in countryList) {
        const newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "PKR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    // Add event listener for flag updates
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to update flag based on selected currency
const updateFlag = (element) => {
    const currCode = element.value;
    const countryCode = countryList[currCode];
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    const img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Exchange rate button event listener
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    const amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    msg.innerText = "Getting exchange rate...";

    try {
        const URL = `${BASE_URL}/${fromCurr.value}`;
        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();
        const rate = data.rates[toCurr.value];

        if (!rate) {
            throw new Error("Exchange rate not found");
        }

        const finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Error fetching exchange rate. Please try again.";
    }
});

// Initialize flags on page load
window.addEventListener("load", () => {
    updateFlag(fromCurr);
    updateFlag(toCurr);
});