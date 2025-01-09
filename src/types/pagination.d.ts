import { StyleProp, TextStyle, ViewStyle } from 'react-native'

export type PaginationProps = {
  totalItems: number
  pagesToDisplay?: number
  pageSize: number
  onPageChange: (page: number) => void
  showLastPagesButtons?: boolean
  currentPage: number
  containerStyle?: StyleProp<ViewStyle>
  btnStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  activeBtnStyle?: StyleProp<ViewStyle>
  activeTextStyle?: StyleProp<TextStyle>
}

export type PaginationButtonProps = {
  onPress: () => void
  children: React.ReactNode
  isActive?: boolean
  btnStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  activeBtnStyle?: StyleProp<ViewStyle>
  activeTextStyle?: StyleProp<TextStyle>
}

export type PaginationSideButtonsProps = {
  totalPages: number
  currentPage: number
  showLastPagesButtons?: boolean
  handleChangePage: (page: string) => void
  children: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  btnStyle?: StyleProp<ViewStyle>
}
