export const envCommon = {
  ghAuth: {
    baseUrl: 'https://github.com/login/oauth/authorize',
    cid: process.env.GH_CID || 'b2dc087b88922e0b5e34',
    csecret: process.env.GH_CSECRET || '64e4ac3b205e933887c90bbaac82fdfcdb30ab98',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    apiUrl: 'https://api.github.com/user'
  }
};