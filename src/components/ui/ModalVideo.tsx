import { FC, useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEventListener } from 'expo'

import useThemeApp from '@/src/common/hooks/useThemeApp'
import { SPACE } from '@/src/common/constants/constants'

import ButtonUI from './ButtonUI'

type Props = {}

const ModalVideo: FC<Props> = ({}) => {
  const theme = useThemeApp()
  const [modalVisible, setModalVisible] = useState<boolean>(true)
  const player = useVideoPlayer(
    require('@/assets/hny_mobile.mp4'),
    (player) => {
      player.play()
    }
  )

  const closeModal = () => {
    setModalVisible(false)
  }

  useEventListener(player, 'playToEnd', closeModal)

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
            <VideoView
              style={styles.modalView}
              player={player}
              contentFit="fill"
              nativeControls={false}
            />
            <View style={{ position: 'absolute', top: 10, right: 10 }}>
              <ButtonUI
                icon="close"
                chilColor={theme.colors.primary}
                onPress={closeModal}
                size="extra-large"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ModalVideo

const styles = StyleSheet.create({
  containerNotNet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    height: '100%',
  },
  modalText: {
    fontSize: SPACE + 3,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
})
