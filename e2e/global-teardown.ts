import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalTeardown() {
  const mockDir = path.resolve(__dirname, '../src/__mocks__/response');
  const files = fs.readdirSync(mockDir).filter((f) => f.startsWith('e2e.worker-'));

  files.forEach((file) => {
    const filePath = path.join(mockDir, file);
    fs.unlinkSync(filePath);
  });
}

export default globalTeardown;
