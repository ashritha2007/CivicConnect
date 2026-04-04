import React, { useState } from 'react';
import { Camera, MapPin, Send, Loader2, Megaphone } from 'lucide-react';
import { MapPicker } from './MapComponents';
import { mlService } from '../utils/ml-service';
import confetti from 'canvas-confetti';

const Input = ({ label, icon: Icon, readOnly, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-emerald-600 uppercase tracking-widest ml-1">{label} <span className="text-red-500">*</span></label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
      <input
        {...props}
        readOnly={readOnly}
        className={`w-full bg-slate-50 border border-slate-200 ${Icon ? 'pl-12' : 'px-4'} pr-4 py-4 rounded-2xl outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-800 placeholder:text-slate-400 block`}
      />
    </div>
  </div>
);

export const IssueReportForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Roads',
    state: 'Select location on map',
    district: '',
    locality: '',
    latitude: 0,
    longitude: 0,
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      alert('Please select a location on the map first.');
      return;
    }
    if (!formData.title || !formData.description || !formData.category) {
      alert('Please fill in all the text fields.');
      return;
    }

    if (!photo) {
      alert('Visual Evidence is mandatory. Please upload an image.');
      return;
    }

    setLoading(true);
    
    // Phase 3: ML Validation Layer
    const qualityCheck = await mlService.validateImageQuality(photo);
    if (!qualityCheck.isValid) {
      setLoading(false);
      alert(qualityCheck.reason || "Unclear Information Provided");
      return;
    }

    // Phase 3: Automated Classification
    const aiClassification = await mlService.classifyIssue(formData.title, formData.description);

    const data = new FormData();
    const submissionData = {
      ...formData,
      category: aiClassification.confidence > 85 ? aiClassification.category : formData.category, // Auto-route if high confidence
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      confidence_score: aiClassification.confidence,
      ai_category: aiClassification.category
    };
    Object.entries(submissionData).forEach(([key, value]) => data.append(key, value.toString()));
    if (photo) data.append('photo', photo);

    try {
      const res = await fetch('/api/issues', { method: 'POST', body: data });
      if (res.ok) {
        // Confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        const successMsg = document.createElement('div');
        successMsg.className =
          'fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-emerald-400 z-[100] font-bold animate-bounce';
        successMsg.innerText = 'You\'re a Civic Saviour! Report Submitted Successfully!';
        document.body.appendChild(successMsg);

        setFormData({
          title: '', description: '', category: 'Roads',
          state: 'Andhra Pradesh', district: 'Visakhapatnam',
          locality: '', latitude: 0, longitude: 0,
        });
        setPhoto(null);
        onSuccess();

        setTimeout(() => {
          if (document.body.contains(successMsg)) document.body.removeChild(successMsg);
        }, 2000);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'Failed to submit report'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationDetails = async (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data?.address) {
        setFormData(prev => ({
          ...prev,
          state: data.address.state || prev.state,
          district: data.address.state_district || data.address.county || data.address.city_district || prev.district,
          locality: data.address.suburb || data.address.neighbourhood || data.address.village || data.address.town || data.address.city || prev.locality,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch location details', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 md:p-12 rounded-[2.5rem] space-y-10 relative overflow-hidden shadow-2xl border border-emerald-100"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl -mr-32 -mt-32 pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <Megaphone className="w-8 h-8 text-emerald-500" />
          </div>
          Report Issue
        </h2>
        <p className="text-slate-500 mt-3 text-lg">Help us identify and resolve community problems.</p>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            required
            label="Title"
            placeholder="e.g. Broken Street Light"
            value={formData.title}
            onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-600 uppercase tracking-widest ml-1">Category <span className="text-red-500">*</span></label>
            <select
              className="w-full bg-slate-50 border border-slate-200 px-4 py-4 rounded-2xl outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-800 appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Roads</option>
              <option>Sanitation</option>
              <option>Water Supply</option>
              <option>Electricity</option>
              <option>Public Safety</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-emerald-600 uppercase tracking-widest ml-1">Detailed Description <span className="text-red-500">*</span></label>
          <textarea
            required
            rows={4}
            placeholder="Provide as much detail as possible..."
            className="w-full bg-slate-50 border border-slate-200 px-4 py-4 rounded-2xl outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-800 placeholder:text-slate-400 resize-none block"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="State (Auto)" value={formData.state} readOnly />
          <Input label="District (Auto)" value={formData.district} readOnly />
          <Input label="Locality (Auto)" value={formData.locality} readOnly />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Pinpoint Location
            </label>
            {formData.latitude !== 0 && (
              <span className="text-[10px] text-emerald-500 font-mono">
                COORD: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </span>
            )}
          </div>
          <MapPicker onLocationSelect={fetchLocationDetails} />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Camera className="w-4 h-4" /> Visual Evidence <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
            <div className="w-full py-12 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 group-hover:border-emerald-400 transition-all bg-slate-50">
              <div className="p-4 bg-emerald-50 rounded-full border border-emerald-100">
                <Camera className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-slate-500 font-medium">{photo ? photo.name : 'Click or drag to upload photo'}</p>
              <p className="text-slate-400 text-xs uppercase tracking-widest">Max size: 10MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 relative z-10">
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-emerald-500 text-white py-5 rounded-[2rem] font-bold hover:bg-emerald-600 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 group"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Submit Report <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
