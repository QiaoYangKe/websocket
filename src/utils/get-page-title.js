import defaultSettings from '@/settings'

const title = defaultSettings.title || 'almes-web-client'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
