export const login = async ({ email, password, rememberMe, provider }) => {
  await Promise.resolve()

  return {
    ok: true,
    email,
    password,
    rememberMe,
    provider,
  }
}

export const register = async ({ fullName, email, password, provider }) => {
  await Promise.resolve()

  return {
    ok: true,
    fullName,
    email,
    password,
    provider,
  }
}

export const logout = async () => {
  await Promise.resolve()

  return { ok: true }
}
