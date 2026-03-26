import app from "./app.js";
const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
