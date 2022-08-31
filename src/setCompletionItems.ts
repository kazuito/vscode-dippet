import * as vscode from "vscode";

interface Entry {
  prefix: string;
  description: string;
  body: string;
  command: string;
}

export function setCompletionItems(
  context: vscode.ExtensionContext,
  configuration: vscode.WorkspaceConfiguration
) {
  let entryLangs = Object.keys(configuration.entry);
  let completionProviders = [];

  for (let i = 0; i < entryLangs.length; i++) {
    let entryLang = entryLangs[i];
    let documentSelector: vscode.DocumentSelector =
      entryLang === "*"
        ? { scheme: "file" }
        : {
            scheme: "file",
            language: entryLang,
          };
    let completionProvider = vscode.languages.registerCompletionItemProvider(
      documentSelector,
      {
        provideCompletionItems(
          document: vscode.TextDocument,
          position: vscode.Position,
          token: vscode.CancellationToken,
          context: vscode.CompletionContext
        ) {
          let items = [];
          for (let j = 0; j < configuration.entry[entryLang].length; j++) {
            let entry: Entry = configuration.entry[entryLang][j];

            let item = new vscode.CompletionItem(entry.prefix);
            item.kind = vscode.CompletionItemKind.Keyword;
            item.detail = entry.description || "";
            item.insertText = new vscode.SnippetString(entry.body || "");
            item.command = {
              command: entry.command || "",
              title: "",
            };
            items.push(item);
          }
          return items;
        },
      }
    );
    context.subscriptions.push(completionProvider);
    completionProviders.push(completionProvider);
  }
  return completionProviders;
}
