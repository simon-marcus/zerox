const { exec } = require("child_process");
const { promisify } = require("util");

const execPromise = promisify(exec);

// Skip installation in Vercel environment since it's handled by Install Command
if (process.env.VERCEL === '1') {
  console.log('Detected Vercel environment, skipping dependency installation...');
  process.exit(0);
}

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
        install: (pkg) => `apt-get update && apt-get install -y ${pkg}`
      };
    } catch {
      try {
        await execPromise("which brew");
        packageManager = {
          type: "brew",
          install: (pkg) => `brew install ${pkg}`,
          installCask: (pkg) => `brew install --cask ${pkg}`
        };
      } catch {
        if (process.platform === "win32") {
          console.log(
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
      await installPackage(packageManager.install("ghostscript"), "Ghostscript");
    }

    // Check and install GraphicsMagick
    try {
      await execPromise("gm -version");
      console.log("GraphicsMagick is already installed");
    } catch {
      console.log("Installing GraphicsMagick...");
      const cmd = packageManager.type === "apt-get" ? "graphicsmagick" : "graphicsmagick";
      await installPackage(packageManager.install(cmd), "GraphicsMagick");
    }

    // Check and install LibreOffice (not available in Vercel)
    try {
      await execPromise("soffice --version");
      console.log("LibreOffice is already installed");
    } catch {
      console.log("Installing LibreOffice...");
      const cmd = packageManager.type === "apt-get" 
        ? packageManager.install("libreoffice")
        : packageManager.installCask("libreoffice");
      await installPackage(cmd, "LibreOffice");
    }

    console.log("All dependencies installed successfully!");
  } catch (err) {
    console.error(`Error during installation: ${err.message}`);
    process.exit(1);
  }
};

checkAndInstall();