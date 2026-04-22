import bootstrab from "./app.controller";

const app = bootstrab();

if (require.main === module && process.env.VERCEL !== "1") {
  const port = Number(process.env.PORT) || 5000;

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;
