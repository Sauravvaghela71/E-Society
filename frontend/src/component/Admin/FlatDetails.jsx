import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  User, MapPin, Hash, Phone, Mail,
  Info, ShieldCheck, Users,
  Car, Calendar, X, Home, Layers, FileText,
  Search, Building2, CheckCircle2, XCircle,
  IndianRupee, Wrench, Receipt, Edit3, Save, AlertCircle,
  Settings2, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';

const API = 'http://localhost:5100/api';
const CURRENT_YEAR = new Date().getFullYear();

const BHK_TYPES = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'];

// Default BHK config stored in localStorage
const DEFAULT_BHK_CONFIG = {
  '1 BHK': { propertyValue: 2000000, rent: 8000,  maintenanceCost: 1500, tax: 12000, area: '550 Sq.Ft'  },
  '2 BHK': { propertyValue: 3500000, rent: 14000, maintenanceCost: 2500, tax: 20000, area: '900 Sq.Ft'  },
  '3 BHK': { propertyValue: 5500000, rent: 22000, maintenanceCost: 3500, tax: 30000, area: '1300 Sq.Ft' },
  '4 BHK': { propertyValue: 7500000, rent: 32000, maintenanceCost: 5000, tax: 42000, area: '1700 Sq.Ft' },
  '5 BHK': { propertyValue: 10000000,rent: 45000, maintenanceCost: 7000, tax: 60000, area: '2200 Sq.Ft' },
};

const loadBhkConfig = () => {
  try {
    const saved = localStorage.getItem('bhkConfig');
    return saved ? JSON.parse(saved) : DEFAULT_BHK_CONFIG;
  } catch { return DEFAULT_BHK_CONFIG; }
};

const saveBhkConfig = (cfg) => {
  localStorage.setItem('bhkConfig', JSON.stringify(cfg));
};

// ─── Format currency ──────────────────────────────────────────────────────────
const fmt = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

// ─── Reusable Detail Item ─────────────────────────────────────────────────────
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 group">
    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex-shrink-0">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="min-w-0">
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-slate-700 font-bold text-lg break-words">{value || '—'}</p>
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ value }) => {
  const isActive = value?.toLowerCase() === 'active';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {value || 'Unknown'}
    </span>
  );
};

// ─── BHK Configuration Panel ──────────────────────────────────────────────────
const BhkConfigPanel = ({ config, onChange, flats, onApplyAll }) => {
  const [open, setOpen]       = useState(false);
  const [draft, setDraft]     = useState(config);
  const [saved, setSaved]     = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState(null); // { success, failed }

  const handleField = (bhk, field, val) => {
    setDraft(prev => ({ ...prev, [bhk]: { ...prev[bhk], [field]: val } }));
    setSaved(false);
  };

  const handleSave = () => {
    saveBhkConfig(draft);
    onChange(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setDraft(DEFAULT_BHK_CONFIG);
    setSaved(false);
  };

  // Bulk-apply: for every flat that has a bhkType, PUT the config defaults
  const handleApplyAll = async () => {
    const flatsWithBhk = flats.filter(f => f.bhkType && draft[f.bhkType]);
    if (!flatsWithBhk.length) {
      alert('No flats with a BHK type assigned. Assign a BHK type to flats first.');
      return;
    }
    if (!window.confirm(`Apply BHK config defaults to ${flatsWithBhk.length} flat(s)? This will overwrite their rent, maintenance, tax, area and property value.`)) return;

    setApplying(true);
    setApplyResult(null);
    let success = 0, failed = 0;

    await Promise.allSettled(
      flatsWithBhk.map(async (flat) => {
        const cfg = draft[flat.bhkType];
        try {
          const res = await axios.put(`${API}/flats/${flat._id}`, {
            bhkType:         flat.bhkType,
            propertyValue:   cfg.propertyValue   || null,
            rent:            cfg.rent            || null,
            maintenanceCost: cfg.maintenanceCost || null,
            tax:             cfg.tax             || null,
            area:            cfg.area            || null,
          });
          onApplyAll(res.data.data); // update parent state
          success++;
        } catch { failed++; }
      })
    );

    setApplyResult({ success, failed });
    setApplying(false);
    setTimeout(() => setApplyResult(null), 4000);
  };

  const BHK_COLORS = ['bg-violet-50 border-violet-200','bg-blue-50 border-blue-200','bg-emerald-50 border-emerald-200','bg-amber-50 border-amber-200','bg-rose-50 border-rose-200'];
  const BHK_TEXT   = ['text-violet-700','text-blue-700','text-emerald-700','text-amber-700','text-rose-700'];

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-indigo-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <Settings2 size={18} />
          </div>
          <div className="text-left">
            <p className="font-black text-slate-800 text-sm">BHK Price Configuration</p>
            <p className="text-slate-400 text-xs font-medium">Set default property value, rent, maintenance &amp; tax per BHK type</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Admin Only</span>
          {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-indigo-100 p-6 space-y-4">
          {/* Column headers */}
          <div className="grid grid-cols-6 gap-3 text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">
            <div>BHK Type</div>
            <div>Property Value (₹)</div>
            <div>Monthly Rent (₹)</div>
            <div>Maintenance/mo (₹)</div>
            <div>Annual Tax (₹)</div>
            <div>Area</div>
          </div>

          {BHK_TYPES.map((bhk, idx) => (
            <div key={bhk} className={`grid grid-cols-6 gap-3 items-center p-3 rounded-xl border ${BHK_COLORS[idx]}`}>
              <div className={`font-black text-sm ${BHK_TEXT[idx]}`}>{bhk}</div>
              {['propertyValue','rent','maintenanceCost','tax'].map(field => (
                <div key={field} className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    value={draft[bhk]?.[field] ?? ''}
                    onChange={e => handleField(bhk, field, e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    className="w-full border border-white/80 bg-white rounded-lg pl-6 pr-2 py-1.5 text-sm font-semibold outline-none focus:border-indigo-400 shadow-sm"
                  />
                </div>
              ))}
              <input
                type="text"
                value={draft[bhk]?.area ?? ''}
                onChange={e => handleField(bhk, 'area', e.target.value)}
                placeholder="e.g. 900 Sq.Ft"
                className="border border-white/80 bg-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-400 shadow-sm"
              />
            </div>
          ))}

          {/* Apply result toast */}
          {applyResult && (
            <div className={`rounded-xl px-4 py-3 text-sm font-bold flex items-center gap-2 ${
              applyResult.failed === 0 ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-amber-50 border border-amber-200 text-amber-700'
            }`}>
              <Sparkles size={15}/>
              Applied to {applyResult.success} flat(s) successfully{applyResult.failed > 0 ? `, ${applyResult.failed} failed.` : '!'}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
            <button onClick={handleReset} className="text-xs font-bold text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors">
              Reset to Defaults
            </button>
            <div className="flex items-center gap-3">
              {/* BULK APPLY button */}
              <button
                onClick={handleApplyAll}
                disabled={applying}
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 disabled:opacity-60"
              >
                <Sparkles size={15} />
                {applying ? 'Applying...' : 'Apply to All Flats'}
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                  saved ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
                }`}
              >
                <Save size={15} /> {saved ? '✓ Saved!' : 'Save Config'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Flat Card ─────────────────────────────────────────────────────────────────
const FlatCard = ({ flat, onClick, bhkConfig, onBhkChange }) => {
  const [bhkOpen, setBhkOpen] = useState(false);
  const [saving,  setSaving]  = useState(false);

  const isVacant      = flat.status === 'Vacant';
  const isMaintenance = flat.status === 'Maintenance';
  const flatAge       = flat.yearBuilt ? `${CURRENT_YEAR - flat.yearBuilt} yrs` : null;

  // Use flat's saved value; fall back to BHK config default
  const cfg            = (flat.bhkType && bhkConfig?.[flat.bhkType]) || {};
  const rent           = flat.rent            ?? cfg.rent            ?? null;
  const maint          = flat.maintenanceCost ?? cfg.maintenanceCost ?? null;
  const tax            = flat.tax             ?? cfg.tax             ?? null;
  const propVal        = flat.propertyValue   ?? cfg.propertyValue   ?? null;
  const rentFromCfg    = !flat.rent            && cfg.rent;
  const maintFromCfg   = !flat.maintenanceCost && cfg.maintenanceCost;
  const taxFromCfg     = !flat.tax             && cfg.tax;
  const propFromCfg    = !flat.propertyValue   && cfg.propertyValue;
  const anyFromCfg     = rentFromCfg || maintFromCfg || taxFromCfg || propFromCfg;

  const colorSet = isVacant
    ? { border: 'border-emerald-200 hover:border-emerald-400', badge: 'bg-emerald-100 text-emerald-700', bg: 'bg-emerald-500', text: 'text-emerald-700' }
    : isMaintenance
    ? { border: 'border-amber-200 hover:border-amber-400',  badge: 'bg-amber-100 text-amber-700',   bg: 'bg-amber-500',   text: 'text-amber-700'   }
    : { border: 'border-indigo-200 hover:border-indigo-400',badge: 'bg-indigo-100 text-indigo-700', bg: 'bg-indigo-500',  text: 'text-indigo-700'  };

  const BHK_BTN_COLORS = {
    '1 BHK': 'bg-violet-500 hover:bg-violet-600',
    '2 BHK': 'bg-blue-500   hover:bg-blue-600',
    '3 BHK': 'bg-emerald-500 hover:bg-emerald-600',
    '4 BHK': 'bg-amber-500  hover:bg-amber-600',
    '5 BHK': 'bg-rose-500   hover:bg-rose-600',
  };

  // Quick-assign BHK directly from card tile — no modal needed
  const handleBhkSelect = async (e, bhk) => {
    e.stopPropagation();
    setBhkOpen(false);
    setSaving(true);
    try {
      const cfgData = bhkConfig?.[bhk] || {};
      const payload = {
        bhkType:         bhk || null,
        rent:            cfgData.rent            || null,
        maintenanceCost: cfgData.maintenanceCost || null,
        tax:             cfgData.tax             || null,
        area:            cfgData.area            || null,
        propertyValue:   cfgData.propertyValue   || null,
      };
      const res = await axios.put(`${API}/flats/${flat._id}`, payload);
      onBhkChange?.(res.data.data);
    } catch (err) { console.error('BHK assign failed:', err); }
    finally { setSaving(false); }
  };

  const FinCell = ({ icon: Icon, color, value, fromCfg, suffix = '' }) => (
    <div className="flex items-center gap-1.5">
      <Icon size={11} className={`${color} flex-shrink-0`} />
      <span className={`text-xs font-bold truncate ${
        value
          ? fromCfg ? 'text-slate-400 italic' : 'text-slate-700'
          : 'text-slate-300'
      }`}>
        {value ? `₹${Number(value).toLocaleString('en-IN')}${suffix}${fromCfg ? '*' : ''}` : '—'}
      </span>
    </div>
  );

  return (
    <div
      onClick={() => { if (!bhkOpen) onClick(flat); }}
      className={`relative bg-white rounded-2xl border-2 p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-visible group ${colorSet.border}`}
    >
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 ${colorSet.bg}`} />
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {saving
          ? <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"/>
          : <Edit3 size={14} className="text-slate-400" />}
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Flat No.</p>
          <h3 className={`text-2xl font-black tracking-tight ${colorSet.text}`}>{flat.flatNumber}</h3>
        </div>
        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider ${colorSet.badge}`}>{flat.status}</span>
      </div>

      {/* Wing / Floor / BHK row */}
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="bg-slate-50 rounded-xl p-2">
          <p className="text-slate-400 text-[9px] font-bold uppercase">Wing</p>
          <p className="text-slate-700 font-black text-sm mt-0.5">{flat.wing || '—'}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-2">
          <p className="text-slate-400 text-[9px] font-bold uppercase">Floor</p>
          <p className="text-slate-700 font-black text-sm mt-0.5">{flat.floor || '—'}</p>
        </div>

        {/* ── BHK Tile: click to open inline picker ── */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setBhkOpen(p => !p); }}
            title="Click to assign BHK type"
            className={`w-full rounded-xl p-2 transition-all border-2 ${
              flat.bhkType
                ? 'bg-violet-50 border-violet-200 hover:bg-violet-100 hover:border-violet-400'
                : 'bg-slate-50 border-dashed border-slate-300 hover:bg-indigo-50 hover:border-indigo-400'
            }`}
          >
            <p className="text-slate-400 text-[9px] font-bold uppercase">BHK</p>
            <p className={`font-black text-sm mt-0.5 ${ flat.bhkType ? 'text-violet-700' : 'text-indigo-400' }`}>
              {saving ? '…' : flat.bhkType ? flat.bhkType.replace(' BHK', '') : '+'}
            </p>
          </button>

          {/* Inline BHK Picker Popup */}
          {bhkOpen && (
            <>
              {/* backdrop */}
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setBhkOpen(false); }} />
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-indigo-100 p-3 w-52"
                style={{ animation: 'popInUp 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}
                onClick={e => e.stopPropagation()}
              >
                <style>{`@keyframes popInUp{from{transform:translateX(-50%) scale(0.85) translateY(8px);opacity:0}to{transform:translateX(-50%) scale(1) translateY(0);opacity:1}}`}</style>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 text-center">Select BHK Type</p>
                <div className="flex flex-col gap-1.5">
                  {BHK_TYPES.map(bhk => (
                    <button
                      key={bhk}
                      onClick={(e) => handleBhkSelect(e, bhk)}
                      className={`w-full text-white text-xs font-black py-2 rounded-xl transition-all shadow-sm flex items-center justify-between px-3 ${
                        BHK_BTN_COLORS[bhk]
                      } ${flat.bhkType === bhk ? 'ring-2 ring-offset-1 ring-white/60' : ''}`}
                    >
                      <span>{bhk}</span>
                      {bhkConfig?.[bhk]?.rent && (
                        <span className="opacity-70 font-normal text-[10px]">
                          ₹{Number(bhkConfig[bhk].rent).toLocaleString('en-IN')}/mo
                        </span>
                      )}
                    </button>
                  ))}
                  {flat.bhkType && (
                    <button
                      onClick={(e) => handleBhkSelect(e, '')}
                      className="w-full text-slate-500 bg-slate-100 hover:bg-slate-200 text-xs font-bold py-1.5 rounded-xl transition-all mt-0.5"
                    >
                      Clear BHK
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Property Value Banner — shown above financial row */}
      {propVal ? (
        <div className={`mb-3 rounded-xl px-3 py-2 flex items-center justify-between ${
          propFromCfg ? 'bg-slate-50 border border-dashed border-slate-200' : 'bg-indigo-50 border border-indigo-100'
        }`}>
          <div className="flex items-center gap-1.5">
            <IndianRupee size={12} className={propFromCfg ? 'text-slate-400' : 'text-indigo-500'} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Property Value</span>
          </div>
          <span className={`font-black text-sm ${propFromCfg ? 'text-slate-400 italic' : 'text-indigo-700'}`}>
            ₹{Number(propVal).toLocaleString('en-IN')}{propFromCfg ? '*' : ''}
          </span>
        </div>
      ) : flat.bhkType ? (
        <div className="mb-3 rounded-xl px-3 py-2 flex items-center justify-between bg-slate-50 border border-dashed border-slate-200">
          <div className="flex items-center gap-1.5">
            <IndianRupee size={12} className="text-slate-300" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Property Value</span>
          </div>
          <span className="text-slate-300 font-bold text-sm">—</span>
        </div>
      ) : null}

      <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-2">
        <FinCell icon={IndianRupee} color="text-emerald-500" value={rent}  fromCfg={rentFromCfg}  suffix="/mo" />
        <FinCell icon={Wrench}      color="text-amber-500"   value={maint} fromCfg={maintFromCfg} suffix="/mo" />
        <FinCell icon={Receipt}     color="text-rose-500"    value={tax}   fromCfg={taxFromCfg}   suffix="/yr" />
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-blue-500 flex-shrink-0" />
          <span className={`text-xs font-bold ${flatAge ? 'text-slate-700' : 'text-slate-300'}`}>{flatAge || '—'}</span>
        </div>
      </div>

      {flat.residentName && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <User size={11} className="text-indigo-400 flex-shrink-0" />
          <span className="text-indigo-600 text-xs font-bold truncate">{flat.residentName}</span>
        </div>
      )}

      {anyFromCfg && flat.bhkType && (
        <p className="mt-1.5 text-[9px] text-slate-400 italic">* BHK config default — click to save</p>
      )}
    </div>
  );
};

// ─── Flat Edit Modal ───────────────────────────────────────────────────────────
const FlatModal = ({ flat, bhkConfig, onClose, onSave }) => {
  const [form, setForm]     = useState({
    bhkType:         flat.bhkType         || '',
    rent:            flat.rent            ?? '',
    yearBuilt:       flat.yearBuilt       ?? '',
    maintenanceCost: flat.maintenanceCost ?? '',
    tax:             flat.tax             ?? '',
    area:            flat.area            || '',
    propertyValue:   flat.propertyValue   ?? '',
    status:          flat.status          || 'Vacant',
  });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [autoFilled, setAutoFilled] = useState(false);

  const flatAge = form.yearBuilt ? CURRENT_YEAR - Number(form.yearBuilt) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setAutoFilled(false);

    // Auto-fill from BHK config when BHK type changes
    if (name === 'bhkType' && value && bhkConfig[value]) {
      const cfg = bhkConfig[value];
      setForm(prev => ({
        ...prev,
        bhkType:         value,
        rent:            cfg.rent            ?? prev.rent,
        maintenanceCost: cfg.maintenanceCost ?? prev.maintenanceCost,
        tax:             cfg.tax             ?? prev.tax,
        area:            cfg.area            || prev.area,
        propertyValue:   cfg.propertyValue   ?? prev.propertyValue,
      }));
      setAutoFilled(true);
      setTimeout(() => setAutoFilled(false), 3000);
    }
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        rent:            form.rent            !== '' ? Number(form.rent)            : null,
        yearBuilt:       form.yearBuilt       !== '' ? Number(form.yearBuilt)       : null,
        maintenanceCost: form.maintenanceCost !== '' ? Number(form.maintenanceCost) : null,
        tax:             form.tax             !== '' ? Number(form.tax)             : null,
        propertyValue:   form.propertyValue   !== '' ? Number(form.propertyValue)   : null,
      };
      const res = await axios.put(`${API}/flats/${flat._id}`, payload);
      onSave(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const totalMonthly = (Number(form.rent)||0) + (Number(form.maintenanceCost)||0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 max-h-[92vh] overflow-y-auto"
        style={{ animation: 'popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <style>{`@keyframes popIn { from{transform:scale(0.9);opacity:0} to{transform:scale(1);opacity:1} }`}</style>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-black text-slate-800">Flat {flat.flatNumber}</h2>
            <p className="text-slate-400 text-sm font-medium">Wing {flat.wing} &bull; Floor {flat.floor}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Auto-fill notice */}
          {autoFilled && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 text-indigo-700 text-sm font-semibold">
              <Sparkles size={16} className="text-indigo-500" />
              Values auto-filled from BHK Configuration! You can edit them below.
            </div>
          )}

          {/* Status Banner */}
          <div className={`rounded-2xl px-5 py-3 flex items-center justify-between ${
            flat.status==='Vacant' ? 'bg-emerald-50 border border-emerald-200'
            : flat.status==='Maintenance' ? 'bg-amber-50 border border-amber-200'
            : 'bg-indigo-50 border border-indigo-200'
          }`}>
            <div className="flex items-center gap-3">
              <Home size={20} className={flat.status==='Vacant'?'text-emerald-600':flat.status==='Maintenance'?'text-amber-600':'text-indigo-600'} />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                <p className={`font-black text-lg ${flat.status==='Vacant'?'text-emerald-700':flat.status==='Maintenance'?'text-amber-700':'text-indigo-700'}`}>{flat.status}</p>
              </div>
            </div>
            {flat.residentName && (
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Resident</p>
                <p className="font-bold text-indigo-700">{flat.residentName}</p>
              </div>
            )}
          </div>

          {/* BHK & Area */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Building2 size={13}/> Flat Type & Size</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">BHK Type <span className="text-rose-500">*</span></label>
                <select name="bhkType" value={form.bhkType} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-indigo-400 bg-white shadow-sm">
                  <option value="">Select BHK</option>
                  {BHK_TYPES.map(b => <option key={b}>{b}</option>)}
                </select>
                {bhkConfig[form.bhkType] && (
                  <p className="text-indigo-500 text-[10px] font-bold mt-1 flex items-center gap-1">
                    <Sparkles size={10}/> Defaults loaded — edit as needed
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Area (Sq.Ft)</label>
                <input type="text" name="area" value={form.area} onChange={handleChange} placeholder="e.g. 1200 Sq.Ft"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 shadow-sm"/>
              </div>
            </div>
          </div>

          {/* Property Value */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><IndianRupee size={13}/> Property Value & Financial Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Property Value (₹) — Flat Price</label>
                <div className="relative">
                  <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input type="number" name="propertyValue" value={form.propertyValue} onChange={handleChange} placeholder="e.g. 2000000" min="0"
                    className="w-full border-2 border-indigo-200 rounded-xl pl-8 pr-3 py-3 text-base font-black outline-none focus:border-indigo-500 shadow-sm text-indigo-800"/>
                </div>
                {form.propertyValue && (
                  <p className="text-indigo-600 text-xs font-bold mt-1">
                    = {fmt(form.propertyValue)} &nbsp;({Number(form.propertyValue).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })})
                  </p>
                )}
              </div>
            </div>

            {/* Rent, Maintenance, Tax */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Monthly Rent (₹)</label>
                <div className="relative">
                  <IndianRupee size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500"/>
                  <input type="number" name="rent" value={form.rent} onChange={handleChange} placeholder="0" min="0"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-2 py-2.5 text-sm outline-none focus:border-emerald-400 shadow-sm"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Maintenance (₹/mo)</label>
                <div className="relative">
                  <Wrench size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-500"/>
                  <input type="number" name="maintenanceCost" value={form.maintenanceCost} onChange={handleChange} placeholder="0" min="0"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-2 py-2.5 text-sm outline-none focus:border-amber-400 shadow-sm"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Annual Tax (₹/yr)</label>
                <div className="relative">
                  <Receipt size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-rose-500"/>
                  <input type="number" name="tax" value={form.tax} onChange={handleChange} placeholder="0" min="0"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-2 py-2.5 text-sm outline-none focus:border-rose-400 shadow-sm"/>
                </div>
              </div>
            </div>
          </div>

          {/* Flat Age */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Calendar size={13}/> Flat Age</h3>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Year Built</label>
                <input type="number" name="yearBuilt" value={form.yearBuilt} onChange={handleChange}
                  placeholder={`e.g. ${CURRENT_YEAR - 10}`} min="1900" max={CURRENT_YEAR}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 shadow-sm"/>
              </div>
              {flatAge !== null && flatAge >= 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
                  <Calendar size={20} className="text-blue-500"/>
                  <div>
                    <p className="text-blue-400 text-[10px] font-bold uppercase">Flat Age</p>
                    <p className="text-blue-700 font-black text-lg">{flatAge} Years</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cost Summary */}
          {(form.rent || form.maintenanceCost || form.tax || form.propertyValue) && (
            <div className="bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 border border-indigo-100 rounded-2xl p-5">
              <p className="text-indigo-500 text-xs font-black uppercase tracking-wider mb-4">📊 Cost Summary</p>
              <div className="grid grid-cols-4 gap-3 text-center">
                {form.propertyValue && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Property Value</p>
                    <p className="text-indigo-700 font-black text-sm mt-1">{fmt(form.propertyValue)}</p>
                  </div>
                )}
                {form.rent && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Monthly Rent</p>
                    <p className="text-emerald-700 font-black text-sm mt-1">{fmt(form.rent)}</p>
                  </div>
                )}
                {form.maintenanceCost && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Maintenance</p>
                    <p className="text-amber-700 font-black text-sm mt-1">{fmt(form.maintenanceCost)}</p>
                  </div>
                )}
                {form.tax && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Annual Tax</p>
                    <p className="text-rose-700 font-black text-sm mt-1">{fmt(form.tax)}</p>
                  </div>
                )}
              </div>
              {totalMonthly > 0 && (
                <div className="mt-3 pt-3 border-t border-indigo-100 text-center">
                  <span className="text-indigo-600 text-xs font-black uppercase">Total Monthly: </span>
                  <span className="text-indigo-800 font-black">{fmt(totalMonthly)}/month</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-semibold">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={onClose} className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-200 flex items-center gap-2 disabled:opacity-60">
              <Save size={16}/> {saving ? 'Saving...' : 'Save Flat Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main FlatDetails Component ───────────────────────────────────────────────
const FlatDetails = ({ resident, onClose }) => {
  if (resident) {
    const fullName = `${resident.firstName || ''} ${resident.lastName || ''}`.trim() || 'N/A';
    const moveIn   = resident.moveInDate  ? new Date(resident.moveInDate).toLocaleDateString('en-IN',  { day:'2-digit', month:'long', year:'numeric' }) : null;
    const dob      = resident.dateOfBirth ? new Date(resident.dateOfBirth).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' }) : null;

    return (
      <div className="fixed inset-0 z-50 flex justify-end"
        style={{ background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div className="relative w-full max-w-2xl h-full bg-slate-50 overflow-y-auto shadow-2xl"
          style={{ animation:'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
          <style>{`@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

          <div className="sticky top-0 z-10 flex items-center justify-between bg-white border-b border-slate-100 px-6 py-4 shadow-sm">
            <div><h2 className="text-xl font-black text-slate-800 tracking-tight">Flat Details</h2><p className="text-slate-400 text-sm font-medium">Resident Information</p></div>
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><X size={20}/></button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
              <div className="absolute -right-6 -bottom-6 opacity-10"><Home size={120}/></div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30"><Hash size={30} className="text-white"/></div>
                <div>
                  <p className="text-indigo-200 text-sm font-semibold">Flat Number</p>
                  <h3 className="text-3xl font-black text-white tracking-tight">{resident.flatNumber||'N/A'}</h3>
                  <p className="text-indigo-300 text-sm font-bold mt-0.5">Wing {resident.wing||'—'} &bull; Floor {resident.floor||'—'}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[['Resident Type',resident.residentType],['BHK Type',resident.bhkType],['Status',resident.status]].map(([l,v])=>(
                  <div key={l} className="bg-white/10 rounded-xl p-3 border border-white/20">
                    <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">{l}</p>
                    <p className={`font-bold mt-0.5 ${l==='Status'?(v==='Active'?'text-emerald-300':'text-red-300'):'text-white'}`}>{v||'—'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><User className="text-indigo-600" size={20}/> Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DetailItem icon={<User/>} label="Full Name" value={fullName}/>
                <DetailItem icon={<Calendar/>} label="Date of Birth" value={dob}/>
                <DetailItem icon={<Users/>} label="Gender" value={resident.gender}/>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Phone className="text-indigo-600" size={20}/> Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DetailItem icon={<Phone/>} label="Mobile Number" value={resident.mobileNumber}/>
                <DetailItem icon={<Mail/>} label="Email Address" value={resident.email}/>
                <DetailItem icon={<Phone/>} label="Emergency Contact" value={resident.emergencyContactName}/>
                <DetailItem icon={<Phone/>} label="Emergency Number" value={resident.emergencyContactNumber}/>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Info className="text-indigo-600" size={20}/> Residency Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DetailItem icon={<MapPin/>} label="Wing" value={resident.wing}/>
                <DetailItem icon={<Layers/>} label="Floor" value={resident.floor}/>
                <DetailItem icon={<Hash/>} label="Flat Number" value={resident.flatNumber}/>
                <DetailItem icon={<Home/>} label="BHK Type" value={resident.bhkType}/>
                <DetailItem icon={<Calendar/>} label="Move-In Date" value={moveIn}/>
                <DetailItem icon={<Car/>} label="Vehicle Number" value={resident.vehicleNumber}/>
                <DetailItem icon={<FileText/>} label="ID Proof Type" value={resident.idProofType}/>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
              <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Account Status</p><StatusBadge value={resident.status}/></div>
              <ShieldCheck className={resident.status==='Active'?'text-emerald-500':'text-slate-300'} size={40}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <FlatDashboardPage />;
};

// ─── Wing / Floor Analytics Panel ─────────────────────────────────────────────
// Shows rich analytics when a specific wing is selected
const WingAnalyticsPanel = ({ wing, flats, bhkConfig, onFlatClick }) => {
  const wFlats    = flats.filter(f => f.wing === wing);
  const occupied  = wFlats.filter(f => f.status === 'Occupied');
  const vacant    = wFlats.filter(f => f.status === 'Vacant');
  const inMaint   = wFlats.filter(f => f.status === 'Maintenance');

  // Unique floors in this wing
  const floors = [...new Set(wFlats.map(f => f.floor))].sort((a,b) => a-b);

  // BHK mix
  const bhkMix = wFlats.reduce((a,f) => { if(f.bhkType) a[f.bhkType]=(a[f.bhkType]||0)+1; return a; }, {});

  // Revenue: use saved values, fall back to bhkConfig defaults
  const getVal = (flat, key) => flat[key] ?? (flat.bhkType && bhkConfig?.[flat.bhkType]?.[key]) ?? 0;
  const totalRent  = wFlats.reduce((s,f) => s + Number(getVal(f,'rent')),            0);
  const totalMaint = wFlats.reduce((s,f) => s + Number(getVal(f,'maintenanceCost')), 0);
  const totalTax   = wFlats.reduce((s,f) => s + Number(getVal(f,'tax')),             0);

  const BHK_PALETTE = {'1 BHK':'bg-violet-100 text-violet-700','2 BHK':'bg-blue-100 text-blue-700','3 BHK':'bg-emerald-100 text-emerald-700','4 BHK':'bg-amber-100 text-amber-700','5 BHK':'bg-rose-100 text-rose-700'};

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-3xl border border-indigo-100 shadow-sm overflow-hidden"
      style={{ animation: 'fadeSlideDown 0.3s ease' }}>
      <style>{`@keyframes fadeSlideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Panel Header */}
      <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-black text-lg tracking-tight">Wing {wing} — Full Details</h2>
            <p className="text-indigo-200 text-xs font-medium">{wFlats.length} flats &bull; {floors.length} floors</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[{l:'Occupied',v:occupied.length,c:'bg-white/20 text-white'},{l:'Vacant',v:vacant.length,c:'bg-emerald-400/30 text-emerald-100'},{l:'Maint.',v:inMaint.length,c:'bg-amber-400/30 text-amber-100'}].map(s=>(
            <div key={s.l} className={`${s.c} rounded-xl px-3 py-1.5 text-center border border-white/20`}>
              <p className="text-[10px] font-bold uppercase opacity-80">{s.l}</p>
              <p className="font-black text-xl leading-none">{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* Revenue Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><IndianRupee size={18}/></div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase">Monthly Rent</p>
              <p className="text-emerald-700 font-black text-lg">₹{totalRent.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><Wrench size={18}/></div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase">Monthly Maintenance</p>
              <p className="text-amber-700 font-black text-lg">₹{totalMaint.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center"><Receipt size={18}/></div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase">Annual Tax</p>
              <p className="text-rose-700 font-black text-lg">₹{totalTax.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Floor-wise breakdown + BHK mix */}
        <div className="grid grid-cols-2 gap-4">

          {/* Floor breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1"><Layers size={13}/> Floor-wise Breakdown</h3>
            <div className="space-y-2">
              {floors.map(floor => {
                const fFlats    = wFlats.filter(f => f.floor === floor);
                const fOccupied = fFlats.filter(f => f.status === 'Occupied').length;
                const fVacant   = fFlats.filter(f => f.status === 'Vacant').length;
                const pct       = Math.round((fOccupied / fFlats.length) * 100);
                return (
                  <div key={floor}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-600">Floor {floor}</span>
                      <div className="flex items-center gap-3 text-[10px] font-bold">
                        <span className="text-indigo-600">{fOccupied} occ.</span>
                        <span className="text-emerald-600">{fVacant} vac.</span>
                        <span className="text-slate-400">{fFlats.length} total</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BHK mix */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1"><Home size={13}/> BHK Mix</h3>
            {Object.keys(bhkMix).length === 0 ? (
              <p className="text-slate-400 text-xs font-bold italic">No BHK types assigned yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(bhkMix).sort().map(([bhk, count]) => {
                  const pct = Math.round((count / wFlats.length) * 100);
                  const cfg = bhkConfig[bhk];
                  return (
                    <div key={bhk} className="flex items-center gap-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg w-12 text-center ${BHK_PALETTE[bhk]||'bg-slate-100 text-slate-600'}`}>{bhk}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-black text-slate-600 w-5 text-right">{count}</span>
                      {cfg?.rent && <span className="text-[10px] text-slate-400 font-bold">₹{Number(cfg.rent).toLocaleString('en-IN')}/mo</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Occupied flats list */}
        {occupied.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1"><User size={13}/> Occupied Flats</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Flat No.','Floor','BHK','Resident','Rent/mo','Maintenance','Tax/yr'].map(h=>(
                      <th key={h} className="text-left text-[10px] font-black text-slate-400 uppercase py-2 pr-4 tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {occupied.map(flat => {
                    const cfg = flat.bhkType && bhkConfig[flat.bhkType];
                    return (
                      <tr key={flat._id}
                        onClick={() => onFlatClick(flat)}
                        className="border-b border-slate-50 hover:bg-indigo-50/50 cursor-pointer transition-colors group">
                        <td className="py-2 pr-4 font-black text-indigo-700 group-hover:text-indigo-900">{flat.flatNumber}</td>
                        <td className="py-2 pr-4 text-slate-600 font-semibold">Floor {flat.floor}</td>
                        <td className="py-2 pr-4">
                          {flat.bhkType ? <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${BHK_PALETTE[flat.bhkType]||'bg-slate-100 text-slate-600'}`}>{flat.bhkType}</span> : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="py-2 pr-4">
                          {flat.residentName
                            ? <span className="flex items-center gap-1.5 font-semibold text-slate-700"><User size={11} className="text-indigo-400"/>{flat.residentName}</span>
                            : <span className="text-slate-300 text-xs">—</span>}
                        </td>
                        <td className="py-2 pr-4 font-bold text-emerald-600">{flat.rent ? `₹${Number(flat.rent).toLocaleString('en-IN')}` : cfg?.rent ? <span className="text-slate-400 italic text-xs">₹{Number(cfg.rent).toLocaleString('en-IN')}*</span> : <span className="text-slate-300">—</span>}</td>
                        <td className="py-2 pr-4 font-bold text-amber-600">{flat.maintenanceCost ? `₹${Number(flat.maintenanceCost).toLocaleString('en-IN')}` : cfg?.maintenanceCost ? <span className="text-slate-400 italic text-xs">₹{Number(cfg.maintenanceCost).toLocaleString('en-IN')}*</span> : <span className="text-slate-300">—</span>}</td>
                        <td className="py-2 font-bold text-rose-600">{flat.tax ? `₹${Number(flat.tax).toLocaleString('en-IN')}` : cfg?.tax ? <span className="text-slate-400 italic text-xs">₹{Number(cfg.tax).toLocaleString('en-IN')}*</span> : <span className="text-slate-300">—</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-[10px] text-slate-400 mt-2 italic">* Default from BHK config — click row to edit</p>
            </div>
          </div>
        )}

        {/* Vacant flats quick list */}
        {vacant.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1"><CheckCircle2 size={13}/> Vacant Flats in Wing {wing}</h3>
            <div className="flex flex-wrap gap-2">
              {vacant.map(flat => (
                <button key={flat._id} onClick={() => onFlatClick(flat)}
                  className="bg-white border border-emerald-200 text-emerald-700 font-black text-xs px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-all shadow-sm">
                  {flat.flatNumber} {flat.bhkType ? `· ${flat.bhkType}` : ''}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Standalone Dashboard ──────────────────────────────────────────────────────
function FlatDashboardPage() {
  const [flats, setFlats]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [wingFilter, setWingFilter]     = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bhkFilter, setBhkFilter]       = useState('All');
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [bhkConfig, setBhkConfig]       = useState(loadBhkConfig);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fR, rR] = await Promise.allSettled([axios.get(`${API}/flats`), axios.get(`${API}/residents`)]);
      const flatList     = fR.status==='fulfilled' ? (fR.value.data.data || fR.value.data || []) : [];
      const residentList = rR.status==='fulfilled' ? (rR.value.data.data || rR.value.data || []) : [];
      const rMap = {};
      residentList.forEach(r => { if (r.flatNumber) rMap[r.flatNumber] = r; });
      setFlats(flatList.map(f => ({
        ...f,
        bhkType:      f.bhkType || rMap[f.flatNumber]?.bhkType || null,
        residentName: rMap[f.flatNumber] ? `${rMap[f.flatNumber].firstName||''} ${rMap[f.flatNumber].lastName||''}`.trim() : null,
      })));
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = (updated) => {
    setFlats(prev => prev.map(f => f._id === updated._id ? { ...updated, residentName: f.residentName } : f));
  };

  // Bulk-apply: called per flat from BhkConfigPanel
  const handleApplyAll = (updatedFlat) => {
    setFlats(prev => prev.map(f => f._id === updatedFlat._id ? { ...updatedFlat, residentName: f.residentName } : f));
  };

  const wings        = ['All', ...new Set(flats.map(f=>f.wing).filter(Boolean))].sort();
  const bhkList      = ['All', ...new Set(flats.map(f=>f.bhkType).filter(Boolean))].sort();
  const totalVacant  = flats.filter(f=>f.status==='Vacant').length;
  const totalOccupied= flats.filter(f=>f.status==='Occupied').length;
  const bhkBreakdown = flats.reduce((a,f)=>{ if(f.bhkType) a[f.bhkType]=(a[f.bhkType]||0)+1; return a; },{});

  const filtered = flats.filter(f => {
    const q = search.toLowerCase();
    return (f.flatNumber?.toLowerCase().includes(q)||f.wing?.toLowerCase().includes(q)||f.residentName?.toLowerCase().includes(q))
      && (wingFilter==='All'||f.wing===wingFilter)
      && (statusFilter==='All'||f.status===statusFilter)
      && (bhkFilter==='All'||f.bhkType===bhkFilter);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <Building2 className="text-indigo-600" size={30}/> Flat Details
        </h1>
        <p className="text-slate-500 font-medium mt-1">Click any flat card to view & edit details. Configure BHK pricing below.</p>
      </div>

      {/* ─── BHK Config Panel ─── */}
      <BhkConfigPanel
        config={bhkConfig}
        onChange={setBhkConfig}
        flats={flats}
        onApplyAll={handleApplyAll}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Home size={22}/></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase">Total Flats</p><p className="text-2xl font-black text-slate-800">{flats.length}</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={22}/></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase">Vacant</p><p className="text-2xl font-black text-emerald-600">{totalVacant}</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center"><XCircle size={22}/></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase">Occupied</p><p className="text-2xl font-black text-rose-600">{totalOccupied}</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-slate-400 text-xs font-bold uppercase mb-2">BHK Breakdown</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(bhkBreakdown).length===0
              ? <span className="text-slate-300 text-xs font-bold">No BHK data yet</span>
              : Object.entries(bhkBreakdown).sort().map(([b,c])=>(
                <span key={b} className="bg-violet-50 text-violet-700 text-xs font-black px-2 py-0.5 rounded-lg border border-violet-100">{b}: {c}</span>
              ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
            <input type="text" placeholder="Search flat number, wing, or resident name..." value={search}
              onChange={e=>setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 shadow-sm"/>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All','Vacant','Occupied','Maintenance'].map(s=>(
              <button key={s} onClick={()=>setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter===s
                  ? s==='Vacant'?'bg-emerald-500 text-white':s==='Occupied'?'bg-indigo-600 text-white':s==='Maintenance'?'bg-amber-500 text-white':'bg-slate-700 text-white'
                  :'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-slate-400 text-xs font-bold uppercase">Wing:</span>
          {wings.map(w=>(
            <button key={w} onClick={()=>setWingFilter(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${wingFilter===w?'bg-indigo-600 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {w==='All'?'All':`Wing ${w}`}</button>
          ))}
          {bhkList.length>1 && <>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400 text-xs font-bold uppercase">BHK:</span>
            {bhkList.map(b=>(
              <button key={b} onClick={()=>setBhkFilter(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${bhkFilter===b?'bg-violet-600 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {b==='All'?'All':b}</button>
            ))}
          </>}
        </div>
      </div>

      {/* Wing Analytics Panel — shows when a specific wing is selected */}
      {wingFilter !== 'All' && !loading && (
        <WingAnalyticsPanel
          wing={wingFilter}
          flats={flats}
          bhkConfig={bhkConfig}
          onFlatClick={setSelectedFlat}
        />
      )}

      {/* Cards */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Loading flats...</div>
      ) : filtered.length===0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Home size={48} className="mx-auto mb-3 text-indigo-200"/>
          <p className="text-slate-500 font-bold">No flats found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(flat => (
            <FlatCard
              key={flat._id}
              flat={flat}
              onClick={setSelectedFlat}
              bhkConfig={bhkConfig}
              onBhkChange={handleSave}
            />
          ))}
        </div>
      )}

      {selectedFlat && (
        <FlatModal flat={selectedFlat} bhkConfig={bhkConfig} onClose={()=>setSelectedFlat(null)} onSave={handleSave}/>
      )}
    </div>
  );
}

export default FlatDetails;