import { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import { PaginationSideButtonsProps } from '@/src/types/pagination'
import PaginationButton from './PaginationButton'

const PaginationSideButtons: FC<PaginationSideButtonsProps> = ({
  totalPages,
  currentPage,
  children,
  showLastPagesButtons = false,
  handleChangePage,
  containerStyle,
  textStyle,
  btnStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {showLastPagesButtons && currentPage > 1 && (
        <PaginationButton
          textStyle={textStyle}
          btnStyle={btnStyle}
          onPress={() => handleChangePage('1')}
        >
          {'<<'}
        </PaginationButton>
      )}
      {currentPage > 1 && (
        <PaginationButton
          textStyle={textStyle}
          btnStyle={btnStyle}
          onPress={() =>
            currentPage > 1 && handleChangePage(`${currentPage - 1}`)
          }
        >
          {'<'}
        </PaginationButton>
      )}
      {children}
      {currentPage < totalPages && (
        <PaginationButton
          textStyle={textStyle}
          btnStyle={btnStyle}
          onPress={() =>
            currentPage < totalPages && handleChangePage(`${currentPage + 1}`)
          }
        >
          {'>'}
        </PaginationButton>
      )}
      {showLastPagesButtons && currentPage < totalPages && (
        <PaginationButton
          textStyle={textStyle}
          btnStyle={btnStyle}
          onPress={() => handleChangePage(`${totalPages}`)}
        >
          {'>>'}
        </PaginationButton>
      )}
    </View>
  )
}

export default PaginationSideButtons

export const styles = StyleSheet.create({
  container: {
    maxWidth: '100%',
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
    zIndex: 100,
  },
  pageContainer: {
    flexDirection: 'row',
  },
})
