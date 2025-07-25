import App from './app';

const PORT = process.env.PORT || 8080;

const app = new App().app;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
});