import * as vscode from "vscode";
import { openSettings } from "./settings";

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("AIKeys actived");

  const settings = vscode.commands.registerCommand(
    "aikeys.openSettings",
    () => {
      vscode.window.showInformationMessage("Going to settings...");
      openSettings();
    }
  );

  context.subscriptions.push(settings);
}

export function deactivate() {
  vscode.window.showInformationMessage("AIKeys deactived");
}
