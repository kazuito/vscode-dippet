import * as vscode from "vscode";

import { extensionInfo } from "./extensionInfo";
import { bundleCommands } from "./bundleCommands";
import { setCompletionItem } from "./setCompletionItems";

var disposableCompletionProviders: Array<vscode.Disposable> = [];
var disposableBundledCommands: Array<vscode.Disposable> = [];

export function activate(context: vscode.ExtensionContext) {
  // console.log("Dippet is now active!");
  // vscode.window.showInformationMessage("Dippet is now active!");

  var configuration = vscode.workspace.getConfiguration(extensionInfo.name);
  updateAll(context, configuration);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      for (let i = 0; i < disposableCompletionProviders.length; i++) {
        disposableCompletionProviders[i].dispose();
      }
      for (let i = 0; i < disposableBundledCommands.length; i++) {
        disposableBundledCommands[i].dispose();
      }
      configuration = vscode.workspace.getConfiguration(extensionInfo.name);
      disposableCompletionProviders = [];
      disposableBundledCommands = [];
      updateAll(context, configuration);
    })
  );
}

function updateAll(
  context: vscode.ExtensionContext,
  configuration: vscode.WorkspaceConfiguration
) {
  var entryLangs = Object.keys(configuration.entry);

  for (let i = 0; i < entryLangs.length; i++) {
    let entryLang = entryLangs[i];
    let entrySnippets = configuration.entry[entryLangs[i]];
    for (let j = 0; j < entrySnippets.length; j++) {
      let entry = entrySnippets[j];
      let commands =
        typeof entry.command === "string" ? [entry.command] : entry.command;

      let [bundledCommandId, disposableBundledCommand] = bundleCommands(
        context,
        commands
      );
      disposableBundledCommands.push(disposableBundledCommand);
      disposableCompletionProviders.push(
        setCompletionItem(context, entryLang, entry, bundledCommandId)
      );
    }
  }
}

export function deactivate() {}
