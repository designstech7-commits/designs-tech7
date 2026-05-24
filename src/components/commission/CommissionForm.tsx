"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import type { Package } from "@/types";
import {
  PROJECT_TYPES, ASPECT_RATIOS, EXPORT_FORMATS, BUDGET_RANGES,
} from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Project", "Brief", "Specs", "Budget", "Assets", "Agreement"
];

const TONES = [
  "Dark / Cinematic", "Bold / Energetic", "Minimal / Refined", "Experimental / Abstract",
  "Warm / Organic", "Cold / Clinical", "Playful / Irreverent", "Serious / Institutional",
];

interface CommissionFormProps {
  selectedPackageId: string | null;
  packages: Package[];
}

type FormData = Record<string, unknown>;

export default function CommissionForm({ selectedPackageId, packages }: CommissionFormProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({
    package_id: selectedPackageId || "",
    project_title: "",
    project_type: "",
    client_name: "",
    client_email: "",
    client_company: "",
    creative_brief: "",
    target_audience: "",
    tone_mood: "",
    aspect_ratio: "16:9",
    export_formats: [] as string[],
    animation_duration: "",
    budget_range: "",
    deadline: "",
    usage_rights: "standard",
    licensing_requirements: "",
    revision_count: 2,
    delivery_expectations: "",
    agreement_accepted: false,
  });
  const [files, setFiles] = useState<{ moodboard: File[]; reference: File[]; brand: File[] }>({
    moodboard: [], reference: [], brand: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const set = (key: string, value: unknown) => setData((prev) => ({ ...prev, [key]: value }));

  const toggleArrayValue = (key: string, value: string) => {
    const arr = (data[key] as string[]) || [];
    set(key, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  // Save draft to Supabase
  const saveDraft = async () => {
    setSavingDraft(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast("Sign in to save drafts", { icon: "🔒" });
        return;
      }

      const { error } = await supabase.from("commission_drafts").upsert({
        user_id: user.id,
        step_data: data,
        current_step: step,
        last_saved: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success("Draft saved!");
    } catch {
      toast.error("Could not save draft");
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Insert commission request
      const { data: commission, error } = await supabase
        .from("commission_requests")
        .insert({
          user_id: user?.id || null,
          package_id: data.package_id || null,
          project_title: data.project_title,
          project_type: data.project_type,
          creative_brief: data.creative_brief,
          target_audience: data.target_audience,
          tone_mood: data.tone_mood,
          aspect_ratio: data.aspect_ratio,
          export_formats: data.export_formats,
          animation_duration: data.animation_duration,
          budget_range: data.budget_range,
          deadline: data.deadline || null,
          usage_rights: data.usage_rights,
          licensing_requirements: data.licensing_requirements,
          revision_count: data.revision_count,
          delivery_expectations: data.delivery_expectations,
          client_name: data.client_name,
          client_email: data.client_email,
          client_company: data.client_company,
          status: "submitted",
          is_draft: false,
          agreement_accepted: true,
          agreement_accepted_at: new Date().toISOString(),
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Upload files if any
      const allFiles = [
        ...files.moodboard.map((f) => ({ file: f, type: "moodboard" })),
        ...files.reference.map((f) => ({ file: f, type: "reference" })),
        ...files.brand.map((f) => ({ file: f, type: "brand_asset" })),
      ];

      for (const { file, type } of allFiles) {
        const path = `${commission.id}/${type}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("commission-uploads")
          .upload(path, file);
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("commission-uploads")
            .getPublicUrl(path);
          await supabase.from("uploaded_assets").insert({
            user_id: user?.id,
            commission_id: commission.id,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            storage_path: path,
            public_url: urlData.publicUrl,
            asset_type: type,
          });
        }
      }

      setSubmitted(true);
      toast.success("Commission submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return <SuccessScreen data={data} />;

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10">
      {/* Step progress */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <p className="text-label text-platinum/30">
            Step {step} of {TOTAL_STEPS}
          </p>
          <button
            onClick={saveDraft}
            disabled={savingDraft}
            className="text-label text-platinum/30 hover:text-platinum/60 transition-colors disabled:opacity-30"
          >
            {savingDraft ? "Saving…" : "Save Draft"}
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-[1px] bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-acid"
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Step labels */}
        <div className="flex justify-between mt-3">
          {STEP_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => i + 1 < step && setStep(i + 1)}
              className={`text-label transition-colors duration-200 ${
                i + 1 === step ? "text-acid" :
                i + 1 < step ? "text-platinum/40 hover:text-platinum/60 cursor-pointer" :
                "text-platinum/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 1 && <Step1 data={data} set={set} packages={packages} />}
            {step === 2 && <Step2 data={data} set={set} toggleArrayValue={toggleArrayValue} />}
            {step === 3 && <Step3 data={data} set={set} toggleArrayValue={toggleArrayValue} />}
            {step === 4 && <Step4 data={data} set={set} />}
            {step === 5 && <Step5 files={files} setFiles={setFiles} />}
            {step === 6 && <Step6 data={data} set={set} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5 max-w-2xl">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 text-label text-platinum/40 hover:text-platinum transition-colors disabled:opacity-20"
        >
          ← Back
        </button>

        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
            className="flex items-center gap-3 bg-acid text-ink px-8 py-3 text-label font-mono uppercase hover:bg-acid/90 transition-colors"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !(data.agreement_accepted)}
            className="flex items-center gap-3 bg-acid text-ink px-8 py-3 text-label font-mono uppercase hover:bg-acid/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting…" : "Submit Commission →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Step 1: Project Info ──
function Step1({ data, set, packages }: { data: FormData; set: (k: string, v: unknown) => void; packages: Package[] }) {
  return (
    <div className="space-y-8">
      <StepHeader number="01" title="Project Information" subtitle="Tell us what you're making and who you are." />

      {/* Package selection */}
      {packages.length > 0 && (
        <FormField label="Package (optional)">
          <div className="grid grid-cols-3 gap-2">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => set("package_id", data.package_id === pkg.id ? "" : pkg.id)}
                className={`py-2 px-3 text-label border transition-all duration-200 ${
                  data.package_id === pkg.id ? "border-acid text-acid bg-acid/5" : "border-white/8 text-platinum/40 hover:border-white/20"
                }`}
              >
                {pkg.name}
              </button>
            ))}
          </div>
        </FormField>
      )}

      <FormField label="Project Title *">
        <input
          className="form-input w-full px-4 py-3 rounded-sm text-sm"
          placeholder="e.g. Nocturne Album Launch Campaign"
          value={data.project_title as string}
          onChange={(e) => set("project_title", e.target.value)}
        />
      </FormField>

      <FormField label="Project Type *">
        <div className="grid grid-cols-2 gap-2">
          {PROJECT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => set("project_type", t.value)}
              className={`py-2.5 px-3 text-label text-left border transition-all duration-200 ${
                data.project_type === t.value ? "border-acid text-acid bg-acid/5" : "border-white/8 text-platinum/40 hover:border-white/20 hover:text-platinum/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Your Name *">
          <input className="form-input w-full px-4 py-3 rounded-sm text-sm" placeholder="Full name"
            value={data.client_name as string} onChange={(e) => set("client_name", e.target.value)} />
        </FormField>
        <FormField label="Email *">
          <input className="form-input w-full px-4 py-3 rounded-sm text-sm" type="email" placeholder="you@company.com"
            value={data.client_email as string} onChange={(e) => set("client_email", e.target.value)} />
        </FormField>
      </div>

      <FormField label="Company / Organization">
        <input className="form-input w-full px-4 py-3 rounded-sm text-sm" placeholder="Optional"
          value={data.client_company as string} onChange={(e) => set("client_company", e.target.value)} />
      </FormField>
    </div>
  );
}

// ── Step 2: Creative Brief ──
function Step2({ data, set, toggleArrayValue }: { data: FormData; set: (k: string, v: unknown) => void; toggleArrayValue: (k: string, v: string) => void }) {
  return (
    <div className="space-y-8">
      <StepHeader number="02" title="Creative Brief" subtitle="Describe the project in as much detail as you have." />

      <FormField label="Creative Brief *" hint="What's the project? What does it need to achieve? What's the context?">
        <textarea
          className="form-input w-full px-4 py-3 rounded-sm text-sm min-h-[160px] resize-y"
          placeholder="Describe your project, goals, context, and any constraints..."
          value={data.creative_brief as string}
          onChange={(e) => set("creative_brief", e.target.value)}
        />
      </FormField>

      <FormField label="Target Audience">
        <input className="form-input w-full px-4 py-3 rounded-sm text-sm"
          placeholder="Who is this for? Age range, culture, context..."
          value={data.target_audience as string}
          onChange={(e) => set("target_audience", e.target.value)} />
      </FormField>

      <FormField label="Tone / Mood">
        <div className="grid grid-cols-2 gap-2">
          {TONES.map((tone) => (
            <button
              key={tone}
              onClick={() => set("tone_mood", data.tone_mood === tone ? "" : tone)}
              className={`py-2 px-3 text-label text-left border transition-all duration-200 ${
                data.tone_mood === tone ? "border-acid text-acid bg-acid/5" : "border-white/8 text-platinum/40 hover:border-white/20"
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
        <input className="form-input w-full px-4 py-3 rounded-sm text-sm mt-3"
          placeholder="Or describe in your own words..."
          value={(data.tone_mood && !TONES.includes(data.tone_mood as string)) ? data.tone_mood as string : ""}
          onChange={(e) => set("tone_mood", e.target.value)} />
      </FormField>
    </div>
  );
}

// ── Step 3: Technical Specs ──
function Step3({ data, set, toggleArrayValue }: { data: FormData; set: (k: string, v: unknown) => void; toggleArrayValue: (k: string, v: string) => void }) {
  return (
    <div className="space-y-8">
      <StepHeader number="03" title="Technical Specifications" subtitle="Define the format requirements for the deliverables." />

      <FormField label="Aspect Ratio">
        <div className="grid grid-cols-1 gap-2">
          {ASPECT_RATIOS.map((ar) => (
            <button
              key={ar.value}
              onClick={() => set("aspect_ratio", ar.value)}
              className={`py-2.5 px-4 text-label text-left border transition-all duration-200 ${
                data.aspect_ratio === ar.value ? "border-acid text-acid bg-acid/5" : "border-white/8 text-platinum/40 hover:border-white/15"
              }`}
            >
              {ar.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="Export Formats (select all that apply)">
        <div className="grid grid-cols-3 gap-2">
          {EXPORT_FORMATS.map((fmt) => {
            const selected = ((data.export_formats as string[]) || []).includes(fmt.value);
            return (
              <button
                key={fmt.value}
                onClick={() => toggleArrayValue("export_formats", fmt.value)}
                className={`py-2 px-3 text-label border transition-all duration-200 ${
                  selected ? "border-acid text-acid bg-acid/5" : "border-white/8 text-platinum/40 hover:border-white/15"
                }`}
              >
                {fmt.label}
              </button>
            );
          })}
        </div>
      </FormField>

      <FormField label="Animation Duration" hint="If applicable — e.g. '15 seconds', '30s loop', '1 minute'">
        <input className="form-input w-full px-4 py-3 rounded-sm text-sm"
          placeholder="e.g. 15s loop, 30s, 1 minute title sequence"
          value={data.animation_duration as string}
          onChange={(e) => set("animation_duration", e.target.value)} />
      </FormField>
    </div>
  );
}

// ── Step 4: Budget & Timeline ──
function Step4({ data, set }: { data: FormData; set: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-8">
      <StepHeader number="04" title="Budget & Timeline" subtitle="Help us scope the right level of engagement." />

      <FormField label="Budget Range">
        <div className="grid grid-cols-1 gap-2">
          {BUDGET_RANGES.map((b) => (
            <button
              key={b.value}
              onClick={() => set("budget_range", b.value)}
              className={`py-2.5 px-4 text-label text-left border transition-all duration-200 ${
                data.budget_range === b.value ? "border-acid text-acid bg-acid/5" : "border-white/8 text-platinum/40 hover:border-white/15"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="Ideal Deadline">
        <input
          type="date"
          className="form-input w-full px-4 py-3 rounded-sm text-sm"
          value={data.deadline as string}
          onChange={(e) => set("deadline", e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          style={{ colorScheme: "dark" }}
        />
      </FormField>

      <FormField label="Usage Rights">
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: "standard", label: "Standard — Digital + Print, 1 year" },
            { value: "extended", label: "Extended — Worldwide, unlimited duration" },
            { value: "exclusive", label: "Exclusive — Full transfer of ownership" },
            { value: "discuss", label: "To be discussed" },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => set("usage_rights", r.value)}
              className={`py-2.5 px-4 text-label text-left border transition-all duration-200 ${
                data.usage_rights === r.value ? "border-acid text-acid bg-acid/5" : "border-white/8 text-platinum/40 hover:border-white/15"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="Licensing Requirements" hint="Any specific licensing clauses, territory restrictions, or usage limitations.">
        <textarea
          className="form-input w-full px-4 py-3 rounded-sm text-sm min-h-[100px] resize-y"
          placeholder="Detail any specific licensing requirements..."
          value={data.licensing_requirements as string}
          onChange={(e) => set("licensing_requirements", e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Number of Revisions">
          <select
            className="form-input w-full px-4 py-3 rounded-sm text-sm"
            value={data.revision_count as number}
            onChange={(e) => set("revision_count", Number(e.target.value))}
            style={{ colorScheme: "dark" }}
          >
            {[1, 2, 3, 5, 10].map((n) => (
              <option key={n} value={n} className="bg-ink">{n} round{n > 1 ? "s" : ""}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Delivery Expectations">
          <input
            className="form-input w-full px-4 py-3 rounded-sm text-sm"
            placeholder="e.g. Staggered delivery, all at once..."
            value={data.delivery_expectations as string}
            onChange={(e) => set("delivery_expectations", e.target.value)}
          />
        </FormField>
      </div>
    </div>
  );
}

// ── Step 5: Asset Uploads ──
function Step5({ files, setFiles }: {
  files: { moodboard: File[]; reference: File[]; brand: File[] };
  setFiles: React.Dispatch<React.SetStateAction<{ moodboard: File[]; reference: File[]; brand: File[] }>>;
}) {
  return (
    <div className="space-y-8">
      <StepHeader number="05" title="Reference Assets" subtitle="Upload any moodboards, references, or brand assets. All optional." />

      <DropZone
        label="Moodboard"
        hint="Visual references for the aesthetic direction"
        files={files.moodboard}
        onDrop={(f) => setFiles((prev) => ({ ...prev, moodboard: [...prev.moodboard, ...f] }))}
        onRemove={(i) => setFiles((prev) => ({ ...prev, moodboard: prev.moodboard.filter((_, idx) => idx !== i) }))}
      />

      <DropZone
        label="Creative References"
        hint="Posters, motion work, or other visual references"
        files={files.reference}
        onDrop={(f) => setFiles((prev) => ({ ...prev, reference: [...prev.reference, ...f] }))}
        onRemove={(i) => setFiles((prev) => ({ ...prev, reference: prev.reference.filter((_, idx) => idx !== i) }))}
      />

      <DropZone
        label="Brand Assets"
        hint="Logos, brand guidelines, existing artwork"
        files={files.brand}
        onDrop={(f) => setFiles((prev) => ({ ...prev, brand: [...prev.brand, ...f] }))}
        onRemove={(i) => setFiles((prev) => ({ ...prev, brand: prev.brand.filter((_, idx) => idx !== i) }))}
      />
    </div>
  );
}

function DropZone({ label, hint, files, onDrop, onRemove }: {
  label: string; hint: string;
  files: File[];
  onDrop: (files: File[]) => void;
  onRemove: (index: number) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => onDrop(acceptedFiles), [onDrop]),
    accept: { "image/*": [], "application/pdf": [], "video/*": [] },
    maxSize: 50 * 1024 * 1024,
  });

  return (
    <FormField label={label} hint={hint}>
      <div
        {...getRootProps()}
        className={`border border-dashed rounded-sm px-6 py-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? "border-acid bg-acid/5" : "border-white/10 hover:border-white/20"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-label text-platinum/40">
          {isDragActive ? "Drop files here…" : "Drag & drop files, or click to browse"}
        </p>
        <p className="text-[10px] font-mono text-platinum/20 mt-1">Images, PDF, Video — max 50MB each</p>
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => (
            <li key={i} className="flex items-center justify-between py-2 px-3 bg-white/[0.03] rounded-sm">
              <span className="text-sm text-platinum/60 truncate">{file.name}</span>
              <button onClick={() => onRemove(i)} className="text-label text-platinum/30 hover:text-ember ml-3 shrink-0">✕</button>
            </li>
          ))}
        </ul>
      )}
    </FormField>
  );
}

// ── Step 6: Agreement ──
function Step6({ data, set }: { data: FormData; set: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-8">
      <StepHeader number="06" title="Agreement & Submission" subtitle="Review the terms and submit your commission brief." />

      {/* Summary */}
      <div className="glass rounded-sm p-6 space-y-3">
        <p className="text-label text-platinum/30 mb-4">Commission Summary</p>
        {[
          { label: "Project", value: data.project_title as string },
          { label: "Type", value: PROJECT_TYPES.find(t => t.value === data.project_type)?.label || "" },
          { label: "Client", value: data.client_name as string },
          { label: "Email", value: data.client_email as string },
          { label: "Budget", value: BUDGET_RANGES.find(b => b.value === data.budget_range)?.label || "Not specified" },
          { label: "Deadline", value: data.deadline as string || "Flexible" },
        ].map(({ label, value }) => value ? (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-platinum/35">{label}</span>
            <span className="text-platinum/70">{value}</span>
          </div>
        ) : null)}
      </div>

      {/* Terms */}
      <div className="glass rounded-sm p-6">
        <p className="text-label text-platinum/30 mb-4">Terms & Conditions</p>
        <div className="text-sm text-platinum/45 leading-relaxed space-y-3 max-h-48 overflow-y-auto pr-2">
          <p>By submitting this commission brief, you agree to the following terms:</p>
          <p><strong className="text-platinum/70">Proposal Process:</strong> We will review your brief and respond with a tailored proposal within 48 business hours. Submission of this form does not constitute a binding agreement.</p>
          <p><strong className="text-platinum/70">Payment:</strong> A 50% deposit is required before work commences. The remaining 50% is due upon delivery. Prices are confirmed in the formal proposal.</p>
          <p><strong className="text-platinum/70">Revisions:</strong> The agreed number of revision rounds is included in the price. Additional revisions are billed at our standard rate.</p>
          <p><strong className="text-platinum/70">Intellectual Property:</strong> All work remains the property of Designs.Tech7 until final payment is received. License terms are specified per project.</p>
          <p><strong className="text-platinum/70">Confidentiality:</strong> All project information and uploaded assets are kept confidential and used solely for the purpose of this commission.</p>
        </div>
      </div>

      {/* Agreement checkbox */}
      <label className="flex items-start gap-4 cursor-pointer group">
        <div
          className={`mt-0.5 w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
            data.agreement_accepted ? "border-acid bg-acid" : "border-white/20 group-hover:border-white/40"
          }`}
          onClick={() => set("agreement_accepted", !data.agreement_accepted)}
        >
          {data.agreement_accepted && <span className="text-ink text-xs font-bold">✓</span>}
        </div>
        <span className="text-sm text-platinum/50 leading-relaxed">
          I have read and agree to the terms above. I understand this submission is a brief request, not a binding contract, and that a formal proposal will be issued separately.
        </span>
      </label>
    </div>
  );
}

// ── Shared UI ──
function StepHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <span className="text-label text-acid/60 mb-2 block">{number}</span>
      <h2 className="text-display-md text-platinum mb-2">{title}</h2>
      <p className="text-sm text-platinum/40">{subtitle}</p>
    </div>
  );
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-label text-platinum/50 block">{label}</label>
      {hint && <p className="text-xs text-platinum/25 font-mono -mt-1">{hint}</p>}
      {children}
    </div>
  );
}

function SuccessScreen({ data }: { data: FormData }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-lg mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-acid flex items-center justify-center mx-auto mb-8">
          <span className="text-ink text-2xl">✓</span>
        </div>
        <h2 className="text-display-md text-platinum mb-4">
          Commission<br />
          <span className="text-acid italic">Submitted</span>
        </h2>
        <p className="text-base text-platinum/50 leading-relaxed mb-8">
          We've received your brief for <strong className="text-platinum/80">{data.project_title as string}</strong>. You'll hear from us within 48 hours with a tailored proposal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/portfolio" className="text-label text-platinum/40 hover:text-platinum transition-colors">
            ← Browse Portfolio
          </Link>
          <Link href="/dashboard" className="bg-acid text-ink px-6 py-3 text-label font-mono uppercase hover:bg-acid/90 transition-colors">
            Go to Dashboard →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// Need Link import
import Link from "next/link";
