import { Dispatch, FC, SetStateAction } from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import useThemeApp from '@/src/common/hooks/useThemeApp'
import { SPACE } from '@/src/common/constants/constants'

import ButtonUI from './ButtonUI'
import InputStyled from './InputStyled'

type Props = {
  modalVisible: boolean
  setModalVisible: Dispatch<SetStateAction<boolean>>
  value: string
  setValue: Dispatch<SetStateAction<string>>
  server: string
  setServer: Dispatch<SetStateAction<string>>
  onSend: (e: string) => Promise<void>
}

const ModalInput: FC<Props> = ({
  modalVisible,
  setModalVisible,
  value,
  setValue,
  server,
  setServer,
  onSend,
}) => {
  const theme = useThemeApp()
  const { t } = useTranslation()
  const closeModal = () => {
    setModalVisible(false)
    setServer('')
    setValue('')
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, { color: theme.colors.secondary }]}>
              {server}
            </Text>
            <InputStyled
              placeholder={t('url_stream')}
              value={value}
              setValue={setValue}
              enterKeyHint="send"
              actionEnd="close"
              onSubmit={async (e) => {
                await onSend(e).then(closeModal)
              }}
            />
            <View style={{ position: 'absolute', top: 10, right: 10 }}>
              <ButtonUI
                icon="close"
                chilColor={theme.colors.tertiary}
                onPress={closeModal}
                size="large"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ModalInput

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: SPACE * 2.5,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: SPACE,
  },

  modalText: {
    fontSize: SPACE + 3,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
})
