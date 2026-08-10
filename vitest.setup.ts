import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// @testing-library/react's eigenes Auto-Cleanup erkennt nur ein GLOBALES afterEach
// (vitest.config.ts hat bewusst test.globals: false, siehe dortiger Kommentar). Ohne diesen
// Hook bleiben gemountete Komponenten zwischen it()-Blocks im DOM stehen, was zu
// "mehrere Elemente gefunden"-Fehlern fuehrt, sobald eine Testdatei mehr als einen render()-Call hat.
afterEach(() => {
  cleanup();
});
