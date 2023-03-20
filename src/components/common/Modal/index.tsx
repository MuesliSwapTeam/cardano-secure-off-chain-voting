import StyledModal from 'components/common/Modal/styled'
import { ReactNode } from 'react'

interface Props {
  isOpen: boolean
  toggleModal: () => void
  children: ReactNode
  contentProps?: any // TODO pjordan: Figure out the correct type
}

export default function Modal({ isOpen, toggleModal, contentProps, children }: Props) {
  return (
    <StyledModal
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          inset: 0,
          zIndex: 1000,
        },
        content: {
          margin: 'auto',
          ...contentProps,
        },
      }}
      isOpen={isOpen}
      onRequestClose={toggleModal}
      shouldCloseOnOverlayClick
    >
      {children}
    </StyledModal>
  )
}

Modal.defaultProps = {
  contentProps: {},
}
