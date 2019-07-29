const getters = {
  accessToken: state => state.tokenAuth.accessToken,
  encryptedAccessToken: state => state.tokenAuth.encryptedAccessToken,
  expireInSeconds: state => state.tokenAuth.expireInSeconds,
  userId: state => state.tokenAuth.userId,

  user: state => state.session.user,
  tenant: state => state.session.tenant,
  application: state => state.session.application,

  avatar: () => 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',

  sidebar: state => state.app.sidebar,
  device: state => state.app.device
}
export default getters
