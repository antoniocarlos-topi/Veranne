import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout.jsx'
import styles from './About.module.css'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'

export default function About() {
  const [heroRef, heroVisible] = useScrollReveal({ threshold: 0.15 })
  const [storyTextRef, storyTextVisible] = useScrollReveal()
  const [storyImgRef, storyImgVisible] = useScrollReveal()
  const [valuesRef, valuesVisible] = useScrollReveal()
  const [numbersRef, numbersVisible] = useScrollReveal()
  const [ctaRef, ctaVisible] = useScrollReveal()

  return (
    <Layout>
      <div className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div
              ref={heroRef}
              className={`${styles.heroContent} ${heroVisible ? styles.visible : styles.hidden}`}
            >
              <h1 className={styles.heroTitle}>Sobre a VERANNE</h1>
              <p className={styles.heroSubtitle}>Feita para destacar você</p>
            </div>
          </div>
        </section>

        {/* História — texto da esquerda, imagem da direita */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.twoCol}>
              <div
                ref={storyTextRef}
                className={`${styles.textCol} ${storyTextVisible ? styles.visibleLeft : styles.hiddenLeft}`}
              >
                <h2 className={styles.sectionTitle}>Nossa História</h2>
                <p className={styles.p}>
                  A VERANNE nasceu da vontade de transformar o cotidiano em ocasião especial.
                  Sem excesso, sem pressa: apenas semijoias em aço inox pensadas para acompanhar
                  cada fase da sua vida com beleza e presença.
                </p>
                <p className={styles.p}>
                  Inspirada no equilíbrio entre sofisticação e conforto, nossa curadoria valoriza
                  detalhes delicados, acabamento impecável e design minimalista — do jeito que a
                  mulher brasileira gosta: elegante, moderna e marcante.
                </p>
                <p className={styles.p}>
                  Cada peça é desenhada para durar, brilhar e se tornar parte da sua assinatura.
                  Porque estilo também é sentimento: é o que você escolhe usar para se destacar.
                </p>
              </div>

              <div
                ref={storyImgRef}
                className={`${styles.imageCol} ${storyImgVisible ? styles.visibleRight : styles.hiddenRight}`}
                aria-hidden="true"
              >
                <img
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div
              ref={valuesRef}
              className={valuesVisible ? styles.visible : styles.hidden}
            >
              <h2 className={styles.sectionTitle}>Nossos Valores</h2>
              <div className={styles.cards}>
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Qualidade</div>
                  <div className={styles.cardText}>
                    Aço inox com acabamento premium para manter o brilho por muito mais tempo.
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Sofisticação</div>
                  <div className={styles.cardText}>
                    Design minimalista, linhas refinadas e presença discreta — sempre luxuosa.
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardTitle}>Exclusividade</div>
                  <div className={styles.cardText}>
                    Coleções com personalidade para você encontrar peças que realmente combinam com você.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Números */}
        <section className={styles.numbers}>
          <div className={styles.container}>
            <div
              ref={numbersRef}
              className={`${styles.numbersGrid} ${numbersVisible ? styles.visible : styles.hidden}`}
            >
              <div className={styles.numberCard}>
                <div className={styles.numberValue}>500+</div>
                <div className={styles.numberLabel}>Clientes</div>
              </div>
              <div className={styles.numberCard}>
                <div className={styles.numberValue}>4.9★</div>
                <div className={styles.numberLabel}>Avaliação</div>
              </div>
              <div className={styles.numberCard}>
                <div className={styles.numberValue}>1 Ano</div>
                <div className={styles.numberLabel}>Garantia</div>
              </div>
              <div className={styles.numberCard}>
                <div className={styles.numberValue}>100% Aço Inox</div>
                <div className={styles.numberLabel}>Durabilidade</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <div
              ref={ctaRef}
              className={`${styles.ctaBox} ${ctaVisible ? styles.visible : styles.hidden}`}
            >
              <div className={styles.ctaTitle}>Pronta para sua próxima assinatura?</div>
              <Link className={styles.ctaBtn} to="/loja">
                Ver Coleção
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
