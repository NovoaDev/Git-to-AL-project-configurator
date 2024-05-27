# AL Project Configurator

**AL Project Configurator** is a Visual Studio Code extension that synchronizes default settings in AL projects from a Git repository. The extension downloads the configured repository and updates the current project's files, overwriting existing keys in `.json` files with those from the source repository.

## Features

- Downloads and clones a configured Git repository.
- Synchronizes the current project's files with those from the cloned repository.
- Overwrites keys in `.json` files if they already exist, keeping the content updated.

## Prerequisites

- Node.js and npm installed on your system.
- Visual Studio Code version 1.57.0 or higher.

## Installation

At the moment it can only be installed manually :)
1. Clone repository.
2. Open Terminal and position yourself in the extension folder

   ![Install1](/res/Install1.png)
3. Run in terminal npm install.

   ![Install2](/res/Install2.png)
  
4. Copy the **al-project-configurator** folder to the Visual Studio Code extensions folder for your user. Replace `user` with your actual username.

   C:\Users\\**user\\**.vscode\extensions

   ![Install3](/res/Install3.png)
   ![Install4](/res/Install4.png)

5. You need to close and reopen **VSCode** or use the **VSCode Reload Window** command to load the extension.

   ![Install5](/res/Install5.png)

   To check if it has been installed correctly, go to the extensions tab in **VSCode** and you will see **AL Project Configurator**.

   ![Install6](/res/Install6.png)

## Configuration

1. Open the user or workspace settings in Visual Studio Code (`Ctrl + ,`).
2. Search for `AL Project Configurator`.
3. Configure the Git repository URLs in the corresponding fields:
   - `AlProjectConfigurator.PTETemplate`: URL of the PTE template repository.
   - `AlProjectConfigurator.ProductTemplate`: URL of the product template repository.
  
   ![Install7](/res/Install7.png)

### Configuration Example

```json
{
   "AlProjectConfigurator.PTETemplate": "https://github.com/NovoaDev/ExamplePTECFG.git",
   "AlProjectConfigurator.ProductTemplate": "https://github.com/NovoaDev/ExampleAppSourceCFG.git"
}
```

## Preparing Template Repositories

It is important that we only place the files and keys that we want to be snatched.

![Usage0](/res/Usage0.png)

### Sample repositories

https://github.com/NovoaDev/ExamplePTECFG<br>
https://github.com/NovoaDev/ExampleAppSourceCFG

## Usage

1. Open the project folder where you want to load the settings.
   
   ![Usage1](/res/Usage1.png)
2. Open the command palette (`Ctrl+Shift+P`) and execute `AL Project Configurator: Load configuration from template`.
   
   ![Usage2](/res/Usage2.png)
3. Select the template type (`PTE` or `Product`).
   
   ![Usage3](/res/Usage3.png)
4. The extension will clone the configured repository, validate that it contains an `app.json` file, and then synchronize the current project's files with those from the cloned repository, overwriting keys in the `.json` files.
   
   ![Usage4](/res/Usage4.png)

