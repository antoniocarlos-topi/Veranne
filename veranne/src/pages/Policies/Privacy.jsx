import React from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import styles from './Policies.module.css'

export default function Privacy() {
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
            <span className={styles.crumbCurrent}>Privacidade</span>
          </nav>

          <header className={styles.header}>
            <h1 className={styles.title}>Política de Privacidade</h1>
            <p className={styles.updated}>
              Última atualização: <span className={styles.updatedStrong}>2025</span>
            </p>
          </header>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Informações Coletadas</h2>
              <p className={styles.p}>
                Coletamos informações que você fornece diretamente, como nome, e-mail e dados de
                contato. Também podemos coletar dados de navegação para melhorar sua experiência
                no site.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Como Usamos</h2>
              <p className={styles.p}>
                Utilizamos os dados para atender solicitações, processar pedidos, responder
                mensagens e aprimorar recursos do site. Também usamos informações para fins de
                segurança e prevenção a fraudes.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Compartilhamento</h2>
              <p className={styles.p}>
                Podemos compartilhar informações com parceiros necessários para funcionamento do
                serviço (por exemplo, meios de pagamento e logística). Não vendemos suas
                informações pessoais.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Segurança</h2>
              <p className={styles.p}>
                Adotamos medidas técnicas e organizacionais para proteger suas informações contra
                acesso não autorizado, alteração, divulgação ou destruição indevida.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Seus Direitos</h2>
              <p className={styles.p}>
                Você pode solicitar acesso, correção, exclusão e outras atualizações relacionadas
                aos seus dados, conforme as leis aplicáveis. Para isso, entre em contato com
                nosso time.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Cookies</h2>
              <p className={styles.p}>
                Utilizamos cookies e tecnologias semelhantes para lembrar preferências,
                analisar desempenho e melhorar navegação. Você pode gerenciar as configurações do
                navegador.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Contato</h2>
              <p className={styles.p}>
                Em caso de dúvidas sobre esta Política de Privacidade, entre em contato pelo
                e-mail do nosso atendimento.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}
