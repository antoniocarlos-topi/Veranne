import React, { useState, useEffect, useRef } from 'react';
import styles from './ShopSearch.module.css';
import { useProductsContext } from '../../context/ProductsContext.jsx';

export default function ShopSearch({ value, onChange }) {
  const { searchProducts } = useProductsContext();
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('veranne_search_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value.trim()) {
      const results = searchProducts(value).slice(0, 4);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [value, searchProducts]);

  function handleSelect(val) {
    onChange(val);
    saveToHistory(val);
    setFocused(false);
  }

  function saveToHistory(val) {
    if (!val.trim()) return;
    const newHist = [val, ...history.filter(h => h !== val)].slice(0, 5);
    setHistory(newHist);
    localStorage.setItem('veranne_search_history', JSON.stringify(newHist));
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      saveToHistory(value);
      setFocused(false);
    }
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={onKeyDown}
        placeholder="Ex: anel, colar, minimal"
        aria-label="Buscar produtos"
      />
      {focused && (
        <div className={styles.dropdown}>
          {value.trim() ? (
            suggestions.length > 0 ? (
              <div className={styles.suggestions}>
                <div className={styles.title}>Sugestões</div>
                {suggestions.map(p => (
                  <button key={p.id} className={styles.item} onClick={() => handleSelect(p.name)}>
                    {p.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                Sem resultados para "{value}". Tente buscar por "anel" ou "colar".
              </div>
            )
          ) : (
            history.length > 0 && (
              <div className={styles.history}>
                <div className={styles.title}>Buscas recentes</div>
                {history.map((h, i) => (
                  <button key={i} className={styles.item} onClick={() => handleSelect(h)}>
                    <span className={styles.historyIcon}>🕒</span> {h}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
