import React from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import styles from './Policies.module.css'

export default function Terms() {
  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a className={styles.crumbLink} href="/">
              Home
            </a>
            <span className={styles.crumbSep} aria-hidden="true">
              {'>'}
            </span>
            <span className={styles.crumbCurrent}>Políticas</span>
            <span className={styles.crumbSep} aria-hidden="true">
              {'>'}
            </span>
            <span className={styles.crumbCurrent}>Termos</span>
          </nav>

          <header className={styles.header}>
            <h1 className={styles.title}>Termos de Uso</h1>
            <p className={styles.updated}>
              Última atualização: <span className={styles.updatedStrong}>2025</span>
            </p>
          </header>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Aceite dos Termos</h2>
              <p className={styles.p}>
                Ao acessar e utilizar o site da VERANNE, você concorda com estes Termos de Uso.
                Caso não concorde, recomendamos que não utilize o serviço.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Uso do Site</h2>
              <p className={styles.p}>
                Você concorda em utilizar o site de forma adequada, não realizando tentativas de
                burlar mecanismos de segurança ou causar danos ao funcionamento da plataforma.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Compras e Pagamentos</h2>
              <p className={styles.p}>
                A compra de produtos depende de disponibilidade e das condições apresentadas no
                momento da contratação. Os pagamentos seguem as regras e métodos indicados no
                checkout.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Entrega</h2>
              <p className={styles.p}>
                Os prazos de entrega podem variar conforme localidade e transportadora. Qualquer
                atualização será informada ao cliente durante o processo de acompanhamento do
                pedido.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Cancelamento</h2>
              <p className={styles.p}>
                O cancelamento do pedido segue as políticas da loja e o estágio em que a
                solicitação se encontra (antes ou após a separação/expedição).
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Propriedade Intelectual</h2>
              <p className={styles.p}>
                Conteúdos, layouts e elementos visuais apresentados no site são protegidos por
                direitos autorais e legislação aplicável. É proibida a reprodução sem autorização.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Contato</h2>
              <p className={styles.p}>
                Em caso de dúvidas sobre estes Termos, entre em contato através dos canais
                informados no site.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}
