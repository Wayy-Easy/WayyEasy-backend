import path from "path";
import { fileURLToPath } from "url";
import child_process from "child_process";

export const InitiateSnapshort = () => {
  const __filename = fileURLToPath(import.meta.url);

  const __dirname = path.dirname(__filename);
  const fullPath = path.join(__dirname, "../files/images");
  const ls = child_process.exec(
    `tar -czvf Backup.tar.gz ${fullPath} && mv Backup.tar.gz ./`
  );
  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });
  ls.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
};