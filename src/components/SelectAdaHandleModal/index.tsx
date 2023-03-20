import { CloseIcon } from 'assets/icons'
import Modal from 'components/common/Modal'
import { useWallet } from 'hooks/useWallet'
import { useCallback, useMemo } from 'react'
import { Button, Flex, Text } from 'rebass/styled-components'
import { usePreferredHandle, useSetPreferredHandle } from 'state/user/hooks'
import { useTheme } from 'styled-components'

interface Props {
  isOpen: boolean
  toggleModal: () => void
}

export default function SelectAdaHandleModal({ isOpen, toggleModal }: Props) {
  const { colors } = useTheme()
  const { useAdaHandles, useAddress } = useWallet()
  const address = useAddress()
  const handles = useAdaHandles()

  const preferredHandle = usePreferredHandle(address)
  const setHandle = useSetPreferredHandle(address)
  const forceOpen = useMemo(() => handles?.length && preferredHandle === undefined, [handles, preferredHandle])
  const close = useCallback(() => {
    if (isOpen) toggleModal()
  }, [isOpen, toggleModal])
  const toggle = useCallback(
    (handle) => {
      if (handle !== undefined) setHandle(handle)
      close()
    },
    [setHandle, close],
  )

  return (
    <Modal
      isOpen={isOpen || forceOpen}
      toggleModal={() => (forceOpen ? toggle(handles[0]) : close())}
      contentProps={{
        borderRadius: 16,
        position: 'relative',
        maxWidth: '375px',
        width: '100%',
        maxHeight: '60%',
        overflowY: 'auto',
        background: colors.primary,
      }}
    >
      <Flex
        sx={{
          p: '16px',
          width: '100%',
          alignItems: 'start',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: 'secondary',
        }}
      >
        <Text variant="heading5">
          Select your display&nbsp;
          <Text as="span" color="#0CD15B">
            $
          </Text>
          handle
        </Text>
        <Button
          height="fit-content"
          ml="15px"
          p="5px"
          variant="icon-transparent"
          onClick={() => (forceOpen ? toggle(handles[0]) : close())}
        >
          <CloseIcon />
        </Button>
      </Flex>

      <Flex
        flexDirection="column"
        sx={{
          p: '16px',
          gap: '8px',
        }}
      >
        <Button
          onClick={() => toggle(null)}
          variant="secondary"
          sx={{
            boxShadow: 'None',
            border: '1px solid',
          }}
        >
          <Text as="span" variant="subtle" fontStyle="italic">
            None
          </Text>
        </Button>

        {handles &&
          handles.map((item) => (
            <Button
              key={item}
              variant="secondary"
              onClick={() => toggle(item)}
              sx={{ boxShadow: 'None', border: '1px solid' }}
            >
              <Text as="span" variant="regular" fontFamily="gilroy" fontWeight="500" fontSize="15px">
                <Text as="span" color="#0CD15B">
                  $
                </Text>
                {item}
              </Text>
            </Button>
          ))}
      </Flex>
    </Modal>
  )
}
