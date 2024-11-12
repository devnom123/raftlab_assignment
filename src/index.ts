import httpServer from './app.js';

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

