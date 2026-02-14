function isFirefox() {
  return navigator.userAgent.toLowerCase().includes("firefox");
}
if (!isFirefox()) {
  alert("Im only working in Firefox!");
  return;
}

const errorElements = document.querySelectorAll(".error");
let currentIndex = -1; // initial index: -1 --> no error selected yet
let intervalId = null;
let intervalSpeed = 120; // Initial speed of error navigation (in milliseconds)
const minSpeed = 50; // Minimum speed of error navigation (in milliseconds)
const speedIncrement = 20; // Amount to decrease speed each time

if (errorElements.length === 0) {
  console.log("No Errors Found! :]");
  alert("No Errors Found! :]");
  return;
}
console.log(`${errorElements.length} Errors Found!`);

// Function to get scroll smoothly to error
function scrollToError(index) {
  if (index >= 0 && index < errorElements.length) {
    const element = errorElements[index];
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.style.border = "2px solid red"; // focus / mark element
    updateStatus();
  }
}

// Reset Highlight
function resetHighlight() {
  if (currentIndex >= 0 && currentIndex < errorElements.length) {
    errorElements[currentIndex].style.border = ""; // Remove highlight
  }
}

// Update Status
function updateStatus() {
  statusDiv.innerHTML = `Error ${currentIndex + 1} of ${errorElements.length}`;
}

// Start the error navigation at a specified interval
function startInterval(increment) {
  if (intervalId) return; // Prevent multiple intervals
  process();
  intervalId = setInterval(() => {
    process();
  }, intervalSpeed);
  function process() {
    resetHighlight();
    currentIndex =
      (currentIndex + increment + errorElements.length) % errorElements.length; // Increment index
    scrollToError(currentIndex);

    // Speed up navigation
    intervalSpeed = Math.max(intervalSpeed - speedIncrement, minSpeed);
  }
}

// Stop the error navigation
function stopInterval() {
  clearInterval(intervalId);
  intervalId = null;
  intervalSpeed = 120; // Reset speed
}

// Create status bar in browser GUI
const nextButton = document.createElement("button");
nextButton.innerText = "Next";
nextButton.style.position = "fixed";
nextButton.style.bottom = "20px";
nextButton.style.right = "20px";
nextButton.style.zIndex = "1000";

const prevButton = document.createElement("button");
prevButton.innerText = "Previous";
prevButton.style.position = "fixed";
prevButton.style.bottom = "20px";
prevButton.style.right = "80px";
prevButton.style.zIndex = "1000";

const statusDiv = document.createElement("div");
statusDiv.style.position = "fixed";
statusDiv.style.bottom = "60px";
statusDiv.style.right = "20px";
statusDiv.style.padding = "5px 10px";
statusDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
statusDiv.style.color = "white";
statusDiv.style.zIndex = "1000";
statusDiv.style.borderRadius = "5px";
statusDiv.style.fontFamily = "Arial, sans-serif";

document.body.appendChild(nextButton);
document.body.appendChild(prevButton);
document.body.appendChild(statusDiv);

// "Previous" click event
nextButton.addEventListener("mousedown", function () {
  startInterval(1); // Increment index
});

nextButton.addEventListener("mouseup", stopInterval);
nextButton.addEventListener("mouseleave", stopInterval); // Stop interval if mouse leaves button

// "Next" click event
prevButton.addEventListener("mousedown", function () {
  startInterval(-1); // Decrement index
});

prevButton.addEventListener("mouseup", stopInterval);
prevButton.addEventListener("mouseleave", stopInterval); // Stop interval if mouse leaves button

// Set initial state
updateStatus();

console.log("Click and hold the buttons to navigate through errors faster.");
