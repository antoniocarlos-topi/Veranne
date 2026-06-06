import React from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import { HeroSection } from '../../components/home/HeroSection/HeroSection.jsx'
import { CategoriesSection } from '../../components/home/CategoriesSection/CategoriesSection.jsx'
import { FeaturedSection } from '../../components/home/FeaturedSection/FeaturedSection.jsx'
import { CollectionBanner } from '../../components/home/CollectionBanner/CollectionBanner.jsx'
import { BenefitsSection } from '../../components/home/BenefitsSection/BenefitsSection.jsx'
import { TestimonialsSection } from '../../components/home/TestimonialsSection/TestimonialsSection.jsx'
import { NewsletterSection } from '../../components/home/NewsletterSection/NewsletterSection.jsx'

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection />
      <CollectionBanner />
      <BenefitsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </Layout>
  )
}

