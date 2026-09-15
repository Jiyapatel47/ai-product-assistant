import { useEffect, useMemo, useState } from "react";
import {
  getLatestAnalysis,
  getInsights,
  getFeatures,
} from "../../services/api";

const chartColors = [
  "#7c3aed",
  "#2563eb",
  "#ec4899",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
];

function InsightsPage({ workspaceId, onBack }) {
  const [analysis, setAnalysis] = useState(null);
  const [insights, setInsights] = useState(null);
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!workspaceId) {
        setError("No workspace selected.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [analysisData, insightsData, featuresData] =
          await Promise.all([
            getLatestAnalysis(workspaceId),
            getInsights(workspaceId),
            getFeatures(workspaceId),
          ]);

        setAnalysis(analysisData);
        setInsights(insightsData);
        setFeatures(featuresData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load insights.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [workspaceId]);

  const getValue = (item, keys, fallback = "") => {
    if (!item) return fallback;

    for (const key of keys) {
      if (
        item[key] !== undefined &&
        item[key] !== null &&
        item[key] !== ""
      ) {
        return item[key];
      }
    }

    return fallback;
  };

  const getNumber = (item, keys, fallback = 0) => {
    const value = getValue(item, keys, fallback);
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
  };

  const themes = useMemo(() => {
    const data =
      insights?.main_themes ||
      insights?.themes ||
      analysis?.main_themes ||
      analysis?.themes ||
      [];

    return Array.isArray(data) ? data : [];
  }, [insights, analysis]);

  const painPoints = useMemo(() => {
    const data =
      insights?.pain_points ||
      analysis?.pain_points ||
      [];

    return Array.isArray(data) ? data : [];
  }, [insights, analysis]);

  const featureRequests = useMemo(() => {
    const data =
      insights?.feature_requests ||
      features?.feature_requests ||
      analysis?.feature_requests ||
      [];

    return Array.isArray(data) ? data : [];
  }, [insights, features, analysis]);

  const featureOpportunities = useMemo(() => {
    const data =
      insights?.feature_opportunities ||
      features?.feature_opportunities ||
      analysis?.feature_opportunities ||
      [];

    return Array.isArray(data) ? data : [];
  }, [insights, features, analysis]);

  const trendFeatures = useMemo(() => {
    const data =
      insights?.trend_analysis ||
      insights?.trends ||
      features?.trend_analysis ||
      features?.trends ||
      analysis?.trend_analysis ||
      [];

    return Array.isArray(data) ? data : [];
  }, [insights, features, analysis]);

  const categoryDistribution = useMemo(() => {
    const data =
      insights?.category_distribution ||
      analysis?.category_distribution ||
      [];

    return Array.isArray(data) ? data : [];
  }, [insights, analysis]);

  const totalFeedback = useMemo(() => {
    const values = [
      insights?.total_feedback,
      insights?.totalFeedback,
      analysis?.total_feedback,
      analysis?.totalFeedback,
      analysis?.feedback_count,
      analysis?.total_items,
    ];

    for (const value of values) {
      const number = Number(value);

      if (Number.isFinite(number) && number > 0) {
        return number;
      }
    }

    const categoryTotal = categoryDistribution.reduce(
      (sum, item) =>
        sum +
        getNumber(
          item,
          ["count", "total", "value", "frequency"],
          0
        ),
      0
    );

    return categoryTotal || 0;
  }, [insights, analysis, categoryDistribution]);

  const getPercentage = (count) => {
    if (!totalFeedback) return 0;

    return ((Number(count) / totalFeedback) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="visual-insights-page">
        <div className="visual-loader">
          <div className="loader-orbit">
            <div className="loader-core">✦</div>
          </div>

          <h2>Preparing AI Insights</h2>
          <p>Analyzing your customer feedback...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="visual-insights-page">
        <div className="visual-error">
          <div className="error-circle">!</div>

          <h2>Unable to Load Insights</h2>
          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="visual-primary-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="visual-insights-page">

      {/* HEADER */}
      <header className="visual-header">

        <div className="visual-brand">
          <div className="brand-orb">✦</div>

          <div>
            <h1>AI Product Assistant</h1>
            <p>Customer Intelligence Workspace</p>
          </div>
        </div>

        {onBack && (
          <button
            className="visual-back-btn"
            onClick={onBack}
          >
            ← Workspace
          </button>
        )}

      </header>


      {/* HERO */}
      <section className="visual-hero">

        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>

        <div className="hero-content">

          <div className="ai-complete-pill">
            <span></span>
            AI Analysis Complete
          </div>

          <h2>
            What are your customers
            <br />
            <strong>really saying?</strong>
          </h2>

          <p>
            Your feedback has been transformed into clear
            product intelligence, customer pain points and
            feature opportunities.
          </p>

        </div>


        {/* HERO CIRCLE */}
        <div className="hero-analysis-circle">

          <div className="hero-circle-inner">
            <span>FEEDBACK</span>
            <strong>{totalFeedback}</strong>
            <small>ANALYZED</small>
          </div>

        </div>

      </section>


      {/* OVERVIEW CIRCLES */}
      <section className="overview-section">

        <div className="overview-circle-card purple">
          <div className="overview-circle">
            <span>💬</span>
            <strong>{totalFeedback}</strong>
          </div>

          <h3>Feedback</h3>
          <p>Customer responses</p>
        </div>


        <div className="overview-circle-card blue">
          <div className="overview-circle">
            <span>🧠</span>
            <strong>{themes.length}</strong>
          </div>

          <h3>Themes</h3>
          <p>Patterns detected</p>
        </div>


        <div className="overview-circle-card pink">
          <div className="overview-circle">
            <span>⚠</span>
            <strong>{painPoints.length}</strong>
          </div>

          <h3>Pain Points</h3>
          <p>Customer problems</p>
        </div>


        <div className="overview-circle-card green">
          <div className="overview-circle">
            <span>✦</span>
            <strong>{featureOpportunities.length}</strong>
          </div>

          <h3>Opportunities</h3>
          <p>Product ideas</p>
        </div>

      </section>


      {/* MAIN THEMES */}
      <section className="visual-section">

        <div className="visual-section-title">
          <div>
            <span>AI DISCOVERY</span>
            <h2>Main Customer Themes</h2>
            <p>
              Recurring patterns discovered across customer feedback.
            </p>
          </div>

          <div className="round-count">
            {themes.length}
          </div>
        </div>


        <div className="theme-orbit-grid">

          {themes.map((theme, index) => {

            const title = getValue(
              theme,
              ["theme", "name", "title", "label", "text"],
              `Theme ${index + 1}`
            );

            const count = getNumber(
              theme,
              ["count", "frequency", "total", "occurrences"],
              0
            );

            const description = getValue(
              theme,
              ["description", "summary", "details"],
              "Recurring customer feedback pattern."
            );

            const percentage = getPercentage(count);

            return (
              <div
                className="theme-orbit-card"
                key={index}
              >

                <div
                  className="theme-ring"
                  style={{
                    "--ring-color":
                      chartColors[index % chartColors.length],
                    "--progress":
                      `${percentage * 3.6}deg`,
                  }}
                >
                  <div className="theme-ring-inner">
                    <strong>{percentage}%</strong>
                    <span>{count} mentions</span>
                  </div>
                </div>

                <div className="theme-details">
                  <span className="theme-index">
                    0{index + 1}
                  </span>

                  <h3>{title}</h3>

                  <p>{description}</p>
                </div>

              </div>
            );
          })}

        </div>

      </section>


      {/* CATEGORY CHART */}
      <section className="visual-section">

        <div className="visual-section-title">
          <div>
            <span>FEEDBACK ANALYTICS</span>
            <h2>Category Distribution</h2>
            <p>
              Visual breakdown of the feedback categories.
            </p>
          </div>
        </div>


        <div className="category-visual-card">

          {/* DONUT */}
          <div className="donut-area">

            <div
              className="donut-chart"
              style={{
                background: (() => {
                  if (!categoryDistribution.length) {
                    return "conic-gradient(#e5e7eb 0deg 360deg)";
                  }

                  let currentDegree = 0;

                  const segments = categoryDistribution.map(
                    (category, index) => {

                      const count = getNumber(
                        category,
                        ["count", "total", "value", "frequency"],
                        0
                      );

                      const percentage =
                        totalFeedback > 0
                          ? (count / totalFeedback) * 100
                          : 0;

                      const start = currentDegree;
                      const end =
                        currentDegree +
                        percentage * 3.6;

                      currentDegree = end;

                      return `${
                        chartColors[
                          index % chartColors.length
                        ]
                      } ${start}deg ${end}deg`;
                    }
                  );

                  return `conic-gradient(${segments.join(", ")})`;
                })(),
              }}
            >

              <div className="donut-center">
                <strong>{totalFeedback}</strong>
                <span>Feedback</span>
              </div>

            </div>

          </div>


          {/* LEGEND */}
          <div className="category-legend">

            {categoryDistribution.map(
              (category, index) => {

                const name = getValue(
                  category,
                  [
                    "category",
                    "name",
                    "label",
                    "title",
                  ],
                  `Category ${index + 1}`
                );

                const count = getNumber(
                  category,
                  [
                    "count",
                    "total",
                    "value",
                    "frequency",
                  ],
                  0
                );

                const percentage =
                  getPercentage(count);

                return (
                  <div
                    className="legend-item"
                    key={index}
                  >

                    <div className="legend-left">

                      <span
                        className="legend-dot"
                        style={{
                          background:
                            chartColors[
                              index %
                                chartColors.length
                            ],
                        }}
                      ></span>

                      <span>{name}</span>

                    </div>

                    <div className="legend-right">
                      <strong>{count}</strong>
                      <span>{percentage}%</span>
                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </section>


      {/* PAIN POINTS */}
      <section className="visual-section">

        <div className="visual-section-title">
          <div>
            <span>CUSTOMER FRICTION</span>
            <h2>Pain Points</h2>
            <p>
              Problems that are creating friction in the customer journey.
            </p>
          </div>

          <div className="round-count danger">
            {painPoints.length}
          </div>
        </div>


        <div className="pain-circle-grid">

          {painPoints.map((pain, index) => {

            const title = getValue(
              pain,
              [
                "title",
                "name",
                "pain_point",
                "painPoint",
                "theme",
              ],
              `Customer Problem ${index + 1}`
            );

            const description = getValue(
              pain,
              [
                "description",
                "text",
                "summary",
                "details",
              ],
              "Customer feedback indicates a product issue."
            );

            return (
              <div
                className="pain-circle-card"
                key={index}
              >

                <div className="pain-circle-number">
                  {index + 1}
                </div>

                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>

                <div className="pain-hover-arrow">
                  →
                </div>

              </div>
            );
          })}

        </div>

      </section>


      {/* FEATURE REQUESTS */}
      <section className="visual-section">

        <div className="visual-section-title">

          <div>
            <span>CUSTOMER DEMANDS</span>
            <h2>Feature Requests</h2>
            <p>
              Features customers would like to see improved or added.
            </p>
          </div>

          <div className="round-count success">
            {featureRequests.length}
          </div>

        </div>


        <div className="feature-circle-grid">

          {featureRequests.map((feature, index) => {

            const title = getValue(
              feature,
              [
                "feature",
                "name",
                "title",
                "feature_request",
                "featureRequest",
              ],
              `Feature ${index + 1}`
            );

            const description = getValue(
              feature,
              [
                "description",
                "summary",
                "details",
                "text",
              ],
              "Customer-requested product improvement."
            );

            return (
              <div
                className="feature-circle-card"
                key={index}
              >

                <div className="feature-big-icon">
                  ✦
                </div>

                <h3>{title}</h3>

                <p>{description}</p>

                <div className="feature-card-arrow">
                  Explore →
                </div>

              </div>
            );
          })}

        </div>

      </section>


      {/* OPPORTUNITIES */}
      <section className="visual-section">

        <div className="visual-section-title">

          <div>
            <span>PRODUCT INTELLIGENCE</span>
            <h2>Feature Opportunities</h2>
            <p>
              Potential opportunities generated from customer needs.
            </p>
          </div>

        </div>


        <div className="opportunity-circle-grid">

          {featureOpportunities.map(
            (opportunity, index) => {

              const title = getValue(
                opportunity,
                [
                  "feature",
                  "name",
                  "title",
                  "opportunity",
                ],
                `Opportunity ${index + 1}`
              );

              const description = getValue(
                opportunity,
                [
                  "description",
                  "summary",
                  "details",
                  "reason",
                ],
                "Potential product improvement."
              );

              return (
                <div
                  className="opportunity-circle-card"
                  key={index}
                >

                  <div className="opportunity-orb">
                    <span>↗</span>
                  </div>

                  <div>
                    <span className="opportunity-label">
                      OPPORTUNITY
                    </span>

                    <h3>{title}</h3>

                    <p>{description}</p>
                  </div>

                </div>
              );
            }
          )}

        </div>

      </section>


      {/* TRENDS */}
      <section className="visual-section">

        <div className="visual-section-title">

          <div>
            <span>TREND INTELLIGENCE</span>
            <h2>Trend Analysis</h2>
            <p>
              AI-detected trends across the analyzed feedback.
            </p>
          </div>

          <div className="round-count blue">
            {trendFeatures.length}
          </div>

        </div>


        <div className="trend-circle-grid">

          {trendFeatures.map((trend, index) => {

            const title = getValue(
              trend,
              [
                "feature",
                "name",
                "title",
                "theme",
              ],
              `Trend ${index + 1}`
            );

            const trendValue = getValue(
              trend,
              [
                "trend",
                "direction",
                "status",
              ],
              "Stable"
            );

            const description = getValue(
              trend,
              [
                "description",
                "summary",
                "details",
              ],
              "No additional trend details available."
            );

            return (
              <div
                className="trend-circle-card"
                key={index}
              >

                <div className="trend-round">
                  <span>↗</span>
                </div>

                <div className="trend-content">

                  <span className="trend-number">
                    TREND {index + 1}
                  </span>

                  <h3>{title}</h3>

                  <p>{description}</p>

                  <span className="stable-pill">
                    {trendValue}
                  </span>

                </div>

              </div>
            );
          })}

        </div>

      </section>


      {/* COMPLETION */}
      <section className="completion-visual">

        <div className="completion-ring">

          <div>
            <span>✓</span>
          </div>

        </div>

        <div>

          <span>ANALYSIS COMPLETE</span>

          <h2>
            Your customer intelligence is ready.
          </h2>

          <p>
            These insights can now be converted into PRDs,
            user stories, acceptance criteria and roadmap items.
          </p>

        </div>

      </section>


      {/* NEXT STEP */}
      <section className="next-visual-card">

        <div className="next-orb">✦</div>

        <div>
          <span>NEXT STEP</span>

          <h2>
            Turn insights into product requirements.
          </h2>

          <p>
            Generate structured PRDs, user stories and
            acceptance criteria from your AI insights.
          </p>
        </div>

        <div className="next-arrow">
          →
        </div>

      </section>

    </div>
  );
}

export default InsightsPage;