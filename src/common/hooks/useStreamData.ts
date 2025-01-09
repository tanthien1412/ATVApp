import { useEffect, useState } from 'react'
import { onSnapshot, orderBy, query } from 'firebase/firestore'
import { channelDocRef } from '../services/firestore'
import { StreamInfo } from '@/src/types/stream'

const useStreamData = () => {
  const [streamData, setStreamData] = useState<StreamInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const q = query(channelDocRef, orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        callId: doc.data()?.callId,
        user: doc.data()?.user,
        createdAt: doc.data()?.createdAt,
        server: doc.data()?.server,
      }))
      setStreamData(list)
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return { streamData, isLoading }
}

export default useStreamData
