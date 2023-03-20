/* eslint-disable @typescript-eslint/no-explicit-any */
import Page from 'components/common/Page'
import { useWallet } from 'hooks/useWallet'
import React, { Component, useMemo } from 'react'
import { Box, Flex, Link, Text } from 'rebass/styled-components'
import { lightThemes } from 'theme'
import { DECIMAL_SEPARATOR, GROUPING_SEPARATOR } from 'utils/numericHelpers'

function DebugInfo() {
  const { connectorId, isWalletEnabled, useStakeKeys } = useWallet()
  const stakeKeys = useStakeKeys()
  const content = useMemo(() => {
    const result = [
      { title: 'Locale', value: navigator.language },
      { title: 'Available Locales', value: navigator.languages },
      { title: 'Grouping Separator', value: GROUPING_SEPARATOR },
      { title: 'Decimal Separator', value: DECIMAL_SEPARATOR },
      { title: 'Connected Wallet', value: !isWalletEnabled ? 'disconnected' : connectorId },
      { title: 'User Agent', value: navigator.userAgent },
      { title: 'Stake Key', value: stakeKeys?.length ? stakeKeys[0] : '-' },
    ]

    return result
  }, [connectorId, isWalletEnabled, stakeKeys])
  return (
    <Box
      as={Flex}
      padding="20px"
      marginTop="20px"
      flexDirection="column"
      marginX="auto"
      sx={{
        border: 'solid 1px',
        borderRadius: '20px',
        borderColor: 'main',
        background: 'primary',
        width: 'fit-content',
      }}
    >
      <Text variant="heading5" p="10px">
        Additional Debug Information
      </Text>
      {content.map(({ title, value }) => (
        <Flex key={title} flexDirection="row" justifyContent="space-between">
          <Text variant="subheading">{title}: </Text>
          <Text variant="regular">{JSON.stringify(value)}</Text>
        </Flex>
      ))}
    </Box>
  )
}

function PrettyError({ error }) {
  const errorString = useMemo(() => {
    let string = JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    string = string.substring(3, string.length - 2)
    return string
  }, [error])
  const lines = useMemo(() => errorString.split('\\n'), [errorString])

  return (
    <Box
      padding="20px"
      marginTop="20px"
      marginX="auto"
      sx={{
        border: 'solid 1px',
        borderRadius: '20px',
        borderColor: 'red',
        background: 'white',
        width: 'min-content',
        color: lightThemes.colors.text,
      }}
    >
      <Text fontSize="7px" variant="subtle" color={lightThemes.colors.text}>
        <pre>
          {lines.map((line) => (
            <React.Fragment key={line}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </pre>
      </Text>
    </Box>
  )
}

class ErrorBoundary extends Component<{ children: JSX.Element }, { hasError: boolean; error?: any }> {
  constructor(props: { children: JSX.Element } | Readonly<{ children: JSX.Element }>) {
    super(props)

    this.state = {
      error: undefined,
      hasError: false,
    }
  }

  static getDerivedStateFromError(error: any) {
    // TODO pjordan: Find better solution to chunkload errors
    if (/Loading chunk [\d]+ failed/.test(error.message)) window.location.reload()

    return { hasError: true, error }
  }

  render() {
    const { hasError, error } = this.state

    if (hasError) {
      return (
        <Page title="An Error occurred">
          <Flex flexDirection="column" alignItems="center">
            <Text variant="heading1">Something went wrong!</Text>
            <Text variant="heading5">Seems like we spilled some milk</Text>
            <br />
            <br />
            <Text variant="subheading">
              In case this keeps happening please{' '}
              <Link href="https://forms.gle/AMyT143WtA6BxLtQ9" target="_blank" rel="noopener noreferrer">
                report a bug
              </Link>{' '}
              with a copy of the error code below:
            </Text>
          </Flex>
          <Box
            padding="20px"
            marginTop="20px"
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <PrettyError error={error} />
            <DebugInfo />
          </Box>
        </Page>
      )
    }

    const { children } = this.props
    return children
  }
}

export default ErrorBoundary
