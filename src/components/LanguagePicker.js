import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../i18n/translations';

const LanguagePicker = () => {
  const { lang, setLang, t } = useLanguage();

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'center', marginBottom: 8 }}>
        {t('selectLanguage')}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            style={{
              padding: '7px 16px',
              borderRadius: 20,
              border: lang === l.code ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: lang === l.code ? 'var(--primary)' : 'var(--bg)',
              color: lang === l.code ? 'white' : 'var(--text)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {l.native}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguagePicker;
