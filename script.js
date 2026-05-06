const editor = document.getElementById("editor");
const preview = document.getElementById("preview");

marked.setOptions({
    breaks: true,
    gfm: true
});

function updatePreview() {
    preview.innerHTML = marked.parse(editor.value);

    // Apply syntax highlighting AFTER rendering
    document.querySelectorAll("#preview pre code").forEach((block) => {
        hljs.highlightElement(block);
    });

    // Save (if you're using autosave)
    localStorage.setItem("markdown-content", editor.value);
}

function downloadMarkdown() {
    const content = document.getElementById("editor").value;

    if (!content.trim()) {
        alert("Nothing to download!");
        return;
    }

    // Create file
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });

    // Create temporary link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    // Better filename (timestamped)
    const date = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    a.href = url;
    a.download = `markdown-${date}.md`;

    document.body.appendChild(a);
    a.click();

    // Cleanup (important)
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadHTML() {
    const html = document.getElementById("preview").innerHTML;

    const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "preview.html";
    a.click();

    URL.revokeObjectURL(url);
}

function clearEditor() {
    const editor = document.getElementById("editor");
    const preview = document.getElementById("preview");

    // optional safety check (prevents accidental wipe spam)
    const confirmClear = confirm("Clear all Markdown content?");

    if (!confirmClear) return;

    // Clear editor
    editor.value = "";

    // Clear preview
    preview.innerHTML = "";

    // Remove saved content (if you're using localStorage autosave)
    localStorage.removeItem("markdown-content");
}

// Load saved content
editor.value = localStorage.getItem("markdown-content") || "";

editor.addEventListener("input", updatePreview);
updatePreview();