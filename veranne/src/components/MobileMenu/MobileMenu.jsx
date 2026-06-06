import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StaggeredMenu } from './StaggeredMenu'
import { CONFIG } from '../../config'

export function MobileMenu({ logoUrl }) {
  const navigate = useNavigate()

  const items = [
    { label: 'Home',      link: '/',          ariaLabel: 'Ir para Home'      },
    { label: 'Loja',      link: '/loja',      ariaLabel: 'Ir para Loja'      },
    { label: 'Sobre',     link: '/sobre',     ariaLabel: 'Ir para Sobre'     },
    { label: 'Contato',   link: '/contato',   ariaLabel: 'Ir para Contato'   },
    { label: 'Favoritos', link: '/favoritos', ariaLabel: 'Ir para Favoritos' },
    { label: 'Carrinho',  link: '/carrinho',  ariaLabel: 'Ir para Carrinho'  },
  ]

  const socialItems = [
    { label: 'Instagram', link: `https://instagram.com/${CONFIG.instagram?.replace('@', '') || 'veranne.oficial'}` },
    { label: 'TikTok',    link: `https://tiktok.com/@${CONFIG.tiktok?.replace('@', '') || 'veranne.oficial'}`   },
    { label: 'WhatsApp',  link: `https://wa.me/${CONFIG.whatsappNumber}` },
  ]

  function handleItemClick(link) {
    navigate(link)
  }

  return (
    <StaggeredMenu
      position="left"
      colors={['#F5F5F5', '#ECECEC']}
      items={items.map(item => ({
        ...item,
        onClick: () => handleItemClick(item.link)
      }))}
      socialItems={socialItems}
      displaySocials={true}
      logoUrl={logoUrl}
      menuButtonColor="#000000"
      openMenuButtonColor="#000000"
      closeOnClickAway={true}
    />
  )
}
