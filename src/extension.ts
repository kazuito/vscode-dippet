import * as vscode from "vscode";

import { EntryManager } from "./entryManager";

export function activate(context: vscode.ExtensionContext) {
  // console.log("Dippet is now active!");
  // vscode.window.showInformationMessage("Dippet is now active!");

  const entryManager = new EntryManager(context);

  entryManager.updateEntry();

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      entryManager.disposeEntry();
      entryManager.updateEntry();
    })
  );
}

export function deactivate() {}
