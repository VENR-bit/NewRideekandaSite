/* Tweaks panel — drives CSS variables / data attributes on the document.
   The content page itself is plain HTML; this only adjusts presentation. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "paper",
  "letterforms": "classic",
  "motion": true
}/*EDITMODE-END*/;

const LETTERFORMS = {
  classic:   { display: '"Cormorant Garamond", Georgia, serif', body: '"Hanken Grotesk", system-ui, sans-serif' },
  editorial: { display: '"Newsreader", Georgia, serif',         body: '"Newsreader", Georgia, serif' }
};

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // NOTE: the light/dark theme is owned by the shared eco-theme toggle
  // (Auto-by-time + manual). The tweaks palette no longer sets data-theme
  // so it can't fight that system.

  React.useEffect(() => {
    const lf = LETTERFORMS[t.letterforms] || LETTERFORMS.classic;
    document.documentElement.style.setProperty('--font-display', lf.display);
    document.documentElement.style.setProperty('--font-body', lf.body);
  }, [t.letterforms]);

  React.useEffect(() => {
    document.documentElement.classList.toggle('motion-off', !t.motion);
  }, [t.motion]);

  return (
    <TweaksPanel>
      <TweakSection label="Atmosphere" />
      <TweakRadio
        label="Palette"
        value={t.palette}
        options={[
          { value: 'paper', label: 'Paper' },
          { value: 'sage', label: 'Sage' },
          { value: 'terracotta', label: 'Clay' },
          { value: 'night', label: 'Night' }
        ]}
        onChange={(v) => setTweak('palette', v)}
      />
      <TweakSection label="Letterforms" />
      <TweakRadio
        label="Type"
        value={t.letterforms}
        options={[
          { value: 'classic', label: 'Classic' },
          { value: 'editorial', label: 'Editorial' }
        ]}
        onChange={(v) => setTweak('letterforms', v)}
      />
      <TweakSection label="Motion" />
      <TweakToggle
        label="Scroll fade-ins"
        value={t.motion}
        onChange={(v) => setTweak('motion', v)}
      />
    </TweaksPanel>
  );
}

// 'Clay' is the label shown for the 'terracotta' theme.
(function () {
  const root = document.getElementById('tweaks-root');
  ReactDOM.createRoot(root).render(<TweaksApp />);
})();
