(function () {
  "use strict";

  let templates = {};
  let currentTemplate = null;
  let currentLang = "en";
  // Cache of edited field values, keyed by "templateId:lang", so switching
  // templates/langs and coming back doesn't lose edits.
  const editedState = {};

  const el = {
    templateSelect: document.getElementById("template-select"),
    langToggle: document.getElementById("lang-toggle"),
    resetBtn: document.getElementById("reset-btn"),
    formRoot: document.getElementById("form-root"),
    preview: document.getElementById("preview"),
    frameWrap: document.getElementById("frame-wrap"),
    dimsLabel: document.getElementById("dims-label"),
    exportName: document.getElementById("export-name"),
    exportScale: document.getElementById("export-scale"),
    exportHtmlBtn: document.getElementById("export-html-btn"),
    exportPngBtn: document.getElementById("export-png-btn"),
    exportStatus: document.getElementById("export-status"),
    previewPane: document.querySelector(".preview-pane"),
  };

  function stateKey(templateId, lang) {
    return templateId + ":" + lang;
  }

  function getFields(templateId, lang) {
    const key = stateKey(templateId, lang);
    if (!editedState[key]) {
      editedState[key] = structuredClone(templates[templateId].defaults[lang]);
    }
    return editedState[key];
  }

  function resetFields(templateId, lang) {
    editedState[stateKey(templateId, lang)] = structuredClone(templates[templateId].defaults[lang]);
  }

  function buildFormField(schemaField, value, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "field";

    if (schemaField.type === "list") {
      const title = document.createElement("label");
      title.textContent = schemaField.label;
      wrap.appendChild(title);

      (value || []).forEach((item, idx) => {
        const group = document.createElement("div");
        group.className = "list-group";
        const gTitle = document.createElement("div");
        gTitle.className = "list-group-title";
        gTitle.textContent = schemaField.label + " " + (idx + 1);
        group.appendChild(gTitle);

        schemaField.itemFields.forEach((sub) => {
          const subField = buildFormField(
            { key: sub.key, label: sub.label, type: sub.type || "text" },
            item[sub.key],
            (v) => {
              item[sub.key] = v;
              onChange();
            }
          );
          group.appendChild(subField);
        });
        wrap.appendChild(group);
      });
      return wrap;
    }

    const label = document.createElement("label");
    label.textContent = schemaField.label;
    label.htmlFor = "f-" + schemaField.key;
    wrap.appendChild(label);

    const input = schemaField.type === "textarea" ? document.createElement("textarea") : document.createElement("input");
    if (input.tagName === "INPUT") input.type = "text";
    input.id = "f-" + schemaField.key;
    input.value = value ?? "";
    input.addEventListener("input", () => onChange(input.value));
    wrap.appendChild(input);
    return wrap;
  }

  function renderForm() {
    const tpl = templates[currentTemplate];
    const fields = getFields(currentTemplate, currentLang);
    el.formRoot.innerHTML = "";

    tpl.schema.forEach((sf) => {
      const node = buildFormField(sf, fields[sf.key], (v) => {
        if (sf.type !== "list") fields[sf.key] = v;
        schedulePreview();
      });
      el.formRoot.appendChild(node);
    });

    el.dimsLabel.textContent = `${tpl.label} — ${tpl.width} × ${tpl.height}px`;
  }

  let previewTimer = null;
  function schedulePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(updatePreview, 200);
  }

  function updatePreview() {
    const tpl = templates[currentTemplate];
    const fields = getFields(currentTemplate, currentLang);
    const data = encodeURIComponent(JSON.stringify(fields));
    el.preview.width = tpl.width;
    el.preview.height = tpl.height;
    el.preview.src = `/api/preview?template=${encodeURIComponent(currentTemplate)}&lang=${currentLang}&data=${data}`;
    fitPreview();
  }

  function fitPreview() {
    const tpl = templates[currentTemplate];
    const availW = el.previewPane.clientWidth - 48;
    const availH = el.previewPane.clientHeight - 80;
    const scale = Math.min(1, availW / tpl.width, availH / tpl.height);
    el.preview.style.transform = `scale(${scale})`;
    el.frameWrap.style.width = tpl.width * scale + "px";
    el.frameWrap.style.height = tpl.height * scale + "px";
  }

  function selectTemplate(id) {
    currentTemplate = id;
    renderForm();
    updatePreview();
  }

  function init() {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => {
        templates = data;
        Object.keys(templates).forEach((id) => {
          const opt = document.createElement("option");
          opt.value = id;
          opt.textContent = `${templates[id].label} (${templates[id].width}×${templates[id].height})`;
          el.templateSelect.appendChild(opt);
        });
        selectTemplate(Object.keys(templates)[0]);
      });

    el.templateSelect.addEventListener("change", (e) => selectTemplate(e.target.value));

    el.langToggle.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-lang]");
      if (!btn) return;
      currentLang = btn.dataset.lang;
      [...el.langToggle.querySelectorAll("button")].forEach((b) => b.classList.toggle("active", b === btn));
      renderForm();
      updatePreview();
    });

    el.resetBtn.addEventListener("click", () => {
      resetFields(currentTemplate, currentLang);
      renderForm();
      updatePreview();
    });

    el.exportPngBtn.addEventListener("click", () => doExport("png"));
    el.exportHtmlBtn.addEventListener("click", () => doExport("html"));

    window.addEventListener("resize", () => {
      if (currentTemplate) fitPreview();
    });
  }

  function doExport(format) {
    el.exportStatus.textContent = "Exporting…";
    const fields = getFields(currentTemplate, currentLang);
    const name = el.exportName.value.trim() || undefined;
    const scale = Number(el.exportScale.value) || 2;
    fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: currentTemplate, lang: currentLang, data: fields, name, format, scale }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.error) {
          el.exportStatus.textContent = "Error: " + res.error;
          return;
        }
        const url = format === "html" ? res.htmlUrl : res.pngUrl;
        const sizeNote = format === "png" ? ` (${res.width * res.scale}×${res.height * res.scale}px, @${res.scale}x)` : "";
        el.exportStatus.innerHTML = "Done" + sizeNote + ". ";
        const a = document.createElement("a");
        a.href = url;
        a.textContent = "Download " + format.toUpperCase();
        a.download = "";
        el.exportStatus.appendChild(a);
      })
      .catch((err) => {
        el.exportStatus.textContent = "Error: " + err.message;
      });
  }

  init();
})();
