import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function App() {
  const [requirementText, setRequirementText] = useState("");
  const [requirementType, setRequirementType] = useState("functional");
  const [documentation, setDocumentation] = useState({
    functional: [],
    nonFunctional: [],
  });
  const [loading, setLoading] = useState(false);

  // Submit handler for generating documentation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requirementText) {
      alert("Please enter a requirement!");
      return;
    }

    setLoading(true);
    try {
      // Send requirement and type to backend
      const response = await axios.post("http://localhost:5000/generate-doc", {
        text: requirementText,
        type: requirementType,
      });

      const generatedText = response?.data?.content?.trim();
      if (!generatedText) {
        throw new Error("Invalid response from the server");
      }

      setDocumentation((prev) => ({
        ...prev,
        [requirementType]: [...(prev[requirementType] || []), generatedText],
      }));
      setRequirementText(""); // Clear input after submission
    } catch (error) {
      console.error("Error generating text:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Failed to generate documentation"}`);
      } else {
        alert("Failed to generate documentation. Please check your network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

// Download the documentation as a PDF
const downloadDocument = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const lineHeight = 8; // Reduced line height for smaller font size
  let yPosition = 20;

// Utility to sanitize input and remove asterisks
  const sanitizeText = (text) => text.replace(/\*/g, "").trim();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14); // Larger font for title
  doc.text("Software Project Documentation", margin, yPosition, { align: "left" });
  yPosition += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12); // Bold headings with slightly smaller size
  doc.text("Functional Requirements:", margin, yPosition);
  yPosition += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10); // Smaller font for body text
  documentation.functional.forEach((item, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${sanitizeText(item)}`, pageWidth - 2 * margin);
    lines.forEach((line) => {
      if (yPosition + lineHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  });

  yPosition += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Non-Functional Requirements:", margin, yPosition);
  yPosition += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  documentation.nonFunctional.forEach((item, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${sanitizeText(item)}`, pageWidth - 2 * margin);
    lines.forEach((line) => {
      if (yPosition + lineHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  });

  // Save the generated PDF document
  doc.save("SoftwareDocumentation.pdf");
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>AI-Powered Documentation Generator</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter requirement details"
          value={requirementText}
          onChange={(e) => setRequirementText(e.target.value)}
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <select
          value={requirementType}
          onChange={(e) => setRequirementType(e.target.value)}
          style={{ marginBottom: "10px" }}
        >
          <option value="functional">Functional Requirement</option>
          <option value="nonFunctional">Non-Functional Requirement</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Add to Documentation"}
        </button>
      </form>

      {loading && <p>Generating documentation...</p>}

      <h2>Current Documentation:</h2>
      <div>
        <h3>Functional Requirements</h3>
        <ul>
          {documentation.functional.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <h3>Non-Functional Requirements</h3>
        <ul>
          {documentation.nonFunctional.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <button onClick={downloadDocument} style={{ marginTop: "10px" }}>
        Download Documentation
      </button>
    </div>
  );
}

export default App;
