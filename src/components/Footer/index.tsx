import FOOTER_COLUMNS from 'components/Footer/columns'
import { StyledColumn, StyledFooter, StyledLink } from 'components/Footer/styled'
import ThemeSwitcher from 'components/Header/ThemeSwitcher'
import MuesliLogo from 'components/MuesliLogo'
import { Link } from 'react-router-dom'
import { useMedia } from 'react-use'
import { Flex } from 'rebass/styled-components'

export default function Footer() {
  const year = new Date().getFullYear()

  const isSmall = useMedia('(max-width: 750px)')

  return (
    <StyledFooter>
      <Flex
        alignItems="start"
        flexWrap={['wrap', 'nowrap']}
        width="100%"
        flexDirection={isSmall ? 'column' : 'row'}
        justifyContent="space-between"
      >
        {isSmall ? (
          <Flex alignItems="center" width="100%" justifyContent="space-between" flexWrap="wrap">
            <MuesliLogo />
            {isSmall && (
              <Flex height="fit-content" width="auto" alignItems="left" justifyContent="left" marginLeft="-10px">
                <ThemeSwitcher />
              </Flex>
            )}
          </Flex>
        ) : (
          <Flex alignItems="center" width="100%">
            <MuesliLogo />
          </Flex>
        )}
        <Flex ml="20px" width="100%" flexWrap="wrap" justifyContent={isSmall ? 'space-between' : 'space-around'}>
          {FOOTER_COLUMNS.map((column) => (
            <StyledColumn key={column.id} style={{ minWidth: '130px' }}>
              {column.column_name}
              <Flex flexDirection="column" m="10px -5px 30px">
                {column.links.map((link) => (
                  <StyledLink
                    target={link.external ? '_blank' : undefined}
                    as={link.external ? 'a' : Link}
                    to={!link.external ? link.to : null}
                    href={link.external ? link.to : null}
                    key={link.id}
                  >
                    {link.name}
                  </StyledLink>
                ))}
              </Flex>
            </StyledColumn>
          ))}
        </Flex>
      </Flex>
      <Flex flexWrap="wrap" justifyContent="space-between" alignItems="center" color="text" mt="30px">
        &copy; {year} MuesliSwap
        <Flex
          flexWrap="wrap"
          width={isSmall ? '100%' : 'fit-content'}
          m="-5px"
          mt={isSmall ? '15px' : undefined}
          justifyContent={isSmall ? 'space-between' : 'start'}
        >
          <StyledLink as={Link} to="/privacy" color="text">
            Privacy Policy
          </StyledLink>
          <StyledLink as={Link} to="/terms" color="text">
            Terms of Service
          </StyledLink>
        </Flex>
      </Flex>
    </StyledFooter>
  )
}
