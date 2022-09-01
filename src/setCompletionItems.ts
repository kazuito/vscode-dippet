import * as vscode from "vscode";

export function setCompletionItem(
  context: vscode.ExtensionContext,
  entryLang: string,
  entry: any,
  bundledCommandId: string
) {
  let documentSelector =
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
  context.subscriptions.push(completionProvider);
  return completionProvider;
}
