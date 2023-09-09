import { Dispatch, useEffect, useMemo, useState } from 'react'

interface Props {
  data: []
  limit?: number
}
interface ReturnHook {
  currentPage: number
  setCurrentPage: Dispatch<number>
  dataParePage: []
  totalPage: number
}
export default function usePagination({
  data = [],
  limit = 10
}: Props): ReturnHook {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [dataParePage, setDataParePage] = useState(data)

  const totalPage = data.length

  const nextCurrentData = limit * currentPage

  const currentData = useMemo(
    () => data.slice(nextCurrentData - limit, nextCurrentData),
    [currentPage, data]
  )
  useEffect(() => {
    setDataParePage(currentData as [])
  }, [currentData])

  return { currentPage, setCurrentPage, dataParePage, totalPage }
}
