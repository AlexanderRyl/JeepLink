export function initLedger() {
  const inputs = document.querySelectorAll(".ledger-input");
  const resultDisplay = document.getElementById("take-home-pay");

  if (!inputs.length || !resultDisplay) return;

  function calculate() {
    // Get values (default to 0 if empty)
    const totalFare =
      parseFloat(document.getElementById("fare-input").value) || 0;
    const fuelCost =
      parseFloat(document.getElementById("fuel-input").value) || 0;
    const boundary =
      parseFloat(document.getElementById("boundary-input").value) || 0;

    // The Math
    const takeHome = totalFare - (fuelCost + boundary);

    // Update UI
    resultDisplay.innerText = `₱ ${takeHome.toLocaleString()}`;

    // Color Logic (Red if negative, Green if positive)
    if (takeHome < 0) {
      resultDisplay.style.color = "#ef4444";
    } else {
      resultDisplay.style.color = "#22c55e";
    }
  }

  // Listen to every keystroke
  inputs.forEach((input) => {
    input.addEventListener("input", calculate);
  });
}
