import app from './app';
import { env } from './config';

app.listen(env.port, () => {
  console.log(`Backend service running at http://localhost:${env.port}`);
});
