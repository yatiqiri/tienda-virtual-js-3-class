document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});
const fetchData = async () => {
  try {
    const res = await fetch("api.json");
    const data = await res.json();
    console.log("josdde", data);
    console.log("ccamaaa", data);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
console.log("data object");
