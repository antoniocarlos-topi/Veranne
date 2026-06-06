import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import logoMarca from '../../../image/logomarca.jpeg'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.col}>
            <div className={styles.brand}>
              <Link to="/" className={styles.brandLogoLink} aria-label="VERANNE - Página inicial">
                <img src={logoMarca} alt="VERANNE" className={styles.brandLogoImg} />
              </Link>
              <div className={styles.slogan}>Feita para destacar você</div>
              <div className={styles.socialRow} aria-label="Redes sociais">
                <a className={styles.social} href="#" aria-label="Instagram">
                  Instagram
                </a>
                <a className={styles.social} href="#" aria-label="TikTok">
                  TikTok
                </a>
                <a className={styles.social} href="#" aria-label="WhatsApp">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className={styles.col}>
            <h3 className={styles.title}>Navegação</h3>
            <ul className={styles.links}>
              <li><Link className={styles.link} to="/">Home</Link></li>
              <li><Link className={styles.link} to="/loja">Loja</Link></li>
              <li><Link className={styles.link} to="/sobre">Sobre</Link></li>
              <li><Link className={styles.link} to="/contato">Contato</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.title}>Informações</h3>
            <ul className={styles.links}>
              <li><Link className={styles.link} to="/privacidade">Política de Privacidade</Link></li>
              <li><Link className={styles.link} to="/trocas">Política de Trocas</Link></li>
              <li><Link className={styles.link} to="/termos">Termos de Uso</Link></li>
            </ul>
          </div>

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
                placeholder="Seu email"
                required
                aria-label="Email para newsletter"
              />
              <button className={styles.subscribe} type="submit">
                Inscrever
              </button>
            </form>
          </div>
        </div>

        <div className={styles.bottom}>
          <div>© 2025 VERANNE. Todos os direitos reservados.</div>
          <div>Desenvolvido com ♡</div>
        </div>
      </div>
    </footer>
  )
}
