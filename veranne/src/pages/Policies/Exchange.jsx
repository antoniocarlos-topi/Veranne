import React from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import styles from './Policies.module.css'

export default function Exchange() {
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
            <span className={styles.crumbCurrent}>Trocas</span>
          </nav>

          <header className={styles.header}>
            <h1 className={styles.title}>Política de Trocas</h1>
            <p className={styles.updated}>
              Última atualização: <span className={styles.updatedStrong}>2025</span>
            </p>
          </header>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Prazo (7 dias)</h2>
              <p className={styles.p}>
                Você pode solicitar troca ou devolução em até 7 dias corridos após o recebimento
                do produto. O item deve estar em perfeitas condições, com embalagem e acessórios
                originais.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Condições</h2>
              <p className={styles.p}>
                Não realizamos trocas de itens danificados por uso inadequado, sem condições de
                revenda ou fora das especificações do pedido. Consulte as regras descritas na
                confirmação do envio.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Como Solicitar</h2>
              <p className={styles.p}>
                Para solicitar, entre em contato com nossa equipe pelos canais informados no site.
                Enviaremos instruções de postagem e acompanharemos o processo até a finalização.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Produtos com Defeito</h2>
              <p className={styles.p}>
                Se o produto apresentar defeito, você deverá comunicar o ocorrido em até 7 dias.
                Após análise, poderemos realizar troca do item ou reembolso, conforme o caso.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Personalizados</h2>
              <p className={styles.p}>
                Itens personalizados seguem regras específicas. Em geral, só são elegíveis para troca
                quando houver defeito de fabricação ou divergência do que foi solicitado.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Reembolso</h2>
              <p className={styles.p}>
                O reembolso é efetuado após a confirmação do recebimento e/ou validação do item,
                seguindo os prazos da instituição financeira utilizada na compra.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}
