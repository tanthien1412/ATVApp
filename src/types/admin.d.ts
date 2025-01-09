import { User } from 'firebase/auth'
// export type Account = {
//   id: string
//   name: string | null
//   email: string
//   photo: string | null
//   familyName: string | null
//   givenName: string | null
// }

// export type Account = {
//   id: string
//   name: string
//   email: string
//   password: string
//   role: 'admin' | 'anonymous'
// }

type IToast = {
  text: string
  type: 'success' | 'error' | 'warning'
  duration: number
}

export type SigninParam = {
  email: string
  password: string
}
