import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Tools() {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryType, setSummaryType] = useState("paragraph");
  const [summaryLength, setSummaryLength] = useState(50);
  const [selectedTool, setSelectedTool] = useState("summarize");
  const [expandedCategory, setExpandedCategory] = useState("core");
  const toolsSectionRef = React.useRef(null);
  
  const navigate = useNavigate();

  const toolGroups = [
    {
      id: "core",
      title: "🎓 Core Text Tools",
      tools: [
        { id: "summarize", name: "Summarize", icon: "📝", premium: false, description: "Condense long texts" },
        { id: "humanize", name: "Humanize", icon: "✍️", premium: false, description: "Make AI text natural" },
        { id: "keywords", name: "Keywords", icon: "🗝️", premium: false, description: "Extract key terms" },
        { id: "grammar", name: "Grammar", icon: "✅", premium: false, description: "Check grammar" },
        { id: "paraphrase", name: "Paraphrase", icon: "🔄", premium: false, description: "Rewrite text" },
        { id: "tone", name: "Tone Changer", icon: "🎭", premium: false, description: "Adjust writing tone" },
        { id: "expand", name: "Text Expander", icon: "➕", premium: false, description: "Elaborate text" },
        { id: "simplify", name: "Simplify", icon: "📚", premium: false, description: "Simplify text" },
        { id: "plagiarism", name: "Plagiarism", icon: "🔍", premium: true, description: "Check duplicates" },
      ]
    },
    {
      id: "study",
      title: "📚 Study & Academic",
      tools: [
        { id: "citation", name: "Citations", icon: "📋", premium: false, description: "Generate citations" },
        { id: "flashcards", name: "Flashcards", icon: "🃏", premium: false, description: "Study flashcards" },
        { id: "quiz", name: "Quiz Maker", icon: "❓", premium: false, description: "Practice quizzes" },
        { id: "exam", name: "Exam Prep", icon: "📝", premium: false, description: "Exam preparation" },
        { id: "outline", name: "Essay Outline", icon: "📑", premium: true, description: "Essay structures" },
        { id: "notes", name: "Study Notes", icon: "📖", premium: true, description: "Study materials" },
        { id: "vocab", name: "Vocabulary", icon: "📚", premium: true, description: "Vocabulary lists" },
      ]
    },
    {
      id: "specialized",
      title: "🎓 Specialized",
      tools: [
        { id: "code", name: "Code Explainer", icon: "💻", premium: true, description: "Explain code" },
        { id: "legal", name: "Legal Summary", icon: "⚖️", premium: true, description: "Legal documents" },
        { id: "medical", name: "Medical Terms", icon: "🩺", premium: true, description: "Medical terms" },
        { id: "business", name: "Case Analysis", icon: "📊", premium: true, description: "Business cases" },
        { id: "math", name: "Math Solver", icon: "➗", premium: true, description: "Math problems" },
        { id: "science", name: "Science Helper", icon: "🧪", premium: true, description: "Science concepts" },
        { id: "literature", name: "Lit Analysis", icon: "📚", premium: true, description: "Literature analysis" },
        { id: "history", name: "History Context", icon: "🕰️", premium: true, description: "Historical context" },
      ]
    },
    {
      id: "premium",
      title: "💎 Premium Tools",
      tools: [
        { id: "tutor", name: "AI Tutor", icon: "👨‍🏫", premium: true, description: "Learning assistant" },
        { id: "research", name: "Research Finder", icon: "🔗", premium: true, description: "Find papers" },
        { id: "compare", name: "Doc Compare", icon: "📄", premium: true, description: "Compare docs" },
        { id: "presentation", name: "Presentation", icon: "🎤", premium: true, description: "Presentations" },
        { id: "resume", name: "Resume Builder", icon: "💼", premium: true, description: "Resumes" },
        { id: "scholarship", name: "Scholarship", icon: "💰", premium: true, description: "Scholarship essays" },
        { id: "group", name: "Group Project", icon: "👥", premium: true, description: "Collaboration" },
      ]
    }
  ];

  const handleSubmit = async () => {
    if (!text && !url && !file) return alert("Please add text, URL, or file");
    
    const selectedToolData = getSelectedTool();
    if (selectedToolData?.premium) {
      const upgrade = window.confirm("🔒 This is a premium feature! Upgrade to access this tool.\n\nClick OK to go to pricing page, or Cancel to choose a free tool.");
      if (upgrade) {
        navigate("/pricing");
      }
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (url) formData.append("url", url);
      if (file) formData.append("file", file);

      formData.append("tool", selectedTool);
      formData.append("summaryType", summaryType);
      formData.append("summaryLength", summaryLength);

      const res = await axios.post("http://localhost:5000/api/summarize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSummary(res.data.summary);
    } catch (err) {
      alert("Error processing your request");
      console.error(err);
    }

    setLoading(false);
  };

  const handleToolClick = (toolId, isPremium) => {
    setSelectedTool(toolId);
    if (isPremium) {
      console.log("Premium tool selected");
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };
  

  const downloadSummary = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTool}-result.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getButtonText = () => {
    const tool = getSelectedTool();
    if (!tool) return "Process";
    
    if (loading) return `Processing ${tool.name}...`;
    if (tool.premium) return "Upgrade to Use";
    return `Run ${tool.name}`;
  };

  const getSelectedTool = () => {
    return toolGroups.flatMap(g => g.tools).find(t => t.id === selectedTool);
  };

  const selectedToolData = getSelectedTool();

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">     
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Nyx AI Tools Hub
          </h2>
          <p className="text-lg text-body mb-6 max-w-2xl mx-auto">
            25+ AI-powered tools for students. Everything in one place.
          </p>
          
          {/* Stats Grid */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="premium-card px-6 py-4 min-w-[120px] text-center interactive-glow">
              <div className="text-2xl font-bold text-accent-blue">25+</div>
              <div className="text-sm text-body mt-1">AI Tools</div>
            </div>
            <div className="premium-card px-6 py-4 min-w-[120px] text-center interactive-glow">
              <div className="text-2xl font-bold text-accent-blue">12</div>
              <div className="text-sm text-body mt-1">Free Tools</div>
            </div>
            <div className="premium-card px-6 py-4 min-w-[120px] text-center interactive-glow">
              <div className="text-2xl font-bold text-accent-blue">13</div>
              <div className="text-sm text-body mt-1">Premium</div>
            </div>
            <div className="premium-card px-6 py-4 min-w-[120px] text-center interactive-glow">
              <div className="text-2xl font-bold text-accent-blue">8</div>
              <div className="text-sm text-body mt-1">Disciplines</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tools Section - Sidebar Layout */}
      <div className="min-h-screen">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - Tool Categories */}
          <div className="w-full lg:w-64 bg-primary-medium/50 border-r border-primary-light/20">
            <div className="p-4 sticky top-20">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-headline">AI Tools</h3>
                <p className="text-xs text-body mb-3">Select a tool to start</p>
                
                <div className="flex items-center gap-2 text-xs text-body mb-2">
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1"></span>
                    <span>Free</span>
                  </span>
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-accent-blue rounded-full mr-1"></span>
                    <span>Premium</span>
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-1">
                {toolGroups.map((category) => (
                  <div key={category.id} className="mb-2">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex justify-between items-center w-full p-2 rounded-lg hover:bg-primary-light/20 transition-colors text-left text-sm"
                    >
                      <span className="font-medium text-headline truncate">{category.title}</span>
                      <span className="text-accent-blue text-sm">
                        {expandedCategory === category.id ? '−' : '+'}
                      </span>
                    </button>
                    
                    {expandedCategory === category.id && (
                      <div className="mt-1 space-y-1 ml-1">
                        {category.tools.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => handleToolClick(tool.id, tool.premium)}
                            className={`flex items-center gap-2 w-full p-2 rounded-lg transition-all duration-300 ${
                              selectedTool === tool.id 
                                ? 'bg-accent-blue/20 border-l-2 border-accent-blue' 
                                : 'hover:bg-primary-light/10'
                            }`}
                          >
                            <span className="text-base">{tool.icon}</span>
                            <div className="flex-1 text-left min-w-0">
                              <div className="font-medium text-sm text-headline truncate">{tool.name}</div>
                            </div>
                            {tool.premium ? (
                              <span className="badge premium text-[10px] px-1">PRO</span>
                            ) : (
                              <span className="badge free text-[10px] px-1">FREE</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="p-4 lg:p-6">
              {/* Tool Header */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">{selectedToolData?.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-headline truncate">{selectedToolData?.name || "Select a Tool"}</h2>
                    <p className="text-sm text-body truncate">{selectedToolData?.description || "Choose a tool from the sidebar"}</p>
                  </div>
                  {selectedToolData && (
                    <div>
                      {selectedToolData.premium ? (
                        <span className="badge premium text-xs">PREMIUM</span>
                      ) : (
                        <span className="badge free text-xs">FREE</span>
                      )}
                    </div>
                  )}
                </div>
                
                {selectedToolData?.premium && (
                  <div className="p-3 bg-accent-blue/10 border border-accent-blue/30 rounded-lg mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-accent-blue">🔒</span>
                      <div className="flex-1">
                        <p className="text-headline font-medium">Premium Tool - Upgrade Required</p>
                      </div>
                      <button
                        onClick={() => navigate("/pricing")}
                        className="btn-secondary text-xs py-1 px-3 interactive-glow"
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Section */}
              {selectedToolData ? (
                <div className="premium-card p-4 interactive-glow mb-6">
                  <div className="space-y-4">
                    {/* Input Fields */}
                    <div>
                      <label className="block text-sm font-medium text-body mb-2">
                        Enter your content:
                      </label>
                      <textarea
                        className="input-field h-32 text-sm"
                        placeholder="Paste your text here, or use the options below..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                    </div>

                    {/* Alternative Input Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-body mb-1">
                          Or enter a URL:
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com"
                          className="input-field text-sm py-2"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-body mb-1">
                          Or upload a file:
                        </label>
                        <input
                          type="file"
                          accept=".txt,.docx,.pdf,.jpg,.png"
                          className="input-field text-sm py-2"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </div>
                    </div>

                    {/* Tool-specific Options */}
                    {(selectedTool === "summarize" || selectedTool === "tone" || selectedTool === "expand") && (
                      <div className="p-3 bg-primary-light/30 rounded-lg text-sm">
                        <h4 className="font-medium text-headline mb-2">Tool Settings</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-body mb-1">Output Format:</label>
                            <select 
                              value={summaryType} 
                              onChange={(e) => setSummaryType(e.target.value)} 
                              className="input-field text-sm py-2"
                            >
                              <option value="paragraph">Paragraph</option>
                              <option value="bullets">Bullet Points</option>
                              <option value="bestline">Key Sentences</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-body mb-1">
                              Output Length: <span className="text-accent-blue font-semibold">{summaryLength}%</span>
                            </label>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={summaryLength}
                              onChange={(e) => setSummaryLength(e.target.value)}
                              className="w-full accent-accent-blue"
                            />
                            <div className="flex justify-between text-xs text-body mt-1">
                              <span>Shorter</span>
                              <span>Longer</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <button
                        onClick={handleSubmit}
                        disabled={loading || (selectedToolData?.premium && !text && !url && !file)}
                        className={`btn-primary flex-1 py-3 text-sm font-semibold interactive-glow ${
                          selectedToolData?.premium ? 'opacity-90' : ''
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="loading-spinner"></div>
                            Processing...
                          </span>
                        ) : getButtonText()}
                      </button>
                      
                      <button
                        onClick={() => {
                          setText(""); 
                          setUrl(""); 
                          setFile(null); 
                          setSummary("");
                        }}
                        className="btn-secondary py-3 px-4 text-sm font-semibold interactive-glow"
                      >
                        Clear
                      </button>
                    </div>

                    {/* Results Section */}
                    {summary && (
                      <div className="premium-card mt-4 p-4 interactive-glow">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-lg text-headline">Results</h3>
                          <div className="flex gap-2">
                            <span className="badge premium text-xs">
                              {selectedTool.toUpperCase()}
                            </span>
                            <button
                              onClick={downloadSummary}
                              className="btn-success text-xs py-1 px-3 interactive-glow"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                        <div className="bg-primary-light/30 p-4 rounded-lg border border-primary-light/50 max-h-60 overflow-y-auto">
                          <p className="text-sm text-body whitespace-pre-wrap leading-relaxed">{summary}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => navigator.clipboard.writeText(summary)}
                            className="btn-secondary flex-1 text-sm py-2 interactive-glow"
                          >
                            📋 Copy
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="btn-secondary flex-1 text-sm py-2 interactive-glow"
                          >
                            🖨️ Print
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="premium-card p-8 text-center interactive-glow">
                  <div className="text-4xl mb-4">🔧</div>
                  <h3 className="text-lg font-bold text-headline mb-3">Select a Tool to Begin</h3>
                  <p className="text-sm text-body mb-4 max-w-md mx-auto">
                    Choose any tool from the sidebar to start.
                  </p>
                  <div className="inline-flex flex-wrap gap-2 justify-center">
                    <span className="badge free text-xs">12 Free Tools</span>
                    <span className="badge premium text-xs">13 Premium</span>
                  </div>
                </div>
              )}

              {/* Quick Tips */}
              {selectedToolData && (
                <div className="premium-card p-4 interactive-glow text-sm">
                  <h4 className="font-medium text-headline mb-2">💡 Tips:</h4>
                  <ul className="space-y-1 text-body">
                    <li className="flex items-start gap-1">
                      <span className="text-accent-blue mt-0.5">•</span>
                      <span>Provide clear text for better analysis</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-accent-blue mt-0.5">•</span>
                      <span>Break long documents into sections</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-accent-blue mt-0.5">•</span>
                      <span>Use length slider for detail control</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="section-container px-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-headline">Why Nyx AI Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="feature-card interactive-glow p-4">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-headline mb-2">Instant Results</h3>
              <p className="text-sm text-body">
                Get results in seconds. Perfect for deadlines.
              </p>
            </div>
            <div className="feature-card interactive-glow p-4">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-headline mb-2">Specialized</h3>
              <p className="text-sm text-body">
                Tools designed for academic work.
              </p>
            </div>
            <div className="feature-card interactive-glow p-4">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-semibold text-headline mb-2">Easy Switching</h3>
              <p className="text-sm text-body">
                Switch tools instantly. No reload needed.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="section-container px-4 mt-6">
          <div className="bg-gradient-to-r from-accent-blue/10 to-accent-blue/5 border border-accent-blue/30 
                          py-8 rounded-xl p-6 text-center interactive-glow">
            <h2 className="text-2xl font-bold mb-3 text-headline">Access All 25+ Tools</h2>
            <p className="mb-6 text-body">
              Upgrade to Premium for unlimited access
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
             
              <button
                onClick={() => navigate("/pricing")}
                className="btn-secondary text-sm interactive-glow py-3"
              >
                Upgrade → $9.99/month
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}