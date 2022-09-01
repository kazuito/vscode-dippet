import * as vscode from "vscode";

import { extensionInfo } from "./extensionInfo";
import { generateToken } from "./utils";

export function bundleCommands(
  context: vscode.ExtensionContext,
  commands: Array<string>
): [string, vscode.Disposable] {
  const commandId: string = `${extensionInfo.name}.cmd-${generateToken(64)}`;
  // console.log("command id:", commandId);
  const disposableBundledCommand: vscode.Disposable =
    vscode.commands.registerCommand(commandId, async () => {
      for (let i = 0; i < commands.length; i++) {
        await vscode.commands.executeCommand(commands[i]);
      }
    });
  context.subscriptions.push(disposableBundledCommand);
  return [commandId, disposableBundledCommand];
}
