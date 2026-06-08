import React from 'react'
import { Link } from 'react-router-dom'
import { useHomepage } from '../../context/HomepageContext'
import styles from './Footer.module.css'
import logoMarca from '../../../image/logomarca.jpeg'

export default function Footer() {
  const { homepage } = useHomepage()

  const socials = [
    {
      name: 'WhatsApp',
      href: homepage.whatsappLink || '#',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.117 1.534 5.847L0 24l6.335-1.508A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.728.888.921-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: homepage.instagramLink || '#',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
    },
    {
      name: 'TikTok',
      href: homepage.tiktokLink || '#',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
        </svg>
      ),
    },
  ]

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>

          {/* Coluna 1 — Marca */}
          <div className={styles.col}>
            <div className={styles.brand}>
              <Link to="/" className={styles.brandLogoLink} aria-label="VERANNE - Página inicial">
                <img src={logoMarca} alt="VERANNE" className={styles.brandLogoImg} />
              </Link>
              <div className={styles.slogan}>Feita para destacar você</div>
              {/* Ícones sociais clicáveis */}
              <div className={styles.socialRow} aria-label="Redes sociais">
                {socials.map(social => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.social}
                    aria-label={social.name}
                    onClick={e => {
                      if (!social.href || social.href === '#') {
                        e.preventDefault()
                      }
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna 2 — Navegação */}
          <div className={styles.col}>
            <h3 className={styles.title}>Navegação</h3>
            <ul className={styles.links}>
              <li><Link className={styles.link} to="/">Home</Link></li>
              <li><Link className={styles.link} to="/loja">Loja</Link></li>
              <li><Link className={styles.link} to="/sobre">Sobre</Link></li>
              <li><Link className={styles.link} to="/contato">Contato</Link></li>
            </ul>
          </div>

          {/* Coluna 3 — Políticas */}
          <div className={styles.col}>
            <h3 className={styles.title}>Informações</h3>
            <ul className={styles.links}>
              <li><Link className={styles.link} to="/privacidade">Privacidade</Link></li>
              <li><Link className={styles.link} to="/trocas">Trocas</Link></li>
              <li><Link className={styles.link} to="/termos">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Coluna 4 — Newsletter */}
          <div className={styles.col}>
            <h3 className={styles.title}>Receba novidades</h3>
            <p className={styles.newsText}>
              Seja a primeira a saber das novidades e ofertas exclusivas.
            </p>
            <form
              className={styles.newsForm}
              onSubmit={e => e.preventDefault()}
              aria-label="Newsletter"
            >
              <input
                className={styles.email}
                type="email"
                placeholder="seu@email.com"
                required
                aria-label="Email para newsletter"
              />
              <button className={styles.subscribe} type="submit">
                Inscrever
              </button>
            </form>
          </div>
        </div>

        {/* Rodapé */}
        <div className={styles.bottom}>
          <div>© {new Date().getFullYear()} VERANNE. Todos os direitos reservados.</div>
          <div className={styles.paymentIcons}>
            <span>Pix</span>
            <span>WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
