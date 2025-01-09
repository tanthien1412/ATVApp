import { FC } from 'react'
import { Text, Pressable, StyleSheet } from 'react-native'
import { PaginationButtonProps } from '@/src/types/pagination'

const PaginationButton: FC<PaginationButtonProps> = ({
  onPress = () => {},
  children,
  isActive = false,
  btnStyle,
  textStyle,
  activeBtnStyle,
  activeTextStyle,
}) => {
  return (
    <Pressable
      style={[
        styles.button,
        btnStyle,
        isActive ? (activeBtnStyle ? activeBtnStyle : styles.buttonActive) : {},
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          textStyle,
          isActive
            ? activeTextStyle
              ? activeTextStyle
              : styles.activeText
            : {},
        ]}
      >
        {children}
      </Text>
    </Pressable>
  )
}

export default PaginationButton

export const styles = StyleSheet.create({
  button: {
    backgroundColor: '#27282E',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderColor: '#494A4F',
  },
  buttonActive: {
    backgroundColor: '#494A4F',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    alignSelf: 'center',
  },
  activeText: {
    fontWeight: 'bold',
  },
})
