import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { ProjectView } from "../../components/Projects/ViewCard";
import { exportProjectPdf } from "../../components/Presentation/Export_pdf";

export default function ProjectPage() {
  const { query, push } = useRouter();
  const id = query?.id;
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/projects/${id}`);
      const data = await res.json();
      setProject(data?.project ?? data);
    })();
  }, [id]);

  return (
    <>
      <Navbar />
      <main>{project ? <ProjectView project={project} onExport={exportProjectPdf} onClose={() => push("/Projects")} /> : "Loading..."}</main>
    </>
  );
}