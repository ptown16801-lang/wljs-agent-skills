// Export the open WLJS notebook to a static HTML file without the desktop app's native dialogs.
//
// WLJS 3.1.4 exports only from its menu, and the last step asks for a file name with a native save dialog
// (in a browser it falls back to prompt()). Run this in a browser tab showing the notebook at
// http://127.0.0.1:<port>/<url-encoded notebook path>, for example from an agent's browser tool:
//
//   await wljsExport('/abs/path/notebook.html')
//
// A 15 MB export takes about a minute. Agent browser tools that cap a script's run time can start it without
// awaiting (wljsExport(path).then(console.log)) and then wait for the file on disk.
//
// It answers the dialogs the menu would show (format: "HTML File", mode: "Static", file name) and resolves when
// WLJS has written the file. The page's `server.ask` runs code in WLJS's own server (not the kernel); it is used
// here only to check that the file exists. Check the result before sharing it: WLJS writes the computer's user
// name as the author and the notebook's folder into a compressed block (see showcase/notebooks/README.md).
async function wljsExport(outPath, { timeoutMs = 120000 } = {}) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clickText = async (text, waitMs = 30000) => {
    const end = Date.now() + waitMs;
    while (Date.now() < end) {
      const el = [...document.querySelectorAll('*')].find((e) => e.children.length === 0 && e.textContent.trim() === text);
      if (el) { (el.closest('[role="option"], li, button, a, div') || el).click(); return; }
      await sleep(300);
    }
    throw new Error(`"${text}" did not appear`);
  };
  const exists = async () => String(await window.server.ask(`FileExistsQ[${JSON.stringify(outPath)}]`)).includes('True');
  const original = window.prompt;
  window.prompt = () => outPath;                         // the save dialog's browser fallback
  try {
    document.querySelector('[aria-label="Export notebook"], button[title="Export notebook"]').click();
    await clickText('HTML File');
    await clickText('Static');
    const end = Date.now() + timeoutMs;
    while (Date.now() < end) { if (await exists()) return outPath; await sleep(1000); }
    throw new Error('export did not finish in time');
  } finally {
    window.prompt = original;
  }
}
