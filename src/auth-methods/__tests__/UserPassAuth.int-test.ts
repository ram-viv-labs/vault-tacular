import cryptoRandomString from 'crypto-random-string'

import { UserPassAuth } from '../UserPassAuth'

const BASE_URL = 'http://127.0.0.1:8200/v1'

const auth = new UserPassAuth({
  baseUrl: BASE_URL
})

describe('UserPassAuth integration tests', () => {
  it('should login', async () => {
    const user = await createUser()
    const resp = await auth.login(user)

    expect(resp).toMatchObject({
      statusCode: 200,
      data: {
        auth: {
          metadata: {
            username: user.username
          }
        }
      }
    })
  })
})

async function createUser () {
  const username = cryptoRandomString({
    length: 10
  })

  const password = cryptoRandomString({
    length: 10
  })

  await auth.create(process.env.VAULT_TOKEN, {
    username,
    password
  })

  return {
    username,
    password
  }
}
