import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "voicenote-" is now active!');

  const disposable = vscode.commands.registerCommand(
    'voicenote.createNote',
    async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;

      let notePath: string;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        // 如果没有打开工作区文件夹，则在临时目录中创建文件
        const tempDir = os.tmpdir();
        const noteName = `note-${Date.now()}.md`;
        notePath = path.join(tempDir, noteName);
      } else {
        // 如果有打开工作区文件夹，则在工作区文件夹中创建文件
        const noteName = `note-${Date.now()}.md`;
        notePath = path.join(workspaceFolders[0].uri.fsPath, noteName);
      }

      fs.writeFileSync(notePath, '# ' + path.basename(notePath));

      const document = await vscode.workspace.openTextDocument(notePath);
      await vscode.window.showTextDocument(document);
      // 执行编辑器听写命令
      await vscode.commands.executeCommand(
        'workbench.action.editorDictation.start'
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
