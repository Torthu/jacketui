// Function to download data to a file
export function downloadJson(data: string, filename: string) {
  const file = new Blob([data], { type: "text/json" });
  const a = document.createElement("a");
  const url = URL.createObjectURL(file);

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}
