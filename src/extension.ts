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
        // ワークスペースフォルダが開かれていない場合、一時ディレクトリにファイルを作成する
        const tempDir = os.tmpdir();
        const noteName = `note-${Date.now()}.md`;
        notePath = path.join(tempDir, noteName);
      } else {
        // ワークスペースフォルダが開かれている場合、ワークスペースフォルダにファイルを作成する
        const noteName = `note-${Date.now()}.md`;
        notePath = path.join(workspaceFolders[0].uri.fsPath, noteName);
      }

      fs.writeFileSync(notePath, '# ' + path.basename(notePath));

      const document = await vscode.workspace.openTextDocument(notePath);
      await vscode.window.showTextDocument(document);
      // エディタのディクテーションコマンドを実行する
      await vscode.commands.executeCommand(
        'workbench.action.editorDictation.start'
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
