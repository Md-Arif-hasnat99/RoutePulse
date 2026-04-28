import { useEffect, useState } from "react";

import { wireTemplateHtml } from "../utils/wireTemplateHtml";

const htmlCache = new Map();

function TemplateFrame({ templateFile, title }) {
  const [wiredHtml, setWiredHtml] = useState("");
  const [status, setStatus] = useState("loading");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    let isDisposed = false;

    async function loadTemplate() {
      setStatus("loading");
      setErrorText("");

      try {
        let sourceHtml = htmlCache.get(templateFile);

        if (!sourceHtml) {
          const response = await fetch(`/templates/${templateFile}`);
          if (!response.ok) {
            throw new Error(`Template fetch failed: ${templateFile}`);
          }
          sourceHtml = await response.text();
          htmlCache.set(templateFile, sourceHtml);
        }

        const processedHtml = wireTemplateHtml(sourceHtml);

        if (!isDisposed) {
          setWiredHtml(processedHtml);
          setStatus("ready");
        }
      } catch (error) {
        if (!isDisposed) {
          setStatus("error");
          setErrorText("Unable to load this template page.");
        }
      }
    }

    loadTemplate();

    return () => {
      isDisposed = true;
    };
  }, [templateFile]);

  if (status === "loading") {
    return (
      <section className="template-status template-status-loading">
        <h2>Loading {title}</h2>
        <p>Extracting and wiring this page template...</p>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="template-status template-status-error">
        <h2>Template Error</h2>
        <p>{errorText}</p>
      </section>
    );
  }

  return (
    <iframe
      title={title}
      className="template-iframe"
      srcDoc={wiredHtml}
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
    />
  );
}

export default TemplateFrame;
