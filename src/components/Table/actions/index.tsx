import React from 'react'
import Eye from 'svg/eye.svg'
import Edit from 'svg/edit.svg'
import Trash from 'svg/trash.svg'
import Return from 'svg/return.svg'
import useTranslation from 'next-translate/useTranslation'

export interface Props {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onReturn?: () => void
  className?: string
}

function TableActions({
  onView,
  onEdit,
  onDelete,
  onReturn,
  className = ''
}: Props) {
  const { t } = useTranslation('common')
  return (
    <div className={`flex justify-evenly ${className}`}>
      {onView !== undefined ? (
        <span className="cursor-pointer" onClick={onView}>
          <Eye className="stroke-black dark:stroke-white" />
        </span>
      ) : null}

      {onEdit !== undefined ? (
        <span
          className="cursor-pointer flex items-center gap-2"
          onClick={onEdit}
        >
          <Edit className="stroke-black dark:stroke-white" />
          {t('edit')}
        </span>
      ) : null}

      {onDelete !== undefined ? (
        <span
          className="cursor-pointer flex items-center gap-1"
          onClick={onDelete}
        >
          <Trash className="scale-75" />
          {t('delete')}
        </span>
      ) : null}

      {onReturn !== undefined ? (
        <span className="cursor-pointer" onClick={onReturn}>
          <Return className="dark:fill-light-200 fill-dark-100 mt-1" />
        </span>
      ) : null}
    </div>
  )
}

export default TableActions
