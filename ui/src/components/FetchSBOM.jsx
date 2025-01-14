import { useEffect, useState } from "react";
import { GcdsHeading, GcdsText, GcdsButton } from "@cdssnc/gcds-components-react";
import "./Table.css"; 

function FetchSBOM() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/SBOM`, {          
          credentials: "include", // Include authentication cookies
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Process files: Remove "SBOM-" prefix and sort by date (most recent first)
        const processedFiles = data
          .map((file) => ({
            ...file,
            sha: file.sha.replace(/^SBOM\/SBOM-/, ""), // Remove the "SBOM-" prefix
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort files by date (most recent first)

        setFiles(processedFiles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  if (loading) return <GcdsText>{`Loading...`}</GcdsText>;
  if (error) return <GcdsText>{`Error: ${error}`}</GcdsText>;

  return (
    <div>
      <table className="gcds-table">
        <thead>
          <tr>
            <th>
              <GcdsText tag="span">{`Commit SHA`}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{`Date`}</GcdsText>
            </th>
            <th>
              <GcdsText tag="span">{`View`}</GcdsText>
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>
                <GcdsText>{file.sha}</GcdsText>
              </td>
              <td>
                <GcdsText>{file.date}</GcdsText>
              </td>
              <td>
                <GcdsButton
                  type="button"
                  button-style="link"
                  onClick={() => window.open(file.signedUrl, "_blank", "noopener,noreferrer")}
                >
                  View SBOM
                </GcdsButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FetchSBOM;

