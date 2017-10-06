export default {
  name: 'Custom',
  struct: {
    id: { type: 'ID!' },
    nickname: { type: 'String!' },
  },
  validator: {
  },
  methods: {
    photo(url, width, height) {
      return `url?width=${width}&height=${height}`
    },
    url(url, protocol) {
      return `${protocol}://${url}`
    },
  },
  actions: {
    queryUserById: `
    {
      user(id: <id>) {
        id,
        nickname,
        avatar(width: 200, height: 300) {
          url(protocol: "https")
        }
      }
    }
    `,
  },
}
