import Link from 'next/link'
import React from 'react'

const ButtonCancelComponent = ({url}) => {
  return (
    <Link href={url}>buttonCancel</Link>
  )
}

export default ButtonCancelComponent