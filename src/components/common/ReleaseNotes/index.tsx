import { CloseIcon } from 'assets/icons'
import { Box, Button, Flex, Text } from 'rebass/styled-components'
import { useReleaseNotes, useToggleReleaseNotes } from 'state/user/hooks'
import { useTheme } from 'styled-components'

import Modal from '../Modal'
import RELEASE_NOTES from './releases'

export default function ReleaseNotes() {
  const { colors } = useTheme()

  const releaseNoteInfo = useReleaseNotes()
  const toggleReleaseNotes = useToggleReleaseNotes()

  const prevMajor = releaseNoteInfo.prevVersion.major
  const prevMinor = releaseNoteInfo.prevVersion.minor
  return (
    <Modal
      isOpen={releaseNoteInfo.show}
      toggleModal={toggleReleaseNotes}
      contentProps={{
        background: colors.primary,
        margin: 'auto',
        maxWidth: 600,
        borderRadius: 16,
      }}
    >
      <Flex
        sx={{
          p: 23,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: 'secondary',
        }}
      >
        <Text variant="heading5">🥳 Release Notes</Text>
        <Button p="5px" onClick={toggleReleaseNotes} height="auto" variant="icon-transparent">
          <Box as={CloseIcon} />
        </Button>
      </Flex>
      <Box p="16px 24px 24px">
        <Text textAlign="center" variant="regular" marginBottom={20}>
          Since your last visit, a few things have changed! <br />
          We hope you enjoy all the new features.
        </Text>
        {Object.keys(RELEASE_NOTES).map((major) =>
          Object.keys(RELEASE_NOTES[major]).map((minor) => {
            const show = Number(major) > prevMajor || (Number(major) === prevMajor && Number(minor) > prevMinor)

            if (!show) return undefined

            return (
              <Box
                key={`${major}.${minor}`}
                marginX={20}
                sx={{
                  p: 10,
                  borderTopWidth: 1,
                  borderTopStyle: 'solid',
                  borderTopColor: 'secondary',
                }}
              >
                <Text variant="subheading">
                  Update {major}.{minor}
                </Text>
                <Text variant="regular">{RELEASE_NOTES[major][minor]}</Text>
              </Box>
            )
          }),
        )}
      </Box>
    </Modal>
  )
}
