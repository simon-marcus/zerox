const { exec } = require("child_process");
const { promisify } = require("util");
console.log('FORK OF ZEROX - WIP');
console.log('Installing dependencies...');
// Immediately exit in Vercel environment
console.log("process.env.VERCEL: ", process.env.VERCEL);

if (process.env.VERCEL === '1') {
  console.log('Detected Vercel environment, skipping dependency installation script...');
  process.exit(0);
}

const execPromise = promisify(exec);

const installPackage = async (command, packageName) => {
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr && !stderr.includes("Complete!")) {
      throw new Error(`Failed to install ${packageName}: ${stderr}`);
    }
    return stdout;
  } catch (error) {
    throw new Error(`Failed to install ${packageName}: ${error.message}`);
  }
};

const checkAndInstall = async () => {
  try {
    // Check for package manager
    let packageManager;
    try {
      await execPromise("which apt-get");
      packageManager = {
        type: "apt-get",
        commands: {
          ghostscript: "apt-get update && apt-get install -y ghostscript",
          graphicsmagick: "apt-get update && apt-get install -y graphicsmagick",
          libreoffice: "apt-get update && apt-get install -y libreoffice"
        }
      };
    } catch {
      try {
        await execPromise("which brew");
        packageManager = {
          type: "brew",
          commands: {
            ghostscript: "brew install ghostscript",
            graphicsmagick: "brew install graphicsmagick",
            libreoffice: "brew install --cask libreoffice"
          }
        };
      } catch {
        if (process.platform === "win32") {
          console.warn(
            "Windows detected. Please install dependencies manually:\n" +
            "- Ghostscript: https://www.ghostscript.com/download.html\n" +
            "- GraphicsMagick: http://www.graphicsmagick.org/download.html\n" +
            "- LibreOffice: https://www.libreoffice.org/download/download/"
          );
          process.exit(0);
        }
        throw new Error("No supported package manager found (requires apt-get or brew)");
      }
    }

    console.log(`Using package manager: ${packageManager.type}`);

    // Check and install Ghostscript
    try {
      await execPromise("gs --version");
      console.log("Ghostscript is already installed");
    } catch {
      console.log("Installing Ghostscript...");
      await installPackage(packageManager.commands.ghostscript, "Ghostscript");
    }

    // Check and install GraphicsMagick
    try {
      await execPromise("gm -version");
      console.log("GraphicsMagick is already installed");
    } catch {
      console.log("Installing GraphicsMagick...");
      await installPackage(packageManager.commands.graphicsmagick, "GraphicsMagick");
    }

    // Check and install LibreOffice
    try {
      await execPromise("soffice --version");
      console.log("LibreOffice is already installed");
    } catch {
      console.log("Installing LibreOffice...");
      await installPackage(packageManager.commands.libreoffice, "LibreOffice");
    }

    console.log("All dependencies installed successfully!");
  } catch (err) {
    console.error(`Error during installation: ${err.message}`);
    process.exit(1);
  }
};

checkAndInstall();