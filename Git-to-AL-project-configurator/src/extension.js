const vscode = require("vscode");
const simpleGit = require("simple-git");
const fs = require("fs-extra");
const path = require("path");

async function activate(context) {
    let disposable = vscode.commands.registerCommand("extension.syncRepo", async () => {
        try {
            const gitUrl = await getUrl();

            if (!gitUrl) {
                vscode.window.showErrorMessage("Please configure the Git repository URL in the settings.");
                return;
            }

            const tempDir = path.join(context.globalStoragePath, "tempRepo");
            await fs.remove(tempDir);
            await fs.ensureDir(tempDir);
            const git = simpleGit();
            await git.clone(gitUrl, tempDir);
            
            const appJsonPath = path.join(tempDir, "app.json");
            if (!(await fs.pathExists(appJsonPath))) {
                vscode.window.showErrorMessage("The cloned repository does not contain an app.json file.");
                return;
            }

            const currentRepoPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
            await compareAndFillFiles(tempDir, currentRepoPath);

            vscode.window.showInformationMessage("Repository successfully synchronized.");
        } catch (error) {
            vscode.window.showErrorMessage(`Error while synchronizing the repository: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

async function getUrl() {
    const type = await getExtensionType();
    const config = vscode.workspace.getConfiguration("AlProjectConfigurator");
    let gitUrl;

    if (type === "PTE") {
        gitUrl = config.get("PTETemplate");
    } else {
        gitUrl = config.get("ProductTemplate");
    }

    return gitUrl;
}

function getExtensionType() {
    const options = {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: "Template type",
    };
    
    const createItemMenu = (label, description, picked = false) => {
        return {
            label: label,
            description: description,
            picked: picked,
        };
    };

    return new Promise((resolve) => {
        vscode.window.showQuickPick([
            createItemMenu("PTE", "Per-Tenant extension"),
            createItemMenu("Product", "AppSource product"),
        ], options).then((target) => {
            resolve(target.label);
        });
    });
}

async function compareAndFillFiles(srcDir, destDir) {
    const srcFiles = await fs.readdir(srcDir);

    for (const file of srcFiles) {
        const srcFilePath = path.join(srcDir, file);
        const destFilePath = path.join(destDir, file);

        if (srcFilePath.includes(path.join(srcDir, '.git'))) {
            continue;
        }

        if ((await fs.stat(srcFilePath)).isDirectory()) {
            await fs.ensureDir(destFilePath);
            await compareAndFillFiles(srcFilePath, destFilePath);
        } else {
            if (path.extname(srcFilePath) === '.json') {
                await handleJsonFile(srcFilePath, destFilePath);
            } else {
                await fs.copy(srcFilePath, destFilePath, { overwrite: true });
            }
        }
    }
}

async function handleJsonFile(srcFilePath, destFilePath) {
    let srcJson = {};
    let destJson = {};

    if (await fs.pathExists(srcFilePath)) {
        srcJson = await fs.readJson(srcFilePath);
    }

    if (await fs.pathExists(destFilePath)) {
        destJson = await fs.readJson(destFilePath);
    }

    const mergedJson = mergeJson(srcJson, destJson);

    await fs.writeJson(destFilePath, mergedJson, { spaces: 2 });
}

function mergeJson(srcJson, destJson) {
    for (const key in srcJson) {
        if (typeof srcJson[key] === 'object' && !Array.isArray(srcJson[key]) && srcJson[key] !== null) {
            if (!destJson[key]) destJson[key] = {};
            destJson[key] = mergeJson(srcJson[key], destJson[key]);
        } else {
            destJson[key] = srcJson[key];
        }
    }
    return destJson;
}

module.exports = { activate };
