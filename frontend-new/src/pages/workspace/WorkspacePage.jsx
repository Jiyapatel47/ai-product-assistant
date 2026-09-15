import { useEffect, useState } from "react";

import {
  getWorkspaces,
  createWorkspace,
  uploadFeedback,
  analyzeFeedback,
} from "../../services/api";

function WorkspacePage({ onBack, onOpenInsights }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] =
    useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [analysisCompleted, setAnalysisCompleted] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================================================
  // DATA QUALITY STATE
  // ============================================================

  const [dataQuality, setDataQuality] = useState(null);
  const [checkingFile, setCheckingFile] = useState(false);

  // ============================================================
  // LOAD WORKSPACES
  // ============================================================

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getWorkspaces();

      const list = data.workspaces || [];

      setWorkspaces(list);

      if (list.length > 0) {
        setSelectedWorkspace(list[0]);
      }
    } catch (err) {
      console.error("Load workspaces error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CREATE WORKSPACE
  // ============================================================

  const handleCreateWorkspace = async () => {
    console.log("CREATE WORKSPACE BUTTON CLICKED");

    if (!workspaceName.trim()) {
      setError("Please enter a workspace name.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setMessage("");

      const data = await createWorkspace(
        workspaceName,
        workspaceDescription
      );

      const newWorkspace = {
        id: data.workspace_id,
        name: workspaceName,
        description: workspaceDescription,
      };

      setWorkspaces((prev) => [...prev, newWorkspace]);

      setSelectedWorkspace(newWorkspace);

      setWorkspaceName("");
      setWorkspaceDescription("");

      setAnalysisCompleted(false);
      setDataQuality(null);

      setMessage("Workspace created successfully!");

      console.log("SUCCESS MESSAGE SET");
    } catch (err) {
      console.error("Create workspace error:", err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // ============================================================
  // CHANGE WORKSPACE
  // ============================================================

  const handleWorkspaceChange = (event) => {
    const workspace = workspaces.find(
      (item) => item.id === event.target.value
    );

    setSelectedWorkspace(workspace);

    setMessage("");
    setError("");
    setSelectedFile(null);

    setAnalysisCompleted(false);
    setDataQuality(null);
  };

  // ============================================================
  // CSV PARSER
  // ============================================================

  const parseCSV = (text) => {
    const rows = [];

    let currentRow = [];
    let currentValue = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"' && insideQuotes && nextChar === '"') {
        currentValue += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        currentRow.push(currentValue);
        currentValue = "";
      } else if (
        (char === "\n" || char === "\r") &&
        !insideQuotes
      ) {
        if (char === "\r" && nextChar === "\n") {
          i++;
        }

        currentRow.push(currentValue);

        if (
          currentRow.some(
            (value) => value.trim() !== ""
          )
        ) {
          rows.push(currentRow);
        }

        currentRow = [];
        currentValue = "";
      } else {
        currentValue += char;
      }
    }

    // Add final row
    if (
      currentValue !== "" ||
      currentRow.length > 0
    ) {
      currentRow.push(currentValue);

      if (
        currentRow.some(
          (value) => value.trim() !== ""
        )
      ) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  // ============================================================
  // CHECK CSV DATA QUALITY
  // ============================================================

  const checkDataQuality = (file) => {
    setCheckingFile(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csvText = event.target.result;

        const rows = parseCSV(csvText);

        if (rows.length === 0) {
          setError("The CSV file appears to be empty.");
          setDataQuality(null);
          setCheckingFile(false);
          return;
        }

        const headers = rows[0].map((header) =>
          header.trim().toLowerCase()
        );

        // Backend currently expects "text"
        const textColumnIndex = headers.indexOf("text");

        if (textColumnIndex === -1) {
          setError(
            'CSV must contain a "text" column.'
          );
          setDataQuality(null);
          setCheckingFile(false);
          return;
        }

        const dataRows = rows.slice(1);

        const feedbackTexts = dataRows.map(
          (row) =>
            row[textColumnIndex]
              ? row[textColumnIndex].trim()
              : ""
        );

        const totalRecords = feedbackTexts.length;

        const emptyRecords = feedbackTexts.filter(
          (text) => text === ""
        ).length;

        const validTexts = feedbackTexts.filter(
          (text) => text !== ""
        );

        // Detect duplicate feedback
        const normalizedTexts = validTexts.map(
          (text) => text.toLowerCase().replace(/\s+/g, " ")
        );

        const uniqueTexts = new Set(
          normalizedTexts
        );

        const duplicateRecords =
          validTexts.length - uniqueTexts.size;

        const validRecords = validTexts.length;

        const readyForAI =
          validRecords - duplicateRecords;

        setDataQuality({
          totalRecords,
          validRecords,
          emptyRecords,
          duplicateRecords,
          readyForAI,
        });

        setError("");
        setMessage(
          "CSV checked successfully. Your data is ready for AI analysis."
        );
      } catch (err) {
        console.error(
          "CSV quality check error:",
          err
        );

        setError(
          "Unable to read the CSV file. Please check the file format."
        );

        setDataQuality(null);
      } finally {
        setCheckingFile(false);
      }
    };

    reader.onerror = () => {
      setError("Unable to read the selected file.");
      setDataQuality(null);
      setCheckingFile(false);
    };

    reader.readAsText(file);
  };

  // ============================================================
  // FILE CHANGE
  // ============================================================

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setSelectedFile(null);
      setDataQuality(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file.");
      setSelectedFile(null);
      setDataQuality(null);
      return;
    }

    setError("");
    setMessage("");
    setSelectedFile(file);
    setAnalysisCompleted(false);
    setDataQuality(null);

    // Check CSV before uploading
    checkDataQuality(file);
  };

  // ============================================================
  // UPLOAD + AI ANALYSIS
  // ============================================================

  const handleUploadAndAnalyze = async () => {
    if (!selectedWorkspace) {
      setError(
        "Please create or select a workspace first."
      );
      return;
    }

    if (!selectedFile) {
      setError("Please choose a CSV file first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");
      setAnalysisCompleted(false);

      // STEP 1: Upload CSV
      const uploadResult = await uploadFeedback(
        selectedWorkspace.id,
        selectedFile
      );

      setMessage(
        `Feedback uploaded successfully! Total feedback: ${uploadResult.total_feedback}`
      );

      // STEP 2: Run AI analysis
      const analysisResult = await analyzeFeedback(
        selectedWorkspace.id
      );

      setMessage(
        `Analysis completed successfully! ${analysisResult.total_feedback} feedback items analyzed.`
      );

      setAnalysisCompleted(true);

      setSelectedFile(null);
    } catch (err) {
      console.error(
        "Upload/analysis error:",
        err
      );

      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ============================================================
  // VIEW INSIGHTS
  // ============================================================

  const handleViewInsights = () => {
    if (!selectedWorkspace) {
      setError("Please select a workspace first.");
      return;
    }

    if (onOpenInsights) {
      onOpenInsights(selectedWorkspace.id);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="workspace-page">
        <div className="workspace-content">
          <div className="workspace-card">
            <h2>Loading workspace...</h2>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="workspace-page">

      {/* ================= HEADER ================= */}

      <header className="workspace-header">

        <div>
          <h1>Product Workspace</h1>

          <p>
            Analyze your customer feedback.
          </p>
        </div>

        <button onClick={onBack}>
          ← Dashboard
        </button>

      </header>


      <main className="workspace-content">

        {/* ================= WORKSPACE ================= */}

        <div className="workspace-card">

          <h2>📁 Workspace</h2>

          {workspaces.length > 0 ? (
            <>
              <p>
                Select a workspace to continue.
              </p>

              <select
                value={
                  selectedWorkspace?.id || ""
                }
                onChange={handleWorkspaceChange}
              >
                {workspaces.map(
                  (workspace) => (
                    <option
                      key={workspace.id}
                      value={workspace.id}
                    >
                      {workspace.name}
                    </option>
                  )
                )}
              </select>


              {selectedWorkspace && (
                <div className="selected-workspace">

                  <h3>
                    {selectedWorkspace.name}
                  </h3>

                  <p>
                    {selectedWorkspace.description ||
                      "No description provided."}
                  </p>

                </div>
              )}
            </>
          ) : (
            <p>
              No workspace found. Create your first
              workspace below.
            </p>
          )}


          {/* CREATE WORKSPACE */}

          <div className="create-workspace">

            <h3>
              Create New Workspace
            </h3>

            <input
              type="text"
              placeholder="Workspace name"
              value={workspaceName}
              onChange={(e) =>
                setWorkspaceName(e.target.value)
              }
            />

            <textarea
              placeholder="Workspace description"
              value={workspaceDescription}
              onChange={(e) =>
                setWorkspaceDescription(
                  e.target.value
                )
              }
            />

            <button
              onClick={handleCreateWorkspace}
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Workspace"}
            </button>

          </div>

        </div>


        {/* ================= CSV UPLOAD ================= */}

        <div className="workspace-card">

          <h2>
            📊 Upload Customer Feedback
          </h2>

          <p>
            Upload your customer feedback CSV file
            to begin analysis.
          </p>


          {!selectedWorkspace ? (

            <div className="upload-box">

              <h3>
                Create a workspace first
              </h3>

              <p>
                You need a workspace before
                uploading feedback.
              </p>

            </div>

          ) : (

            <div className="upload-box">

              <div className="upload-icon">
                📁
              </div>

              <h3>
                Choose a CSV file
              </h3>

              <p>
                Upload feedback, reviews or
                support tickets.
              </p>


              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />


              {selectedFile && (
                <p>
                  Selected file:{" "}
                  <strong>
                    {selectedFile.name}
                  </strong>
                </p>
              )}


              {checkingFile && (
                <div className="data-checking">
                  🔍 Checking your feedback data...
                </div>
              )}


              <button
                onClick={handleUploadAndAnalyze}
                disabled={
                  uploading ||
                  checkingFile ||
                  !selectedFile
                }
              >
                {uploading
                  ? "Uploading & Analyzing..."
                  : "Upload & Analyze"}
              </button>

            </div>

          )}

        </div>


        {/* =====================================================
            DATA QUALITY CHECK
        ====================================================== */}

        {dataQuality && (
          <div className="workspace-card data-quality-card">

            <div className="data-quality-header">

              <div>
                <span className="quality-label">
                  DATA PREPROCESSING
                </span>

                <h2>
                  📊 Data Quality Check
                </h2>

                <p>
                  AI-ready feedback validation before
                  analysis.
                </p>
              </div>

              <div className="quality-status">
                ✓ Ready
              </div>

            </div>


            <div className="quality-grid">

              {/* TOTAL */}

              <div className="quality-stat">

                <div className="quality-icon">
                  📋
                </div>

                <div>
                  <span>Total Records</span>
                  <strong>
                    {dataQuality.totalRecords}
                  </strong>
                </div>

              </div>


              {/* VALID */}

              <div className="quality-stat">

                <div className="quality-icon">
                  ✓
                </div>

                <div>
                  <span>Valid Records</span>
                  <strong>
                    {dataQuality.validRecords}
                  </strong>
                </div>

              </div>


              {/* EMPTY */}

              <div className="quality-stat">

                <div className="quality-icon">
                  ⚠️
                </div>

                <div>
                  <span>Empty Records</span>
                  <strong>
                    {dataQuality.emptyRecords}
                  </strong>
                </div>

              </div>


              {/* DUPLICATES */}

              <div className="quality-stat">

                <div className="quality-icon">
                  🔁
                </div>

                <div>
                  <span>Duplicates</span>
                  <strong>
                    {dataQuality.duplicateRecords}
                  </strong>
                </div>

              </div>

            </div>


            {/* READY MESSAGE */}

            <div className="ai-ready-box">

              <div className="ai-ready-icon">
                ✨
              </div>

              <div>
                <strong>
                  {dataQuality.readyForAI} feedback items
                  ready for AI analysis
                </strong>

                <p>
                  The dataset has been checked for
                  empty and duplicate feedback.
                </p>
              </div>

            </div>

          </div>
        )}


        {/* ================= SUCCESS ================= */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}


        {/* ================= ERROR ================= */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* ================= VIEW INSIGHTS ================= */}

        {analysisCompleted &&
          selectedWorkspace && (
            <div className="view-insights-box">

              <div>
                <h3>
                  🎉 Your analysis is ready!
                </h3>

                <p>
                  Explore themes, pain points,
                  feature requests and trends.
                </p>
              </div>


              <button
                onClick={handleViewInsights}
              >
                View Insights →
              </button>

            </div>
          )}


        {/* ================= ANALYSIS PIPELINE ================= */}

        <div className="workspace-card">

          <div className="pipeline-heading">

            <span className="quality-label">
              AI WORKFLOW
            </span>

            <h2>
              Analysis Pipeline
            </h2>

            <p>
              From raw customer feedback to
              actionable product intelligence.
            </p>

          </div>


          <div className="pipeline">

            {/* STEP 1 */}

            <div className="pipeline-item">

              <span>1</span>

              <div>
                <strong>
                  Upload Feedback
                </strong>

                <p>
                  Import customer feedback data.
                </p>
              </div>

            </div>


            {/* STEP 2 */}

            <div className="pipeline-item">

              <span>2</span>

              <div>
                <strong>
                  Data Cleaning
                </strong>

                <p>
                  Check empty and duplicate records.
                </p>
              </div>

            </div>


            {/* STEP 3 */}

            <div className="pipeline-item">

              <span>3</span>

              <div>
                <strong>
                  AI Analysis
                </strong>

                <p>
                  Extract themes and pain points.
                </p>
              </div>

            </div>


            {/* STEP 4 */}

            <div className="pipeline-item">

              <span>4</span>

              <div>
                <strong>
                  Generate Insights
                </strong>

                <p>
                  Identify important feature requests.
                </p>
              </div>

            </div>


            {/* STEP 5 */}

            <div className="pipeline-item">

              <span>5</span>

              <div>
                <strong>
                  PRD & Roadmap
                </strong>

                <p>
                  Convert insights into product
                  requirements.
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default WorkspacePage;