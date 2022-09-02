import * as vscode from "vscode";

import { extensionInfo } from "./extensionInfo";
import { generateToken } from "./utils";

export function bundleCommands(
  context: vscode.ExtensionContext,
  commands: Array<string>
): [string, vscode.Disposable] {
  const commandId: string = `${extensionInfo.name}.cmd-${generateToken(64)}`;
  var commandIdList:any;
  // console.log("command id:", commandId);
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
        console.log(commandType, commandBody);
        switch (commandType) {
          case "cmd":
            await vscode.commands.executeCommand(commandBody);
            if(commandIdList === undefined || commandIdList === null){
              commandIdList = await vscode.commands.getCommands();
            }
            if (commandIdList.indexOf(commandBody) < 0) {
              console.log(commandIdList);
              vscode.window.showErrorMessage(
                `Not found command \"${commandBody}\".`
              );
              return;
            }
            break;
          case "key":
            break;
          case "text":
            break;
          case "shell":
            const terminal: vscode.Terminal =
              vscode.window.activeTerminal ||
              vscode.window.terminals[0] ||
              (await vscode.window.createTerminal("Code"));
            console.log(vscode.window.terminals);
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
  context.subscriptions.push(disposableBundledCommand);
  return [commandId, disposableBundledCommand];
}
