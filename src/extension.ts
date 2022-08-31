import * as vscode from "vscode";

import { setCompletionItems } from "./setCompletionItems";

const extensionInfo = {
  name: "dippet",
};

export function activate(context: vscode.ExtensionContext) {
  // console.log(
  //   'Congratulations, your extension "Dippet" is now active!'
  // );

  let configuration = vscode.workspace.getConfiguration(extensionInfo.name);
  var registeredCompletionProviders = setCompletionItems(
    context,
    configuration
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      for (let i = 0; i < registeredCompletionProviders.length; i++) {
        registeredCompletionProviders[i].dispose();
      }
      configuration = vscode.workspace.getConfiguration(extensionInfo.name);
      registeredCompletionProviders = setCompletionItems(
        context,
        configuration
      );
    })
  );
}

export function deactivate() {}
