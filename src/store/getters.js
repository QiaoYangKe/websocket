const getters = {
  accessToken: state => state.user.token,
  encryptedAccessToken: state => state.user.token,
  expireInSeconds: state => state.user.token,
  userId: state => state.user.token,

  user: state => state.session.user,
  tenant: state => state.session.tenant,
  application: state => state.session.application,

  avatar: () => 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',

  sidebar: state => state.app.sidebar,
  device: state => state.app.device
}
export default getters
