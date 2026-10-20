import React, { useEffect, useState } from 'react';
import { CheckCircle2, Image as ImageIcon, RotateCcw, Save, Search, Upload } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DEFAULT_WEBSITE_SETTINGS, WebsiteSettings } from '../data/websiteSettings';
import { WEBSITE_COPY_FIELDS } from '../data/siteCopy';

const localDateTimeValue = (isoValue: string) => {
  if (!isoValue) return '';
  const date = new Date(isoValue);
  if (!Number.isFinite(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

const isoFromLocalDateTime = (localValue: string) => {
  if (!localValue) return '';
  const date = new Date(localValue);
  return Number.isFinite(date.getTime()) ? date.toISOString() : '';
};

const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-neutral-300">{label}</span>
    <input
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
    />
  </label>
);

const TextAreaField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}> = ({ label, value, onChange, rows = 3, hint }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-neutral-300">{label}</span>
    <textarea
      value={value}
      onChange={event => onChange(event.target.value)}
      rows={rows}
      className="w-full resize-y rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
    />
    {hint && <span className="block text-[11px] leading-relaxed text-neutral-500">{hint}</span>}
  </label>
);

export const WebsiteContentEditor: React.FC = () => {
  const { websiteSettings, updateWebsiteSettings, addAuditLog, adminStoreSaveState } = useStore();
  const [draft, setDraft] = useState<WebsiteSettings>(websiteSettings);
  const [saveMessage, setSaveMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [copySearch, setCopySearch] = useState('');

  useEffect(() => {
    setDraft(websiteSettings);
  }, [websiteSettings]);

  const updateDraft = <K extends keyof WebsiteSettings,>(key: K, value: WebsiteSettings[K]) => {
    setDraft(previous => ({ ...previous, [key]: value }));
    setSaveMessage('');
  };

  const updateSiteCopy = (key: string, value: string) => {
    setDraft(previous => ({
      ...previous,
      siteCopy: { ...previous.siteCopy, [key]: value }
    }));
    setSaveMessage('');
  };

  const jumpToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const matchingCopyFields = WEBSITE_COPY_FIELDS.filter(field =>
    `${field.group} ${field.label} ${field.defaultValue}`.toLowerCase().includes(copySearch.trim().toLowerCase())
  );
  const copyGroups = [...new Set(matchingCopyFields.map(field => field.group))];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
      setUploadError('Choose a PNG, JPEG, WebP, or GIF image.');
      return;
    }
    if (file.size > 512 * 1024) {
      setUploadError('Logo files must be 512 KB or smaller. You can also use an image URL.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateDraft('logoUrl', reader.result);
        setUploadError('');
      } else {
        setUploadError('The selected logo could not be read.');
      }
    };
    reader.onerror = () => setUploadError('The selected logo could not be read.');
    reader.readAsDataURL(file);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const imageValue = draft.logoUrl.trim();
    if (imageValue && !/^(https?:\/\/|\/|data:image\/(?:png|jpeg|webp|gif);base64,)/i.test(imageValue)) {
      setUploadError('Use an http/https image URL, a site-relative path, or upload a supported image.');
      return;
    }

    const normalized: WebsiteSettings = {
      ...draft,
      logoUrl: imageValue,
      brandName: draft.brandName.trim() || DEFAULT_WEBSITE_SETTINGS.brandName,
      brandSuffix: draft.brandSuffix.trim(),
      brandTagline: draft.brandTagline.trim(),
      heroRotatingWords: draft.heroRotatingWords.split('\n').map(word => word.trim()).filter(Boolean).join('\n'),
      heroGuarantees: draft.heroGuarantees.map(value => value.trim()).filter(Boolean)
    };

    updateWebsiteSettings(normalized);
    addAuditLog('Storefront Content Updated', 'settings', 'website-content', 'Updated branding, homepage copy, buttons, or dispatch timer');
    setSaveMessage('Changes applied. Storefront content is syncing with the store service.');
    setUploadError('');
  };

  const handleReset = () => {
    if (!window.confirm('Restore the storefront branding and copy to the default text?')) return;
    setDraft({ ...DEFAULT_WEBSITE_SETTINGS, heroGuarantees: [...DEFAULT_WEBSITE_SETTINGS.heroGuarantees] });
    setSaveMessage('Defaults loaded. Save changes to apply them to the storefront.');
    setUploadError('');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Storefront content editor</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-neutral-400">
            Edit the brand, homepage copy, action labels, and dispatch timer. Product details and navigation labels remain editable in their existing dashboard sections.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-3.5 py-2.5 text-xs font-semibold text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset draft
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <Save className="h-3.5 w-3.5" />
            Save storefront changes
          </button>
        </div>
      </div>

      <nav aria-label="Website editor sections" className="flex flex-wrap gap-2">
        <button type="button" onClick={() => jumpToSection('branding-settings')} className="rounded-full border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white">
          Change logo & brand name
        </button>
        <button type="button" onClick={() => jumpToSection('offer-settings')} className="rounded-full border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white">
          Modify offer timer
        </button>
        <button type="button" onClick={() => jumpToSection('site-copy-settings')} className="rounded-full border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white">
          Edit website text
        </button>
      </nav>

      {saveMessage && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-900 bg-emerald-950/50 px-4 py-3 text-xs font-medium text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {saveMessage}
        </div>
      )}
      {adminStoreSaveState !== 'idle' && (
        <div role={adminStoreSaveState === 'error' ? 'alert' : 'status'} aria-live="polite" className={`rounded-xl border px-4 py-3 text-xs font-semibold ${adminStoreSaveState === 'error' ? 'border-rose-800 bg-rose-950/50 text-rose-300' : adminStoreSaveState === 'saved' ? 'border-emerald-900 bg-emerald-950/50 text-emerald-300' : 'border-neutral-700 bg-neutral-900 text-neutral-300'}`}>
          {adminStoreSaveState === 'saving' && 'Saving changes to the store service…'}
          {adminStoreSaveState === 'saved' && 'Store service has saved these changes. They will remain available after reload.'}
          {adminStoreSaveState === 'error' && 'The store service could not save these changes. Check the connection and try saving again.'}
        </div>
      )}

      <section id="branding-settings" className="scroll-mt-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-950 text-sky-300">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Brand and logo</h3>
            <p className="text-[11px] text-neutral-500">These changes appear in the storefront header.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Brand name" value={draft.brandName} onChange={value => updateDraft('brandName', value)} />
          <TextField label="Brand suffix" value={draft.brandSuffix} onChange={value => updateDraft('brandSuffix', value)} placeholder="Transfers" />
          <TextField label="Header tagline" value={draft.brandTagline} onChange={value => updateDraft('brandTagline', value)} />
          <TextField label="Top navigation label" value={draft.utilityNavLabel} onChange={value => updateDraft('utilityNavLabel', value)} />
          <div className="md:col-span-2">
            <TextField label="Logo image URL" value={draft.logoUrl} onChange={value => updateDraft('logoUrl', value)} placeholder="https://example.com/logo.png" />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-[11px] font-semibold text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white">
                <Upload className="h-3.5 w-3.5" />
                Upload logo (max 512 KB)
                <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleLogoUpload} />
              </label>
              {draft.logoUrl && (
                <button type="button" onClick={() => updateDraft('logoUrl', '')} className="text-[11px] font-semibold text-neutral-400 underline hover:text-white">
                  Use the default mark
                </button>
              )}
              {draft.logoUrl && <img src={draft.logoUrl} alt="Current logo preview" className="h-10 w-10 rounded-lg border border-neutral-700 bg-white object-contain p-1" />}
            </div>
            {uploadError && <p role="alert" className="mt-2 text-[11px] text-rose-300">{uploadError}</p>}
          </div>
          <div className="md:col-span-2">
            <TextField label="Product search placeholder" value={draft.searchPlaceholder} onChange={value => updateDraft('searchPlaceholder', value)} />
          </div>
        </div>
      </section>

      <section id="offer-settings" className="scroll-mt-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-white">Announcement and offer timer</h3>
          <p className="mt-1 text-[11px] text-neutral-500">The countdown uses one saved deadline. Visitors see the same remaining time.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Header dispatch message" value={draft.topDispatchText} onChange={value => updateDraft('topDispatchText', value)} />
          <TextField label="Wash guarantee text" value={draft.topGuaranteeText} onChange={value => updateDraft('topGuaranteeText', value)} />
          <TextField label="Header shipping message" value={draft.topShippingText} onChange={value => updateDraft('topShippingText', value)} />
          <TextField label="Timer label" value={draft.offerLabel} onChange={value => updateDraft('offerLabel', value)} />
          <TextField label="Text before countdown" value={draft.offerLead} onChange={value => updateDraft('offerLead', value)} />
          <TextField label="Text after countdown" value={draft.offerTail} onChange={value => updateDraft('offerTail', value)} />
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-neutral-300">Offer deadline</span>
            <input
              type="datetime-local"
              value={localDateTimeValue(draft.offerEndsAt)}
              onChange={event => updateDraft('offerEndsAt', isoFromLocalDateTime(event.target.value))}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <span className="block text-[11px] text-neutral-500">Choose your local date and time. The saved deadline is shared across visitors in this browser data.</span>
          </label>
          <TextField label="Message after the deadline" value={draft.offerExpiredText} onChange={value => updateDraft('offerExpiredText', value)} />
          <TextField label="Timer shipping note" value={draft.offerShippingText} onChange={value => updateDraft('offerShippingText', value)} />
          <TextField label="Timer guarantee note" value={draft.offerGuaranteeText} onChange={value => updateDraft('offerGuaranteeText', value)} />
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-white">Homepage copy and buttons</h3>
          <p className="mt-1 text-[11px] text-neutral-500">Update the hero message, rotating headline words, trust points, and the main storefront buttons.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Review rating" value={draft.reviewRating} onChange={value => updateDraft('reviewRating', value)} />
          <TextField label="Review count text" value={draft.reviewCount} onChange={value => updateDraft('reviewCount', value)} />
          <div className="md:col-span-2">
            <TextField label="Hero headline first line" value={draft.heroHeadlineLead} onChange={value => updateDraft('heroHeadlineLead', value)} />
          </div>
          <div className="md:col-span-2">
            <TextAreaField
              label="Rotating headline words"
              value={draft.heroRotatingWords}
              onChange={value => updateDraft('heroRotatingWords', value)}
              rows={4}
              hint="Use one phrase per line. Leave one phrase to keep the headline static."
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaField label="Hero description" value={draft.heroDescription} onChange={value => updateDraft('heroDescription', value)} rows={4} />
          </div>
          <div className="md:col-span-2">
            <TextAreaField
              label="Trust points"
              value={draft.heroGuarantees.join('\n')}
              onChange={value => updateDraft('heroGuarantees', value.split('\n'))}
              rows={3}
              hint="Use one item per line."
            />
          </div>
          <TextField label="Primary button label" value={draft.heroPrimaryButton} onChange={value => updateDraft('heroPrimaryButton', value)} />
          <TextField label="Secondary button label" value={draft.heroSecondaryButton} onChange={value => updateDraft('heroSecondaryButton', value)} />
          <TextField label="Sample-pack link label" value={draft.heroSampleButton} onChange={value => updateDraft('heroSampleButton', value)} />
          <TextField label="Featured-section button label" value={draft.featuredCtaButton} onChange={value => updateDraft('featuredCtaButton', value)} />
          <TextField label="Shipping note under buttons" value={draft.heroShippingNote} onChange={value => updateDraft('heroShippingNote', value)} />
          <div className="md:col-span-2">
            <TextField label="Industry section heading" value={draft.industrySectionHeading} onChange={value => updateDraft('industrySectionHeading', value)} />
          </div>
        </div>
      </section>

      <section id="site-copy-settings" className="scroll-mt-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Website text</h3>
            <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-neutral-500">
              Update key storefront headings, account prompts, catalog labels, and footer contact copy. Product names and descriptions are managed under Products; navigation menus are managed under Menu Manager.
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search website text</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="search"
              value={copySearch}
              onChange={event => setCopySearch(event.target.value)}
              placeholder="Find text to edit"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </label>
        </div>

        <div className="space-y-3">
          {copyGroups.map(group => {
            const fields = matchingCopyFields.filter(field => field.group === group);
            return (
              <details key={group} open={Boolean(copySearch.trim())} className="group rounded-xl border border-neutral-800 bg-neutral-900/60">
                <summary className="cursor-pointer list-none px-4 py-3 text-xs font-bold text-neutral-200 marker:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {group}
                    <span className="text-[10px] font-medium text-neutral-500">{fields.length} editable fields</span>
                  </span>
                </summary>
                <div className="grid gap-4 border-t border-neutral-800 p-4 md:grid-cols-2">
                  {fields.map(field => (
                    <div key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                      {field.multiline ? (
                        <TextAreaField
                          label={field.label}
                          value={draft.siteCopy[field.key] ?? field.defaultValue}
                          onChange={value => updateSiteCopy(field.key, value)}
                          rows={3}
                        />
                      ) : (
                        <TextField
                          label={field.label}
                          value={draft.siteCopy[field.key] ?? field.defaultValue}
                          onChange={value => updateSiteCopy(field.key, value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
          {matchingCopyFields.length === 0 && (
            <p className="rounded-xl border border-dashed border-neutral-700 px-4 py-8 text-center text-xs text-neutral-500">
              No website text matches “{copySearch}”.
            </p>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-xl border border-sky-900/70 bg-sky-950/30 px-4 py-3 text-xs text-sky-200 sm:flex-row sm:items-center">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-300" />
        <p>Product descriptions, category labels, and navigation menus can also be edited in the Products and Menu Manager sections.</p>
      </div>
    </form>
  );
};
