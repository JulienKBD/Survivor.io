async function loadImageData(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("Failed to load image");
    const blob = await res.blob();
    const dataURL = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onloadend = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataURL;
    });
    const mime = (blob.type || "image/png").toLowerCase().includes("png") ? "PNG" : "JPEG";
    return { dataURL, width: img.naturalWidth || 0, height: img.naturalHeight || 0, mime };
  } catch (e) {
    console.error("Failed to load image for PDF:", e);
    return null;
  }
}

function addWrappedText(pdf, text, x, y, maxWidth, lineHeight, pageHeight, margin) {
  const content = text || "";
  const lines = pdf.splitTextToSize(content, maxWidth);
  let cursorY = y;
  for (const line of lines) {
    if (cursorY + lineHeight > pageHeight - margin) {
      pdf.addPage();
      cursorY = margin;
    }
    pdf.text(line, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

async function renderProjectToPdf(pdf, project) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const x = margin;
  let y = margin;
  const imgData = await loadImageData(project?.image);

  if (imgData?.dataURL) {
    const maxW = pageWidth - 2 * margin;
    const maxH = 90;
    let w = maxW;
    let h = imgData.height && imgData.width ? (imgData.height * maxW) / imgData.width : maxH;
    if (h > maxH) {
      h = maxH;
      w = (imgData.width / imgData.height) * h;
      if (w > maxW) w = maxW;
    }
    pdf.addImage(imgData.dataURL, imgData.mine || "JPEG", x, y, w, h);
    y += h + 10;
  }
  // Titre
  pdf.setTextColor(20, 20, 20);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text(project?.title || "Project", x, y);
  y += 10;

  // Métadonnées
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  const metas = [
    project?.sector ? `Sector: ${project.sector}` : null,
    project?.location ? `Location: ${project.location}` : null,
    Number.isFinite(project?.age) ? `Age: ${project.age} years` : null,
    project?.published ? `Published: ${new Date(project.published).toLocaleDateString()}` : null,
  ].filter(Boolean);

  for (const line of metas) {
    pdf.text(line, x, y);
    y += 6;
  }

  // Séparateur
  pdf.setDrawColor(180);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Description
  if (project?.description) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    y = addWrappedText(pdf, project.description, x, y, maxWidth, lineHeight, pageHeight, margin);
  }
}

export async function exportProjectPdf(projectsOrProject) {
  try {
    const mod = await import("jspdf");
    const PDF = mod.jsPDF || mod.default || mod;
    const pdf = new PDF("p", "mm", "a4");

    const items = Array.isArray(projectsOrProject)
      ? projectsOrProject.filter(Boolean)
      : [projectsOrProject].filter(Boolean);

    if (items.length === 0) {
      // Page vide informative
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("No project data to export.", 20, 30);
      pdf.save("projects.pdf");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (i > 0) pdf.addPage();
      await renderProjectToPdf(pdf, items[i]);
    }

    const firstTitle = items[0]?.title || "project";
    const filename =
      items.length === 1
        ? `${String(firstTitle).replace(/\s+/g, "_")}.pdf`
        : "projects.pdf";

    pdf.save(filename);
  } catch (err) {
    console.error("Erreur export PDF:", err);
    throw err;
  }
}

export default function ProjectPresentation() {
  const exportEmptyPdf = async () => {
    try {
      const mod = await import("jspdf");
      const PDF = mod.jsPDF || mod.default || mod;
      const pdf = new PDF("p", "mm", "a4");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("JEB Incubator — Export", 20, 30);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text("Use exportProjectPdf(project) to export a specific project.", 20, 42);
      pdf.save("presentation_empty.pdf");
    } catch (err) {
      console.error("Erreur export PDF:", err);
      alert("Impossible de générer le PDF — regarde la console.");
    }
  };

  return (
    <div>
      {/* Bouton flottant (démo) */}
      <button
        onClick={exportEmptyPdf}
        aria-label="Exporter PDF"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          padding: "18px 22px",
          minWidth: 180,
          height: 64,
          borderRadius: 12,
          border: "none",
          background: "#1976d2",
          color: "white",
          cursor: "pointer",
          zIndex: 99999,
          boxShadow: "0 6px 22px rgba(0,0,0,0.25)",
          fontSize: 18,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        Exporter PDF
      </button>
    </div>
  );
}
