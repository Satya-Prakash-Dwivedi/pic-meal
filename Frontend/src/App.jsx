import React, { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://localhost:8000/recognize", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get response from backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
  };

  const renderValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return (
        <div className="pl-4 space-y-1">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-indigo-600 font-medium capitalize w-28">
                {k.replace(/_/g, " ")}:
              </span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      );
    }
    return <span>{value}</span>;
  };

  const handleAddMeal = async () => {
    if (!result?.item) return;
  
    try {
      const res = await fetch("http://localhost:8000/add-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.item),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Meal saved to database!");
      } else {
        alert("Failed to save meal: " + data.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving meal.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🍽️ AI Nutrition Analyzer
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Upload an image of food and let our AI assistant analyze its nutritional content!
        </p>

        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full cursor-pointer bg-indigo-50 text-indigo-700 font-medium px-4 py-2 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition"
          />

          {preview && (
            <div className="max-w-sm w-full relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-56 object-cover rounded-xl shadow-lg border border-gray-200"
              />
              <button
                onClick={handleRemove}
                className="mt-2 w-full bg-red-100 text-red-600 font-medium py-2 rounded-xl hover:bg-red-200 transition"
              >
                Remove Image
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!image || loading}
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">🤖 AI Insight</h2>
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm space-y-3 text-sm text-gray-700 leading-relaxed">
            {Object.entries(result).map(([key, value]) => (
              <div key={key}>
                <div className="text-indigo-500 font-semibold capitalize mb-1">{key.replace(/_/g, " ")}:</div>
                   {renderValue(value)}
                </div>
              ))}
            </div>
            <button
              onClick={handleAddMeal}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition"
            >
               ➕ Add to Meal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
