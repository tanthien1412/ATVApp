import { Navigation, OnboardI } from '@/src/types/navigation'

export const SPACE = 15

export const OnboardData: OnboardI[] = [
  {
    id: '1',
    animation: require('@/assets/animations/onboarding_1.json'),
    text: 'onboarding_1',
    textColor: '#749d3f',
    backgroundColor: '#fffff0',
  },
  {
    id: '2',
    animation: require('@/assets/animations/onboarding_2.json'),
    text: 'onboarding_2',
    textColor: '#165a33',
    backgroundColor: '#faeb8a',
  },
  {
    id: '3',
    animation: require('@/assets/animations/onboarding_3.json'),
    text: 'onboarding_3',
    textColor: '#eec33c',
    backgroundColor: '#bae4fd',
  },
]

export const ThreadMobile: Navigation[] = [
  {
    label: 'home',
  },
  {
    label: 'article',
  },
  {
    label: 'local',
  },
  {
    label: 'vr360',
  },
  {
    label: 'livestream',
  },
]

export const DrawerMobile: Navigation[] = [
  {
    label: 'app_admin',
  },
  {
    label: 'aboutUs',
  },
  {
    label: 'aboutApp',
  },
  {
    label: 'locale_label',
  },
  {
    label: 'signout_btn',
  },
]

export const SPEAKERSTREAM = {
  email: 'info@truyenhinhnongnghiep.vn',
  password: 'Saigonfilm2@24',
}

export const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5MzZmNDE2My0yNGI2LTQ1ZmQtYTg2OC01MDAyYmMyMTY1NDgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyMDQyMzMyMywiZXhwIjoxNzIxMDI4MTIzfQ.12gFJb-WVVoA1W_FcdDCHOjmmnC8TEHbS4WZrY4lXLk'

export const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['
