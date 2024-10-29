const { exec } = require("child_process");
const { promisify } = require("util");

const execPromise = promisify(exec);

const installPackage = async (command, packageName) => {
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr && !stderr.includes("Complete!")) { // DNF outputs to stderr even on success
      throw new Error(`Failed to install ${packageName}: ${stderr}`);
    }
    return stdout;
  } catch (error) {
    throw new Error(`Failed to install ${packageName}: ${error.message}`);
  }
};

const detectPackageManager = async () => {
  try {
    // Check for dnf (Vercel)
    await execPromise("which dnf");
    return {
      type: "dnf",
      commands: {
        ghostscript: "dnf install -y ghostscript",
        graphicsmagick: "dnf install -y GraphicsMagick",
        libreoffice: "dnf install -y libreoffice"
      }
    };
  } catch {
    try {
      // Check for apt-get (Debian/Ubuntu)
      await execPromise("which apt-get");
      return {
        type: "apt-get",
        commands: {
          ghostscript: "apt-get update && apt-get install -y ghostscript",
          graphicsmagick: "apt-get update && apt-get install -y graphicsmagick",
          libreoffice: "apt-get update && apt-get install -y libreoffice"
        }
      };
    } catch {
      try {
        // Check for brew (macOS)
        await execPromise("which brew");
        return {
          type: "brew",
          commands: {
            ghostscript: "brew install ghostscript",
            graphicsmagick: "brew install graphicsmagick",
            libreoffice: "brew install --cask libreoffice"
          }
        };
      } catch {
        if (process.platform === "win32") {
          throw new Error(
            "Windows detected. Please install Ghostscript, GraphicsMagick, and LibreOffice manually:\n" +
            "- Ghostscript: https://www.ghostscript.com/download.html\n" +
            "- GraphicsMagick: http://www.graphicsmagick.org/download.html\n" +
            "- LibreOffice: https://www.libreoffice.org/download/download/"
          );
        }
        throw new Error("No supported package manager found (requires dnf, apt-get, or brew)");
      }
    }
  }
};

const checkAndInstall = async () => {
  try {
    const packageManager = await detectPackageManager();
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