import * as vscode from "vscode";

import { extensionInfo } from "./constants";
import { generateToken } from "./utils";

export class EntryManager {
  private context: vscode.ExtensionContext;
  private configuration: vscode.WorkspaceConfiguration;
  private disposableBundledCommands: Array<vscode.Disposable>;
  private disposableCompletionProviders: Array<vscode.Disposable>;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.configuration = vscode.workspace.getConfiguration(extensionInfo.name);
    this.disposableBundledCommands = [];
    this.disposableCompletionProviders = [];
  }

  public updateEntry(): void {
    this.configuration = vscode.workspace.getConfiguration(extensionInfo.name);
    var entryLangs = Object.keys(this.configuration.entry);

    for (let i = 0; i < entryLangs.length; i++) {
      let entryLang = entryLangs[i];
      let entrySnippets = this.configuration.entry[entryLangs[i]];
      for (let j = 0; j < entrySnippets.length; j++) {
        let entry = entrySnippets[j];
        let commands =
          typeof entry.command === "string" ? [entry.command] : entry.command;

        let entryInfo = {
          lang: entryLang,
          nthSnippet: j,
        };
        this.setCompletionItem(
          entryLang,
          entry,
          this.bundleCommands(commands, entryInfo)
        );
      }
    }
  }

  private bundleCommands(commands: Array<string>, entryInfo: any): string {
    const commandId: string = `${extensionInfo.name}.cmd-${generateToken(64)}`;
    const disposableBundledCommand: vscode.Disposable =
      vscode.commands.registerCommand(commandId, async () => {
        for (let i = 0; i < commands.length; i++) {
          let commandTypeMatch = commands[i].match(/^[a-z]+?(?=:)/);
          let commandBodyMatch = commands[i].match(/(?<=^[a-z]+?:).*/);
          if (commandTypeMatch === null) {
            vscode.window.showErrorMessage(
              "Error reading command type. Expect 'cmd:' or 'shell:' at the beginning of each command."
            );
            return;
          }
          if (commandBodyMatch === null) {
            vscode.window.showErrorMessage(
              "Error reading command. Please specify available command id."
            );
            return;
          }
          let commandType = commandTypeMatch[0].trim();
          let commandBody = commandBodyMatch[0].trim();
          switch (commandType) {
            case "cmd":
              vscode.commands
                .executeCommand(commandBody)
                .then(undefined, (error) => {
                  vscode.window.showErrorMessage(
                    `Command \'${commandBody}\' not found. Error at: settings.json > dippet.entry > ${entryInfo.lang}[${entryInfo.nthSnippet}] > command[${i}]`
                  );
                });
              break;
            case "shell":
              const terminal: vscode.Terminal =
                vscode.window.activeTerminal ||
                vscode.window.terminals[0] ||
                (await vscode.window.createTerminal("Code"));
              await terminal.sendText(commandBody);
              break;
            default:
              vscode.window.showErrorMessage(
                `Error reading command type. Expect 'cmd:' or 'shell:' at the beginning of each command, but got ${commandType}.`
              );
              return;
          }
        }
      });
    this.context.subscriptions.push(disposableBundledCommand);
    this.disposableBundledCommands.push(disposableBundledCommand);
    return commandId;
  }

  setCompletionItem(entryLang: string, entry: any, bundledCommandId: string) {
    let documentSelector: vscode.DocumentSelector =
      entryLang === "*"
        ? {
            scheme: "file",
          }
        : {
            scheme: "file",
            language: entryLang,
          };
    let completionProvider = vscode.languages.registerCompletionItemProvider(
      documentSelector,
      {
        async provideCompletionItems(
          document: vscode.TextDocument,
          position: vscode.Position,
          token: vscode.CancellationToken,
          context: vscode.CompletionContext
        ) {
          let items = [];
          let item = new vscode.CompletionItem(entry.prefix);
          item.kind = vscode.CompletionItemKind.Keyword;
          item.detail = entry.description || "";
          item.insertText = new vscode.SnippetString(entry.body || "");
          item.command = {
            command: bundledCommandId,
            title: "",
          };
          items.push(item);

          return items;
        },
      }
    );
    this.context.subscriptions.push(completionProvider);
    this.disposableCompletionProviders.push(completionProvider);
  }

  disposeEntry() {
    for (let i = 0; i < this.disposableCompletionProviders.length; i++) {
      this.disposableCompletionProviders[i].dispose();
      this.disposableBundledCommands[i].dispose();
    }
    this.disposableCompletionProviders = [];
    this.disposableBundledCommands = [];
  }
}
