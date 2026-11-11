/* Tweaks panel — hero variants + accent options.
   Reads/writes on body[data-hero] and body[data-accent], persisted via the host. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "phrase",
  "accent": "terracotta"
}/*EDITMODE-END*/;

const HERO_OPTIONS = [
  { value: "phrase",  label: "Phrase"  },
  { value: "stacked", label: "Stacked" },
  { value: "lead",    label: "Lead"    }
];

const ACCENT_OPTIONS = [
  { value: "terracotta", swatch: "#B8553A", label: "Terracotta" },
  { value: "saffron",    swatch: "#C8782A", label: "Saffron"    },
  { value: "forest",     swatch: "#4F6B3A", label: "Forest"     },
  { value: "indigo",     swatch: "#3F4D7A", label: "Indigo"     }
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to <body> data attributes so CSS handles the rest.
  React.useEffect(() => {
    document.body.dataset.hero = t.hero;
    document.body.dataset.accent = t.accent;
  }, [t.hero, t.accent]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Hero" />
      <TweakRadio
        label="Variant"
        value={t.hero}
        options={HERO_OPTIONS}
        onChange={(v) => setTweak("hero", v)}
      />

      <TweakSection label="Accent" />
      <TweakColor
        label="Tone"
        value={ACCENT_OPTIONS.find(o => o.value === t.accent)?.swatch || "#B8553A"}
        options={ACCENT_OPTIONS.map(o => o.swatch)}
        onChange={(swatch) => {
          const match = ACCENT_OPTIONS.find(o => o.swatch === swatch);
          if (match) setTweak("accent", match.value);
        }}
      />
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(
  (() => {
    let el = document.getElementById("__tweaks_root");
    if (!el) {
      el = document.createElement("div");
      el.id = "__tweaks_root";
      document.body.appendChild(el);
    }
    return el;
  })()
);
root.render(<App />);
