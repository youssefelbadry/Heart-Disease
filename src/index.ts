import bootstrab from "./app.controller";

const app = bootstrab();
const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
