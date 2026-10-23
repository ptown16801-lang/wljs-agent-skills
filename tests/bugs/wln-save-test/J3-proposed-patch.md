# Proposed local patch for WLJS bug J3 (not applied: needs the owner's OK)

File: `~/.local/opt/wljs/app/resources/app/modules/wljs-editor/src/RemoteCells.wl`
(already patched once for J1; backup of the original: `RemoteCells.wl.orig-2026-10-22`).

Replace the `exportNotebook[notebook_, savingPath_, "wln"]` definition with:

```wolfram
(* [local patch] kernel-side NotebookSave: write the file as before, then run the same frontend-object sync the GUI
   save runs (OnBeforeSave fetches every graphics object from the notebook's window) and write again, so saved
   graphics survive an app restart. *)
writeWlnLocal[notebook_, savingPath_] := With[{stream = OpenWrite[savingPath, DOSTextFormat->False]},
    notebook["Path"] = savingPath;
    notebook["Directory"] = DirectoryName[savingPath];
    nb`SerializeToStream[stream, notebook];
    Close[stream];
    notebook["FileHash"] = FileHash[savingPath];
]

exportNotebook[notebook_, savingPath_, "wln"] := (
    writeWlnLocal[notebook, savingPath];
    With[{sock = notebook["Socket"]},
        If[sock =!= Null && Head[sock] =!= Missing,
            Then[EventFire[notebook, "OnBeforeSave", <|"Client" -> sock, "Log" -> localSaveLog|>],
                Function[Null, writeWlnLocal[notebook, savingPath]]]]];
)
```

Why it is safe: the first write is exactly today's behaviour, so a save is never lost; the second write only happens
after the sync resolves. `OnBeforeSave` (`modules/wljs-editor/src/FrontendObjectSync.wl:145`) needs only the window
client (`notebook["Socket"]`, set in `Views/Notebook/Notebook.wlx:1235`); `"Log"` is used only for a progress notice.

Test after applying (needs a WLJS restart): `tests/bugs/wln-save-test/` — make a notebook with
`Plot[Sin[x], {x, 0, 6}]`, save it from a cell with `NotebookSave[EvaluationNotebook[], path]`, check the file has an
`Objects` section, restart WLJS, reopen it and capture the window: the plot must draw, not "Loading...".
