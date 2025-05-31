import {file as _file} from "@observablehq/inputs";
import {AbstractFile} from "observablehq:stdlib";

export {
  button,
  checkbox,
  radio,
  toggle,
  color,
  date,
  datetime,
  form,
  range,
  number,
  search,
  searchFilter,
  select,
  table,
  text,
  email,
  tel,
  url,
  password,
  textarea,
  input,
  bind,
  disposal,
  formatDate,
  formatLocaleAuto,
  formatLocaleNumber,
  formatTrim,
  formatAuto,
  formatNumber
} from "@observablehq/inputs";

export const file = (options) => _file({...options, transform: localFile});

function localFile(file) {
  return new LocalFile(file);
}

class LocalFile extends AbstractFile {
  constructor(file) {
    super(file.name, file.type, file.lastModified, file.size);
    Object.defineProperty(this, "_", {value: file});
    Object.defineProperty(this, "_url", {writable: true});
  }
  get href() {
    return (this._url ??= URL.createObjectURL(this._));
  }
  async url() {
    return this.href;
  }
  async blob() {
    return this._;
  }
  async stream() {
    return this._.stream();
  }
}

export function dropzone(options = {}) {
  const zone = document.createElement("div");
  zone.className = "__ns__-dropzone";
  zone.textContent = options.label ?? "Drop file";
  const input = file(options);
  input.style.display = "none";
  zone.appendChild(input);
  let value = null;

  function setFiles(files) {
    if (!files || files.length === 0) return;
    value = options.multiple
      ? Array.from(files, (f) => new LocalFile(f))
      : new LocalFile(files[0]);
    zone.dispatchEvent(new Event("input", {bubbles: true}));
  }

  input.addEventListener("input", () => {
    value = input.value;
    zone.dispatchEvent(new Event("input", {bubbles: true}));
  });

  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("__over");
  });

  zone.addEventListener("dragleave", () => zone.classList.remove("__over"));
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("__over");
    setFiles(event.dataTransfer?.files);
  });

  zone.addEventListener("click", () => input.click());

  Object.defineProperty(zone, "value", {get: () => value});
  return zone;
}
